import {
  isTiengemeten,
  normalizeAddition,
  normalizeHouseNumber,
  normalizePostcode,
} from "@/lib/delivery/address-validation";
import {
  isQuoteSecretConfigured,
} from "@/lib/delivery/config";
import {
  deliveryConfig,
  isDeliveryAvailable,
} from "@/lib/delivery/delivery-config";
import {
  checkDeliveryPostcode,
  looksLikePoBox,
} from "@/lib/delivery/postal-allowlist";
import { zoneForPostcodePrefix } from "@/lib/delivery/postal-zones";
import { createSignedQuote } from "@/lib/delivery/quote";
import type { DeliveryBlocked, DeliveryQuoteResult } from "@/lib/delivery/types";
import { orderingConfig } from "@/lib/ordering/opening-hours";

const ROUTING_UNAVAILABLE_MSG =
  "Online bezorgen is tijdelijk niet beschikbaar. Afhalen is wel mogelijk.";

export async function buildDeliveryQuote(input: {
  postcode: string;
  houseNumber: string;
  addition?: string;
  street?: string;
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

  if (looksLikePoBox(input.street) || looksLikePoBox(addition)) {
    return {
      blocked: true,
      reason: "invalid_address",
      message: "We bezorgen niet naar een postbus. Vul een bezorgadres in.",
    };
  }

  const postal = checkDeliveryPostcode(postcode);
  if (!postal.ok) {
    return {
      blocked: true,
      reason:
        postal.code === "outside_area" || postal.code === "blocked"
          ? "out_of_range"
          : "invalid_address",
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

  if (deliveryConfig.pricingMode === "postcode_zones") {
    const zone = zoneForPostcodePrefix(postcode);
    if (!zone) {
      return {
        blocked: true,
        reason: "out_of_range",
        message: "Dit adres ligt buiten ons bezorggebied. Kies afhalen of WhatsApp ons.",
      };
    }

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
        zoneId: zone.id,
        feeCents: zone.feeCents,
        minOrderCents: zone.minimumOrderAmountCents,
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
      zoneId: zone.id,
      feeCents: zone.feeCents,
      minOrderCents: zone.minimumOrderAmountCents,
      expiresAt: Date.now() + 15 * 60 * 1000,
      zoneLabel: zone.customerLabel,
    };
  }

  return {
    blocked: true,
    reason: "routing_unavailable",
    message: ROUTING_UNAVAILABLE_MSG,
  };
}
