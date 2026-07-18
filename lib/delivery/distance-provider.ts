import {
  getDeliveryOrigin,
  isDeliveryRoutingConfigured,
} from "@/lib/delivery/config";

export type RouteResult = {
  normalizedAddress: string;
  street: string;
  city: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  durationSeconds: number;
  provider: "google";
};

export interface DeliveryDistanceProvider {
  getRoute(input: {
    destinationPostcode: string;
    destinationHouseNumber: string;
    destinationAddition?: string;
  }): Promise<RouteResult | null>;
}

async function geocodePdok(
  postcode: string,
  houseNumber: string,
  addition: string,
): Promise<{ street: string; city: string; lat: number; lng: number; label: string } | null> {
  const q = addition
    ? `${postcode} ${houseNumber}${addition}`
    : `${postcode} ${houseNumber}`;
  const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(q)}&rows=1&fq=type:adres`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    response?: {
      docs?: Array<{
        weergavenaam?: string;
        straatnaam?: string;
        woonplaatsnaam?: string;
        centroide_ll?: string;
      }>;
    };
  };
  const doc = data.response?.docs?.[0];
  if (!doc?.centroide_ll) return null;
  const m = /POINT\(([-\d.]+)\s+([-\d.]+)\)/.exec(doc.centroide_ll);
  if (!m) return null;
  const lng = Number(m[1]);
  const lat = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    street: doc.straatnaam ?? "",
    city: doc.woonplaatsnaam ?? "",
    lat,
    lng,
    label: doc.weergavenaam ?? `${postcode} ${houseNumber}`,
  };
}

async function googleDistance(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
): Promise<{ meters: number; seconds: number } | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!key) return null;
  const url =
    `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?origins=${origin.lat},${origin.lng}` +
    `&destinations=${dest.lat},${dest.lng}` +
    `&mode=driving&language=nl&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    rows?: Array<{
      elements?: Array<{
        status?: string;
        distance?: { value: number };
        duration?: { value: number };
      }>;
    }>;
  };
  const el = data.rows?.[0]?.elements?.[0];
  if (!el || el.status !== "OK" || !el.distance || !el.duration) return null;
  return { meters: el.distance.value, seconds: el.duration.value };
}

/**
 * PDOK geocodeert het adres; Google Distance Matrix bepaalt de rijafstand.
 * Geen Haversine, geen postcodecentrum-fallback voor klanttarieven.
 */
export class GoogleDistanceProvider implements DeliveryDistanceProvider {
  async getRoute(input: {
    destinationPostcode: string;
    destinationHouseNumber: string;
    destinationAddition?: string;
  }): Promise<RouteResult | null> {
    if (!isDeliveryRoutingConfigured()) return null;

    const origin = getDeliveryOrigin();
    const addition = input.destinationAddition ?? "";

    try {
      const geo = await geocodePdok(
        input.destinationPostcode,
        input.destinationHouseNumber,
        addition,
      );
      if (!geo) return null;

      const google = await googleDistance(origin, geo);
      if (!google) return null;

      return {
        normalizedAddress: geo.label,
        street: geo.street,
        city: geo.city,
        lat: geo.lat,
        lng: geo.lng,
        distanceMeters: google.meters,
        durationSeconds: google.seconds,
        provider: "google",
      };
    } catch (e) {
      console.error("[delivery] route failed", e instanceof Error ? e.message : "error");
      return null;
    }
  }
}

export function getDistanceProvider(): DeliveryDistanceProvider {
  return new GoogleDistanceProvider();
}
