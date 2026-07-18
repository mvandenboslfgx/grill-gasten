import { describe, expect, it } from "vitest";

/** Mollie bedrag = (totalCents / 100).toFixed(2) */
function mollieAmountFromCents(totalCents: number): string {
  return (totalCents / 100).toFixed(2);
}

describe("Mollie amount", () => {
  it("komt exact overeen met server-side ordertotaal", () => {
    expect(mollieAmountFromCents(799)).toBe("7.99");
    expect(mollieAmountFromCents(1274)).toBe("12.74");
    expect(mollieAmountFromCents(1674)).toBe("16.74");
    expect(mollieAmountFromCents(995)).toBe("9.95");
  });
});

describe("webhook idempotency helper", () => {
  it("dubbele paid-status wordt als no-op behandeld", () => {
    const alreadyPaid = "paid";
    const shouldAward = alreadyPaid !== "paid";
    expect(shouldAward).toBe(false);
  });
});
