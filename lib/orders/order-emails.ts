import { formatPriceCents } from "@/lib/catalog/format-money";
import {
  fulfillmentLabel,
  orderStatusLabel,
  paymentStatusLabel,
} from "@/lib/orders/labels";
import { formatAddress, formatLineForKitchen, parseOrderLines } from "@/lib/orders/parse-lines";
import type { DbOrder } from "@/lib/orders/types";
import { site } from "@/lib/site";

export function buildOwnerPaidEmail(order: DbOrder): { subject: string; text: string; html: string } {
  const lines = parseOrderLines(order.lines);
  const isDelivery = order.fulfillment_method === "delivery";
  const subtotal = order.subtotal_cents ?? order.total_cents - (order.delivery_fee_cents ?? 0);
  const fee = order.delivery_fee_cents ?? 0;
  const products = lines.map(formatLineForKitchen).join("\n\n");
  const address = isDelivery ? formatAddress(order) : "—";
  const kitchenUrl = `${site.url.replace(/\/$/, "")}/kitchen`;

  const text = [
    `Bestelnummer: ${order.order_number}`,
    `Betaalstatus: ${paymentStatusLabel(order.payment_status)}`,
    `Methode: ${fulfillmentLabel(order.fulfillment_method)}`,
    `Datum: ${order.pickup_date}`,
    `Tijd/venster: ${isDelivery ? order.delivery_window || order.pickup_time : order.pickup_time}`,
    `Naam: ${order.customer_name}`,
    `Telefoon: ${order.customer_phone}`,
    `E-mail: ${order.customer_email}`,
    isDelivery ? `Adres: ${address}` : null,
    isDelivery ? `Bezorgzone: ${order.delivery_zone ?? "—"}` : null,
    isDelivery ? `Bezorginstructies: ${order.delivery_instructions?.trim() || "Geen"}` : null,
    "",
    "Producten:",
    products,
    "",
    `Klantopmerking: ${order.customer_note?.trim() || "Geen"}`,
    `Subtotaal: ${formatPriceCents(subtotal)}`,
    `Bezorgkosten: ${formatPriceCents(fee)}`,
    `Totaal: ${formatPriceCents(order.total_cents)}`,
    "",
    `Keukenscherm: ${kitchenUrl}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const html = `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")}</pre>`;

  return {
    subject: `Nieuwe betaalde bestelling ${order.order_number}`,
    text,
    html,
  };
}

export function buildCustomerPaidEmail(
  order: DbOrder,
  accessToken: string,
): {
  subject: string;
  text: string;
  html: string;
} {
  const lines = parseOrderLines(order.lines);
  const isDelivery = order.fulfillment_method === "delivery";
  const subtotal = order.subtotal_cents ?? order.total_cents - (order.delivery_fee_cents ?? 0);
  const fee = order.delivery_fee_cents ?? 0;
  const statusUrl = `${site.url.replace(/\/$/, "")}/bestellen/status/${encodeURIComponent(order.order_number)}?t=${encodeURIComponent(accessToken)}`;
  const products = lines
    .map((l) => {
      const extras = l.options.map((o) => `  - ${o.label}`).join("\n");
      const sauce = l.sauceChoice ? `\n  - Saus: ${l.sauceChoice}` : "";
      return `${l.qty}× ${l.name}${extras ? `\n${extras}` : ""}${sauce} — ${formatPriceCents(l.lineTotalCents)}`;
    })
    .join("\n\n");

  const text = [
    `Bedankt voor je bestelling bij Grill Gasten!`,
    "",
    `Bestelnummer: ${order.order_number}`,
    `Betaalstatus: ${paymentStatusLabel(order.payment_status)}`,
    `Status: ${orderStatusLabel(order.status, order.fulfillment_method)}`,
    `Methode: ${fulfillmentLabel(order.fulfillment_method)}`,
    `Moment: ${order.pickup_date} · ${isDelivery ? order.delivery_window || order.pickup_time : order.pickup_time}`,
    isDelivery ? `Bezorgadres: ${formatAddress(order)}` : null,
    isDelivery ? `Bezorginstructies: ${order.delivery_instructions?.trim() || "Geen"}` : null,
    "",
    "Producten:",
    products,
    "",
    `Klantopmerking: ${order.customer_note?.trim() || "Geen"}`,
    `Subtotaal: ${formatPriceCents(subtotal)}`,
    `Bezorgkosten: ${formatPriceCents(fee)}`,
    `Totaal: ${formatPriceCents(order.total_cents)}`,
    "",
    `Volg je bestelling: ${statusUrl}`,
    `Vragen? Bel ${site.phoneDisplay} of WhatsApp ${site.whatsapp}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const html = `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap">${text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")}</pre>`;

  return {
    subject: `Bevestiging bestelling ${order.order_number} — Grill Gasten`,
    text,
    html,
  };
}
