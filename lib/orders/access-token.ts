import { createHash, randomBytes, timingSafeEqual } from "crypto";

/** 256-bit opaque token for customer status URLs (never store plaintext). */
export function generateAccessToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashAccessToken(token) };
}

export function hashAccessToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function verifyAccessToken(token: string | null | undefined, hash: string | null | undefined): boolean {
  if (!token || !hash) return false;
  const computed = hashAccessToken(token);
  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function customerStatusPath(orderNumber: string, token: string): string {
  return `/bestellen/status/${encodeURIComponent(orderNumber)}?t=${encodeURIComponent(token)}`;
}
