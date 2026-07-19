import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  createKitchenSessionToken,
  safeEqualString,
  verifyKitchenRequest,
  verifyKitchenSecretValue,
  verifyKitchenSessionToken,
} from "@/lib/auth/kitchen";
import {
  generateAccessToken,
  hashAccessToken,
  verifyAccessToken,
} from "@/lib/orders/access-token";
import { generateOrderNumber } from "@/lib/orders/order-number";

describe("kitchen auth", () => {
  const secret = "k".repeat(32);

  beforeEach(() => {
    process.env.KITCHEN_SECRET = secret;
  });

  afterEach(() => {
    delete process.env.KITCHEN_SECRET;
  });

  it("rejects short kitchen secrets", () => {
    process.env.KITCHEN_SECRET = "short";
    expect(verifyKitchenSecretValue("short")).toBe(false);
  });

  it("accepts header with constant-time compare", () => {
    const req = new Request("https://example.com/api/kitchen/orders", {
      headers: { "x-kitchen-key": secret },
    });
    expect(verifyKitchenRequest(req)).toBe(true);
  });

  it("rejects query ?key=", () => {
    const req = new Request(`https://example.com/api/kitchen/orders?key=${secret}`);
    expect(verifyKitchenRequest(req)).toBe(false);
  });

  it("accepts signed session cookie", () => {
    const token = createKitchenSessionToken();
    expect(token).toBeTruthy();
    expect(verifyKitchenSessionToken(token)).toBe(true);
    const req = new Request("https://example.com/api/kitchen/orders", {
      headers: { cookie: `gg_kitchen=${token}` },
    });
    expect(verifyKitchenRequest(req)).toBe(true);
  });

  it("safeEqualString rejects different lengths without throwing", () => {
    expect(safeEqualString("abc", "ab")).toBe(false);
  });
});

describe("access tokens", () => {
  it("verifies matching token/hash", () => {
    const { token, hash } = generateAccessToken();
    expect(hash).toBe(hashAccessToken(token));
    expect(verifyAccessToken(token, hash)).toBe(true);
    expect(verifyAccessToken("wrong", hash)).toBe(false);
    expect(verifyAccessToken(token, null)).toBe(false);
  });
});

describe("order numbers", () => {
  it("uses high-entropy suffix without uppercasing", () => {
    const n = generateOrderNumber(new Date("2026-07-19T12:00:00Z"));
    expect(n).toMatch(/^GG-260719-[A-Za-z0-9_-]{12}$/);
    const set = new Set(Array.from({ length: 40 }, () => generateOrderNumber()));
    expect(set.size).toBe(40);
  });
});
