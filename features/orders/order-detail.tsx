"use client";

import * as React from "react";
import { Check, Copy, ExternalLink, MessageCircle, Phone } from "lucide-react";
import { formatPriceCents } from "@/lib/catalog/format-money";
import {
  displayOrNone,
  orderStatusLabel,
  paymentStatusLabel,
} from "@/lib/orders/labels";
import {
  formatAddress,
  mapsUrl,
  parseOrderLines,
  type OrderLineView,
} from "@/lib/orders/parse-lines";
import type { DbOrder, FulfillmentMethod, OrderStatus, PaymentStatus } from "@/lib/orders/types";
import { site } from "@/lib/site";
import { FulfillmentBadge } from "@/features/orders/fulfillment-badge";
import { OrderStatusBadge } from "@/features/orders/order-status-badge";
import { PaymentStatusBadge } from "@/features/orders/payment-status-badge";
import { cn } from "@/lib/utils";

export type OrderDetailModel = {
  id: string;
  order_number: string;
  status: OrderStatus | string;
  payment_status: PaymentStatus | string;
  fulfillment_method: FulfillmentMethod | string | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  pickup_date: string;
  pickup_time: string;
  delivery_window?: string | null;
  delivery_street?: string | null;
  delivery_postcode?: string | null;
  delivery_house_number?: string | null;
  delivery_addition?: string | null;
  delivery_city?: string | null;
  delivery_zone?: number | null;
  delivery_distance_meters?: number | null;
  delivery_duration_seconds?: number | null;
  delivery_instructions?: string | null;
  delivery_fee_cents?: number | null;
  subtotal_cents?: number | null;
  total_cents: number;
  lines: unknown;
  customer_note?: string | null;
  notes?: string | null;
  mollie_payment_id?: string | null;
  created_at?: string;
  updated_at?: string | null;
};

function CopyButton({ value, label }: { value: string; label: string }) {
  const [ok, setOk] = React.useState(false);
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-white"
      aria-label={`${label} kopiëren`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* ignore */
        }
      }}
    >
      {ok ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
      {ok ? "Gekopieerd" : "Kopieer"}
    </button>
  );
}

function Block({
  title,
  children,
  alert,
}: {
  title: string;
  children: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border p-4",
        alert ? "border-[#d4af37]/50 bg-[#d4af37]/10" : "border-white/10 bg-[#111]",
      )}
    >
      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d4af37]">
        {title}
      </h3>
      <div className="text-sm text-white">{children}</div>
    </section>
  );
}

function LineBlock({ line }: { line: OrderLineView }) {
  return (
    <li className="border-b border-white/10 py-3 last:border-0">
      <div className="flex justify-between gap-3">
        <p className="font-semibold text-white">
          {line.qty}× {line.name}
        </p>
        <p className="shrink-0 text-white">{formatPriceCents(line.lineTotalCents)}</p>
      </div>
      <p className="text-muted-foreground text-xs">
        Basis {formatPriceCents(line.unitPriceCents)}
      </p>
      {line.options.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-xs text-white/90">
          {line.options.map((o, i) => (
            <li key={`${o.id}-${i}`}>
              · {o.label}
              {o.priceCents > 0
                ? ` (+${formatPriceCents(o.priceCents)})`
                : o.priceCents === 0
                  ? " (gratis)"
                  : ""}
            </li>
          ))}
        </ul>
      ) : null}
      {line.sauceChoice ? (
        <p className="mt-1 text-xs font-medium text-[#d4af37]">Saus: {line.sauceChoice}</p>
      ) : null}
      {line.note ? (
        <p className="mt-1 text-xs font-medium text-primary">Productwens: {line.note}</p>
      ) : null}
    </li>
  );
}

