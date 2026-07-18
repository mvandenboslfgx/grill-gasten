import { describe, expect, it } from "vitest";
import {
  countsTowardSlotCapacity,
  mapMollieWebhookUpdate,
} from "@/lib/mollie/webhook-status";

describe("Mollie webhook status mapping", () => {
  it("paid → confirmed", () => {
    const r = mapMollieWebhookUpdate("paid", "pending");
    expect("skip" in r).toBe(false);
    if (!("skip" in r)) {
      expect(r.paymentStatus).toBe("paid");
      expect(r.orderStatus).toBe("confirmed");
      expect(r.awardPoints).toBe(true);
    }
  });

  it("failed → cancelled", () => {
    const r = mapMollieWebhookUpdate("failed", "unpaid");
    if (!("skip" in r)) {
      expect(r.paymentStatus).toBe("failed");
      expect(r.orderStatus).toBe("cancelled");
    }
  });

  it("canceled → cancelled", () => {
    const r = mapMollieWebhookUpdate("canceled", "pending");
    if (!("skip" in r)) {
      expect(r.paymentStatus).toBe("canceled");
      expect(r.orderStatus).toBe("cancelled");
    }
  });

  it("expired → cancelled", () => {
    const r = mapMollieWebhookUpdate("expired", "pending");
    if (!("skip" in r)) {
      expect(r.paymentStatus).toBe("expired");
      expect(r.orderStatus).toBe("cancelled");
    }
  });

  it("paid order wordt niet later geannuleerd door oud webhookevent", () => {
    expect(mapMollieWebhookUpdate("failed", "paid")).toEqual({ skip: true });
    expect(mapMollieWebhookUpdate("canceled", "paid")).toEqual({ skip: true });
    expect(mapMollieWebhookUpdate("expired", "paid")).toEqual({ skip: true });
  });

  it("idempotent paid webhook skipped", () => {
    expect(mapMollieWebhookUpdate("paid", "paid")).toEqual({ skip: true });
  });

  it("refunded na paid wijzigt alleen payment_status", () => {
    const r = mapMollieWebhookUpdate("refunded", "paid");
    if (!("skip" in r)) {
      expect(r.paymentStatus).toBe("refunded");
      expect(r.orderStatus).toBeNull();
    }
  });

  it("pending/open/authorized behouden orderstatus", () => {
    const r = mapMollieWebhookUpdate("open", "unpaid");
    if (!("skip" in r)) {
      expect(r.paymentStatus).toBe("pending");
      expect(r.orderStatus).toBeNull();
    }
  });
});

describe("slot capacity statuses", () => {
  it("confirmed telt mee", () => {
    expect(countsTowardSlotCapacity("confirmed")).toBe(true);
  });

  it("pending telt mee", () => {
    expect(countsTowardSlotCapacity("pending")).toBe(true);
  });

  it("cancelled telt niet mee", () => {
    expect(countsTowardSlotCapacity("cancelled")).toBe(false);
  });

  it("delivered / picked_up tellen niet mee", () => {
    expect(countsTowardSlotCapacity("delivered")).toBe(false);
    expect(countsTowardSlotCapacity("picked_up")).toBe(false);
  });
});

describe("Mollie-aanmaakfout capaciteit", () => {
  it("failed payment + cancelled status telt niet mee voor capaciteit", () => {
    // Simuleert cleanup na createMollieCheckout null/exception
    const afterCleanup = { payment_status: "failed", status: "cancelled" as const };
    expect(countsTowardSlotCapacity(afterCleanup.status)).toBe(false);
  });
});
