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

export function isTiengemeten(postcode: string, city: string): boolean {
  const pc4 = postcode.slice(0, 4);
  if (pc4 === "3244") return true;
  return /tiengemeten/i.test(city);
}
