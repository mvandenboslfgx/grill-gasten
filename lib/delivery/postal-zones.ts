/**
 * Postcodezone-prijzen Hoeksche Waard — server-side only.
 * pricingMode: "postcode_zones". Geen Maps. Geen gratis bezorgen.
 */

export type PostalZoneId = 1 | 2 | 3;

export type PostalDeliveryZone = {
  id: PostalZoneId;
  code: "A" | "B" | "C";
  /** Klantveilige naam — geen interne regels lekken */
  customerLabel: string;
  feeCents: number;
  minimumOrderAmountCents: number;
  /** 4-cijferige postcodeprefixen */
  prefixes: readonly string[];
};

export const POSTAL_DELIVERY_ZONES: readonly PostalDeliveryZone[] = [
  {
    id: 1,
    code: "A",
    customerLabel: "Lokaal",
    feeCents: 395,
    minimumOrderAmountCents: 2000,
    prefixes: ["3286", "3273", "3271", "3281"],
  },
  {
    id: 2,
    code: "B",
    customerLabel: "Middellang",
    feeCents: 595,
    minimumOrderAmountCents: 2500,
    prefixes: ["3274", "3261", "3262", "3263", "3284", "3291", "3299"],
  },
  {
    id: 3,
    code: "C",
    customerLabel: "Buitengebied",
    feeCents: 795,
    minimumOrderAmountCents: 3000,
    prefixes: ["3264", "3265", "3267", "3292", "3293", "3295", "3297"],
  },
] as const;

/** Alle allowlist-prefixen (afgeleid van zones). */
export function allPostalZonePrefixes(): string[] {
  return POSTAL_DELIVERY_ZONES.flatMap((z) => [...z.prefixes]);
}

export function zoneForPostcodePrefix(postcode: string): PostalDeliveryZone | null {
  const cleaned = postcode.replace(/\s+/g, "").toUpperCase();
  if (cleaned.length < 4) return null;
  const prefix = cleaned.slice(0, 4);
  const matches = POSTAL_DELIVERY_ZONES.filter((z) => z.prefixes.includes(prefix));
  if (matches.length === 0) return null;
  if (matches.length > 1) return null; // overlap = fail-closed
  return matches[0]!;
}

export function getPostalZoneById(id: PostalZoneId): PostalDeliveryZone | undefined {
  return POSTAL_DELIVERY_ZONES.find((z) => z.id === id);
}

/** Valideer: geen overlap, fees/min > 0, unieke prefixen. */
export function validatePostalZones(
  zones: readonly PostalDeliveryZone[] = POSTAL_DELIVERY_ZONES,
): { ok: true } | { ok: false; error: string } {
  if (zones.length === 0) return { ok: false, error: "no_zones" };
  const seen = new Map<string, string>();
  for (const z of zones) {
    if (z.feeCents <= 0 || z.minimumOrderAmountCents <= 0) {
      return { ok: false, error: `invalid_tariff_${z.code}` };
    }
    for (const p of z.prefixes) {
      if (!/^[1-9]\d{3}$/.test(p)) {
        return { ok: false, error: `invalid_prefix_${p}` };
      }
      if (seen.has(p)) {
        return { ok: false, error: `overlap_${p}` };
      }
      seen.set(p, z.code);
    }
  }
  return { ok: true };
}
