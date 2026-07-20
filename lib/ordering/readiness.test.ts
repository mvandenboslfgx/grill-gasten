import { describe, expect, it } from "vitest";
import {
  assertNoPublicKitchenStreetLeak,
  getPublicLocationLabel,
  kitchenLocation,
} from "@/lib/business/location";
import { deliveryConfig } from "@/lib/delivery/delivery-config";
import { launchHoursCandidate } from "@/lib/ordering/launch-hours";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { getOrderingReadiness } from "@/lib/ordering/readiness";
import { site } from "@/lib/site";

describe("business launch configuration", () => {
  it("houdt alle orderingflags uit", () => {
    expect(orderingConfig.orderingEnabled).toBe(false);
    expect(orderingConfig.openWeekdays).toEqual([]);
    expect(orderingConfig.pickupEnabled).toBe(false);
    expect(orderingConfig.deliveryEnabled).toBe(false);
    expect(deliveryConfig.enabled).toBe(false);
  });

  it("publiceert geen Molendijk-adres", () => {
    expect(kitchenLocation.publicPickupAddressEnabled).toBe(false);
    expect(getPublicLocationLabel()).toBe("Klaaswaal");
    expect(assertNoPublicKitchenStreetLeak(site.address)).toBe(true);
    expect(site.address.toLowerCase()).not.toContain("molendijk");
  });

  it("uren openen orderflow niet automatisch", () => {
    expect(launchHoursCandidate.candidateOpenWeekdays).toEqual([5, 6, 0]);
    expect(orderingConfig.openWeekdays).toEqual([]);
    expect(orderingConfig.orderingEnabled).toBe(false);
  });

  it("readiness blokkeert activatie (flags + operationeel)", () => {
    const readiness = getOrderingReadiness();
    expect(readiness.ready).toBe(false);
    expect(readiness.publicAvailable).toBe(false);
    const ids = readiness.blockers.map((b) => b.id);
    expect(ids).toContain("ordering_flag_off");
    expect(ids).toContain("no_open_weekdays");
    expect(ids).toContain("public_pickup_address_off");
    expect(ids).toContain("nvwa_unconfirmed");
    expect(ids).toContain("municipal_pickup_unconfirmed");
  });

  it("bevestigde capaciteit en lead times", () => {
    expect(orderingConfig.pickupSlotCapacity).toBe(4);
    expect(deliveryConfig.maximumOrdersPerSlot).toBe(2);
    expect(orderingConfig.minLeadMinutesPickup).toBe(25);
    expect(orderingConfig.minLeadMinutesDelivery).toBe(35);
    expect(orderingConfig.maximumOrderAmountCents).toBe(15_000);
    expect(orderingConfig.serviceFeeCents).toBe(0);
    expect(orderingConfig.maximumAdvanceDays).toBe(7);
  });
});
