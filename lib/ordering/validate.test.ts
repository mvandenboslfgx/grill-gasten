import { describe, expect, it } from "vitest";
import { createOrderSchema } from "@/lib/ordering/validate";

describe("createOrderSchema", () => {
  it("ongeldig e-mailadres geweigerd", () => {
    const r = createOrderSchema.safeParse({
      name: "Test",
      phone: "+31612345678",
      email: "geen-email",
      date: "2099-06-01",
      time: "17:00",
      lines: [{ productId: "single-smash", qty: 1, optionIds: [] }],
    });
    expect(r.success).toBe(false);
  });

  it("geldige payload accepteert", () => {
    const r = createOrderSchema.safeParse({
      name: "Test Gebruiker",
      phone: "+31612345678",
      email: "test@example.com",
      date: "2099-06-01",
      time: "17:00",
      lines: [{ productId: "single-smash", qty: 1, optionIds: [] }],
      website: "",
    });
    expect(r.success).toBe(true);
  });
});
