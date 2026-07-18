import { describe, expect, it } from "vitest";
import {
  isDateOpen,
  validatePickupMoment,
  getAvailableSlotsForDate,
} from "@/lib/ordering/availability";
import { orderingConfig } from "@/lib/ordering/opening-hours";

describe("availability", () => {
  it("verleden datum geweigerd", () => {
    const r = validatePickupMoment("2020-01-01", "17:00");
    expect(r.ok).toBe(false);
  });

  it("ongeldig e-mail patroon zit in zod — hier datum/slot", () => {
    const r = validatePickupMoment("niet-een-datum", "17:00");
    expect(r.ok).toBe(false);
  });

  it("gesloten dag (niet in openWeekdays) geweigerd wanneer ordering enabled", () => {
    if (!orderingConfig.orderingEnabled) {
      const r = validatePickupMoment("2099-01-04", "17:00"); // maandag
      expect(r.ok).toBe(false);
      return;
    }
    // Maandag 4 jan 2099 — niet in openWeekdays [5,6]
    expect(isDateOpen("2099-01-04")).toBe(false);
  });

  it("verlopen tijdslot vandaag niet in beschikbare slots", () => {
    if (!orderingConfig.orderingEnabled) {
      expect(getAvailableSlotsForDate("2099-01-01")).toEqual([]);
      return;
    }
    const past = getAvailableSlotsForDate("2020-01-01");
    expect(past).toEqual([]);
  });
});
