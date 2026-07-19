import { createHmac, timingSafeEqual } from "crypto";
import { getKitchenSecret } from "@/lib/supabase/env";

export const KITCHEN_COOKIE = "gg_kitchen";
const SESSION_TTL_SEC = 12 * 60 * 60; // 12 uur
const MIN_SECRET_LENGTH = 32;

function secretConfigured(): string | null {
  const secret = getKitchenSecret();
  if (!secret || secret.length < MIN_SECRET_LENGTH) return null;
  return secret;
}

/** Constant-time string compare for secrets. */
export function safeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run compare to reduce length-oracle timing skew for equal-length paths
    timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function createKitchenSessionToken(nowSec = Math.floor(Date.now() / 1000)): string | null {
  const secret = secretConfigured();
  if (!secret) return null;
  const exp = nowSec + SESSION_TTL_SEC;
  const payload = `v1.${exp}`;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyKitchenSessionToken(
  token: string | null | undefined,
  nowSec = Math.floor(Date.now() / 1000),
): boolean {
  const secret = secretConfigured();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ver, expRaw, sig] = parts;
  if (ver !== "v1" || !expRaw || !sig) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < nowSec) return false;
  const payload = `${ver}.${expRaw}`;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  return safeEqualString(sig, expected);
}

export function parseCookieHeader(
  cookieHeader: string | null,
  name: string,
): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function kitchenCookieOptions(maxAge = SESSION_TTL_SEC) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    // Must cover /kitchen/* and /api/kitchen/*
    path: "/",
    maxAge,
  };
}

/**
 * Kitchen API / print auth.
 * - Accepts x-kitchen-key header (constant-time)
 * - Accepts signed HttpOnly session cookie
 * - Does NOT accept ?key= (leaks into logs / Referer)
 */
export function verifyKitchenRequest(request: Request): boolean {
  const secret = secretConfigured();
  if (!secret) return false;

  const header = request.headers.get("x-kitchen-key");
  if (header && safeEqualString(header, secret)) return true;

  const cookie = parseCookieHeader(request.headers.get("cookie"), KITCHEN_COOKIE);
  return verifyKitchenSessionToken(cookie);
}

export function verifyKitchenSecretValue(candidate: string): boolean {
  const secret = secretConfigured();
  if (!secret) return false;
  return safeEqualString(candidate, secret);
}
