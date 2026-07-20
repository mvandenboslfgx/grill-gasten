import { describe, expect, it } from "vitest";
import {
  POSTAL_DELIVERY_ZONES,
  validatePostalZones,
  zoneForPostcodePrefix,
} from "@/lib/delivery/postal-zones";

describe("postal zone overlap guard", () => {
  it("detecteert overlap in testdata", () => {
    const broken = [
      {
        ...POSTAL_DELIVERY_ZONES[0]!,
        prefixes: ["3286", "3273"],
      },
      {
        ...POSTAL_DELIVERY_ZONES[1]!,
        prefixes: ["3273", "3261"], // overlap 3273
      },
    ];
    const r = validatePostalZones(broken);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("overlap");
  });

  it("onbekende zone → null", () => {
    expect(zoneForPostcodePrefix("9999XX")).toBeNull();
  });
});
