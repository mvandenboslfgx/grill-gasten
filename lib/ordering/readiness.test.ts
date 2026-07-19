import { describe, expect, it } from "vitest";
import { getOrderingEnvReport } from "@/lib/env/ordering-env";
import { deliveryConfig } from "@/lib/delivery/delivery-config";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { getOrderingReadiness } from "@/lib/ordering/readiness";
import { hashIdempotencyPayload } from "@/lib/orders/order-events";

describe("ordering readiness gate (pickup + delivery day one)", () => {
  it("houdt alle orderingflags uit", () => {
    expect(orderingConfig.orderingEnabled).toBe(false);
    expect(orderingConfig.openWeekdays).toEqual([]);
    expect(orderingConfig.pickupEnabled).toBe(false);
    expect(orderingConfig.deliveryEnabled).toBe(false);
    expect(deliveryConfig.enabled).toBe(false);
  });

  it("blokkeert launch tot pickup én delivery én dranken klaar zijn", () => {
    const readiness = getOrderingReadiness();
    expect(readiness.ready).toBe(false);
    expect(readiness.publicAvailable).toBe(false);
    const ids = readiness.blockers.map((b) => b.id);
    expect(ids).toContain("ordering_flag_off");
    expect(ids).toContain("no_open_weekdays");
    expect(ids).toContain("pickup_flag_off");
    expect(ids).toContain("delivery_flag_off");
    expect(ids).toContain("delivery_config_incomplete");
    expect(ids).toContain("delivery_area_empty");
    expect(ids).toContain("no_active_drinks");
  });

  it("exposeert geen secret-waarden in env-rapport", () => {
    const report = getOrderingEnvReport();
    const serialized = JSON.stringify(report);
    expect(serialized).not.toMatch(/eyJ/);
    expect(["present", "missing", "invalid", "n/a"]).toContain(report.MOLLIE_API_KEY);
  });

  it("idempotency payload hash is stabiel", () => {
    const a = hashIdempotencyPayload({ method: "pickup", lines: [{ id: "x" }] });
    const b = hashIdempotencyPayload({ method: "pickup", lines: [{ id: "x" }] });
    expect(a).toBe(b);
  });
});
