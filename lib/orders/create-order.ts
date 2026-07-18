import { generateOrderNumber } from "@/lib/orders/order-number";
import type { PricedOrderLine } from "@/lib/catalog/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { DbOrder, OrderStatus, PaymentStatus } from "@/lib/orders/types";

export type CreateOrderDbInput = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  lines: PricedOrderLine[];
  totalCents: number;
  notes?: string;
};

export type CreateOrderDbResult =
  | { ok: true; order: DbOrder }
  | { ok: false; code: "slot_full" | "conflict" | "error"; message: string };

/**
 * Atomische orderaanmaak via RPC create_order_with_slot.
 * Fallback: count+insert alleen als RPC nog niet gemigreerd is.
 */
export async function createOrderAtomic(
  input: CreateOrderDbInput,
): Promise<CreateOrderDbResult> {
  const db = getSupabaseAdmin();
  const orderNumber = generateOrderNumber();

  const linesJson = input.lines.map((l) => ({
    productId: l.productId,
    name: l.name,
    qty: l.qty,
    optionIds: l.optionIds,
    optionLabels: l.optionLabels,
    unitPriceCents: l.unitPriceCents,
    lineTotalCents: l.lineTotalCents,
    note: l.note,
  }));

  const { data, error } = await db.rpc("create_order_with_slot", {
    p_order_number: orderNumber,
    p_customer_name: input.name,
    p_customer_phone: input.phone,
    p_customer_email: input.email,
    p_pickup_date: input.date,
    p_pickup_time: input.time,
    p_lines: linesJson,
    p_total_cents: input.totalCents,
    p_notes: input.notes ?? null,
  });

  if (!error && data) {
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.error_code === "slot_full") {
      return { ok: false, code: "slot_full", message: "Dit tijdslot is vol." };
    }
    if (row?.id) {
      return { ok: true, order: row as DbOrder };
    }
  }

  // Fallback wanneer RPC nog niet bestaat
  if (error?.message?.includes("create_order_with_slot") || error?.code === "PGRST202") {
    return createOrderFallback(input, orderNumber);
  }

  if (error?.code === "23505") {
    // Unique collision on order_number — retry once
    return createOrderAtomic(input);
  }

  console.error("[createOrderAtomic]", error?.message ?? error);
  return { ok: false, code: "error", message: "Bestelling kon niet worden opgeslagen." };
}

async function createOrderFallback(
  input: CreateOrderDbInput,
  orderNumber: string,
): Promise<CreateOrderDbResult> {
  const db = getSupabaseAdmin();
  const { count, error: countErr } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("pickup_date", input.date)
    .eq("pickup_time", input.time)
    .not("status", "eq", "cancelled");

  if (countErr) {
    return { ok: false, code: "error", message: "Capaciteit controleren mislukt." };
  }

  const { data: cap } = await db
    .from("timeslot_caps")
    .select("max_orders")
    .eq("event_date", input.date)
    .eq("slot_time", input.time)
    .maybeSingle();

  const max = cap?.max_orders ?? 12;
  if ((count ?? 0) >= max) {
    return { ok: false, code: "slot_full", message: "Dit tijdslot is vol." };
  }

  const { data, error } = await db
    .from("orders")
    .insert({
      order_number: orderNumber,
      status: "pending",
      payment_status: "unpaid",
      customer_name: input.name,
      customer_phone: input.phone,
      customer_email: input.email,
      pickup_date: input.date,
      pickup_time: input.time,
      location: null,
      lines: input.lines,
      total_cents: input.totalCents,
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return createOrderAtomic(input);
    return { ok: false, code: "error", message: "Bestelling opslaan mislukt." };
  }

  return { ok: true, order: data as DbOrder };
}

export async function updateOrderPayment(
  orderId: string,
  patch: {
    payment_status: PaymentStatus;
    mollie_payment_id?: string;
    checkout_url?: string;
    status?: OrderStatus;
  },
): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db.from("orders").update(patch).eq("id", orderId);
  if (error) throw error;
}

export async function getOrderByNumber(orderNumber: string): Promise<DbOrder | null> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (error) throw error;
  return (data as DbOrder) ?? null;
}

/**
 * Punten toekennen — idempotent via unique ledger reason per order.
 */
export async function awardPointsForPaidOrder(
  email: string,
  orderId: string,
  totalCents: number,
): Promise<void> {
  const points = Math.floor(totalCents / 100);
  if (points <= 0) return;

  const db = getSupabaseAdmin();
  const reason = `order:${orderId}`;

  const { data: existing } = await db
    .from("points_ledger")
    .select("id")
    .eq("order_id", orderId)
    .eq("reason", reason)
    .maybeSingle();

  if (existing) return; // al toegekend

  const { data: member } = await db
    .from("rewards_members")
    .select("id, points")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!member) return;

  const newPoints = (member.points as number) + points;
  const tier =
    newPoints >= 1500 ? "black" : newPoints >= 750 ? "gold" : newPoints >= 250 ? "silver" : "bronze";

  await db.from("rewards_members").update({ points: newPoints, tier }).eq("id", member.id);
  await db.from("points_ledger").insert({
    member_id: member.id,
    delta: points,
    reason,
    order_id: orderId,
  });
}
