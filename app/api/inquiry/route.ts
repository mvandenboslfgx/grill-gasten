import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/email/send-inquiry";
import { validateInquiry, type InquiryPayload } from "@/lib/inquiry";
import { inquiryErrorForUser } from "@/lib/inquiry-errors";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const rl = rateLimit(`inquiry:${ip}`, 12, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Te veel verzoeken. Probeer zo opnieuw." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const { data, error } = validateInquiry(body);

    if (error || !data) {
      return NextResponse.json({ ok: false, error: error ?? "Validatiefout." }, { status: 400 });
    }

    // Pre-orders gaan via /api/orders — niet via inquiry (geen nep-bevestiging/QR)
    if (data.type === "preorder") {
      return NextResponse.json(
        {
          ok: false,
          error: "Gebruik de bestelflow op /bestellen. Online bestellen vereist betaling.",
          code: "USE_ORDERS_API",
        },
        { status: 400 },
      );
    }

    const payload: InquiryPayload = { ...data };
    const result = await deliverInquiry(payload);

    if (!result.ok) {
      const status = result.code === "NO_PROVIDER" ? 503 : 502;
      return NextResponse.json(
        { ok: false, error: inquiryErrorForUser(result.code), code: result.code },
        { status },
      );
    }

    return NextResponse.json({
      ok: true,
      channel: result.channel,
    });
  } catch (e) {
    console.error("[api/inquiry]", e);
    return NextResponse.json(
      { ok: false, error: "Er ging iets mis. Probeer WhatsApp of bel ons direct." },
      { status: 500 },
    );
  }
}
