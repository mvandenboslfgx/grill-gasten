import { generateOrderNumber } from "@/lib/orders/order-number";
import type { PricedOrderLine } from "@/lib/catalog/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  DbOrder,
  FulfillmentMethod,
  OrderStatus,
  PaymentStatus,
} from "@/lib/orders/types";

export type CreateOrderDbInput = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  method: FulfillmentMethod;
  lines: PricedOrderLine[];
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  notes?: string;
  customerNote?: string;
  deliveryWindow?: string;
  deliveryStreet?: string;
  deliveryPostcode?: string;
  deliveryHouseNumber?: string;
  deliveryAddition?: string;
  deliveryCity?: string;
  deliveryZone?: number;
  deliveryDistanceMeters?: number;
  deliveryDurationSeconds?: number;
  deliveryInstructions?: string;
};

export type CreateOrderDbResult =
  | { ok: true; order: DbOrder }
  | { ok: false; code: "slot_full" | "conflict" | "error"; message: string };

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
    sauceChoice: l.sauceChoice,
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
    p_fulfillment_method: input.method,
    p_delivery_window: input.deliveryWindow ?? null,
    p_subtotal_cents: input.subtotalCents,
    p_delivery_fee_cents: input.deliveryFeeCents,
    p_delivery_street: input.deliveryStreet ?? null,
    p_delivery_postcode: input.deliveryPostcode ?? null,
    p_delivery_house_number: input.deliveryHouseNumber ?? null,
    p_delivery_addition: input.deliveryAddition ?? null,
    p_delivery_city: input.deliveryCity ?? null,
    p_delivery_zone: input.deliveryZone ?? null,
    p_delivery_distance_meters: input.deliveryDistanceMeters ?? null,
    p_delivery_duration_seconds: input.deliveryDurationSeconds ?? null,
    p_delivery_instructions: input.deliveryInstructions ?? null,
  });

  if (!error && data) {
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.error_code === "slot_full") {
      return { ok: false, code: "slot_full", message: "Dit tijdvak is vol. Kies een ander moment." };
    }
    if (row?.id) {
      const order = row as DbOrder;
      if (input.customerNote) {
        await db
          .from("orders")
          .update({ customer_note: input.customerNote })
          .eq("id", order.id);
        order.customer_note = input.customerNote;
      }
      return { ok: true, order };
    }
  }

  // Geen count-then-insert fallback — overboeking voorkomen; RPC met advisory lock is verplicht.
  if (error?.message?.includes("create_order_with_slot") || error?.code === "PGRST202") {
    console.error("[createOrderAtomic] RPC missing", { code: "RPC_MISSING" });
    return {
      ok: false,
      code: "error",
      message: "Online bestellen is tijdelijk niet beschikbaar. Neem contact op via WhatsApp.",
    };
  }

  if (error?.code === "23505") {
    return createOrderAtomic(input);
  }

  console.error("[createOrderAtomic]", error?.message ?? "error");
  return { ok: false, code: "error", message: "Bestelling kon niet worden opgeslagen." };
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

  if (existing) return;

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
