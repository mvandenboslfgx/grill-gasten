import { afterEach, describe, expect, it, vi } from "vitest";
import { isDeliveryRoutingConfigured } from "@/lib/delivery/config";
import { GoogleDistanceProvider } from "@/lib/delivery/distance-provider";
import { buildDeliveryQuote } from "@/lib/delivery/build-quote";
import { zoneForDistanceMeters } from "@/lib/delivery/zones";

describe("routing provider policy", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("geen Google-key → bezorgen niet beschikbaar via quote", async () => {
    vi.stubEnv("DELIVERY_DISTANCE_PROVIDER", "google");
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "");
    vi.stubEnv("DELIVERY_QUOTE_SECRET", "q".repeat(32));
    expect(isDeliveryRoutingConfigured()).toBe(false);

    const result = await buildDeliveryQuote({
      postcode: "3282AB",
      houseNumber: "1",
    });
    expect("blocked" in result && result.blocked).toBe(true);
    if ("blocked" in result && result.blocked) {
      expect(result.reason).toBe("routing_unavailable");
      expect(result.message).toContain("Online bezorgen is tijdelijk niet beschikbaar");
    }
  });

  it("PDOK zonder routeprovider → geen betaalde quote (null route)", async () => {
    vi.stubEnv("DELIVERY_DISTANCE_PROVIDER", "google");
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "");
    const provider = new GoogleDistanceProvider();
    const route = await provider.getRoute({
      destinationPostcode: "3282AB",
      destinationHouseNumber: "1",
    });
    expect(route).toBeNull();
  });

  it("Google-route meters bepalen zone (geen Haversine voor klanttarief)", () => {
    expect(zoneForDistanceMeters(3000)?.feeCents).toBe(299);
    expect(zoneForDistanceMeters(3001)?.feeCents).toBe(449);
  });

  it("Haversine wordt nooit gebruikt voor klanttarief (geen fallback-provider)", async () => {
    vi.stubEnv("DELIVERY_DISTANCE_PROVIDER", "google");
    vi.stubEnv("GOOGLE_MAPS_API_KEY", "fake");
    vi.stubEnv("DELIVERY_QUOTE_SECRET", "q".repeat(32));

    // Mock PDOK success but Google distance failure → null, never haversine quote
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        const u = String(url);
        if (u.includes("pdok.nl")) {
          return {
            ok: true,
            json: async () => ({
              response: {
                docs: [
                  {
                    weergavenaam: "Test 1, Klaaswaal",
                    straatnaam: "Teststraat",
                    woonplaatsnaam: "Klaaswaal",
                    centroide_ll: "POINT(4.4456 51.7725)",
                  },
                ],
              },
            }),
          };
        }
        // Google Distance Matrix fails
        return {
          ok: true,
          json: async () => ({ rows: [{ elements: [{ status: "ZERO_RESULTS" }] }] }),
        };
      }),
    );

    const provider = new GoogleDistanceProvider();
    const route = await provider.getRoute({
      destinationPostcode: "3282AB",
      destinationHouseNumber: "1",
    });
    expect(route).toBeNull();

    const quote = await buildDeliveryQuote({
      postcode: "3282AB",
      houseNumber: "1",
    });
    expect("blocked" in quote && quote.blocked).toBe(true);
  });
});
