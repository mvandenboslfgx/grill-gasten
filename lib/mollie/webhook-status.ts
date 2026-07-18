import type { OrderStatus, PaymentStatus } from "@/lib/orders/types";

export type MolliePaymentStatus =
  | "paid"
  | "failed"
  | "canceled"
  | "expired"
  | "pending"
  | "open"
  | "authorized"
  | "refunded"
  | "partially_refunded"
  | string;

export type WebhookApplyResult =
  | {
      skip?: false;
      paymentStatus: PaymentStatus;
      /** Order status patch; null = do not change order status */
      orderStatus: OrderStatus | null;
      awardPoints: boolean;
    }
  | { skip: true };

/**
 * Maps Mollie payment status → internal payment + order status.
 * Paid orders are never cancelled by a later webhook event (caller must guard).
 */
export function mapMollieWebhookUpdate(
  mollieStatus: MolliePaymentStatus,
  currentPaymentStatus: PaymentStatus,
): WebhookApplyResult {
  // Never downgrade a paid order via stale webhook
  if (currentPaymentStatus === "paid") {
    if (mollieStatus === "paid") {
      return { skip: true }; // idempotent
    }
    if (mollieStatus === "refunded" || mollieStatus === "partially_refunded") {
      return {
        paymentStatus: "refunded",
        orderStatus: null,
        awardPoints: false,
      };
    }
    // Ignore failed/canceled/expired after paid
    return { skip: true };
  }

  switch (mollieStatus) {
    case "paid":
      return {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        awardPoints: true,
      };
    case "failed":
      return {
        paymentStatus: "failed",
        orderStatus: "cancelled",
        awardPoints: false,
      };
    case "canceled":
      return {
        paymentStatus: "canceled",
        orderStatus: "cancelled",
        awardPoints: false,
      };
    case "expired":
      return {
        paymentStatus: "expired",
        orderStatus: "cancelled",
        awardPoints: false,
      };
    case "refunded":
    case "partially_refunded":
      return {
        paymentStatus: "refunded",
        orderStatus: null,
        awardPoints: false,
      };
    case "pending":
    case "open":
    case "authorized":
      return {
        paymentStatus: "pending",
        orderStatus: null, // keep pending / active kitchen status
        awardPoints: false,
      };
    default:
      return {
        paymentStatus: "pending",
        orderStatus: null,
        awardPoints: false,
      };
  }
}

/** Statussen die capaciteit bezetten (advisory lock count). */
export const CAPACITY_ACTIVE_STATUSES: readonly OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
] as const;

export function countsTowardSlotCapacity(status: OrderStatus): boolean {
  return (CAPACITY_ACTIVE_STATUSES as readonly string[]).includes(status);
}
