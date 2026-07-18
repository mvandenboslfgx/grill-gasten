import { describe, expect, it } from "vitest";
import { zoneForDistanceMeters } from "@/lib/delivery/zones";

describe("delivery zones", () => {
  const cases: Array<[number, number | null, number | null]> = [
    [3000, 1, 299],
    [3001, 2, 449],
    [7000, 2, 449],
    [7001, 3, 599],
    [11000, 3, 599],
    [11001, 4, 749],
    [15000, 4, 749],
    [15001, 5, 949],
    [20000, 5, 949],
    [20001, 6, 1249],
    [25000, 6, 1249],
    [25001, null, null],
  ];

  it.each(cases)("%s m → zone/fee", (meters, zoneId, fee) => {
    const z = zoneForDistanceMeters(meters);
    if (zoneId === null) {
      expect(z).toBeNull();
    } else {
      expect(z?.id).toBe(zoneId);
      expect(z?.feeCents).toBe(fee);
    }
  });
});

describe("minimum order excludes delivery fee", () => {
  it("zone 1 needs 1500 subtotal", () => {
    const z = zoneForDistanceMeters(1000)!;
    expect(z.minOrderCents).toBe(1500);
    const subtotal = 1499;
    const fee = z.feeCents;
    expect(subtotal < z.minOrderCents).toBe(true);
    expect(subtotal + fee >= z.minOrderCents).toBe(true); // fee would wrongly pass — we don't use that
  });

  it("zone minima", () => {
    expect(zoneForDistanceMeters(5000)?.minOrderCents).toBe(2000);
    expect(zoneForDistanceMeters(9000)?.minOrderCents).toBe(2500);
    expect(zoneForDistanceMeters(12000)?.minOrderCents).toBe(3000);
    expect(zoneForDistanceMeters(16000)?.minOrderCents).toBe(3500);
    expect(zoneForDistanceMeters(22000)?.minOrderCents).toBe(4500);
  });
});
