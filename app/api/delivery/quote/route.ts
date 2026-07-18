import { NextResponse } from "next/server";
import { buildDeliveryQuote } from "@/lib/delivery/build-quote";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";

const bodySchema = z.object({
  postcode: z.string().min(4).max(10),
  houseNumber: z.string().min(1).max(10),
  addition: z.string().max(12).optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  const rl = rateLimit(`delivery-quote:${ip}`, 20, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Te veel verzoeken. Probeer zo opnieuw." },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ongeldig verzoek." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Vul postcode en huisnummer in." },
      { status: 400 },
    );
  }

  const result = await buildDeliveryQuote(parsed.data);

  if ("blocked" in result && result.blocked) {
    return NextResponse.json({
      ok: false,
      blocked: true,
      reason: result.reason,
      error: result.message,
    });
  }

  return NextResponse.json({ ok: true, quote: result });
}
