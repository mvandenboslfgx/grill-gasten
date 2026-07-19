import { randomBytes } from "crypto";

/**
 * Publiek bestelnummer: GG-YYMMDD-<12 base64url chars>
 * ~72 bits entropy in de suffix (geen uppercase die alfabet verkleint).
 */
export function generateOrderNumber(date = new Date()): string {
  const y = String(date.getFullYear()).slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = randomBytes(9).toString("base64url").slice(0, 12);
  return `GG-${y}${m}${d}-${suffix}`;
}
