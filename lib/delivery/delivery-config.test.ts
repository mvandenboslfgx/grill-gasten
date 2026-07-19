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
  normalizeAreaToken,
} from "@/lib/delivery/postal-allowlist";

describe("deliveryConfig", () => {
  it("start unconfigured en niet beschikbaar", () => {
    expect(deliveryConfig.enabled).toBe(false);
    expect(deliveryConfig.pricingMode).toBe("unconfigured");
    expect(deliveryConfig.allowedPostalCodeAreas).toEqual([]);
    expect(isDeliveryConfigComplete()).toBe(false);
    expect(isDeliveryAvailable()).toBe(false);
  });

  it("gratis-bezorgdrempel in centen", () => {
    expect(applyFreeDeliveryThreshold(299, 2000, null)).toBe(299);
    expect(applyFreeDeliveryThreshold(299, 2000, 2500)).toBe(299);
    expect(applyFreeDeliveryThreshold(299, 2500, 2500)).toBe(0);
    expect(applyFreeDeliveryThreshold(449, 3000, 2500)).toBe(0);
  });
});

describe("postal allowlist", () => {
  it("normaliseert gebiedstokens", () => {
    expect(normalizeAreaToken("3281")).toBe("3281");
    expect(normalizeAreaToken("3281 ab")).toBe("3281AB");
    expect(normalizeAreaToken("bad")).toBeNull();
  });

  it("leeg allowlist = niemand toegestaan", () => {
    expect(isPostcodeAllowed("3281AB", [], [])).toBe(false);
    const r = checkDeliveryPostcode("3281AB");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe("area_unconfigured");
  });

  it("prefix-allowlist en blocklist", () => {
    expect(isPostcodeAllowed("3281AB", ["3281"], [])).toBe(true);
    expect(isPostcodeAllowed("3282CD", ["3281"], [])).toBe(false);
    expect(isPostcodeAllowed("3284BE", ["3284"], ["3284BE"])).toBe(false);
    expect(isPostcodeAllowed("3284AA", ["3284"], ["3284BE"])).toBe(true);
  });
});
