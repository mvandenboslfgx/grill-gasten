import { describe, expect, it } from "vitest";
import { countsTowardSlotCapacity } from "@/lib/mollie/webhook-status";
import type { OrderStatus } from "@/lib/orders/types";

/**
 * Simuleert de advisory-lock volgorde: lock → count active → insert.
 * Twee parallelle "eerste" inserts met max=1 mogen niet allebei slagen.
 */
class LockedSlot {
  private orders: { status: OrderStatus }[] = [];
  private chain: Promise<void> = Promise.resolve();

  async create(max: number): Promise<"ok" | "slot_full"> {
    let release!: () => void;
    const prev = this.chain;
    this.chain = new Promise((r) => {
      release = r;
    });
    await prev;
    try {
      const n = this.orders.filter((o) => countsTowardSlotCapacity(o.status)).length;
      if (n >= max) return "slot_full";
      this.orders.push({ status: "pending" });
      return "ok";
    } finally {
      release();
    }
  }

  mark(status: OrderStatus) {
    if (this.orders[0]) this.orders[0].status = status;
  }

  active() {
    return this.orders.filter((o) => countsTowardSlotCapacity(o.status)).length;
  }
}

describe("slot capacity concurrency (advisory lock model)", () => {
  it("twee gelijktijdige eerste orders respecteren capaciteit", async () => {
    const slot = new LockedSlot();
    const results = await Promise.all([slot.create(1), slot.create(1)]);
    expect(results.filter((r) => r === "ok")).toHaveLength(1);
    expect(results.filter((r) => r === "slot_full")).toHaveLength(1);
    expect(slot.active()).toBe(1);
  });

  it("cancelled order telt niet mee", async () => {
    const slot = new LockedSlot();
    await slot.create(1);
    slot.mark("cancelled");
    expect(await slot.create(1)).toBe("ok");
  });

  it("failed/expired payment (cancelled status) telt niet mee", async () => {
    const slot = new LockedSlot();
    await slot.create(1);
    slot.mark("cancelled"); // na Mollie failed/expired cleanup
    expect(slot.active()).toBe(0);
    expect(await slot.create(1)).toBe("ok");
  });

  it("confirmed order telt wel mee", async () => {
    const slot = new LockedSlot();
    await slot.create(1);
    slot.mark("confirmed");
    expect(await slot.create(1)).toBe("slot_full");
  });
});
