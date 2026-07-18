import { createHmac, timingSafeEqual } from "crypto";
import { getQuoteSecret } from "@/lib/delivery/config";
import type { DeliveryQuotePayload, DeliveryZoneId } from "@/lib/delivery/types";

const QUOTE_TTL_MS = 15 * 60 * 1000;

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function sign(payloadB64: string): string {
  return createHmac("sha256", getQuoteSecret()).update(payloadB64).digest("base64url");
}

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
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifySignedQuote(
  quoteId: string,
): { ok: true; payload: DeliveryQuotePayload } | { ok: false; error: string } {
  const parts = quoteId.split(".");
  if (parts.length !== 2) return { ok: false, error: "Ongeldige bezorgquote." };

  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return { ok: false, error: "Ongeldige bezorgquote." };

  let expected: string;
  try {
    expected = sign(payloadB64);
  } catch {
    return { ok: false, error: "Bezorgservice niet geconfigureerd." };
  }

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "Ongeldige bezorgquote." };
  }

  let payload: DeliveryQuotePayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as DeliveryQuotePayload;
  } catch {
    return { ok: false, error: "Ongeldige bezorgquote." };
  }

  if (payload.v !== 1) return { ok: false, error: "Ongeldige bezorgquote." };
  if (Date.now() > payload.expiresAt) {
    return { ok: false, error: "Je bezorgquote is verlopen. Controleer je adres opnieuw." };
  }

  return { ok: true, payload };
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
