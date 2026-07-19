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
import {
  deliveryConfig,
  isDeliveryAvailable,
} from "@/lib/delivery/delivery-config";
import { getDistanceProvider } from "@/lib/delivery/distance-provider";
import { checkDeliveryPostcode } from "@/lib/delivery/postal-allowlist";
import { createSignedQuote } from "@/lib/delivery/quote";
import type { DeliveryBlocked, DeliveryQuoteResult } from "@/lib/delivery/types";
import { MAX_DELIVERY_METERS, zoneForDistanceMeters } from "@/lib/delivery/zones";
import { orderingConfig } from "@/lib/ordering/opening-hours";

const ROUTING_UNAVAILABLE_MSG =
  "Online bezorgen is tijdelijk niet beschikbaar. Afhalen is wel mogelijk.";

export async function buildDeliveryQuote(input: {
  postcode: string;
  houseNumber: string;
  addition?: string;
}): Promise<DeliveryQuoteResult | DeliveryBlocked> {
  if (
    !orderingConfig.orderingEnabled ||
    !orderingConfig.deliveryEnabled ||
    !deliveryConfig.enabled ||
    !isQuoteSecretConfigured()
  ) {
    return {
      blocked: true,
      reason: "routing_unavailable",
      message: ROUTING_UNAVAILABLE_MSG,
    };
  }

  if (!isDeliveryAvailable()) {
    return {
      blocked: true,
      reason: "routing_unavailable",
      message:
        "Bezorging is nog niet volledig geconfigureerd. Kies afhalen of WhatsApp ons.",
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

  const postal = checkDeliveryPostcode(postcode);
  if (!postal.ok) {
    return {
      blocked: true,
      reason: postal.code === "outside_area" || postal.code === "blocked" ? "out_of_range" : "invalid_address",
      message: postal.message,
    };
  }

  if (isTiengemeten({ postcode })) {
    return {
      blocked: true,
      reason: "tiengemeten",
      message:
        "Bezorging naar Tiengemeten is alleen mogelijk in overleg. Neem contact op via WhatsApp.",
    };
  }

  // Flat-fee mode: allowlist only — no Maps required
  if (deliveryConfig.pricingMode === "flat_fee") {
    const fee = deliveryConfig.deliveryFeeCents ?? 0;
    const minOrder = deliveryConfig.minimumOrderAmountCents ?? 0;
    let quoteId: string;
    try {
      quoteId = createSignedQuote({
        postcode,
        houseNumber,
        addition,
        street: "",
        city: "",
        distanceMeters: 0,
        durationSeconds: 0,
        zoneId: 1,
        feeCents: fee,
        minOrderCents: minOrder,
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
      street: "",
      city: "",
      distanceKm: 0,
      distanceMeters: 0,
      zoneId: 1,
      feeCents: fee,
      minOrderCents: minOrder,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
  }

  // Distance zones — requires Maps
  if (!isDeliveryRoutingConfigured()) {
    return {
      blocked: true,
      reason: "routing_unavailable",
      message: ROUTING_UNAVAILABLE_MSG,
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

  const maxMeters =
    deliveryConfig.maximumDistanceKm !== null
      ? Math.round(deliveryConfig.maximumDistanceKm * 1000)
      : MAX_DELIVERY_METERS;

  if (route.distanceMeters > maxMeters) {
    return {
      blocked: true,
      reason: "out_of_range",
      message: "Dit adres ligt buiten ons bezorggebied. WhatsApp ons voor overleg.",
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
