import { normalizePostcode } from "@/lib/delivery/address-validation";
import { deliveryConfig } from "@/lib/delivery/delivery-config";
import { zoneForPostcodePrefix } from "@/lib/delivery/postal-zones";

export function normalizeAreaToken(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, "").toUpperCase();
  if (/^[1-9]\d{3}$/.test(cleaned)) return cleaned;
  if (/^[1-9]\d{3}[A-Z]{2}$/.test(cleaned)) return cleaned;
  return null;
}

export function isPostcodeBlocked(
  postcode: string,
  blocked: string[] = deliveryConfig.blockedPostalCodes,
): boolean {
  const pc = normalizePostcode(postcode);
  if (!pc) return true;
  const blockedNorm = blocked
    .map((b) => normalizeAreaToken(b) ?? b.replace(/\s+/g, "").toUpperCase())
    .filter(Boolean);
  return blockedNorm.includes(pc);
}

export function isPostcodeAllowed(
  postcode: string,
  allowed: string[] = deliveryConfig.allowedPostalCodeAreas,
  blocked: string[] = deliveryConfig.blockedPostalCodes,
): boolean {
  const pc = normalizePostcode(postcode);
  if (!pc) return false;
  if (isPostcodeBlocked(pc, blocked)) return false;
  if (allowed.length === 0) return false;

  const areas = allowed
    .map((a) => normalizeAreaToken(a))
    .filter((a): a is string => Boolean(a));

  if (areas.length === 0) return false;

  return areas.some((area) => {
    if (area.length === 4) return pc.startsWith(area);
    return pc === area;
  });
}

export type PostalCheckResult =
  | { ok: true }
  | {
      ok: false;
      code: "invalid" | "blocked" | "outside_area" | "area_unconfigured" | "pobox";
      message: string;
    };

/** Detecteer postbus in vrije tekst (straat/toevoeging). */
export function looksLikePoBox(raw: string | undefined): boolean {
  if (!raw?.trim()) return false;
  return /\b(postbus|p\.?\s*o\.?\s*box|pb)\b/i.test(raw);
}

export function checkDeliveryPostcode(postcode: string): PostalCheckResult {
  const pc = normalizePostcode(postcode);
  if (!pc) {
    return {
      ok: false,
      code: "invalid",
      message: "Vul een geldige Nederlandse postcode in (bijv. 3282 AB).",
    };
  }
  if (deliveryConfig.allowedPostalCodeAreas.length === 0) {
    return {
      ok: false,
      code: "area_unconfigured",
      message: "Bezorggebied is nog niet geconfigureerd. Kies afhalen of WhatsApp.",
    };
  }
  if (isPostcodeBlocked(pc)) {
    return {
      ok: false,
      code: "blocked",
      message:
        "Op dit adres bezorgen we niet online. Neem contact op via WhatsApp of kies afhalen.",
    };
  }
  if (!isPostcodeAllowed(pc)) {
    return {
      ok: false,
      code: "outside_area",
      message: "Dit adres ligt buiten ons bezorggebied. Kies afhalen of WhatsApp ons.",
    };
  }
  // Extra: zone moet bestaan (fail-closed bij overlap/miss)
  if (deliveryConfig.pricingMode === "postcode_zones" && !zoneForPostcodePrefix(pc)) {
    return {
      ok: false,
      code: "outside_area",
      message: "Dit adres ligt buiten ons bezorggebied. Kies afhalen of WhatsApp ons.",
    };
  }
  return { ok: true };
}
