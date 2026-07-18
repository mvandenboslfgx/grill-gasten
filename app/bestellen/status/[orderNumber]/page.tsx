import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlowButton } from "@/components/button";
import { formatPriceCents } from "@/lib/catalog/format-money";
import {
  customerPaymentHeadline,
  fulfillmentLabel,
  orderStatusLabel,
} from "@/lib/orders/labels";
import { parseOrderLines } from "@/lib/orders/parse-lines";
import { getOrderByNumber } from "@/lib/orders/create-order";
import type { OrderStatus } from "@/lib/orders/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { site } from "@/lib/site";

type Props = { params: Promise<{ orderNumber: string }> };

export const metadata: Metadata = {
  title: "Bestelstatus",
  robots: { index: false, follow: false },
};

function timelineSteps(
  method: string | null,
  status: OrderStatus,
  paid: boolean,
): { label: string; done: boolean }[] {
  const pickup = [
    "Betaling ontvangen",
    "Bestelling bevestigd",
    "Wordt bereid",
    "Klaar om af te halen",
    "Afgehaald",
  ];
  const delivery = [
    "Betaling ontvangen",
    "Bestelling bevestigd",
    "Wordt bereid",
    "Klaar",
    "Onderweg",
    "Bezorgd",
  ];
  const labels = method === "delivery" ? delivery : pickup;
  const rank: Record<string, number> = {
    pending: paid ? 0 : -1,
    confirmed: 1,
    preparing: 2,
    ready: 3,
    out_for_delivery: 4,
    delivered: 5,
    picked_up: 4,
    cancelled: -1,
  };
  const current = rank[status] ?? -1;
  return labels.map((label, i) => ({
    label,
    done: paid && current >= i,
  }));
}

export default async function OrderStatusPage({ params }: Props) {
  const { orderNumber } = await params;
  const decoded = decodeURIComponent(orderNumber);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center">
        <h1 className="font-heading text-2xl uppercase text-white">
          Status tijdelijk niet beschikbaar
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">Neem contact op via WhatsApp.</p>
        <GlowButton href={getWhatsAppHref("home")} variant="flame" className="mt-6">
          WhatsApp
        </GlowButton>
      </div>
    );
  }

  let order;
  try {
    order = await getOrderByNumber(decoded);
  } catch {
    notFound();
  }

  if (!order) notFound();

  const lines = parseOrderLines(order.lines);
  const isDelivery = order.fulfillment_method === "delivery";
  const subtotal = order.subtotal_cents ?? order.total_cents - (order.delivery_fee_cents ?? 0);
  const fee = order.delivery_fee_cents ?? 0;
  const paid = order.payment_status === "paid";
  const steps = timelineSteps(order.fulfillment_method, order.status, paid);

  return (
    <div className="site-page">
      <div className="mx-auto max-w-lg space-y-6 px-4 md:px-6">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.12em]">Bestelling</p>
        <h1 className="font-heading text-3xl uppercase tracking-[0.04em] text-white">
          {customerPaymentHeadline(order.payment_status)}
        </h1>
        <p className="font-mono text-sm text-[#d4af37]">{order.order_number}</p>

        <ol className="space-y-2 rounded-2xl border border-white/10 bg-[#111] p-5">
          {steps.map((s) => (
            <li
              key={s.label}
              className={`flex items-center gap-3 text-sm ${s.done ? "text-white" : "text-muted-foreground"}`}
            >
              <span
                className={`size-2.5 shrink-0 rounded-full ${s.done ? "bg-primary" : "bg-white/20"}`}
                aria-hidden
              />
              {s.label}
            </li>
          ))}
        </ol>

        <dl className="space-y-2 rounded-2xl border border-white/10 bg-[#111] p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Orderstatus</dt>
            <dd className="text-white">
              {orderStatusLabel(order.status, order.fulfillment_method)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Methode</dt>
            <dd className="text-white">{fulfillmentLabel(order.fulfillment_method)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{isDelivery ? "Bezorgtijdvak" : "Afhaalmoment"}</dt>
            <dd className="text-right text-white">
              {order.pickup_date}
              {isDelivery
                ? ` · ${order.delivery_window ?? order.pickup_time}`
                : ` om ${order.pickup_time}`}
            </dd>
          </div>
          {isDelivery ? (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Bezorgadres</dt>
                <dd className="text-right text-white">
                  {order.delivery_street} {order.delivery_house_number}
                  {order.delivery_addition}
                  <br />
                  {order.delivery_postcode} {order.delivery_city}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Bezorginstructies</dt>
                <dd className="text-right text-white">
                  {order.delivery_instructions?.trim() || "Geen"}
                </dd>
              </div>
            </>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Klantopmerking</dt>
            <dd className="text-right text-white">{order.customer_note?.trim() || "Geen"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Subtotaal</dt>
            <dd className="text-white">{formatPriceCents(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Bezorgkosten</dt>
            <dd className="text-white">{formatPriceCents(fee)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-white/10 pt-2">
            <dt className="text-muted-foreground">Totaal</dt>
            <dd className="font-semibold text-white">{formatPriceCents(order.total_cents)}</dd>
          </div>
        </dl>

        <ul className="space-y-3 rounded-2xl border border-white/10 bg-[#111] p-5 text-sm">
          {lines.map((line, i) => (
            <li key={i}>
              <div className="flex justify-between gap-3">
                <span className="text-white">
                  {line.qty}× {line.name}
                </span>
                <span className="text-white">{formatPriceCents(line.lineTotalCents)}</span>
              </div>
              {line.options.length > 0 ? (
                <ul className="text-muted-foreground mt-1 text-xs">
                  {line.options.map((o, j) => (
                    <li key={j}>· {o.label}</li>
                  ))}
                </ul>
              ) : null}
              {line.sauceChoice ? (
                <p className="mt-1 text-xs text-[#d4af37]">Saus: {line.sauceChoice}</p>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {paid
            ? isDelivery
              ? "Bedankt! We bezorgen in je gekozen tijdvak."
              : "Bedankt! Kom op het gekozen moment afhalen."
            : order.payment_status === "pending" || order.payment_status === "unpaid"
              ? "We controleren je betaling. Vernieuw deze pagina over een moment."
              : "De betaling is niet gelukt. Probeer opnieuw of neem contact op."}
        </p>

        <div className="flex flex-wrap gap-3">
          <GlowButton href={getWhatsAppHref("home")} variant="flame">
            WhatsApp
          </GlowButton>
          <a
            href={site.phoneTel}
            className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 text-sm font-semibold uppercase tracking-wider text-white"
          >
            Bellen
          </a>
          <Link
            href="/bestellen"
            className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 text-sm font-semibold uppercase tracking-wider text-white"
          >
            Opnieuw bestellen
          </Link>
        </div>
      </div>
    </div>
  );
}
