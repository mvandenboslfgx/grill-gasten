export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "picked_up"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "failed"
  | "canceled"
  | "expired"
  | "refunded"
  | "pending";

export type FulfillmentMethod = "pickup" | "delivery";

export type DbOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  fulfillment_method: FulfillmentMethod | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_date: string;
  pickup_time: string;
  delivery_window: string | null;
  location: string | null;
  delivery_street: string | null;
  delivery_postcode: string | null;
  delivery_house_number: string | null;
  delivery_addition: string | null;
  delivery_city: string | null;
  delivery_zone: number | null;
  delivery_distance_meters: number | null;
  delivery_duration_seconds: number | null;
  delivery_instructions: string | null;
  delivery_fee_cents: number | null;
  subtotal_cents: number | null;
  lines: unknown;
  total_cents: number;
  mollie_payment_id: string | null;
  checkout_url: string | null;
  notes: string | null;
  customer_note: string | null;
  /** SHA-256 hex of customer status token — never expose to clients. */
  access_token_hash?: string | null;
  /** AES-GCM ciphertext of status token — server-only for post-pay e-mail. */
  access_token_ciphertext?: string | null;
  idempotency_key?: string | null;
  idempotency_payload_hash?: string | null;
  batch_status: string | null;
  created_at: string;
  updated_at?: string;
};