export function OrderDetail({
  order,
  mode = "internal",
  className,
}: {
  order: OrderDetailModel | DbOrder;
  mode?: "internal" | "customer" | "print";
  className?: string;
}) {
  const internal = mode === "internal" || mode === "print";
  const isDelivery = order.fulfillment_method === "delivery";
  const lines = parseOrderLines(order.lines);
  const subtotal =
    order.subtotal_cents ?? order.total_cents - (order.delivery_fee_cents ?? 0);
  const fee = order.delivery_fee_cents ?? 0;
  const customerNote = order.customer_note?.trim() || null;
  const productNotes = lines.filter((l) => l.note).map((l) => `${l.name}: ${l.note}`);
  const address = formatAddress(order);
  const phone = order.customer_phone;
  const email = order.customer_email ?? "";
  const wa = `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "31")}`;
  const km =
    order.delivery_distance_meters != null
      ? `${(order.delivery_distance_meters / 1000).toFixed(2)} km`
      : null;
  const duration =
    order.delivery_duration_seconds != null
      ? `${Math.round(order.delivery_duration_seconds / 60)} min`
      : null;

  const alertInstructions = Boolean(order.delivery_instructions?.trim());
  const alertPickle = lines.some((l) =>
    l.options.some((o) => o.id === "pickle-swap" || /augurk/i.test(o.label)),
  );

  return (
    <div className={cn("space-y-4", mode === "print" && "text-black", className)}>
      <header className="space-y-2">
        <p className="font-mono text-2xl font-bold tracking-wide text-primary print:text-black">
          {order.order_number}
        </p>
        <div className="flex flex-wrap gap-2">
          <FulfillmentBadge method={order.fulfillment_method} size="hero" />
          <PaymentStatusBadge status={order.payment_status} />
          <OrderStatusBadge status={order.status} method={order.fulfillment_method} />
        </div>
        <p className="text-muted-foreground text-xs print:text-neutral-600">
          {order.pickup_date} ·{" "}
          {isDelivery ? order.delivery_window || order.pickup_time : order.pickup_time}
        </p>
        {internal && order.created_at ? (
          <p className="text-muted-foreground text-xs">
            Geplaatst: {new Date(order.created_at).toLocaleString("nl-NL")}
            {order.updated_at
              ? ` · Bijgewerkt: ${new Date(order.updated_at).toLocaleString("nl-NL")}`
              : ""}
          </p>
        ) : null}
      </header>

      {internal ? (
        <Block title="Klant">
          <p className="font-semibold">{order.customer_name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a href={`tel:${phone}`} className="inline-flex items-center gap-1 text-primary">
              <Phone className="size-3.5" aria-hidden />
              {phone}
            </a>
            <CopyButton value={phone} label="Telefoon" />
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#25D366]"
            >
              <MessageCircle className="size-3.5" aria-hidden />
              WhatsApp
            </a>
          </div>
          {email ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <a href={`mailto:${email}`} className="text-white underline-offset-2 hover:underline">
                {email}
              </a>
              <CopyButton value={email} label="E-mail" />
            </div>
          ) : (
            <p className="text-muted-foreground mt-2 text-xs">E-mail: Geen</p>
          )}
        </Block>
      ) : null}

      {isDelivery ? (
        <Block title="Bezorging" alert={alertInstructions}>
          <p>{displayOrNone(address)}</p>
          <p className="text-muted-foreground mt-1 text-xs print:hidden">
            {internal ? (
              <>
                Zone {order.delivery_zone ?? "—"}
                {km ? ` · ${km}` : ""}
                {duration ? ` · ~${duration}` : ""}
              </>
            ) : (
              "Bezorgadres"
            )}
          </p>
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Bezorginstructies: </span>
            {displayOrNone(order.delivery_instructions)}
          </p>
          {internal && address !== "" ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={mapsUrl(order)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center gap-1 rounded-full border border-white/20 px-3 text-xs uppercase tracking-wider"
              >
                <ExternalLink className="size-3.5" aria-hidden />
                Open in navigatie
              </a>
              <CopyButton value={address} label="Adres" />
            </div>
          ) : null}
        </Block>
      ) : null}

      <Block title="Producten">
        <ul>
          {lines.map((line, i) => (
            <LineBlock key={i} line={line} />
          ))}
        </ul>
      </Block>

      <Block title="Wensen en opmerkingen" alert={alertPickle || Boolean(customerNote)}>
        {alertPickle ? (
          <p className="mb-2 font-bold uppercase tracking-wide text-[#d4af37]">
            Let op: augurk in plaats van komkommer en tomaat
          </p>
        ) : null}
        {alertInstructions ? (
          <p className="mb-2 font-bold uppercase tracking-wide text-[#d4af37]">
            Bezorginstructie: {order.delivery_instructions}
          </p>
        ) : null}
        <p>
          <span className="text-muted-foreground">Productwensen: </span>
          {productNotes.length ? productNotes.join(" · ") : "Geen"}
        </p>
        <p className="mt-1">
          <span className="text-muted-foreground">Klantopmerking: </span>
          {displayOrNone(customerNote)}
        </p>
        <p className="mt-1">
          <span className="text-muted-foreground">Bezorginstructies: </span>
          {displayOrNone(order.delivery_instructions)}
        </p>
        <p className="mt-1">
          <span className="text-muted-foreground">Allergie- of dieetmelding: </span>
          Geen
        </p>
      </Block>

      <Block title="Bedragen">
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Subtotaal</dt>
            <dd>{formatPriceCents(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Bezorgkosten</dt>
            <dd>{formatPriceCents(fee)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-white/10 pt-2 font-semibold">
            <dt>Totaal</dt>
            <dd>{formatPriceCents(order.total_cents)}</dd>
          </div>
          <div className="flex justify-between gap-4 pt-1">
            <dt className="text-muted-foreground">Betaalstatus</dt>
            <dd>{paymentStatusLabel(order.payment_status)}</dd>
          </div>
          {internal && order.mollie_payment_id ? (
            <div className="flex justify-between gap-4 pt-1 text-xs">
              <dt className="text-muted-foreground">Mollie</dt>
              <dd className="font-mono">{order.mollie_payment_id}</dd>
            </div>
          ) : null}
        </dl>
      </Block>

      {mode === "print" ? (
        <p className="text-xs text-neutral-500">
          Status: {orderStatusLabel(order.status, order.fulfillment_method)} · Grill Gasten ·{" "}
          {site.phoneDisplay}
        </p>
      ) : null}
    </div>
  );
}
