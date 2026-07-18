export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
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

export type DbOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_date: string;
  pickup_time: string;
  location: string | null;
  lines: unknown;
  total_cents: number;
  mollie_payment_id: string | null;
  checkout_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
};
