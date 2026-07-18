import { describe, expect, it } from "vitest";
import {
  canStartPreparing,
  fulfillmentLabel,
  orderStatusLabel,
  paymentStatusLabel,
} from "@/lib/orders/labels";
import { parseOrderLines, formatLineForKitchen } from "@/lib/orders/parse-lines";
import { buildOwnerPaidEmail, buildCustomerPaidEmail } from "@/lib/orders/order-emails";
import type { DbOrder } from "@/lib/orders/types";

const sampleOrder: DbOrder = {
  id: "uuid-1",
  order_number: "GG-260719-A7K9",
  status: "confirmed",
  payment_status: "paid",
  fulfillment_method: "delivery",
  customer_name: "Test Klant",
  customer_phone: "+31612345678",
  customer_email: "test@example.com",
  pickup_date: "2026-07-19",
  pickup_time: "18:00",
  delivery_window: "18:00-18:30",
  location: null,
  delivery_street: "Voorstraat",
  delivery_postcode: "3261AA",
  delivery_house_number: "1",
  delivery_addition: "",
  delivery_city: "Oud-Beijerland",
  delivery_zone: 3,
  delivery_distance_meters: 8500,
  delivery_duration_seconds: 900,
  delivery_instructions: "Niet aanbellen",
  delivery_fee_cents: 599,
  subtotal_cents: 2698,
  lines: [
    {
      productId: "triple-smash",
      name: "Triple Smash Burger",
      qty: 1,
      optionIds: ["pickle-swap"],
      optionLabels: ["Augurk i.p.v. komkommer en tomaat"],
      unitPriceCents: 1499,
      lineTotalCents: 1499,
    },
    {
      productId: "loaded-fries-kip",
      name: "Loaded Fries Kip",
      qty: 1,
      optionIds: [],
      optionLabels: [],
      unitPriceCents: 995,
      lineTotalCents: 995,
    },
    {
      productId: "sauce",
      name: "Saus naar keuze",
      qty: 3,
      optionIds: [],
      optionLabels: [],
      sauceChoice: "Knoflook",
      unitPriceCents: 50,
      lineTotalCents: 150,
      note: undefined,
    },
  ],
  total_cents: 3297,
  mollie_payment_id: "tr_test",
  checkout_url: null,
  notes: "snapshot",
  customer_note: "Extra servetten graag",
  batch_status: "unscheduled",
  created_at: "2026-07-19T10:00:00Z",
};

describe("order labels NL", () => {
  it("consistente termen", () => {
    expect(fulfillmentLabel("pickup")).toBe("Afhalen");
    expect(fulfillmentLabel("delivery")).toBe("Bezorgen");
    expect(paymentStatusLabel("paid")).toBe("Betaald");
    expect(paymentStatusLabel("unpaid")).toBe("Wacht op betaling");
    expect(orderStatusLabel("preparing")).toBe("Wordt bereid");
    expect(orderStatusLabel("ready", "pickup")).toBe("Klaar om af te halen");
    expect(orderStatusLabel("ready", "delivery")).toBe("Klaar voor bezorging");
  });

  it("onbetaalde order niet bereidbaar", () => {
    expect(canStartPreparing("unpaid")).toBe(false);
    expect(canStartPreparing("pending")).toBe(false);
    expect(canStartPreparing("failed")).toBe(false);
    expect(canStartPreparing("paid")).toBe(true);
    expect(canStartPreparing("unpaid", true)).toBe(true);
  });
});

describe("parse order lines", () => {
  it("toont Nederlandse option labels geen codes", () => {
    const lines = parseOrderLines(sampleOrder.lines);
    expect(lines[0]?.options[0]?.label).toMatch(/Augurk/i);
    expect(formatLineForKitchen(lines[0]!)).not.toMatch(/pickle-swap/);
    expect(formatLineForKitchen(lines[0]!)).toMatch(/Augurk/);
  });

  it("sauskeuze zichtbaar", () => {
    const lines = parseOrderLines(sampleOrder.lines);
    expect(lines[2]?.sauceChoice).toBe("Knoflook");
    expect(formatLineForKitchen(lines[2]!)).toMatch(/Knoflook/);
  });
});

describe("order emails", () => {
  it("eigenaarmail bevat zone, instructies, producten", () => {
    const mail = buildOwnerPaidEmail(sampleOrder);
    expect(mail.subject).toContain("GG-260719-A7K9");
    expect(mail.text).toMatch(/Bezorginstructies: Niet aanbellen/);
    expect(mail.text).toMatch(/Augurk/);
    expect(mail.text).toMatch(/Knoflook/);
    expect(mail.text).toMatch(/Extra servetten/);
    expect(mail.text).toMatch(/Subtotaal/);
    expect(mail.text).toMatch(/Bezorgkosten/);
    expect(mail.text).not.toMatch(/undefined/);
  });

  it("klantmail toont geen interne UUID of mollie metadata", () => {
    const mail = buildCustomerPaidEmail(sampleOrder);
    expect(mail.text).not.toContain("uuid-1");
    expect(mail.text).not.toContain("tr_test");
    expect(mail.text).toMatch(/Bedankt/);
    expect(mail.text).toMatch(/bestellen\/status/);
  });
});
