import { afterEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "crypto";
import { isTiengemeten } from "@/lib/delivery/address-validation";
import {
  isDeliveryRoutingConfigured,
  isQuoteSecretConfigured,
  MIN_QUOTE_SECRET_LENGTH,
} from "@/lib/delivery/config";
import { createSignedQuote, verifySignedQuote } from "@/lib/delivery/quote";
import { zoneForDistanceMeters } from "@/lib/delivery/zones";

describe("isTiengemeten", () => {
  it("3284BE met straat Tiengemeten → geblokkeerd", () => {
    expect(
      isTiengemeten({ postcode: "3284BE", street: "Tiengemeten" }),
    ).toBe(true);
  });

  it("3284BE met lege straat → geblokkeerd", () => {
    expect(isTiengemeten({ postcode: "3284 BE", street: "" })).toBe(true);
  });

  it("andere 3284-postcode Zuid-Beijerland → niet geblokkeerd", () => {
    expect(
      isTiengemeten({
        postcode: "3284AA",
        street: "Voorstraat",
        city: "Zuid-Beijerland",
      }),
    ).toBe(false);
  });

  it("3244 → niet automatisch geblokkeerd", () => {
    expect(
      isTiengemeten({ postcode: "3244AB", city: "Nieuw-Lekkerland" }),
    ).toBe(false);
  });

  it("straatnaam Tiengemeten → geblokkeerd", () => {
    expect(
      isTiengemeten({
        postcode: "3284AA",
        street: "veer naar Tiengemeten",
      }),
    ).toBe(true);
  });

  it("normalizedAddress met Tiengemeten → geblokkeerd", () => {
    expect(
      isTiengemeten({
        postcode: "9999ZZ",
        normalizedAddress: "Eiland Tiengemeten",
      }),
    ).toBe(true);
  });
});

describe("routing config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("geen Google-key → routing niet geconfigureerd", () => {
    vi.stubEnv("DELIVERY_DISTANCE_PROVIDER", "google");
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "");
    expect(isDeliveryRoutingConfigured()).toBe(false);
  });

  it("Google key + provider → geconfigureerd", () => {
    vi.stubEnv("DELIVERY_DISTANCE_PROVIDER", "google");
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "test-key-abc");
    expect(isDeliveryRoutingConfigured()).toBe(true);
  });
});

describe("quote secret", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("secret korter dan 32 tekens geweigerd", () => {
    vi.stubEnv("DELIVERY_QUOTE_SECRET", "short");
    expect(isQuoteSecretConfigured()).toBe(false);
  });

  it("service-role key wordt niet als fallback gebruikt", () => {
    vi.stubEnv("DELIVERY_QUOTE_SECRET", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "a".repeat(64));
    vi.stubEnv("KITCHEN_SECRET", "b".repeat(64));
    expect(isQuoteSecretConfigured()).toBe(false);
  });

  it("geldig secret ≥ 32 tekens", () => {
    vi.stubEnv("DELIVERY_QUOTE_SECRET", "x".repeat(MIN_QUOTE_SECRET_LENGTH));
    expect(isQuoteSecretConfigured()).toBe(true);
  });
});

describe("quote payload validation", () => {
  const secret = "s".repeat(32);

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function signRaw(payload: object): string {
    const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
    const sig = createHmac("sha256", secret).update(payloadB64).digest("base64url");
    return `${payloadB64}.${sig}`;
  }

  it("fee die niet bij zone hoort geweigerd", () => {
    vi.stubEnv("DELIVERY_QUOTE_SECRET", secret);
    const now = Date.now();
    const quoteId = signRaw({
      v: 1,
      postcode: "3282AB",
      houseNumber: "10",
      addition: "",
      street: "Test",
      city: "Klaaswaal",
      distanceMeters: 1000,
      durationSeconds: 200,
      zoneId: 1,
      feeCents: 1, // wrong
      minOrderCents: 1500,
      issuedAt: now,
      expiresAt: now + 10 * 60 * 1000,
    });
    expect(verifySignedQuote(quoteId).ok).toBe(false);
  });

  it("TTL langer dan 15 minuten geweigerd", () => {
    vi.stubEnv("DELIVERY_QUOTE_SECRET", secret);
    const now = Date.now();
    const quoteId = signRaw({
      v: 1,
      postcode: "3282AB",
      houseNumber: "10",
      addition: "",
      street: "Test",
      city: "Klaaswaal",
      distanceMeters: 1000,
      durationSeconds: 200,
      zoneId: 1,
      feeCents: 299,
      minOrderCents: 1500,
      issuedAt: now,
      expiresAt: now + 20 * 60 * 1000,
    });
    expect(verifySignedQuote(quoteId).ok).toBe(false);
  });

  it("payload met ongeldige types geweigerd", () => {
    vi.stubEnv("DELIVERY_QUOTE_SECRET", secret);
    const now = Date.now();
    const quoteId = signRaw({
      v: 1,
      postcode: "3282AB",
      houseNumber: "10",
      addition: "",
      street: "Test",
      city: "Klaaswaal",
      distanceMeters: "far",
      durationSeconds: 200,
      zoneId: 1,
      feeCents: 299,
      minOrderCents: 1500,
      issuedAt: now,
      expiresAt: now + 5 * 60 * 1000,
    });
    expect(verifySignedQuote(quoteId).ok).toBe(false);
  });

  it("geldige quote met zone match geaccepteerd", () => {
    vi.stubEnv("DELIVERY_QUOTE_SECRET", secret);
    const zone = zoneForDistanceMeters(2500)!;
    const quoteId = createSignedQuote({
      postcode: "3282AB",
      houseNumber: "10",
      addition: "",
      street: "Teststraat",
      city: "Klaaswaal",
      distanceMeters: 2500,
      durationSeconds: 300,
      zoneId: zone.id,
      feeCents: zone.feeCents,
      minOrderCents: zone.minOrderCents,
    });
    const verified = verifySignedQuote(quoteId);
    expect(verified.ok).toBe(true);
  });
});
