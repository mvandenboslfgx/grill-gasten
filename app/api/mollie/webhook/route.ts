import { NextResponse } from "next/server";
import { getMollieClient } from "@/lib/mollie/client";
import { awardPointsForPaidOrder, updateOrderPayment } from "@/lib/orders/create-order";
import type { PaymentStatus } from "@/lib/orders/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

function mapMollieStatus(status: string): PaymentStatus {
  switch (status) {
    case "paid":
      return "paid";
    case "failed":
      return "failed";
    case "canceled":
      return "canceled";
    case "expired":
      return "expired";
    case "pending":
    case "open":
    case "authorized":
      return "pending";
    default:
      return "pending";
  }
}

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

    const nextPayment = mapMollieStatus(payment.status);

    if (payment.status === "paid") {
      if (order.payment_status !== "paid") {
        await updateOrderPayment(orderId, {
          payment_status: "paid",
          status: "confirmed",
          mollie_payment_id: paymentId,
        });
        await awardPointsForPaidOrder(
          email || (order.customer_email as string),
          orderId,
          order.total_cents as number,
        );
      }
    } else if (payment.status === "failed" || payment.status === "canceled" || payment.status === "expired") {
      if (order.payment_status !== "paid") {
        await updateOrderPayment(orderId, {
          payment_status: nextPayment,
          mollie_payment_id: paymentId,
        });
      }
    } else {
      // open / pending / authorized — en eventuele andere statuses
      const statusStr = String(payment.status);
      if (statusStr === "refunded") {
        await updateOrderPayment(orderId, {
          payment_status: "refunded",
          mollie_payment_id: paymentId,
        });
      } else if (order.payment_status !== "paid") {
        await updateOrderPayment(orderId, {
          payment_status: "pending",
          mollie_payment_id: paymentId,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/mollie/webhook]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
