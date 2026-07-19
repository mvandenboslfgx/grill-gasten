import { NextResponse } from "next/server";
import { formatPriceCents } from "@/lib/catalog/format-money";
import { priceOrderLines } from "@/lib/catalog/pricing";
import {
  normalizeAddition,
  normalizeHouseNumber,
  normalizePostcode,
} from "@/lib/delivery/address-validation";
import { addressesMatchQuote, verifySignedQuote } from "@/lib/delivery/quote";
import { zoneForDistanceMeters } from "@/lib/delivery/zones";
import { isDeliveryRoutingConfigured, isQuoteSecretConfigured } from "@/lib/delivery/config";
import { createMollieCheckout } from "@/lib/mollie/create-payment";
import {
  createOrderAtomic,
  updateOrderPayment,
} from "@/lib/orders/create-order";
import {
  validateDeliveryMoment,
  validatePickupMoment,
} from "@/lib/ordering/availability";
import { getDeliveryWindowById } from "@/lib/ordering/delivery-windows";
import { createOrderSchema } from "@/lib/ordering/validate";
import { clientIp, rateLimitAsync } from "@/lib/security/rate-limit";
import { isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { site } from "@/lib/site";

export const runtime = "nodejs";

function sanitizeNote(raw: string | undefined, max: number): string | undefined {
  if (!raw?.trim()) return undefined;
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !isMollieConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Online bestellen is tijdelijk niet beschikbaar. Neem contact met ons op via WhatsApp.",
        code: "ORDERING_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const rl = await rateLimitAsync(`orders:${ip}`, 8, 60_000);
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

  const priced = priceOrderLines(data.lines);
  if (!priced.ok) {
    return NextResponse.json({ ok: false, error: priced.error }, { status: 400 });
  }

  let deliveryFeeCents = 0;
  let deliveryMeta: {
    street?: string;
    postcode?: string;
    houseNumber?: string;
    addition?: string;
    city?: string;
    zone?: number;
    distanceMeters?: number;
    durationSeconds?: number;
    window?: string;
    instructions?: string;
  } = {};

  if (data.method === "pickup") {
    const pickup = validatePickupMoment(data.date, data.time);
    if (!pickup.ok) {
      return NextResponse.json({ ok: false, error: pickup.error }, { status: 400 });
    }
  } else {
    if (!isDeliveryRoutingConfigured() || !isQuoteSecretConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Online bezorgen is tijdelijk niet beschikbaar. Afhalen is wel mogelijk.",
          code: "DELIVERY_ROUTING_UNAVAILABLE",
        },
        { status: 503 },
      );
    }

    const windowOk = validateDeliveryMoment(data.date, data.time);
    if (!windowOk.ok) {
      return NextResponse.json({ ok: false, error: windowOk.error }, { status: 400 });
    }

    const postcode = normalizePostcode(data.postcode ?? "");
    const houseNumber = normalizeHouseNumber(data.houseNumber ?? "");
    const addition = normalizeAddition(data.addition);
    if (!postcode || !houseNumber) {
      return NextResponse.json(
        { ok: false, error: "Ongeldig bezorgadres." },
        { status: 400 },
      );
    }

    if (!data.quoteId) {
      return NextResponse.json(
        { ok: false, error: "Controleer eerst je bezorgadres." },
        { status: 400 },
      );
    }

    const verified = verifySignedQuote(data.quoteId);
    if (!verified.ok) {
      return NextResponse.json({ ok: false, error: verified.error }, { status: 400 });
    }

    if (!addressesMatchQuote(verified.payload, postcode, houseNumber, addition)) {
      return NextResponse.json(
        { ok: false, error: "Adres komt niet overeen met de bezorgquote. Controleer opnieuw." },
        { status: 400 },
      );
    }

    // Zone opnieuw bepalen vanuit afstand in quote (niet client zone)
    const zone = zoneForDistanceMeters(verified.payload.distanceMeters);
    if (!zone || zone.id !== verified.payload.zoneId) {
      return NextResponse.json(
        { ok: false, error: "Bezorgzone ongeldig. Controleer je adres opnieuw." },
        { status: 400 },
      );
    }

    if (priced.subtotalCents < zone.minOrderCents) {
      const need = zone.minOrderCents - priced.subtotalCents;
      return NextResponse.json(
        {
          ok: false,
          error: `Minimum bestelling voor jouw zone is ${formatPriceCents(zone.minOrderCents)} (excl. bezorgkosten). Nog ${formatPriceCents(need)} nodig.`,
          code: "MIN_ORDER",
          minOrderCents: zone.minOrderCents,
          shortfallCents: need,
        },
        { status: 400 },
      );
    }

    // Fee opnieuw uit zone — niet uit client
    deliveryFeeCents = zone.feeCents;
    const window = getDeliveryWindowById(data.time);

    deliveryMeta = {
      street: verified.payload.street,
      postcode,
      houseNumber,
      addition,
      city: verified.payload.city,
      zone: zone.id,
      distanceMeters: verified.payload.distanceMeters,
      durationSeconds: verified.payload.durationSeconds,
      window: window?.id ?? data.time,
      instructions: sanitizeNote(data.deliveryInstructions, 150),
    };
  }

  const totalCents = priced.subtotalCents + deliveryFeeCents;

  const notesLines = priced.lines
    .map((l) => {
      const opts = l.optionLabels.length ? ` [${l.optionLabels.join(", ")}]` : "";
      const sauce = l.sauceChoice ? ` (saus: ${l.sauceChoice})` : "";
      const note = l.note ? ` — ${l.note}` : "";
      return `${l.qty}× ${l.name}${opts}${sauce} — ${formatPriceCents(l.lineTotalCents)}${note}`;
    })
    .join("\n");

  const customerNote = sanitizeNote(data.note, 500);
  const methodLabel = data.method === "pickup" ? "Afhalen" : "Bezorgen";

  const emailBody = [
    `Bestelnummer: (wordt toegekend)`,
    `Methode: ${methodLabel}`,
    `Naam: ${data.name}`,
    `Telefoon: ${data.phone}`,
    `E-mail: ${data.email}`,
    data.method === "pickup"
      ? `Afhalen: ${data.date} om ${data.time}`
      : `Bezorgen: ${data.date} venster ${deliveryMeta.window}`,
    data.method === "delivery"
      ? `Adres: ${deliveryMeta.street || ""} ${deliveryMeta.houseNumber}${deliveryMeta.addition || ""}, ${deliveryMeta.postcode} ${deliveryMeta.city} (zone ${deliveryMeta.zone})`
      : null,
    deliveryMeta.instructions ? `Bezorginstructies: ${deliveryMeta.instructions}` : null,
    `Subtotaal: ${formatPriceCents(priced.subtotalCents)}`,
    `Bezorgkosten: ${formatPriceCents(deliveryFeeCents)}`,
    `Totaal: ${formatPriceCents(totalCents)}`,
    `Betaalstatus: in behandeling (Mollie)`,
    "",
    "Bestelling:",
    notesLines,
    customerNote ? `\nOpmerking klant: ${customerNote}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const created = await createOrderAtomic({
    name: data.name,
    phone: data.phone,
    email: data.email,
    date: data.date,
    time: data.method === "pickup" ? data.time : (getDeliveryWindowById(data.time)?.start ?? data.time),
    method: data.method,
    lines: priced.lines,
    subtotalCents: priced.subtotalCents,
    deliveryFeeCents,
    totalCents,
    notes: emailBody,
    customerNote,
    deliveryWindow: deliveryMeta.window,
    deliveryStreet: deliveryMeta.street,
    deliveryPostcode: deliveryMeta.postcode,
    deliveryHouseNumber: deliveryMeta.houseNumber,
    deliveryAddition: deliveryMeta.addition,
    deliveryCity: deliveryMeta.city,
    deliveryZone: deliveryMeta.zone,
    deliveryDistanceMeters: deliveryMeta.distanceMeters,
    deliveryDurationSeconds: deliveryMeta.durationSeconds,
    deliveryInstructions: deliveryMeta.instructions,
  });

  if (!created.ok) {
    const status = created.code === "slot_full" ? 409 : 500;
    return NextResponse.json({ ok: false, error: created.message }, { status });
  }

  const { order, accessToken } = created;
  let checkoutUrl: string | null = null;

  async function cancelOrphanOrder(code: string) {
    try {
      await updateOrderPayment(order.id, {
        payment_status: "failed",
        status: "cancelled",
      });
    } catch (cancelErr) {
      console.error("[api/orders] cancel orphan", {
        orderId: order.id,
        orderNumber: order.order_number,
        code: "CANCEL_ORPHAN_FAILED",
      });
      void cancelErr;
    }
    console.error("[api/orders] mollie create failed", {
      orderId: order.id,
      orderNumber: order.order_number,
      code,
    });
  }

  try {
    const payment = await createMollieCheckout({
      orderId: order.id,
      orderNumber: order.order_number,
      totalCents,
      description: `Grill Gasten ${order.order_number}`,
      customerEmail: data.email,
      accessToken,
    });
    if (!payment?.paymentId || !payment.checkoutUrl) {
      await cancelOrphanOrder("MOLLIE_CREATE_NULL");
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
  } catch {
    await cancelOrphanOrder("MOLLIE_CREATE_EXCEPTION");
    return NextResponse.json(
      { ok: false, error: "Betaling starten mislukt. Probeer opnieuw of WhatsApp ons." },
      { status: 502 },
    );
  }

  // Geen bevestigingsmail vóór Mollie paid — zie webhook
  return NextResponse.json({
    ok: true,
    orderNumber: order.order_number,
    checkoutUrl,
    statusUrl: `${site.url}/bestellen/status/${encodeURIComponent(order.order_number)}?t=${encodeURIComponent(accessToken)}`,
    totalCents,
    subtotalCents: priced.subtotalCents,
    deliveryFeeCents,
  });
}
