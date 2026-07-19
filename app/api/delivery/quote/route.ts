import { NextResponse } from "next/server";
import { buildDeliveryQuote } from "@/lib/delivery/build-quote";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { deliveryConfig } from "@/lib/delivery/delivery-config";
import { clientIp, rateLimitAsync } from "@/lib/security/rate-limit";
import { z } from "zod";

export const runtime = "nodejs";

const bodySchema = z.object({
  postcode: z.string().min(4).max(10),
  houseNumber: z.string().min(1).max(10),
  addition: z.string().max(12).optional(),
});

const MAX_BODY_BYTES = 4_096;

export async function POST(request: Request) {
  if (
    !orderingConfig.orderingEnabled ||
    !orderingConfig.deliveryEnabled ||
    !deliveryConfig.enabled ||
    !orderingConfig.openWeekdays.length
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Online bezorgen is momenteel niet beschikbaar.",
        code: "ORDERING_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Ongeldig verzoek." }, { status: 415 });
  }

  const ip = clientIp(request);
  const rl = await rateLimitAsync(`delivery-quote:${ip}`, 20, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Te veel verzoeken. Probeer zo opnieuw." },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Verzoek te groot." }, { status: 413 });
    }
    raw = JSON.parse(text) as unknown;
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
