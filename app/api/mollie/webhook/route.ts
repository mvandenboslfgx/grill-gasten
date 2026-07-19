import { NextResponse } from "next/server";
import { mollieAmountMatchesOrder } from "@/lib/mollie/amount";
import { getMollieClient } from "@/lib/mollie/client";
import { mapMollieWebhookUpdate } from "@/lib/mollie/webhook-status";
import { ownerInbox, sendTransactionalEmail } from "@/lib/email/send-order-mail";
import { orderLog } from "@/lib/observability/order-log";
import { decryptAccessToken } from "@/lib/orders/access-token-crypto";
import {
  buildCustomerPaidEmail,
  buildOwnerPaidEmail,
} from "@/lib/orders/order-emails";
import { claimOrderEvent } from "@/lib/orders/order-events";
import { awardPointsForPaidOrder, updateOrderPayment } from "@/lib/orders/create-order";
import type { DbOrder, OrderStatus, PaymentStatus } from "@/lib/orders/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isMollieConfigured() || !isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const { clientIp, rateLimitAsync } = await import("@/lib/security/rate-limit");
    const ip = clientIp(request);
    const limited = await rateLimitAsync(`mollie-webhook:${ip}`, 120, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const body = await request.formData();
    const paymentId = String(body.get("id") ?? "");
    if (!paymentId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    orderLog("WEBHOOK_RECEIVED", { paymentIdPrefix: paymentId.slice(0, 8) });

    const mollie = getMollieClient();
    const payment = await mollie.payments.get(paymentId);
    const meta = payment.metadata as Record<string, string> | null;
    const orderId = meta?.orderId;

    if (!orderId) {
      return NextResponse.json({ ok: true });
    }

    const db = getSupabaseAdmin();
    const { data: order } = await db
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ ok: true });
    }

    const amountOk = mollieAmountMatchesOrder({
      mollieValue: payment.amount?.value,
      mollieCurrency: payment.amount?.currency,
      orderTotalCents: order.total_cents as number,
    });

    if (!amountOk && payment.status === "paid") {
      orderLog("WEBHOOK_AMOUNT_MISMATCH", {
        orderNumber: order.order_number as string,
        expectedCents: order.total_cents as number,
      });
      return NextResponse.json({ ok: true });
    }

    const currentPayment = order.payment_status as PaymentStatus;
    const wasPaid = currentPayment === "paid";
    const mapped = mapMollieWebhookUpdate(payment.status, currentPayment);

    if (mapped.skip) {
      orderLog("WEBHOOK_SKIPPED", { orderNumber: order.order_number as string });
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

    if (mapped.awardPoints && !wasPaid) {
      const claimed = await claimOrderEvent(orderId, "webhook_paid_processed");
      if (!claimed) {
        orderLog("WEBHOOK_SKIPPED", {
          orderNumber: order.order_number as string,
          reason: "already_processed",
        });
        return NextResponse.json({ ok: true });
      }

      orderLog("WEBHOOK_PAID_VERIFIED", {
        orderNumber: order.order_number as string,
      });
      orderLog("ORDER_CONFIRMED", { orderNumber: order.order_number as string });

      await awardPointsForPaidOrder(
        order.customer_email as string,
        orderId,
        order.total_cents as number,
      );

      const full = { ...order, ...patch } as DbOrder;
      const accessToken = decryptAccessToken(
        typeof order.access_token_ciphertext === "string"
          ? order.access_token_ciphertext
          : null,
      );

      const ownerClaimed = await claimOrderEvent(orderId, "email_owner_paid");
      if (ownerClaimed) {
        const ownerMail = buildOwnerPaidEmail(full);
        await sendTransactionalEmail({
          to: ownerInbox(),
          subject: ownerMail.subject,
          text: ownerMail.text,
          html: ownerMail.html,
          replyTo: full.customer_email,
        }).then(() => {
          orderLog("EMAIL_SENT", { orderNumber: full.order_number, kind: "owner" });
        }).catch(() => {
          orderLog("EMAIL_FAILED", { orderNumber: full.order_number, kind: "owner" });
        });
      } else {
        orderLog("EMAIL_SKIPPED_IDEMPOTENT", {
          orderNumber: full.order_number,
          kind: "owner",
        });
      }

      const customerClaimed = await claimOrderEvent(orderId, "email_customer_paid");
      if (customerClaimed) {
        if (accessToken) {
          const customerMail = buildCustomerPaidEmail(full, accessToken);
          await sendTransactionalEmail({
            to: full.customer_email,
            subject: customerMail.subject,
            text: customerMail.text,
            html: customerMail.html,
          }).then(() => {
            orderLog("EMAIL_SENT", { orderNumber: full.order_number, kind: "customer" });
          }).catch(() => {
            orderLog("EMAIL_FAILED", { orderNumber: full.order_number, kind: "customer" });
          });
        } else {
          orderLog("EMAIL_FAILED", {
            orderNumber: full.order_number,
            kind: "customer",
            code: "CUSTOMER_STATUS_TOKEN_MISSING",
          });
        }
      } else {
        orderLog("EMAIL_SKIPPED_IDEMPOTENT", {
          orderNumber: full.order_number,
          kind: "customer",
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    orderLog("UNEXPECTED_ERROR", {
      scope: "mollie_webhook",
      message: e instanceof Error ? e.message.slice(0, 80) : "error",
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
