export type DeliveryZoneId = 1 | 2 | 3 | 4 | 5 | 6;

export type DeliveryZone = {
  id: DeliveryZoneId;
  /** Inclusive max distance in meters from origin */
  maxMeters: number;
  /** Exclusive min distance in meters (0 for zone 1) */
  minMeters: number;
  feeCents: number;
  minOrderCents: number;
  label: string;
};

export type DeliveryQuotePayload = {
  v: 1;
  postcode: string;
  houseNumber: string;
  addition: string;
  street: string;
  city: string;
  distanceMeters: number;
  durationSeconds: number;
  zoneId: DeliveryZoneId;
  feeCents: number;
  minOrderCents: number;
  issuedAt: number;
  expiresAt: number;
};

export type DeliveryQuoteResult = {
  quoteId: string;
  postcode: string;
  houseNumber: string;
  addition: string;
  street: string;
  city: string;
  distanceKm: number;
  distanceMeters: number;
  zoneId: DeliveryZoneId;
  feeCents: number;
  minOrderCents: number;
  expiresAt: number;
  blocked?: false;
};

export type DeliveryBlocked = {
  blocked: true;
  reason:
    | "tiengemeten"
    | "out_of_range"
    | "invalid_address"
    | "unavailable"
    | "routing_unavailable";
  message: string;
};
