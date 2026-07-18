import {
  isTiengemeten,
  normalizeAddition,
  normalizeHouseNumber,
  normalizePostcode,
} from "@/lib/delivery/address-validation";
import { metersToKmDisplay } from "@/lib/delivery/calculate-zone";
import {
  isDeliveryRoutingConfigured,
  isQuoteSecretConfigured,
} from "@/lib/delivery/config";
import { getDistanceProvider } from "@/lib/delivery/distance-provider";
import { createSignedQuote } from "@/lib/delivery/quote";
import type { DeliveryBlocked, DeliveryQuoteResult } from "@/lib/delivery/types";
import { MAX_DELIVERY_METERS, zoneForDistanceMeters } from "@/lib/delivery/zones";

const ROUTING_UNAVAILABLE_MSG =
  "Online bezorgen is tijdelijk niet beschikbaar. Afhalen is wel mogelijk.";

export async function buildDeliveryQuote(input: {
  postcode: string;
  houseNumber: string;
  addition?: string;
}): Promise<DeliveryQuoteResult | DeliveryBlocked> {
  if (!isDeliveryRoutingConfigured() || !isQuoteSecretConfigured()) {
    return {
      blocked: true,
      reason: "routing_unavailable",
      message: ROUTING_UNAVAILABLE_MSG,
    };
  }

  const postcode = normalizePostcode(input.postcode);
  if (!postcode) {
    return {
      blocked: true,
      reason: "invalid_address",
      message: "Vul een geldige Nederlandse postcode in (bijv. 3282 AB).",
    };
  }
  const houseNumber = normalizeHouseNumber(input.houseNumber);
  if (!houseNumber) {
    return {
      blocked: true,
      reason: "invalid_address",
      message: "Vul een geldig huisnummer in.",
    };
  }
  const addition = normalizeAddition(input.addition);

  if (isTiengemeten({ postcode })) {
    return {
      blocked: true,
      reason: "tiengemeten",
      message:
        "Bezorging naar Tiengemeten is alleen mogelijk in overleg. Neem contact op via WhatsApp.",
    };
  }

  const provider = getDistanceProvider();
  const route = await provider.getRoute({
    destinationPostcode: postcode,
    destinationHouseNumber: houseNumber,
    destinationAddition: addition || undefined,
  });

  if (!route) {
    return {
      blocked: true,
      reason: "unavailable",
      message:
        "We konden dit adres niet betrouwbaar controleren. Neem contact op via WhatsApp of kies afhalen.",
    };
  }

  if (
    isTiengemeten({
      postcode,
      street: route.street,
      city: route.city,
      normalizedAddress: route.normalizedAddress,
    })
  ) {
    return {
      blocked: true,
      reason: "tiengemeten",
      message:
        "Bezorging naar Tiengemeten is alleen mogelijk in overleg. Neem contact op via WhatsApp.",
    };
  }

  if (route.distanceMeters > MAX_DELIVERY_METERS) {
    return {
      blocked: true,
      reason: "out_of_range",
      message:
        "Dit adres ligt buiten ons bezorggebied (max. 25 km vanaf Klaaswaal). WhatsApp ons voor overleg.",
    };
  }

  const zone = zoneForDistanceMeters(route.distanceMeters);
  if (!zone) {
    return {
      blocked: true,
      reason: "out_of_range",
      message: "Dit adres valt buiten onze bezorgzones.",
    };
  }

  let quoteId: string;
  try {
    quoteId = createSignedQuote({
      postcode,
      houseNumber,
      addition,
      street: route.street,
      city: route.city,
      distanceMeters: route.distanceMeters,
      durationSeconds: route.durationSeconds,
      zoneId: zone.id,
      feeCents: zone.feeCents,
      minOrderCents: zone.minOrderCents,
    });
  } catch {
    return {
      blocked: true,
      reason: "unavailable",
      message: ROUTING_UNAVAILABLE_MSG,
    };
  }

  return {
    quoteId,
    postcode,
    houseNumber,
    addition,
    street: route.street,
    city: route.city,
    distanceKm: metersToKmDisplay(route.distanceMeters),
    distanceMeters: route.distanceMeters,
    zoneId: zone.id,
    feeCents: zone.feeCents,
    minOrderCents: zone.minOrderCents,
    expiresAt: Date.now() + 15 * 60 * 1000,
  };
}
