import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/email/send-inquiry";
import { validateInquiry, type InquiryPayload } from "@/lib/inquiry";
import { inquiryErrorForUser } from "@/lib/inquiry-errors";

function createOrderId(): string {
  return `GG-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = validateInquiry(body);

    if (error || !data) {
      return NextResponse.json({ ok: false, error: error ?? "Validatiefout." }, { status: 400 });
    }

    const payload: InquiryPayload = { ...data };
    if (payload.type === "preorder" && !payload.orderId) {
      payload.orderId = createOrderId();
    }

    const result = await deliverInquiry(payload);

    if (!result.ok) {
      const status = result.code === "NO_PROVIDER" ? 503 : 502;
      return NextResponse.json(
        { ok: false, error: inquiryErrorForUser(result.code), code: result.code },
        { status },
      );
    }

    let qrDataUrl: string | undefined;
    if (payload.type === "preorder" && payload.orderId) {
      qrDataUrl = await QRCode.toDataURL(payload.orderId, {
        margin: 2,
        width: 280,
        color: { dark: "#ffffff", light: "#0a0a0a" },
      });
    }

    return NextResponse.json({
      ok: true,
      channel: result.channel,
      orderId: payload.orderId,
      qrDataUrl,
    });
  } catch (e) {
    console.error("[api/inquiry]", e);
    return NextResponse.json(
      { ok: false, error: "Er ging iets mis. Probeer WhatsApp of bel ons direct." },
      { status: 500 },
    );
  }
}
