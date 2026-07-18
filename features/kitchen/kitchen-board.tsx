"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { formatPriceCents } from "@/lib/catalog/format-money";
import type { OrderStatus } from "@/lib/orders/types";

type KitchenLine = {
  name: string;
  qty: number;
  optionLabels?: string[];
  sauceChoice?: string;
};

type KitchenOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: string;
  fulfillment_method: string | null;
  customer_name: string;
  customer_phone: string;
  pickup_time: string;
  delivery_window: string | null;
  delivery_city: string | null;
  delivery_zone: number | null;
  delivery_street: string | null;
  delivery_postcode: string | null;
  delivery_house_number: string | null;
  delivery_addition: string | null;
  delivery_instructions: string | null;
  delivery_distance_meters: number | null;
  notes: string | null;
  lines: KitchenLine[];
  total_cents: number;
  subtotal_cents: number | null;
  delivery_fee_cents: number | null;
};

const COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Nieuw" },
  { status: "confirmed", label: "Bevestigd" },
  { status: "preparing", label: "Wordt bereid" },
  { status: "ready", label: "Klaar" },
  { status: "out_for_delivery", label: "Onderweg" },
  { status: "delivered", label: "Bezorgd" },
  { status: "picked_up", label: "Afgehaald" },
];

export function KitchenBoard({ apiKey }: { apiKey: string }) {
  const [orders, setOrders] = React.useState<KitchenOrder[]>([]);
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [filter, setFilter] = React.useState<"all" | "pickup" | "delivery">("all");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const headers = React.useMemo(
    () => ({ "Content-Type": "application/json", "x-kitchen-key": apiKey }),
    [apiKey],
  );

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/kitchen/orders?date=${date}`, { headers });
      const data = (await res.json()) as {
        ok?: boolean;
        orders?: KitchenOrder[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Laden mislukt");
        return;
      }
      setOrders(data.orders ?? []);
    } catch {
      setError("Geen verbinding");
    } finally {
      setLoading(false);
    }
  }, [date, headers]);

  React.useEffect(() => {
    load();
    const t = setInterval(load, 12_000);
    return () => clearInterval(t);
  }, [load]);

  async function setStatus(id: string, status: OrderStatus) {
    await fetch("/api/kitchen/orders", {
      method: "PATCH",
      headers,
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  function advance(order: KitchenOrder) {
    const isDelivery = order.fulfillment_method === "delivery";
    const flow: OrderStatus[] = isDelivery
      ? ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"]
      : ["pending", "confirmed", "preparing", "ready", "picked_up"];
    const i = flow.indexOf(order.status);
    if (i >= 0 && i < flow.length - 1) setStatus(order.id, flow[i + 1]!);
  }

  const visible = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "delivery") return o.fulfillment_method === "delivery";
    return o.fulfillment_method !== "delivery";
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-muted-foreground">
          Datum{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="ml-2 rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-white"
          />
        </label>
        <div className="flex gap-2">
          {(["all", "pickup", "delivery"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-wider ${
                filter === f
                  ? "border-primary bg-primary/20 text-white"
                  : "border-white/20 text-muted-foreground"
              }`}
            >
              {f === "all" ? "Alles" : f === "pickup" ? "Afhalen" : "Bezorgen"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
        >
          Vernieuwen
        </button>
        {loading ? <Loader2 className="size-5 animate-spin text-primary" aria-hidden /> : null}
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="grid gap-4 xl:grid-cols-7">
        {COLUMNS.map((col) => {
          const colOrders = visible.filter((o) => o.status === col.status);
          return (
            <section
              key={col.status}
              className="min-h-[160px] rounded-2xl border border-white/10 bg-[#0c0c0c] p-3"
            >
              <h2 className="font-heading mb-3 text-xs uppercase tracking-wider text-[#d4af37]">
                {col.label} ({colOrders.length})
              </h2>
              <ul className="space-y-3">
                {colOrders.map((o) => (
                  <li key={o.id} className="rounded-xl border border-white/10 bg-[#151515] p-3 text-xs">
                    <p className="font-mono text-primary">{o.order_number}</p>
                    <p className="mt-1 font-semibold text-white">{o.customer_name}</p>
                    <p className="text-muted-foreground">{o.customer_phone}</p>
                    <p className="mt-1 text-white">
                      {o.fulfillment_method === "delivery" ? "Bezorgen" : "Afhalen"} ·{" "}
                      {o.delivery_window || o.pickup_time}
                    </p>
                    {o.fulfillment_method === "delivery" ? (
                      <p className="text-muted-foreground mt-1">
                        Zone {o.delivery_zone} · {o.delivery_city}
                        {o.delivery_distance_meters != null
                          ? ` · ${(o.delivery_distance_meters / 1000).toFixed(1)} km`
                          : ""}
                        <br />
                        {o.delivery_street} {o.delivery_house_number}
                        {o.delivery_addition} {o.delivery_postcode}
                      </p>
                    ) : null}
                    {o.delivery_instructions ? (
                      <p className="mt-1 text-[#d4af37]">Info: {o.delivery_instructions}</p>
                    ) : null}
                    <ul className="text-muted-foreground mt-2 space-y-0.5">
                      {(o.lines ?? []).map((l, i) => (
                        <li key={i}>
                          {l.qty}× {l.name}
                          {l.optionLabels?.length ? ` [${l.optionLabels.join(", ")}]` : ""}
                          {l.sauceChoice ? ` (saus: ${l.sauceChoice})` : ""}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-white">
                      {formatPriceCents(o.total_cents)} · {o.payment_status}
                    </p>
                    {o.status !== "picked_up" && o.status !== "delivered" && o.status !== "cancelled" ? (
                      <button
                        type="button"
                        onClick={() => advance(o)}
                        className="mt-3 w-full rounded-lg bg-primary py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground"
                      >
                        Volgende stap
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
