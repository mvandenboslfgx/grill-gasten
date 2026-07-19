"use client";

import * as React from "react";
import {
  Loader2,
  Phone,
  MessageCircle,
  Navigation,
  Printer,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { formatPriceCents } from "@/lib/catalog/format-money";
import { canStartPreparing, isPaymentPaid } from "@/lib/orders/labels";
import { formatAddress, mapsUrl, parseOrderLines } from "@/lib/orders/parse-lines";
import type { OrderStatus } from "@/lib/orders/types";
import type { OrderDetailModel } from "@/features/orders/order-detail";
import { OrderDetail } from "@/features/orders/order-detail";
import { OrderSummaryCard } from "@/features/orders/order-summary";
import { cn } from "@/lib/utils";

type FilterId =
  | "all"
  | "pickup"
  | "delivery"
  | "paid"
  | "awaiting_payment"
  | "new"
  | "preparing"
  | "ready"
  | "out"
  | "done"
  | "cancelled";

type SortId = "time_asc" | "newest" | "oldest" | "pickup_first" | "delivery_first" | "zone" | "city";

const ALERTED_KEY = "gg-kitchen-alerted-paid";

function loadAlerted(): Set<string> {
  try {
    const raw = sessionStorage.getItem(ALERTED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveAlerted(set: Set<string>) {
  try {
    sessionStorage.setItem(ALERTED_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

function playBeep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = 880;
    g.gain.value = 0.08;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      void ctx.close();
    }, 220);
  } catch {
    /* ignore */
  }
}

export function KitchenBoard() {
  const [orders, setOrders] = React.useState<OrderDetailModel[]>([]);
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [filter, setFilter] = React.useState<FilterId>("all");
  const [sort, setSort] = React.useState<SortId>("time_asc");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<OrderDetailModel | null>(null);
  const [showHistory, setShowHistory] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [flashId, setFlashId] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const alertedRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    alertedRef.current = loadAlerted();
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ date });
      if (showHistory) q.set("history", "1");
      const res = await fetch(`/api/kitchen/orders?${q}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = (await res.json()) as {
        ok?: boolean;
        orders?: OrderDetailModel[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Laden mislukt");
        return;
      }
      const next = data.orders ?? [];

      for (const o of next) {
        if (
          isPaymentPaid(o.payment_status) &&
          o.status !== "cancelled" &&
          !alertedRef.current.has(o.id)
        ) {
          alertedRef.current.add(o.id);
          saveAlerted(alertedRef.current);
          if (!muted) playBeep();
          setFlashId(o.id);
          setToast(`Nieuwe betaalde bestelling ${o.order_number}`);
          setTimeout(() => setFlashId(null), 4000);
          setTimeout(() => setToast(null), 6000);
        }
      }

      setOrders(next);
    } catch {
      setError("Geen verbinding");
    } finally {
      setLoading(false);
    }
  }, [date, muted, showHistory]);

  React.useEffect(() => {
    load();
    const t = setInterval(load, 12_000);
    return () => clearInterval(t);
  }, [load]);

  async function setStatus(id: string, status: OrderStatus, force = false) {
    const res = await fetch("/api/kitchen/orders", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, force }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Status wijzigen mislukt");
      return;
    }
    setError(null);
    await load();
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  function filteredSorted(): OrderDetailModel[] {
    const q = search.trim().toLowerCase();
    let list = orders.filter((o) => {
      if (filter === "pickup") return o.fulfillment_method !== "delivery";
      if (filter === "delivery") return o.fulfillment_method === "delivery";
      if (filter === "paid") return isPaymentPaid(o.payment_status);
      if (filter === "awaiting_payment")
        return !isPaymentPaid(o.payment_status) && o.status !== "cancelled";
      if (filter === "new") return o.status === "pending" || o.status === "confirmed";
      if (filter === "preparing") return o.status === "preparing";
      if (filter === "ready") return o.status === "ready";
      if (filter === "out") return o.status === "out_for_delivery";
      if (filter === "done")
        return o.status === "delivered" || o.status === "picked_up";
      if (filter === "cancelled") return o.status === "cancelled";
      return true;
    });

    if (q) {
      list = list.filter((o) => {
        const hay = [
          o.order_number,
          o.customer_name,
          o.customer_phone,
          o.delivery_postcode,
          o.delivery_city,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    const timeKey = (o: OrderDetailModel) =>
      o.delivery_window || o.pickup_time || "";

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "newest":
          return (b.created_at ?? "").localeCompare(a.created_at ?? "");
        case "oldest":
          return (a.created_at ?? "").localeCompare(b.created_at ?? "");
        case "pickup_first":
          return (a.fulfillment_method === "delivery" ? 1 : 0) - (b.fulfillment_method === "delivery" ? 1 : 0);
        case "delivery_first":
          return (b.fulfillment_method === "delivery" ? 1 : 0) - (a.fulfillment_method === "delivery" ? 1 : 0);
        case "zone":
          return (a.delivery_zone ?? 99) - (b.delivery_zone ?? 99);
        case "city":
          return (a.delivery_city ?? "").localeCompare(b.delivery_city ?? "", "nl");
        default:
          return timeKey(a).localeCompare(timeKey(b));
      }
    });

    return list;
  }

  const awaiting = orders.filter(
    (o) => !isPaymentPaid(o.payment_status) && o.status !== "cancelled",
  );
  const active = filteredSorted().filter(
    (o) =>
      isPaymentPaid(o.payment_status) &&
      o.status !== "cancelled" &&
      o.status !== "delivered" &&
      o.status !== "picked_up",
  );
  const visible = filteredSorted();

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: "Alle" },
    { id: "awaiting_payment", label: "Wacht op betaling" },
    { id: "paid", label: "Betaald" },
    { id: "pickup", label: "Afhalen" },
    { id: "delivery", label: "Bezorgen" },
    { id: "new", label: "Nieuw" },
    { id: "preparing", label: "Wordt bereid" },
    { id: "ready", label: "Klaar" },
    { id: "out", label: "Onderweg" },
    { id: "done", label: "Afgerond" },
    { id: "cancelled", label: "Geannuleerd" },
  ];

  return (
    <div className="space-y-5">
      {toast ? (
        <div
          role="status"
          className="rounded-xl border border-primary bg-primary/20 px-4 py-3 text-sm font-semibold text-white"
        >
          {toast}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <label className="text-sm text-muted-foreground">
          Datum
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-white lg:w-auto"
          />
        </label>
        <label className="min-w-0 flex-1 text-sm text-muted-foreground">
          Zoeken
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nummer, naam, telefoon, postcode, plaats"
            className="mt-1 block w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-white"
          />
        </label>
        <label className="text-sm text-muted-foreground">
          Sorteren
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="mt-1 block w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-white"
          >
            <option value="time_asc">Tijd oplopend</option>
            <option value="newest">Nieuwste eerst</option>
            <option value="oldest">Oudste eerst</option>
            <option value="pickup_first">Afhalen eerst</option>
            <option value="delivery_first">Bezorgen eerst</option>
            <option value="zone">Zone</option>
            <option value="city">Plaats</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            className="min-h-11 rounded-full border border-white/20 px-4 text-xs font-semibold uppercase tracking-wider text-white"
          >
            Vernieuwen
          </button>
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-xs font-semibold uppercase tracking-wider",
              showHistory ? "border-primary text-primary" : "border-white/20 text-white",
            )}
          >
            Geschiedenis
          </button>
          <button
            type="button"
            onClick={() => {
              setMuted((m) => !m);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-xs uppercase tracking-wider text-white"
            aria-pressed={muted}
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            {muted ? "Gedempt" : "Geluid"}
          </button>
          <button
            type="button"
            onClick={() => playBeep()}
            className="min-h-11 rounded-full border border-white/20 px-4 text-xs uppercase tracking-wider text-white"
          >
            Test geluid
          </button>
          {loading ? <Loader2 className="size-5 animate-spin text-primary self-center" /> : null}
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-2 text-xs uppercase tracking-wider",
              filter === f.id
                ? "border-primary bg-primary/20 text-white"
                : "border-white/20 text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {awaiting.length > 0 && filter === "all" ? (
        <section className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <h2 className="font-heading text-sm uppercase tracking-wider text-amber-200">
            Wacht op betaling ({awaiting.length}) — nog niet bereiden
          </h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {awaiting.map((o) => (
              <li key={o.id}>
                <OrderSummaryCard order={o} onOpen={() => setSelected(o)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="font-heading mb-3 text-sm uppercase tracking-wider text-[#d4af37]">
          Productie ({filter === "all" ? active.length : visible.length})
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {(filter === "all"
            ? visible.filter(
                (o) =>
                  isPaymentPaid(o.payment_status) && o.status !== "cancelled",
              )
            : visible
          ).map((o) => (
            <li key={o.id}>
              <OrderSummaryCard
                order={o}
                highlight={flashId === o.id}
                onOpen={() => setSelected(o)}
              />
            </li>
          ))}
        </ul>
      </section>

      {selected ? (
        <OrderDetailPanel
          order={selected}
          onClose={() => setSelected(null)}
          onStatus={(status, force) => setStatus(selected.id, status, force)}
        />
      ) : null}
    </div>
  );
}

function OrderDetailPanel({
  order,
  onClose,
  onStatus,
}: {
  order: OrderDetailModel;
  onClose: () => void;
  onStatus: (status: OrderStatus, force?: boolean) => void;
}) {
  const paid = isPaymentPaid(order.payment_status);
  const canPrep = canStartPreparing(order.payment_status);
  const isDelivery = order.fulfillment_method === "delivery";
  const phone = order.customer_phone;
  const wa = `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "31")}`;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function confirmAction(label: string, fn: () => void) {
    if (window.confirm(`${label}?`)) fn();
  }

  async function copyAll() {
    const lines = parseOrderLines(order.lines)
      .map((l) => `${l.qty}× ${l.name}`)
      .join("\n");
    const text = [
      order.order_number,
      order.customer_name,
      phone,
      lines,
      formatAddress(order),
      `Totaal ${formatPriceCents(order.total_cents)}`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-stretch sm:justify-end sm:p-0">
      <button type="button" className="absolute inset-0" aria-label="Sluiten" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${order.order_number}`}
        className="relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0a0a0a] sm:max-h-none sm:h-full sm:max-w-lg sm:rounded-none sm:border-l"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="font-mono text-sm text-primary">{order.order_number}</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/15"
            aria-label="Sluiten"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <OrderDetail order={order} mode="internal" />
        </div>
        <div className="space-y-2 border-t border-white/10 p-4">
          {!paid ? (
            <p className="text-xs font-semibold text-amber-200">
              Wacht op betaling — nog niet bereiden.
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            <ActionBtn
              disabled={!canPrep}
              onClick={() => onStatus("confirmed")}
              label="Bevestigen"
            />
            <ActionBtn
              disabled={!canPrep}
              onClick={() => onStatus("preparing")}
              label="Bereiden"
            />
            <ActionBtn disabled={!canPrep} onClick={() => onStatus("ready")} label="Klaar" />
            {isDelivery ? (
              <>
                <ActionBtn
                  disabled={!canPrep}
                  onClick={() => onStatus("out_for_delivery")}
                  label="Onderweg"
                />
                <ActionBtn
                  disabled={!canPrep}
                  onClick={() => onStatus("delivered")}
                  label="Bezorgd"
                />
              </>
            ) : (
              <ActionBtn
                disabled={!canPrep}
                onClick={() => onStatus("picked_up")}
                label="Afgehaald"
              />
            )}
            <ActionBtn
              onClick={() => confirmAction("Bestelling annuleren", () => onStatus("cancelled"))}
              label="Annuleren"
              danger
            />
          </div>
          {!paid ? (
            <button
              type="button"
              className="w-full rounded-xl border border-amber-500/40 px-3 py-2 text-xs text-amber-200"
              onClick={() =>
                confirmAction(
                  "Handmatig bevestigen zonder betaald (alleen uitzondering)",
                  () => onStatus("confirmed", true),
                )
              }
            >
              Uitzondering: handmatig bevestigen
            </button>
          ) : null}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 text-xs uppercase"
            >
              <Phone className="size-4" /> Bellen
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 text-xs uppercase"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
            {isDelivery ? (
              <a
                href={mapsUrl(order)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 text-xs uppercase"
              >
                <Navigation className="size-4" /> Navigatie
              </a>
            ) : null}
            <a
              href={`/kitchen/print/${encodeURIComponent(order.order_number)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 text-xs uppercase"
            >
              <Printer className="size-4" /> Printen
            </a>
            <button
              type="button"
              onClick={() => void copyAll()}
              className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 text-xs uppercase"
            >
              Bestelgegevens kopiëren
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-xl border px-2 text-xs font-semibold uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-40",
        danger
          ? "border-red-500/40 text-red-300"
          : "border-primary/40 bg-primary/15 text-white",
      )}
    >
      {label}
    </button>
  );
}
