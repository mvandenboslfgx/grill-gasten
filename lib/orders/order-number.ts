import { randomBytes } from "crypto";

/** Publiek ordernummer: GG-YYMMDD-XXXX */
export function generateOrderNumber(date = new Date()): string {
  const y = String(date.getFullYear()).slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = randomBytes(3).toString("base64url").slice(0, 4).toUpperCase();
  return `GG-${y}${m}${d}-${suffix}`;
}
