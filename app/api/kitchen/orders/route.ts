import { NextResponse } from "next/server";
import { verifyKitchenRequest } from "@/lib/auth/kitchen";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { OrderStatus } from "@/lib/orders/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isSupabaseConfigured() || !verifyKitchenRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("orders")
    .select(
      "id, order_number, status, payment_status, fulfillment_method, customer_name, customer_phone, pickup_time, delivery_window, delivery_city, delivery_zone, delivery_street, delivery_postcode, delivery_house_number, delivery_addition, delivery_instructions, delivery_distance_meters, notes, lines, total_cents, subtotal_cents, delivery_fee_cents, created_at",
    )
    .eq("pickup_date", date)
    .not("status", "eq", "cancelled")
    .order("pickup_time", { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orders: data ?? [] });
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured() || !verifyKitchenRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; status?: OrderStatus };
  if (!body.id || !body.status) {
    return NextResponse.json({ ok: false, error: "id en status verplicht" }, { status: 400 });
  }

  const allowed: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "picked_up",
    "cancelled",
  ];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ ok: false, error: "Ongeldige status" }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  const patch: Record<string, string> = { status: body.status };
  if (body.status === "out_for_delivery") patch.batch_status = "out_for_delivery";
  if (body.status === "delivered") patch.batch_status = "delivered";

  const { error } = await db.from("orders").update(patch).eq("id", body.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
