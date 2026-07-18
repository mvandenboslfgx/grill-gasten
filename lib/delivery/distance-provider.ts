import { getDeliveryOrigin } from "@/lib/delivery/config";

export type RouteResult = {
  normalizedAddress: string;
  street: string;
  city: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  durationSeconds: number;
  provider: "google" | "pdok_haversine" | "fallback_place";
  conservative: boolean;
};

export interface DeliveryDistanceProvider {
  getRoute(input: {
    destinationPostcode: string;
    destinationHouseNumber: string;
    destinationAddition?: string;
  }): Promise<RouteResult | null>;
}

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Road-factor: haversine × 1.45, rounded up to next 50m (conservatief). */
function roadEstimateMeters(straight: number): number {
  const estimated = straight * 1.45;
  return Math.ceil(estimated / 50) * 50;
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
  // POINT(lng lat)
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
 * Conservatieve plaats-centroids Hoeksche Waard (fallback).
 * Afstanden zijn bewust iets ruim genomen.
 */
const PLACE_FALLBACK: Record<string, { lat: number; lng: number; city: string }> = {
  "3281": { lat: 51.7725, lng: 4.4456, city: "Numansdorp" }, // nearby
  "3282": { lat: 51.7725, lng: 4.4456, city: "Klaaswaal" },
  "3291": { lat: 51.807, lng: 4.48, city: "Strijen" },
  "3295": { lat: 51.82, lng: 4.52, city: "s-Gravendeel" },
  "3261": { lat: 51.855, lng: 4.365, city: "Oud-Beijerland" },
  "3262": { lat: 51.855, lng: 4.365, city: "Oud-Beijerland" },
  "3263": { lat: 51.855, lng: 4.365, city: "Oud-Beijerland" },
  "3264": { lat: 51.83, lng: 4.34, city: "Nieuw-Beijerland" },
  "3265": { lat: 51.81, lng: 4.32, city: "Piershil" },
  "3267": { lat: 51.79, lng: 4.3, city: "Goudswaard" },
  "3271": { lat: 51.79, lng: 4.39, city: "Mijnsheerenland" },
  "3273": { lat: 51.78, lng: 4.42, city: "Westmaas" },
  "3274": { lat: 51.76, lng: 4.4, city: "Heinenoord" },
  "3297": { lat: 51.75, lng: 4.55, city: "Kloosterzandi" },
};

export class DefaultDistanceProvider implements DeliveryDistanceProvider {
  async getRoute(input: {
    destinationPostcode: string;
    destinationHouseNumber: string;
    destinationAddition?: string;
  }): Promise<RouteResult | null> {
    const origin = getDeliveryOrigin();
    const addition = input.destinationAddition ?? "";

    try {
      const geo = await geocodePdok(
        input.destinationPostcode,
        input.destinationHouseNumber,
        addition,
      );

      if (geo) {
        const google = await googleDistance(origin, geo);
        if (google) {
          return {
            normalizedAddress: geo.label,
            street: geo.street,
            city: geo.city,
            lat: geo.lat,
            lng: geo.lng,
            distanceMeters: google.meters,
            durationSeconds: google.seconds,
            provider: "google",
            conservative: false,
          };
        }

        const straight = haversineMeters(origin, geo);
        const meters = roadEstimateMeters(straight);
        const km = meters / 1000;
        const hours = km / 35;
        return {
          normalizedAddress: geo.label,
          street: geo.street,
          city: geo.city,
          lat: geo.lat,
          lng: geo.lng,
          distanceMeters: meters,
          durationSeconds: Math.round(hours * 3600),
          provider: "pdok_haversine",
          conservative: true,
        };
      }
    } catch (e) {
      console.error("[delivery] geocode failed", e instanceof Error ? e.message : "error");
    }

    // Conservatieve postcode-fallback
    const pc4 = input.destinationPostcode.slice(0, 4);
    const place = PLACE_FALLBACK[pc4];
    if (!place) return null;

    const straight = haversineMeters(origin, place);
    // Extra buffer +1 zone-stap (500m) bij twijfel
    const meters = roadEstimateMeters(straight) + 500;
    const km = meters / 1000;
    return {
      normalizedAddress: `${input.destinationPostcode} ${input.destinationHouseNumber}${addition}`,
      street: "",
      city: place.city,
      lat: place.lat,
      lng: place.lng,
      distanceMeters: meters,
      durationSeconds: Math.round((km / 35) * 3600),
      provider: "fallback_place",
      conservative: true,
    };
  }
}

export function getDistanceProvider(): DeliveryDistanceProvider {
  return new DefaultDistanceProvider();
}
