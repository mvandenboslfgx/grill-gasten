import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/email/send-inquiry";
import { createMollieCheckout } from "@/lib/mollie/create-payment";
import { createOrderRecord } from "@/lib/orders/create-order";
import type { OrderLine } from "@/lib/orders/types";
import { isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { updateOrderPayment } from "@/lib/orders/create-order";
import { formatEur } from "@/lib/preorder/cart";

export const runtime = "nodejs";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
  location?: string;
  lines?: OrderLine[];
  website?: string;
};

function linesMessage(lines: OrderLine[]): string {
  return lines.map((l) => `${l.qty}× ${l.name} (${formatEur(l.priceEur * l.qty)})`).join("\n");
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Bestelsysteem nog niet gekoppeld. Gebruik het reserveringsformulier." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Body;

    if (String(body.website ?? "").trim()) {
      return NextResponse.json({ ok: false, error: "Spam gedetecteerd." }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const date = String(body.date ?? "").trim();
    const time = String(body.time ?? "").trim();
    const lines = Array.isArray(body.lines) ? body.lines : [];

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Vul je naam in." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Vul een geldig e-mailadres in." }, { status: 400 });
    }
    if (phone.length < 8) {
      return NextResponse.json({ ok: false, error: "Vul een geldig telefoonnummer in." }, { status: 400 });
    }
    if (!date || !time) {
      return NextResponse.json({ ok: false, error: "Kies datum en tijdslot." }, { status: 400 });
    }
    if (lines.length === 0) {
      return NextResponse.json({ ok: false, error: "Je winkelmand is leeg." }, { status: 400 });
    }

    const totalCents = Math.round(
      lines.reduce((sum, l) => sum + l.priceEur * l.qty, 0) * 100,
    );

    const result = await createOrderRecord({
      name,
      phone,
      email,
      date,
      time,
      location: String(body.location ?? "Foodtruck").trim() || "Foodtruck",
      lines,
      totalCents,
      notes: linesMessage(lines),
    });

    if (result.slotFull) {
      return NextResponse.json(
        { ok: false, error: "Dit tijdslot is vol. Kies een ander tijdstip." },
        { status: 409 },
      );
    }

    const { order } = result;
    let checkoutUrl: string | null = null;

    if (isMollieConfigured() && totalCents > 0) {
      try {
        const payment = await createMollieCheckout({
          orderId: order.id,
          orderNumber: order.order_number,
          totalCents,
          description: `Grill Gasten ${order.order_number}`,
          customerEmail: email,
        });
        if (payment) {
          checkoutUrl = payment.checkoutUrl;
          await updateOrderPayment(order.id, {
            payment_status: "unpaid",
            mollie_payment_id: payment.paymentId,
            checkout_url: payment.checkoutUrl,
          });
        }
      } catch (e) {
        console.error("[api/orders] mollie", e);
      }
    }

    const message =
      linesMessage(lines) +
      `\n\nTotaal: ${formatEur(totalCents / 100)}` +
      (checkoutUrl ? "\n\nBetaallink volgt in checkout." : "\n\nBetaling bij afhalen.");

    await deliverInquiry({
      type: "preorder",
      name,
      phone,
      email,
      date,
      time,
      location: order.location ?? undefined,
      message,
      orderId: order.order_number,
    }).catch((e) => console.error("[api/orders] email", e));

    const qrDataUrl = await QRCode.toDataURL(order.order_number, {
      margin: 2,
      width: 280,
      color: { dark: "#ffffff", light: "#0a0a0a" },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.order_number,
      qrDataUrl,
      checkoutUrl,
      paymentRequired: Boolean(checkoutUrl),
    });
  } catch (e) {
    console.error("[api/orders]", e);
    return NextResponse.json(
      { ok: false, error: "Bestelling mislukt. Probeer opnieuw of WhatsApp ons." },
      { status: 500 },
    );
  }
}
