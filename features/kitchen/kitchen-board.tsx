"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@/lib/orders/types";

type KitchenOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: string;
  customer_name: string;
  pickup_time: string;
  lines: { name: string; qty: number }[];
  total_cents: number;
};

const COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Nieuw" },
  { status: "confirmed", label: "Bevestigd" },
  { status: "preparing", label: "Op de grill" },
  { status: "ready", label: "Klaar" },
  { status: "picked_up", label: "Afgehaald" },
];

export function KitchenBoard({ apiKey }: { apiKey: string }) {
  const [orders, setOrders] = React.useState<KitchenOrder[]>([]);
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
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
      const data = (await res.json()) as { ok?: boolean; orders?: KitchenOrder[]; error?: string };
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
    const flow: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "picked_up"];
    const i = flow.indexOf(order.status);
    if (i < flow.length - 1) setStatus(order.id, flow[i + 1]!);
  }

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

      <div className="grid gap-4 lg:grid-cols-5">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);
          return (
            <section
              key={col.status}
              className="min-h-[200px] rounded-2xl border border-white/10 bg-[#0c0c0c] p-3"
            >
              <h2 className="font-heading mb-3 text-sm uppercase tracking-wider text-[#d4af37]">
                {col.label} ({colOrders.length})
              </h2>
              <ul className="space-y-3">
                {colOrders.map((o) => (
                  <li key={o.id} className="rounded-xl border border-white/10 bg-[#151515] p-3">
                    <p className="font-mono text-xs text-primary">{o.order_number}</p>
                    <p className="mt-1 font-semibold text-white">{o.customer_name}</p>
                    <p className="text-muted-foreground text-xs">{o.pickup_time}</p>
                    <ul className="text-muted-foreground mt-2 text-xs">
                      {(o.lines as { name: string; qty: number }[]).map((l, i) => (
                        <li key={i}>
                          {l.qty}× {l.name}
                        </li>
                      ))}
                    </ul>
                    {o.status !== "picked_up" ? (
                      <button
                        type="button"
                        onClick={() => advance(o)}
                        className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground"
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
