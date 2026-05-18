import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/email/send-inquiry";
import { validateInquiry } from "@/lib/inquiry";
import { inquiryErrorForUser } from "@/lib/inquiry-errors";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = validateInquiry(body);

    if (error || !data) {
      return NextResponse.json({ ok: false, error: error ?? "Validatiefout." }, { status: 400 });
    }

    const result = await deliverInquiry(data);

    if (!result.ok) {
      const status = result.code === "NO_PROVIDER" ? 503 : 502;
      return NextResponse.json(
        { ok: false, error: inquiryErrorForUser(result.code), code: result.code },
        { status },
      );
    }

    return NextResponse.json({ ok: true, channel: result.channel });
  } catch (e) {
    console.error("[api/inquiry]", e);
    return NextResponse.json(
      { ok: false, error: "Er ging iets mis. Probeer WhatsApp of bel ons direct." },
      { status: 500 },
    );
  }
}
