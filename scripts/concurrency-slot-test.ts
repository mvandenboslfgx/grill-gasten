/**
 * Concurrency-simulatie voor slotcapaciteit (advisory-lock model).
 *
 * Echte DB-test: voer na migratie 20260718230000_delivery_safety_fix.sql
 * twee parallelle create_order_with_slot calls uit met max_orders=1.
 *
 * Dit script bewijst lokaal dat een mutex (zoals pg_advisory_xact_lock)
 * voorkomt dat twee gelijktijdige "eerste" inserts capaciteit overschrijden.
 *
 * Run: npm run test:concurrency
 */

import { countsTowardSlotCapacity } from "../lib/mollie/webhook-status";
import type { OrderStatus } from "../lib/orders/types";

type SlotOrder = { id: string; status: OrderStatus };

class SlotStore {
  private orders: SlotOrder[] = [];
  private lock: Promise<void> = Promise.resolve();

  /** Simuleert pg_advisory_xact_lock + count + insert */
  async tryCreate(max: number): Promise<"ok" | "slot_full"> {
    let release!: () => void;
    const prev = this.lock;
    this.lock = new Promise<void>((r) => {
      release = r;
    });
    await prev;
    try {
      const active = this.orders.filter((o) => countsTowardSlotCapacity(o.status)).length;
      if (active >= max) return "slot_full";
      this.orders.push({ id: crypto.randomUUID(), status: "pending" });
      return "ok";
    } finally {
      release();
    }
  }

  /** Race zonder lock — toont het bugpatroon */
  async tryCreateRacey(max: number): Promise<"ok" | "slot_full"> {
    const active = this.orders.filter((o) => countsTowardSlotCapacity(o.status)).length;
    await new Promise((r) => setTimeout(r, 5));
    if (active >= max) return "slot_full";
    this.orders.push({ id: crypto.randomUUID(), status: "pending" });
    return "ok";
  }

  cancelLast() {
    const last = this.orders[this.orders.length - 1];
    if (last) last.status = "cancelled";
  }

  activeCount() {
    return this.orders.filter((o) => countsTowardSlotCapacity(o.status)).length;
  }
}

async function main() {
  const max = 1;

  // 1) Twee gelijktijdige eerste orders met lock → exact 1 OK
  const locked = new SlotStore();
  const [a, b] = await Promise.all([locked.tryCreate(max), locked.tryCreate(max)]);
  const okLocked = [a, b].filter((x) => x === "ok").length;
  if (okLocked !== 1 || locked.activeCount() !== 1) {
    console.error("FAIL: advisory-lock sim — expected 1 success, got", okLocked, locked.activeCount());
    process.exit(1);
  }
  console.log("OK: twee gelijktijdige eerste orders respecteren capaciteit (lock)");

  // 2) Cancelled telt niet mee → nieuwe order mag
  locked.cancelLast();
  const afterCancel = await locked.tryCreate(max);
  if (afterCancel !== "ok" || locked.activeCount() !== 1) {
    console.error("FAIL: cancelled should free capacity");
    process.exit(1);
  }
  console.log("OK: cancelled order telt niet mee");

  // 3) Confirmed telt wel mee
  const confirmedStore = new SlotStore();
  await confirmedStore.tryCreate(max);
  confirmedStore["orders"][0].status = "confirmed";
  const blocked = await confirmedStore.tryCreate(max);
  if (blocked !== "slot_full") {
    console.error("FAIL: confirmed should occupy capacity");
    process.exit(1);
  }
  console.log("OK: confirmed order telt wel mee");

  // 4) Racey zonder lock overboekt (documenteert waarom advisory lock nodig is)
  const racey = new SlotStore();
  const raced = await Promise.all([racey.tryCreateRacey(max), racey.tryCreateRacey(max)]);
  const overbooked = raced.filter((x) => x === "ok").length > 1;
  if (!overbooked) {
    console.warn("WARN: racey test deed toevallig niet overboeken (timing)");
  } else {
    console.log("OK: zonder lock kan overboeking optreden (bewijs noodzaak advisory lock)");
  }

  console.log("\nConcurrencytest geslaagd.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
