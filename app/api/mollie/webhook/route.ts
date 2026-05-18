import { NextResponse } from "next/server";
import { getMollieClient } from "@/lib/mollie/client";
import { awardPointsForOrder } from "@/lib/orders/create-order";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isMollieConfigured() || !isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.formData();
    const paymentId = String(body.get("id") ?? "");
    if (!paymentId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const mollie = getMollieClient();
    const payment = await mollie.payments.get(paymentId);
    const meta = payment.metadata as Record<string, string> | null;
    const orderId = meta?.orderId;
    const email = meta?.customerEmail;

    if (!orderId) {
      return NextResponse.json({ ok: true });
    }

    const db = getSupabaseAdmin();
    const paid = payment.status === "paid";

    const { data: order } = await db
      .from("orders")
      .select("id, customer_email, total_cents, payment_status")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ ok: true });
    }

    if (paid && order.payment_status !== "paid") {
      await db
        .from("orders")
        .update({ payment_status: "paid", status: "confirmed" })
        .eq("id", orderId);

      await awardPointsForOrder(
        email ?? (order.customer_email as string),
        orderId,
        order.total_cents as number,
      );
    } else if (payment.status === "failed" || payment.status === "canceled" || payment.status === "expired") {
      await db.from("orders").update({ payment_status: "failed" }).eq("id", orderId);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/mollie/webhook]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
