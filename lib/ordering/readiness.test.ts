import { describe, expect, it } from "vitest";
import { getOrderingEnvReport } from "@/lib/env/ordering-env";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { getOrderingReadiness } from "@/lib/ordering/readiness";
import { hashIdempotencyPayload } from "@/lib/orders/order-events";

describe("ordering readiness gate", () => {
  it("houdt bestellen uit met expliciete blockers", () => {
    expect(orderingConfig.orderingEnabled).toBe(false);
    expect(orderingConfig.openWeekdays).toEqual([]);
    expect(orderingConfig.pickupEnabled).toBe(false);
    expect(orderingConfig.deliveryEnabled).toBe(false);

    const readiness = getOrderingReadiness();
    expect(readiness.ready).toBe(false);
    expect(readiness.publicAvailable).toBe(false);
    expect(readiness.blockers.some((b) => b.id === "ordering_flag_off")).toBe(true);
    expect(readiness.blockers.some((b) => b.id === "no_open_weekdays")).toBe(true);
    expect(readiness.blockers.some((b) => b.id === "no_fulfillment_mode")).toBe(true);
  });

  it("exposeert geen secret-waarden in env-rapport", () => {
    const report = getOrderingEnvReport();
    const serialized = JSON.stringify(report);
    expect(serialized).not.toMatch(/eyJ/);
    expect(serialized).not.toMatch(/live_/);
    expect(serialized).not.toMatch(/test_/);
    expect(["present", "missing", "invalid", "n/a"]).toContain(report.MOLLIE_API_KEY);
  });

  it("idempotency payload hash is stabiel", () => {
    const a = hashIdempotencyPayload({ method: "pickup", lines: [{ id: "x" }] });
    const b = hashIdempotencyPayload({ method: "pickup", lines: [{ id: "x" }] });
    const c = hashIdempotencyPayload({ method: "delivery", lines: [{ id: "x" }] });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toHaveLength(64);
  });
});
