/**
 * Server-only keuken-/vestigingslocatie.
 * Publiceer het volledige adres nooit zolang publicPickupAddressEnabled false is.
 */

import { formatPostcodeDisplay, normalizePostcode } from "@/lib/delivery/address-validation";

export type KitchenLocation = {
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  country: "NL";
  /** Toon volledig afhaaladres pas na bewuste goedkeuring */
  publicPickupAddressEnabled: boolean;
  /**
   * Operationele gates (eigenaar). Geen restaurantvergunning-eisen in code-readiness;
   * wel blockers voor activation tot bevestigd.
   */
  pickupFromKitchenApproved: boolean;
  deliveryFromKitchenApproved: boolean;
  nvwaRegistrationConfirmed: boolean;
  foodSafetyPlanConfirmed: boolean;
  municipalPickupUseConfirmed: boolean;
};

export const kitchenLocation: KitchenLocation = {
  street: "Molendijk",
  houseNumber: "29",
  postcode: "3286BE",
  city: "Klaaswaal",
  country: "NL",
  publicPickupAddressEnabled: false,
  pickupFromKitchenApproved: false,
  deliveryFromKitchenApproved: false,
  nvwaRegistrationConfirmed: false,
  foodSafetyPlanConfirmed: false,
  municipalPickupUseConfirmed: false,
};

/** Alleen klaaswaal-label of volledig adres wanneer publiek goedgekeurd. */
export function getPublicLocationLabel(
  loc: KitchenLocation = kitchenLocation,
): string {
  if (!loc.publicPickupAddressEnabled) {
    return loc.city;
  }
  const pc = normalizePostcode(loc.postcode) ?? loc.postcode;
  return `${loc.street} ${loc.houseNumber}, ${formatPostcodeDisplay(pc)} ${loc.city}`;
}

/** Volledig adres — uitsluitend server/kitchen, nooit in publieke metadata. */
export function getInternalKitchenAddress(
  loc: KitchenLocation = kitchenLocation,
): string {
  const pc = normalizePostcode(loc.postcode) ?? loc.postcode;
  return `${loc.street} ${loc.houseNumber}, ${formatPostcodeDisplay(pc)} ${loc.city}`;
}

export function assertNoPublicKitchenStreetLeak(haystack: string): boolean {
  const lower = haystack.toLowerCase();
  return !lower.includes("molendijk");
}
