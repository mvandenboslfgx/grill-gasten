import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { normalizeHouseNumber, normalizePostcode } from "@/lib/delivery/address-validation";
import { getQuoteSecret, isQuoteSecretConfigured } from "@/lib/delivery/config";
import type { DeliveryQuotePayload, DeliveryZoneId } from "@/lib/delivery/types";
import { MAX_DELIVERY_METERS, QUOTE_TTL_MS, zoneForDistanceMeters } from "@/lib/delivery/zones";

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function sign(payloadB64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

const quotePayloadSchema = z.object({
  v: z.literal(1),
  postcode: z.string().min(6).max(6),
  houseNumber: z.string().min(1).max(5),
  addition: z.string().max(12),
  street: z.string().max(120),
  city: z.string().max(80),
  distanceMeters: z.number().int().min(0).max(MAX_DELIVERY_METERS),
  durationSeconds: z.number().int().min(0).max(86_400),
  zoneId: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),
  feeCents: z.number().int().min(0),
  minOrderCents: z.number().int().min(0),
  issuedAt: z.number().int().positive(),
  expiresAt: z.number().int().positive(),
});

export function createSignedQuote(input: {
  postcode: string;
  houseNumber: string;
  addition: string;
  street: string;
  city: string;
  distanceMeters: number;
  durationSeconds: number;
  zoneId: DeliveryZoneId;
  feeCents: number;
  minOrderCents: number;
}): string {
  if (!isQuoteSecretConfigured()) {
    throw new Error("DELIVERY_QUOTE_SECRET_NOT_CONFIGURED");
  }
  const secret = getQuoteSecret();
  const now = Date.now();
  const payload: DeliveryQuotePayload = {
    v: 1,
    postcode: input.postcode,
    houseNumber: input.houseNumber,
    addition: input.addition,
    street: input.street,
    city: input.city,
    distanceMeters: input.distanceMeters,
    durationSeconds: input.durationSeconds,
    zoneId: input.zoneId,
    feeCents: input.feeCents,
    minOrderCents: input.minOrderCents,
    issuedAt: now,
    expiresAt: now + QUOTE_TTL_MS,
  };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${payloadB64}.${sign(payloadB64, secret)}`;
}

export function verifySignedQuote(
  quoteId: string,
): { ok: true; payload: DeliveryQuotePayload } | { ok: false; error: string } {
  if (!isQuoteSecretConfigured()) {
    return { ok: false, error: "Bezorgservice niet geconfigureerd." };
  }

  let secret: string;
  try {
    secret = getQuoteSecret();
  } catch {
    return { ok: false, error: "Bezorgservice niet geconfigureerd." };
  }

  const parts = quoteId.split(".");
  if (parts.length !== 2) return { ok: false, error: "Ongeldige bezorgquote." };

  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return { ok: false, error: "Ongeldige bezorgquote." };

  const expected = sign(payloadB64, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "Ongeldige bezorgquote." };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return { ok: false, error: "Ongeldige bezorgquote." };
  }

  const parsed = quotePayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Ongeldige bezorgquote." };
  }

  const payload = parsed.data;

  const pc = normalizePostcode(payload.postcode);
  const hn = normalizeHouseNumber(payload.houseNumber);
  if (!pc || pc !== payload.postcode || !hn || hn !== payload.houseNumber) {
    return { ok: false, error: "Ongeldige bezorgquote." };
  }

  if (payload.expiresAt <= payload.issuedAt) {
    return { ok: false, error: "Ongeldige bezorgquote." };
  }

  const ttl = payload.expiresAt - payload.issuedAt;
  if (ttl > QUOTE_TTL_MS) {
    return { ok: false, error: "Ongeldige bezorgquote." };
  }

  if (Date.now() > payload.expiresAt) {
    return { ok: false, error: "Je bezorgquote is verlopen. Controleer je adres opnieuw." };
  }

  const zone = zoneForDistanceMeters(payload.distanceMeters);
  if (!zone || zone.id !== payload.zoneId) {
    return { ok: false, error: "Bezorgzone ongeldig. Controleer je adres opnieuw." };
  }

  // Centrale zoneconfig is bron van waarheid — payload fee/min moeten matchen
  if (payload.feeCents !== zone.feeCents || payload.minOrderCents !== zone.minOrderCents) {
    return { ok: false, error: "Bezorgzone ongeldig. Controleer je adres opnieuw." };
  }

  return { ok: true, payload: payload as DeliveryQuotePayload };
}

export function addressesMatchQuote(
  payload: DeliveryQuotePayload,
  postcode: string,
  houseNumber: string,
  addition: string,
): boolean {
  return (
    payload.postcode === postcode &&
    payload.houseNumber === houseNumber &&
    (payload.addition || "") === (addition || "")
  );
}
