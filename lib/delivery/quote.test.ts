import { describe, expect, it } from "vitest";
import { createHmac } from "crypto";
import { addressesMatchQuote } from "@/lib/delivery/quote";
import type { DeliveryQuotePayload } from "@/lib/delivery/types";

describe("quote address binding", () => {
  it("gewijzigd adres maakt match ongeldig", () => {
    const payload: DeliveryQuotePayload = {
      v: 1,
      postcode: "3282AB",
      houseNumber: "10",
      addition: "",
      street: "Teststraat",
      city: "Klaaswaal",
      distanceMeters: 1000,
      durationSeconds: 200,
      zoneId: 1,
      feeCents: 299,
      minOrderCents: 1500,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 60_000,
    };
    expect(addressesMatchQuote(payload, "3282AB", "10", "")).toBe(true);
    expect(addressesMatchQuote(payload, "3282AB", "11", "")).toBe(false);
    expect(addressesMatchQuote(payload, "3261AB", "10", "")).toBe(false);
  });
});

describe("Mollie amount with delivery", () => {
  function mollieAmount(totalCents: number): string {
    return (totalCents / 100).toFixed(2);
  }

  it("subtotal + fee exact", () => {
    expect(mollieAmount(1500 + 299)).toBe("17.99");
    expect(mollieAmount(1274 + 449)).toBe("17.23");
  });
});

describe("HMAC signing shape", () => {
  it("signatie verandert bij payload wijziging", () => {
    const secret = "test-secret";
    const a = createHmac("sha256", secret).update("aaa").digest("base64url");
    const b = createHmac("sha256", secret).update("aab").digest("base64url");
    expect(a).not.toBe(b);
  });
});
