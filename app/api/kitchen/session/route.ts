import { NextResponse } from "next/server";
import {
  KITCHEN_COOKIE,
  createKitchenSessionToken,
  kitchenCookieOptions,
  verifyKitchenSecretValue,
} from "@/lib/auth/kitchen";
import { clientIp, rateLimitAsync } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

/** Login: verify kitchen secret once, set HttpOnly session cookie (path=/kitchen). */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = await rateLimitAsync(`kitchen-login:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Te veel pogingen. Probeer later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let body: { key?: string };
  try {
    body = (await request.json()) as { key?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Ongeldig verzoek." }, { status: 400 });
  }

  const key = String(body.key ?? "");
  if (!verifyKitchenSecretValue(key)) {
    return NextResponse.json({ ok: false, error: "Ongeldige sleutel." }, { status: 401 });
  }

  const token = createKitchenSessionToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Keukenauth is niet geconfigureerd (KITCHEN_SECRET ≥ 32 tekens)." },
      { status: 503 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(KITCHEN_COOKIE, token, kitchenCookieOptions());
  return res;
}

/** Logout: clear session cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(KITCHEN_COOKIE, "", { ...kitchenCookieOptions(0), maxAge: 0 });
  return res;
}
