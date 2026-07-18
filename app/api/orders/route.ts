import { NextResponse } from "next/server";
import { priceOrderLines } from "@/lib/catalog/pricing";
import { formatPriceCents } from "@/lib/catalog/products";
import { deliverInquiry } from "@/lib/email/send-inquiry";
import { createMollieCheckout } from "@/lib/mollie/create-payment";
import {
  createOrderAtomic,
  updateOrderPayment,
} from "@/lib/orders/create-order";
import { validatePickupMoment } from "@/lib/ordering/availability";
import { createOrderSchema } from "@/lib/ordering/validate";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { site } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isMollieConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Online bestellen is tijdelijk niet beschikbaar. Bestel via WhatsApp of bel ons.",
        code: "ORDERING_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const rl = rateLimit(`orders:${ip}`, 8, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Te veel verzoeken. Probeer zo opnieuw." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ongeldig verzoek." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Controleer je gegevens.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const data = parsed.data;
  if ((data.website ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "Spam gedetecteerd." }, { status: 400 });
  }

  const pickup = validatePickupMoment(data.date, data.time);
  if (!pickup.ok) {
    return NextResponse.json({ ok: false, error: pickup.error }, { status: 400 });
  }

  const priced = priceOrderLines(data.lines);
  if (!priced.ok) {
    return NextResponse.json({ ok: false, error: priced.error }, { status: 400 });
  }

  const notesLines = priced.lines
    .map((l) => {
      const opts = l.optionLabels.length ? ` [${l.optionLabels.join(", ")}]` : "";
      const note = l.note ? ` — ${l.note}` : "";
      return `${l.qty}× ${l.name}${opts} — ${formatPriceCents(l.lineTotalCents)}${note}`;
    })
    .join("\n");

  const customerNote = data.note?.trim() ? `\n\nOpmerking klant: ${data.note.trim()}` : "";

  const created = await createOrderAtomic({
    name: data.name,
    phone: data.phone,
    email: data.email,
    date: data.date,
    time: data.time,
    lines: priced.lines,
    totalCents: priced.totalCents,
    notes: notesLines + customerNote,
  });

  if (!created.ok) {
    const status = created.code === "slot_full" ? 409 : 500;
    return NextResponse.json({ ok: false, error: created.message }, { status });
  }

  const { order } = created;
  let checkoutUrl: string | null = null;

  try {
    const payment = await createMollieCheckout({
      orderId: order.id,
      orderNumber: order.order_number,
      totalCents: priced.totalCents,
      description: `Grill Gasten ${order.order_number}`,
      customerEmail: data.email,
    });
    if (!payment) {
      return NextResponse.json(
        { ok: false, error: "Betaling starten mislukt. Probeer opnieuw of WhatsApp ons." },
        { status: 502 },
      );
    }
    checkoutUrl = payment.checkoutUrl;
    await updateOrderPayment(order.id, {
      payment_status: "pending",
      mollie_payment_id: payment.paymentId,
      checkout_url: payment.checkoutUrl,
    });
  } catch (e) {
    console.error("[api/orders] mollie", e);
    return NextResponse.json(
      { ok: false, error: "Betaling starten mislukt. Probeer opnieuw of WhatsApp ons." },
      { status: 502 },
    );
  }

  const emailBody = [
    `Bestelnummer: ${order.order_number}`,
    `Naam: ${data.name}`,
    `Telefoon: ${data.phone}`,
    `E-mail: ${data.email}`,
    `Afhalen: ${data.date} om ${data.time}`,
    `Totaal: ${formatPriceCents(priced.totalCents)}`,
    `Betaalstatus: in behandeling (Mollie)`,
    "",
    "Bestelling:",
    notesLines,
    customerNote,
  ].join("\n");

  await deliverInquiry({
    type: "preorder",
    name: data.name,
    phone: data.phone,
    email: data.email,
    date: data.date,
    time: data.time,
    message: emailBody,
    orderId: order.order_number,
  }).catch((e) => console.error("[api/orders] email", e));

  return NextResponse.json({
    ok: true,
    orderNumber: order.order_number,
    checkoutUrl,
    statusUrl: `${site.url}/bestellen/status/${encodeURIComponent(order.order_number)}`,
    totalCents: priced.totalCents,
  });
}
