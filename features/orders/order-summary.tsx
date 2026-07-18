"use client";

import { formatPriceCents } from "@/lib/catalog/format-money";
import { displayOrNone } from "@/lib/orders/labels";
import { parseOrderLines } from "@/lib/orders/parse-lines";
import type { OrderDetailModel } from "@/features/orders/order-detail";
import { FulfillmentBadge } from "@/features/orders/fulfillment-badge";
import { OrderStatusBadge } from "@/features/orders/order-status-badge";
import { PaymentStatusBadge } from "@/features/orders/payment-status-badge";
import { cn } from "@/lib/utils";

/** Compacte keukenkaart — scanbaar zonder openen. */
export function OrderSummaryCard({
  order,
  highlight,
  onOpen,
  className,
}: {
  order: OrderDetailModel;
  highlight?: boolean;
  onOpen?: () => void;
  className?: string;
}) {
  const lines = parseOrderLines(order.lines);
  const isDelivery = order.fulfillment_method === "delivery";
  const note = order.customer_note?.trim();

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-[#151515] p-3 text-left text-xs transition",
        "hover:border-primary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        highlight && "animate-pulse border-primary ring-2 ring-primary/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-mono text-base font-bold text-primary">{order.order_number}</p>
        <div className="flex flex-wrap gap-1">
          <FulfillmentBadge method={order.fulfillment_method} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
      </div>
      <p className="mt-1 font-semibold text-white">{order.customer_name}</p>
      <p className="text-muted-foreground">{order.customer_phone}</p>
      <p className="mt-1 text-white">
        {isDelivery ? order.delivery_window || order.pickup_time : order.pickup_time}
      </p>
      {isDelivery ? (
        <p className="text-muted-foreground mt-0.5">
          {order.delivery_city ?? "—"} · zone {order.delivery_zone ?? "—"}
        </p>
      ) : null}
      <ul className="mt-2 space-y-1 text-white/90">
        {lines.map((l, i) => (
          <li key={i}>
            <span className="font-medium">
              {l.qty}× {l.name}
            </span>
            {l.options.length ? (
              <span className="text-muted-foreground">
                {" "}
                — {l.options.map((o) => o.label).join(", ")}
              </span>
            ) : null}
            {l.sauceChoice ? (
              <span className="text-[#d4af37]"> · saus: {l.sauceChoice}</span>
            ) : null}
          </li>
        ))}
      </ul>
      {note ? (
        <p className="mt-2 line-clamp-2 font-medium text-[#d4af37]">
          Klantopmerking: {note}
        </p>
      ) : null}
      {order.delivery_instructions ? (
        <p className="mt-1 line-clamp-2 font-semibold uppercase tracking-wide text-primary">
          Bezorginstructie: {order.delivery_instructions}
        </p>
      ) : null}
      <div className="mt-2 flex items-center justify-between gap-2">
        <OrderStatusBadge status={order.status} method={order.fulfillment_method} />
        <span className="font-semibold text-white">{formatPriceCents(order.total_cents)}</span>
      </div>
      <span className="sr-only">Adres {displayOrNone(order.delivery_city)}</span>
    </button>
  );
}
