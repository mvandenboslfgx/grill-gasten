import { NextResponse } from "next/server";
import { getMollieClient } from "@/lib/mollie/client";
import { mapMollieWebhookUpdate } from "@/lib/mollie/webhook-status";
import { awardPointsForPaidOrder, updateOrderPayment } from "@/lib/orders/create-order";
import type { OrderStatus, PaymentStatus } from "@/lib/orders/types";
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
    const { data: order } = await db
      .from("orders")
      .select("id, customer_email, total_cents, payment_status")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ ok: true });
    }

    const currentPayment = order.payment_status as PaymentStatus;
    const mapped = mapMollieWebhookUpdate(payment.status, currentPayment);

    if (mapped.skip) {
      return NextResponse.json({ ok: true });
    }

    const patch: {
      payment_status: PaymentStatus;
      mollie_payment_id: string;
      status?: OrderStatus;
    } = {
      payment_status: mapped.paymentStatus,
      mollie_payment_id: paymentId,
    };
    if (mapped.orderStatus) {
      patch.status = mapped.orderStatus;
    }

    await updateOrderPayment(orderId, patch);

    if (mapped.awardPoints) {
      await awardPointsForPaidOrder(
        email || (order.customer_email as string),
        orderId,
        order.total_cents as number,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/mollie/webhook]", e instanceof Error ? e.message : "error");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
