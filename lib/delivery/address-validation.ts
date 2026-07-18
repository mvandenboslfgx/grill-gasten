/** Nederlandse postcode + huisnummer validatie. */

export function normalizePostcode(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, "").toUpperCase();
  if (!/^[1-9]\d{3}[A-Z]{2}$/.test(cleaned)) return null;
  return cleaned;
}

export function formatPostcodeDisplay(pc: string): string {
  return `${pc.slice(0, 4)} ${pc.slice(4)}`;
}

export function normalizeHouseNumber(raw: string): string | null {
  const n = raw.trim();
  if (!/^\d{1,5}$/.test(n)) return null;
  return n;
}

export function normalizeAddition(raw: string | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-zA-Z0-9\-\/]/g, "")
    .trim()
    .slice(0, 12);
}

/** Exacte postcode van het eiland Tiengemeten (niet heel 3284). */
export const TIENGEMETEN_EXACT_POSTCODE = "3284BE";

/**
 * Blokkeer alleen Tiengemeten — niet heel postcodegebied 3284 (Zuid-Beijerland)
 * en niet willekeurige 3244-codes.
 */
export function isTiengemeten(input: {
  postcode: string;
  street?: string;
  city?: string;
  normalizedAddress?: string;
}): boolean {
  const postcode = normalizePostcode(input.postcode) ?? input.postcode.replace(/\s+/g, "").toUpperCase();

  if (postcode === TIENGEMETEN_EXACT_POSTCODE) return true;

  const haystacks = [input.street, input.city, input.normalizedAddress]
    .filter((v): v is string => Boolean(v?.trim()))
    .map((v) => v.toLowerCase());

  return haystacks.some((h) => h.includes("tiengemeten"));
}
