import { describe, expect, it } from "vitest";
import { mollieAmountFromCents, mollieAmountMatchesOrder } from "@/lib/mollie/amount";
import { mapMollieWebhookUpdate } from "@/lib/mollie/webhook-status";

describe("Mollie amount", () => {
  it("komt exact overeen met server-side ordertotaal", () => {
    expect(mollieAmountFromCents(799)).toBe("7.99");
    expect(mollieAmountFromCents(1274)).toBe("12.74");
    expect(mollieAmountFromCents(1674)).toBe("16.74");
    expect(mollieAmountFromCents(995)).toBe("9.95");
  });

  it("weigert niet-gehele centen", () => {
    expect(() => mollieAmountFromCents(7.5)).toThrow();
  });

  it("verifieert Mollie amount tegen order", () => {
    expect(
      mollieAmountMatchesOrder({
        mollieValue: "12.74",
        mollieCurrency: "EUR",
        orderTotalCents: 1274,
      }),
    ).toBe(true);
    expect(
      mollieAmountMatchesOrder({
        mollieValue: "12.75",
        mollieCurrency: "EUR",
        orderTotalCents: 1274,
      }),
    ).toBe(false);
    expect(
      mollieAmountMatchesOrder({
        mollieValue: "12.74",
        mollieCurrency: "USD",
        orderTotalCents: 1274,
      }),
    ).toBe(false);
  });
});

describe("webhook idempotency helper", () => {
  it("dubbele paid-status wordt als no-op behandeld", () => {
    const mapped = mapMollieWebhookUpdate("paid", "paid");
    expect(mapped.skip).toBe(true);
  });
});
