import { createHash, randomBytes } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type OrderEventType =
  | "webhook_paid_processed"
  | "email_owner_paid"
  | "email_customer_paid"
  | "points_awarded";

/**
 * Claim a one-time side-effect for an order.
 * Returns true if this caller won the claim (should perform the action).
 */
export async function claimOrderEvent(
  orderId: string,
  eventType: OrderEventType,
): Promise<boolean> {
  const db = getSupabaseAdmin();
  const { error } = await db.from("order_events").insert({
    order_id: orderId,
    event_type: eventType,
  });
  if (!error) return true;
  // unique violation → already claimed
  if (error.code === "23505") return false;
  // Table not yet migrated — allow once so paid orders still notify (ops must migrate)
  if (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /order_events/i.test(error.message ?? "")
  ) {
    console.error("[order-events] table missing", { code: error.code });
    return true;
  }
  console.error("[order-events] claim failed", { code: error.code, eventType });
  return false;
}

export function hashIdempotencyPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex");
}

export function generateIdempotencyKey(): string {
  return randomBytes(24).toString("base64url");
}
