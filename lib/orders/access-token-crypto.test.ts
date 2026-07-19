import { describe, expect, it } from "vitest";
import {
  canEncryptAccessToken,
  decryptAccessToken,
  encryptAccessToken,
} from "@/lib/orders/access-token-crypto";

describe("access token ciphertext", () => {
  it("rondt encryptie af wanneer secret aanwezig is", () => {
    const prevKitchen = process.env.KITCHEN_SECRET;
    const prevDedicated = process.env.ORDER_STATUS_TOKEN_SECRET;
    process.env.KITCHEN_SECRET = "k".repeat(32);
    delete process.env.ORDER_STATUS_TOKEN_SECRET;

    expect(canEncryptAccessToken()).toBe(true);
    const token = "test-status-token-value-abcdefghijklmnopqrstuv";
    const cipher = encryptAccessToken(token);
    expect(cipher).toBeTruthy();
    expect(decryptAccessToken(cipher)).toBe(token);

    process.env.KITCHEN_SECRET = prevKitchen;
    if (prevDedicated === undefined) delete process.env.ORDER_STATUS_TOKEN_SECRET;
    else process.env.ORDER_STATUS_TOKEN_SECRET = prevDedicated;
  });

  it("geeft null zonder bruikbaar secret", () => {
    const prevKitchen = process.env.KITCHEN_SECRET;
    const prevDedicated = process.env.ORDER_STATUS_TOKEN_SECRET;
    delete process.env.KITCHEN_SECRET;
    delete process.env.ORDER_STATUS_TOKEN_SECRET;

    expect(canEncryptAccessToken()).toBe(false);
    expect(encryptAccessToken("x")).toBeNull();

    process.env.KITCHEN_SECRET = prevKitchen;
    process.env.ORDER_STATUS_TOKEN_SECRET = prevDedicated;
  });
});
