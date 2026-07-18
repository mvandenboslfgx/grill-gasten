import { NextResponse } from "next/server";
import { verifyKitchenRequest } from "@/lib/auth/kitchen";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { OrderStatus, PaymentStatus } from "@/lib/orders/types";
import { canStartPreparing } from "@/lib/orders/labels";
import { clientIp, rateLimitAsync } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

async function kitchenGate(request: Request) {
  const ip = clientIp(request);
  const rl = await rateLimitAsync(`kitchen:${ip}`, 60, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Te veel verzoeken." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }
  if (!isSupabaseConfigured() || !verifyKitchenRequest(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const denied = await kitchenGate(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const includeCancelled = url.searchParams.get("history") === "1";

  const db = getSupabaseAdmin();
  let query = db
    .from("orders")
    .select(
      "id, order_number, status, payment_status, fulfillment_method, customer_name, customer_phone, customer_email, pickup_date, pickup_time, delivery_window, delivery_city, delivery_zone, delivery_street, delivery_postcode, delivery_house_number, delivery_addition, delivery_instructions, delivery_distance_meters, delivery_duration_seconds, customer_note, notes, lines, total_cents, subtotal_cents, delivery_fee_cents, mollie_payment_id, created_at, updated_at",
    )
    .eq("pickup_date", date)
    .order("pickup_time", { ascending: true });

  if (!includeCancelled) {
    query = query.not("status", "eq", "cancelled");
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, orders: data ?? [] });
}

export async function PATCH(request: Request) {
  const denied = await kitchenGate(request);
  if (denied) return denied;

  const body = (await request.json()) as {
    id?: string;
    status?: OrderStatus;
    force?: boolean;
  };
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
  const { data: existing } = await db
    .from("orders")
    .select("id, payment_status, status")
    .eq("id", body.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ ok: false, error: "Order niet gevonden" }, { status: 404 });
  }

  const payment = existing.payment_status as PaymentStatus;
  const preparingStatuses: OrderStatus[] = [
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "picked_up",
  ];

  if (
    preparingStatuses.includes(body.status) &&
    !canStartPreparing(payment, Boolean(body.force))
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Order is niet betaald. Bevestigen/bereiden alleen bij betaalde bestellingen.",
        code: "NOT_PAID",
      },
      { status: 409 },
    );
  }

  const patch: Record<string, string> = { status: body.status };
  if (body.status === "out_for_delivery") patch.batch_status = "out_for_delivery";
  if (body.status === "delivered") patch.batch_status = "delivered";

  const { error } = await db.from("orders").update(patch).eq("id", body.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
