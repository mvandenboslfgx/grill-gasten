import { describe, expect, it } from "vitest";
import {
  applyFreeDeliveryThreshold,
  deliveryConfig,
  isDeliveryAvailable,
  isDeliveryConfigComplete,
} from "@/lib/delivery/delivery-config";
import {
  checkDeliveryPostcode,
  isPostcodeAllowed,
  looksLikePoBox,
  normalizeAreaToken,
} from "@/lib/delivery/postal-allowlist";
import {
  POSTAL_DELIVERY_ZONES,
  validatePostalZones,
  zoneForPostcodePrefix,
} from "@/lib/delivery/postal-zones";

describe("deliveryConfig launch", () => {
  it("houdt delivery uit met postcode_zones voorbereid", () => {
    expect(deliveryConfig.enabled).toBe(false);
    expect(deliveryConfig.pricingMode).toBe("postcode_zones");
    expect(deliveryConfig.freeDeliveryThresholdCents).toBeNull();
    expect(deliveryConfig.allowedPostalCodeAreas.length).toBeGreaterThan(0);
    expect(isDeliveryAvailable()).toBe(false);
    expect(isDeliveryConfigComplete()).toBe(false); // enabled false
  });

  it("gratis bezorgen blijft uit", () => {
    expect(applyFreeDeliveryThreshold(395, 5000, null)).toBe(395);
    expect(deliveryConfig.freeDeliveryThresholdCents).toBeNull();
  });
});

describe("postal zones A/B/C", () => {
  it("zones zijn geldig en niet-overlappend", () => {
    expect(validatePostalZones()).toEqual({ ok: true });
    expect(POSTAL_DELIVERY_ZONES).toHaveLength(3);
  });

  it("Zone A — fee 395 min 2000", () => {
    for (const p of ["3286AB", "3273CD", "3271EE", "3281FF"]) {
      const z = zoneForPostcodePrefix(p);
      expect(z?.code).toBe("A");
      expect(z?.feeCents).toBe(395);
      expect(z?.minimumOrderAmountCents).toBe(2000);
    }
  });

  it("Zone B — fee 595 min 2500", () => {
    for (const p of ["3274AA", "3261BB", "3284CC", "3291DD", "3299EE"]) {
      const z = zoneForPostcodePrefix(p);
      expect(z?.code).toBe("B");
      expect(z?.feeCents).toBe(595);
      expect(z?.minimumOrderAmountCents).toBe(2500);
    }
  });

  it("Zone C — fee 795 min 3000", () => {
    for (const p of ["3264AA", "3265BB", "3295CC", "3297DD"]) {
      const z = zoneForPostcodePrefix(p);
      expect(z?.code).toBe("C");
      expect(z?.feeCents).toBe(795);
      expect(z?.minimumOrderAmountCents).toBe(3000);
    }
  });

  it("buiten Hoeksche Waard geweigerd", () => {
    expect(zoneForPostcodePrefix("3011AA")).toBeNull(); // Rotterdam
    expect(isPostcodeAllowed("3011AA")).toBe(false);
    const r = checkDeliveryPostcode("3011AA");
    expect(r.ok).toBe(false);
  });

  it("Tiengemeten 3284BE geblokkeerd", () => {
    expect(isPostcodeAllowed("3284BE")).toBe(false);
    const r = checkDeliveryPostcode("3284BE");
    expect(r.ok).toBe(false);
  });

  it("normaliseert spaties en kleine letters", () => {
    expect(normalizeAreaToken("3286 be")).toBe("3286BE");
    expect(zoneForPostcodePrefix("3286 be")?.code).toBe("A");
    expect(checkDeliveryPostcode("3286 be").ok).toBe(true);
  });

  it("detecteert postbus", () => {
    expect(looksLikePoBox("Postbus 12")).toBe(true);
    expect(looksLikePoBox("Molendijk")).toBe(false);
  });
});
