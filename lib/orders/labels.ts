/**
 * Consistente Nederlandse labels voor orders (UI, e-mail, print).
 */

import type { FulfillmentMethod, OrderStatus, PaymentStatus } from "@/lib/orders/types";

export function paymentStatusLabel(status: PaymentStatus | string): string {
  switch (status) {
    case "paid":
      return "Betaald";
    case "pending":
    case "unpaid":
      return "Wacht op betaling";
    case "failed":
      return "Betaling mislukt";
    case "canceled":
      return "Betaling geannuleerd";
    case "expired":
      return "Betaling verlopen";
    case "refunded":
      return "Terugbetaald";
    default:
      return "Betaling controleren";
  }
}

export function orderStatusLabel(
  status: OrderStatus | string,
  method?: FulfillmentMethod | string | null,
): string {
  switch (status) {
    case "pending":
      return "Wacht op betaling";
    case "confirmed":
      return "Bevestigd";
    case "preparing":
      return "Wordt bereid";
    case "ready":
      return method === "delivery" ? "Klaar voor bezorging" : "Klaar om af te halen";
    case "out_for_delivery":
      return "Onderweg";
    case "delivered":
      return "Bezorgd";
    case "picked_up":
      return "Afgehaald";
    case "cancelled":
      return "Geannuleerd";
    default:
      return "In behandeling";
  }
}

export function fulfillmentLabel(method: FulfillmentMethod | string | null | undefined): string {
  return method === "delivery" ? "Bezorgen" : "Afhalen";
}

export function displayOrNone(value: string | null | undefined): string {
  const t = value?.trim();
  return t ? t : "Geen";
}

/** Customer-facing payment headline (status page). */
export function customerPaymentHeadline(status: PaymentStatus | string): string {
  switch (status) {
    case "paid":
      return "Betaling geslaagd";
    case "pending":
    case "unpaid":
      return "Betaling in behandeling";
    case "failed":
      return "Betaling mislukt";
    case "canceled":
      return "Betaling geannuleerd";
    case "expired":
      return "Betaling verlopen";
    case "refunded":
      return "Terugbetaald";
    default:
      return "Betaling controleren";
  }
}

export function isPaymentPaid(status: PaymentStatus | string): boolean {
  return status === "paid";
}

export function isPaymentFailedish(status: PaymentStatus | string): boolean {
  return status === "failed" || status === "canceled" || status === "expired";
}

export function canStartPreparing(
  paymentStatus: PaymentStatus | string,
  force = false,
): boolean {
  if (force) return true;
  return isPaymentPaid(paymentStatus);
}
