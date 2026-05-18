export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

export type OrderLine = {
  id: string;
  name: string;
  priceEur: number;
  qty: number;
};

export type CreateOrderInput = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  location?: string;
  lines: OrderLine[];
  totalCents: number;
  notes?: string;
};

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
  lines: OrderLine[];
  total_cents: number;
  mollie_payment_id: string | null;
  checkout_url: string | null;
  created_at: string;
};
