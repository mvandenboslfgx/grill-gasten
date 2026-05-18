import { SLOT_CAPACITY } from "@/lib/preorder/timeslots";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { CreateOrderInput, DbOrder, OrderLine } from "@/lib/orders/types";

function createOrderNumber(): string {
  return `GG-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

async function countSlotOrders(pickupDate: string, pickupTime: string): Promise<number> {
  const db = getSupabaseAdmin();
  const { count, error } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("pickup_date", pickupDate)
    .eq("pickup_time", pickupTime)
    .not("status", "eq", "cancelled");

  if (error) throw error;
  return count ?? 0;
}

async function getSlotCapacity(pickupDate: string, pickupTime: string): Promise<number> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("timeslot_caps")
    .select("max_orders")
    .eq("event_date", pickupDate)
    .eq("slot_time", pickupTime)
    .maybeSingle();

  if (error) throw error;
  return data?.max_orders ?? SLOT_CAPACITY;
}

export async function createOrderRecord(
  input: CreateOrderInput,
): Promise<{ order: DbOrder; slotFull: false } | { slotFull: true }> {
  const used = await countSlotOrders(input.date, input.time);
  const max = await getSlotCapacity(input.date, input.time);
  if (used >= max) {
    return { slotFull: true };
  }

  const orderNumber = createOrderNumber();
  const db = getSupabaseAdmin();

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
      location: input.location ?? null,
      lines: input.lines as unknown as OrderLine[],
      total_cents: input.totalCents,
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return { order: data as DbOrder, slotFull: false };
}

export async function updateOrderPayment(
  orderId: string,
  patch: { payment_status: string; mollie_payment_id?: string; checkout_url?: string; status?: string },
): Promise<void> {
  const db = getSupabaseAdmin();
  const { error } = await db.from("orders").update(patch).eq("id", orderId);
  if (error) throw error;
}

export async function awardPointsForOrder(
  email: string,
  orderId: string,
  totalCents: number,
): Promise<void> {
  const points = Math.floor(totalCents / 100);
  if (points <= 0) return;

  const db = getSupabaseAdmin();
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
    reason: "Bestelling",
    order_id: orderId,
  });
}
