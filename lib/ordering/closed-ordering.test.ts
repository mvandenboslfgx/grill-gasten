import { describe, expect, it } from "vitest";
import { CLOSED_ORDERING_COPY } from "@/features/order/closed-ordering-content";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import {
  getWhatsAppHref,
  WHATSAPP_MESSAGES,
  whatsappIntentFromPath,
} from "@/lib/whatsapp";

describe("closed ordering experience", () => {
  it("houdt online bestellen uit en openWeekdays leeg", () => {
    expect(orderingConfig.orderingEnabled).toBe(false);
    expect(orderingConfig.openWeekdays).toEqual([]);
  });

  it("metadata claimt geen live checkout", () => {
    expect(CLOSED_ORDERING_COPY.metaTitle).toContain("Binnenkort online");
    expect(CLOSED_ORDERING_COPY.metaDescription).toMatch(/binnenkort beschikbaar/i);
    expect(CLOSED_ORDERING_COPY.metaDescription).not.toMatch(/betaal veilig online/i);
  });

  it("gebruikt het correcte WhatsApp-orderbericht en nummer", () => {
    expect(WHATSAPP_MESSAGES.order).toBe(
      "Hoi Grill Gasten, ik heb een vraag of wil graag iets bestellen.",
    );
    expect(whatsappIntentFromPath("/bestellen")).toBe("order");
    const href = getWhatsAppHref("order");
    expect(href).toContain("wa.me/31649565698");
    expect(new URL(href).searchParams.get("text")).toBe(WHATSAPP_MESSAGES.order);
    expect(href.toLowerCase()).not.toContain("foodtruck");
  });

  it("heeft de juiste gesloten copy zonder storings- of foodtrucktaal", () => {
    expect(CLOSED_ORDERING_COPY.h1).toBe("Online bestellen komt binnenkort");
    expect(CLOSED_ORDERING_COPY.primaryCta).toBe("Bestel of vraag via WhatsApp");
    expect(CLOSED_ORDERING_COPY.secondaryCta).toBe("Bekijk het menu");
    expect(CLOSED_ORDERING_COPY.statusLine).toContain("nog gesloten");
    const blob = JSON.stringify(CLOSED_ORDERING_COPY);
    expect(blob).not.toMatch(/storing|defect|onderhoud|foodtruck/i);
    expect(CLOSED_ORDERING_COPY.benefits).toHaveLength(3);
  });
});
