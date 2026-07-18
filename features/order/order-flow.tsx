"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { GlowButton } from "@/components/button";
import { FormSubmitError } from "@/features/forms/form-submit-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { catalogOptions, getOptionById } from "@/lib/catalog/options";
import {
  ALLERGEN_NOTICE,
  formatPriceCents,
  getProductById,
  getVisibleProducts,
} from "@/lib/catalog/products";
import { priceOrderLines } from "@/lib/catalog/pricing";
import type { DeliveryQuoteResult } from "@/lib/delivery/types";
import { getWhatsAppHref } from "@/lib/whatsapp";

type FulfillmentMethod = "pickup" | "delivery";

type CartLine = {
  key: string;
  productId: string;
  qty: number;
  optionIds: string[];
  sauceChoice?: string;
};

type DeliveryWindowOption = {
  id: string;
  label: string;
  start: string;
  end: string;
};

const UI_OPTION_IDS = new Set(["egg", "bacon", "pickle-swap"]);

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-[#0a0a0a] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function lineKey(
  productId: string,
  optionIds: string[],
  sauceChoice?: string,
): string {
  return `${productId}:${[...optionIds].sort().join(",")}:${sauceChoice ?? ""}`;
}

function badgeLabel(badge: string | null): string | null {
  if (badge === "meest-gekozen") return "Meest gekozen";
  if (badge === "populair") return "Populair";
  if (badge === "pittig") return "Pittig";
  if (badge === "liefhebber") return "Voor de echte liefhebber";
  return null;
}

export function OrderFlow() {
  const products = React.useMemo(() => getVisibleProducts(), []);
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [step, setStep] = React.useState<"menu" | "checkout">("menu");
  const [method, setMethod] = React.useState<FulfillmentMethod>("pickup");
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [orderingEnabled, setOrderingEnabled] = React.useState<boolean | null>(null);
  const [deliveryRoutingConfigured, setDeliveryRoutingConfigured] = React.useState(false);
  const [dates, setDates] = React.useState<string[]>([]);
  const [slots, setSlots] = React.useState<string[]>([]);
  const [windows, setWindows] = React.useState<DeliveryWindowOption[]>([]);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string[]>
  >({});
  const [sauceDraft, setSauceDraft] = React.useState("");

  const [postcode, setPostcode] = React.useState("");
  const [houseNumber, setHouseNumber] = React.useState("");
  const [addition, setAddition] = React.useState("");
  const [quote, setQuote] = React.useState<DeliveryQuoteResult | null>(null);
  const [quoteStatus, setQuoteStatus] = React.useState<
    "idle" | "loading" | "error"
  >("idle");
  const [quoteError, setQuoteError] = React.useState<string | null>(null);

  const priced = React.useMemo(
    () =>
      priceOrderLines(
        cart.map(({ productId, qty, optionIds, sauceChoice }) => ({
          productId,
          qty,
          optionIds,
          sauceChoice,
        })),
      ),
    [cart],
  );
  const subtotalCents = priced.ok ? priced.subtotalCents : 0;
  const deliveryFeeCents =
    method === "delivery" && quote ? quote.feeCents : 0;
  const totalCents = subtotalCents + deliveryFeeCents;
  const minOrderShortfall =
    method === "delivery" && quote && subtotalCents < quote.minOrderCents
      ? quote.minOrderCents - subtotalCents
      : 0;

  React.useEffect(() => {
    fetch("/api/ordering/availability")
      .then((r) => r.json())
      .then(
        (d: {
          orderingEnabled?: boolean;
          dates?: string[];
          deliveryRoutingConfigured?: boolean;
        }) => {
          setOrderingEnabled(Boolean(d.orderingEnabled));
          setDeliveryRoutingConfigured(Boolean(d.deliveryRoutingConfigured));
          setDates(d.dates ?? []);
        },
      )
      .catch(() => setOrderingEnabled(false));
  }, []);

  React.useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setWindows([]);
      return;
    }
    let cancelled = false;
    fetch(
      `/api/ordering/availability?date=${encodeURIComponent(selectedDate)}&method=${method}`,
    )
      .then((r) => r.json())
      .then(
        (d: {
          slots?: string[];
          windows?: DeliveryWindowOption[];
        }) => {
          if (cancelled) return;
          setSlots(d.slots ?? []);
          setWindows(d.windows ?? []);
        },
      )
      .catch(() => {
        if (cancelled) return;
        setSlots([]);
        setWindows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, method]);

  function clearQuote() {
    setQuote(null);
    setQuoteError(null);
    setQuoteStatus("idle");
  }

  function setMethodAndReset(next: FulfillmentMethod) {
    setMethod(next);
    clearQuote();
    if (selectedDate) {
      setSlots([]);
      setWindows([]);
    }
  }

  function toggleOption(productId: string, optionId: string) {
    setSelectedOptions((prev) => {
      const cur = prev[productId] ?? [];
      const opt = getOptionById(optionId);
      if (opt?.unique && cur.includes(optionId)) {
        return { ...prev, [productId]: cur.filter((id) => id !== optionId) };
      }
      if (opt?.unique) {
        return {
          ...prev,
          [productId]: [...cur.filter((id) => id !== optionId), optionId],
        };
      }
      return {
        ...prev,
        [productId]: cur.includes(optionId)
          ? cur.filter((id) => id !== optionId)
          : [...cur, optionId],
      };
    });
  }

  function addToCart(productId: string) {
    const product = getProductById(productId);
    if (!product || product.availability === "sold_out") return;

    const optionIds = selectedOptions[productId] ?? [];
    let sauceChoice: string | undefined;

    if (productId === "sauce" || product.requiresSauceChoice) {
      const trimmed = sauceDraft.trim().slice(0, 30);
      if (!trimmed) {
        setErrorMsg("Geef je sauskeuze aan (max. 30 tekens).");
        return;
      }
      sauceChoice = trimmed;
    }

    const key = lineKey(productId, optionIds, sauceChoice);
    setErrorMsg(null);
    setCart((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        const maxQty = product.maxQuantityPerOrder;
        return prev.map((l) =>
          l.key === key ? { ...l, qty: Math.min(maxQty, l.qty + 1) } : l,
        );
      }
      return [
        ...prev,
        {
          key,
          productId,
          qty: 1,
          optionIds,
          ...(sauceChoice ? { sauceChoice } : {}),
        },
      ];
    });
    if (productId === "sauce") {
      setSauceDraft("");
    }
  }

  function setQty(key: string, qty: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  }

  async function requestDeliveryQuote() {
    setQuoteStatus("loading");
    setQuoteError(null);
    setQuote(null);

    try {
      const res = await fetch("/api/delivery/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postcode,
          houseNumber,
          addition: addition || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        quote?: DeliveryQuoteResult;
      };

      if (!res.ok || !data.ok || !data.quote) {
        setQuoteStatus("error");
        setQuoteError(data.error ?? "Adres kon niet worden gecontroleerd.");
        return;
      }

      setQuote(data.quote);
      setQuoteStatus("idle");
    } catch {
      setQuoteStatus("error");
      setQuoteError("Geen verbinding. Probeer het opnieuw.");
    }
  }

  function onCheckAddress(e: React.FormEvent) {
    e.preventDefault();
    void requestDeliveryQuote();
  }

  async function submitCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMsg(null);

    if (!priced.ok || cart.length === 0) {
      setStatus("error");
      setErrorMsg("Voeg minstens één gerecht toe.");
      return;
    }

    if (method === "delivery") {
      if (!quote) {
        setStatus("error");
        setErrorMsg("Controleer eerst je bezorgadres.");
        return;
      }
      if (minOrderShortfall > 0) {
        setStatus("error");
        setErrorMsg(
          `Nog ${formatPriceCents(minOrderShortfall)} nodig voor bezorging in jouw zone.`,
        );
        return;
      }
    }

    const fd = new FormData(form);
    const body: Record<string, unknown> = {
      method,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      date: String(fd.get("date") ?? ""),
      time: String(fd.get("time") ?? ""),
      note: String(fd.get("note") ?? "") || undefined,
      website: String(fd.get("website") ?? ""),
      lines: cart.map(({ productId, qty, optionIds, sauceChoice }) => ({
        productId,
        qty,
        optionIds,
        ...(sauceChoice ? { sauceChoice } : {}),
      })),
    };

    if (method === "delivery") {
      body.quoteId = quote!.quoteId;
      body.postcode = postcode;
      body.houseNumber = houseNumber;
      body.addition = addition || undefined;
      const instructions = String(fd.get("deliveryInstructions") ?? "").trim();
      if (instructions) {
        body.deliveryInstructions = instructions.slice(0, 150);
      }
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        checkoutUrl?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Bestellen mislukt.");
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setStatus("error");
      setErrorMsg("Betaling kon niet worden gestart. Probeer WhatsApp.");
    } catch {
      setStatus("error");
      setErrorMsg("Geen verbinding. Probeer WhatsApp of bel direct.");
    }
  }

  if (orderingEnabled === false) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#111] p-6 md:p-8">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.28em]">
          Online bestellen
        </p>
        <h2 className="font-heading mt-3 text-2xl uppercase tracking-wide text-white">
          Tijdelijk gesloten
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
          Online bestellen staat momenteel uit. Bestel via WhatsApp of bel ons —
          we helpen je graag.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GlowButton href={getWhatsAppHref("home")} variant="flame">
            WhatsApp ons
          </GlowButton>
          <GlowButton href="/menu" variant="outline">
            Bekijk menu
          </GlowButton>
        </div>
      </div>
    );
  }

  if (orderingEnabled === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Laden…</span>
      </div>
    );
  }

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="pb-28 lg:pb-0">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {step === "menu" ? (
            <>
              <div
                className="inline-flex rounded-full border border-white/10 bg-[#111] p-1"
                role="group"
                aria-label="Afhaal of bezorging"
              >
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    method === "pickup"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-white"
                  }`}
                  onClick={() => setMethodAndReset("pickup")}
                >
                  Afhalen
                </button>
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    method === "delivery"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-white"
                  }`}
                  onClick={() => setMethodAndReset("delivery")}
                  disabled={!deliveryRoutingConfigured}
                  title={
                    deliveryRoutingConfigured
                      ? undefined
                      : "Online bezorgen tijdelijk niet beschikbaar"
                  }
                >
                  Bezorgen
                </button>
              </div>

              {!deliveryRoutingConfigured ? (
                <div
                  className="space-y-3 rounded-3xl border border-white/10 bg-[#111] p-5"
                  role="status"
                >
                  <p className="text-sm text-white">
                    Online bezorgen is tijdelijk niet beschikbaar. Afhalen is
                    wel mogelijk.
                  </p>
                  <GlowButton href={getWhatsAppHref("home")} variant="outline">
                    WhatsApp voor bezorging
                  </GlowButton>
                </div>
              ) : null}

              {method === "delivery" && deliveryRoutingConfigured ? (
                <form
                  onSubmit={onCheckAddress}
                  className="space-y-4 rounded-3xl border border-white/10 bg-[#111] p-5"
                >
                  <h2 className="font-heading text-lg uppercase tracking-wide text-white">
                    Bezorgadres
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="del-postcode">Postcode *</Label>
                      <Input
                        id="del-postcode"
                        value={postcode}
                        onChange={(e) => {
                          setPostcode(e.target.value);
                          clearQuote();
                        }}
                        required
                        autoComplete="postal-code"
                        className="h-11"
                        placeholder="3201AB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="del-house">Huisnummer *</Label>
                      <Input
                        id="del-house"
                        value={houseNumber}
                        onChange={(e) => {
                          setHouseNumber(e.target.value);
                          clearQuote();
                        }}
                        required
                        autoComplete="address-line2"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="del-addition">Toevoeging</Label>
                      <Input
                        id="del-addition"
                        value={addition}
                        onChange={(e) => {
                          setAddition(e.target.value);
                          clearQuote();
                        }}
                        autoComplete="off"
                        className="h-11"
                        maxLength={12}
                      />
                    </div>
                  </div>
                  <GlowButton
                    type="submit"
                    variant="outline"
                    disabled={quoteStatus === "loading"}
                  >
                    {quoteStatus === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Controleren…
                      </>
                    ) : (
                      "Controleer adres"
                    )}
                  </GlowButton>
                  {quoteError ? (
                    <p className="text-sm text-red-400" role="alert">
                      {quoteError}
                    </p>
                  ) : null}
                  {quote ? (
                    <div className="space-y-1 rounded-xl border border-white/10 bg-[#0a0a0a] p-4 text-sm">
                      <p className="text-white">
                        {quote.street ? `${quote.street}, ` : ""}
                        {quote.city}
                      </p>
                      <p className="text-muted-foreground">
                        Zone {quote.zoneId} · Bezorgkosten{" "}
                        <span className="text-[#d4af37]">
                          {formatPriceCents(quote.feeCents)}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Minimumbestelling{" "}
                        <span className="text-white">
                          {formatPriceCents(quote.minOrderCents)}
                        </span>{" "}
                        (excl. bezorgkosten)
                      </p>
                      {minOrderShortfall > 0 ? (
                        <p className="pt-1 text-primary" role="status">
                          Nog {formatPriceCents(minOrderShortfall)} nodig voor
                          bezorging in jouw zone.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </form>
              ) : null}

              <ul className="grid gap-5 sm:grid-cols-2">
                {products.map((p) => {
                  const label = badgeLabel(p.badge);
                  const opts = catalogOptions.filter(
                    (o) =>
                      p.allowedOptionIds.includes(o.id) &&
                      UI_OPTION_IDS.has(o.id),
                  );
                  const selected = selectedOptions[p.id] ?? [];
                  const soldOut = p.availability === "sold_out";
                  const needsSauce = p.id === "sauce" || p.requiresSauceChoice;
                  return (
                    <li
                      key={p.id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={p.imageSrc}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 40vw"
                        />
                        {label ? (
                          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                            {label}
                          </span>
                        ) : null}
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-heading text-lg uppercase tracking-wide text-white">
                            {p.name}
                          </h3>
                          <p className="shrink-0 text-sm font-semibold text-[#d4af37]">
                            {formatPriceCents(p.priceCents)}
                          </p>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {p.description}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {p.allergens.length
                            ? `Allergenen: ${p.allergens.join(", ")}`
                            : "Allergeneninformatie op aanvraag"}
                        </p>
                        {opts.length > 0 ? (
                          <fieldset className="space-y-2 border-t border-white/10 pt-3">
                            <legend className="text-xs font-semibold uppercase tracking-wider text-white">
                              Extra&apos;s
                            </legend>
                            {opts.map((o) => (
                              <label
                                key={o.id}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <input
                                  type="checkbox"
                                  checked={selected.includes(o.id)}
                                  onChange={() => toggleOption(p.id, o.id)}
                                  disabled={soldOut}
                                  className="size-4 accent-primary"
                                />
                                <span>
                                  {o.name}
                                  {o.priceCents > 0
                                    ? ` (+${formatPriceCents(o.priceCents)})`
                                    : " (gratis)"}
                                </span>
                              </label>
                            ))}
                          </fieldset>
                        ) : null}
                        {needsSauce ? (
                          <div className="space-y-2 border-t border-white/10 pt-3">
                            <Label htmlFor="sauce-choice">Sauskeuze *</Label>
                            <Input
                              id="sauce-choice"
                              value={sauceDraft}
                              onChange={(e) =>
                                setSauceDraft(e.target.value.slice(0, 30))
                              }
                              maxLength={30}
                              disabled={soldOut}
                              className="h-11"
                              placeholder="Bijv. truffelmayo"
                            />
                            <p className="text-muted-foreground text-xs">
                              Max. 30 tekens
                            </p>
                          </div>
                        ) : null}
                        <GlowButton
                          type="button"
                          variant="flame"
                          className="w-full"
                          disabled={
                            soldOut ||
                            (needsSauce && sauceDraft.trim().length === 0)
                          }
                          onClick={() => addToCart(p.id)}
                        >
                          {soldOut ? "Uitverkocht" : "Toevoegen"}
                        </GlowButton>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <form
              onSubmit={submitCheckout}
              className="space-y-5 rounded-3xl border border-white/10 bg-[#111] p-6"
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading text-2xl uppercase text-white">
                  {method === "delivery" ? "Bezorgen" : "Afhalen"}
                </h2>
                <div
                  className="inline-flex rounded-full border border-white/10 p-1"
                  role="group"
                  aria-label="Afhaal of bezorging"
                >
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      method === "pickup"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setMethodAndReset("pickup")}
                  >
                    Afhalen
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      method === "delivery"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setMethodAndReset("delivery")}
                  >
                    Bezorgen
                  </button>
                </div>
              </div>

              {method === "delivery" ? (
                <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
                  <p className="text-sm font-medium text-white">Bezorgadres</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="chk-postcode">Postcode *</Label>
                      <Input
                        id="chk-postcode"
                        value={postcode}
                        onChange={(e) => {
                          setPostcode(e.target.value);
                          clearQuote();
                        }}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chk-house">Huisnummer *</Label>
                      <Input
                        id="chk-house"
                        value={houseNumber}
                        onChange={(e) => {
                          setHouseNumber(e.target.value);
                          clearQuote();
                        }}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chk-addition">Toevoeging</Label>
                      <Input
                        id="chk-addition"
                        value={addition}
                        onChange={(e) => {
                          setAddition(e.target.value);
                          clearQuote();
                        }}
                        className="h-11"
                        maxLength={12}
                      />
                    </div>
                  </div>
                  <GlowButton
                    type="button"
                    variant="outline"
                    disabled={quoteStatus === "loading"}
                    onClick={() => void requestDeliveryQuote()}
                  >
                    {quoteStatus === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Controleren…
                      </>
                    ) : (
                      "Controleer adres"
                    )}
                  </GlowButton>
                  {quoteError ? (
                    <p className="text-sm text-red-400" role="alert">
                      {quoteError}
                    </p>
                  ) : null}
                  {quote ? (
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        {quote.city} · Zone {quote.zoneId} ·{" "}
                        <span className="text-[#d4af37]">
                          {formatPriceCents(quote.feeCents)}
                        </span>{" "}
                        bezorging · min.{" "}
                        {formatPriceCents(quote.minOrderCents)}
                      </p>
                      {minOrderShortfall > 0 ? (
                        <p className="text-primary" role="status">
                          Nog {formatPriceCents(minOrderShortfall)} nodig voor
                          bezorging in jouw zone.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <Label htmlFor="ord-delivery-instructions">
                      Bezorginstructies (optioneel)
                    </Label>
                    <Input
                      id="ord-delivery-instructions"
                      name="deliveryInstructions"
                      maxLength={150}
                      className="h-11"
                      placeholder="Bijv. bel aan bij de poort"
                    />
                  </div>
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="ord-name">Naam *</Label>
                  <Input
                    id="ord-name"
                    name="name"
                    required
                    autoComplete="name"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ord-phone">Telefoon *</Label>
                  <Input
                    id="ord-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ord-email">E-mail *</Label>
                  <Input
                    id="ord-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ord-date">
                    {method === "delivery" ? "Bezorgdatum *" : "Afhaaldatum *"}
                  </Label>
                  <select
                    id="ord-date"
                    name="date"
                    required
                    className={selectClass}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="" disabled>
                      Kies datum
                    </option>
                    {dates.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ord-time">
                    {method === "delivery" ? "Bezorgtijd *" : "Afhaaltijd *"}
                  </Label>
                  {method === "delivery" ? (
                    <select
                      id="ord-time"
                      name="time"
                      required
                      className={selectClass}
                      defaultValue=""
                      key={`windows-${method}-${selectedDate}`}
                    >
                      <option value="" disabled>
                        Kies tijdvenster
                      </option>
                      {windows.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      id="ord-time"
                      name="time"
                      required
                      className={selectClass}
                      defaultValue=""
                      key={`slots-${method}-${selectedDate}`}
                    >
                      <option value="" disabled>
                        Kies tijd
                      </option>
                      {slots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ord-note">Opmerking (optioneel)</Label>
                <Input
                  id="ord-note"
                  name="note"
                  maxLength={500}
                  className="h-11"
                  placeholder="Bijv. saus of allergie"
                />
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {ALLERGEN_NOTICE}
              </p>
              <p className="text-muted-foreground text-xs">
                Door te bestellen ga je akkoord met de{" "}
                <Link
                  href="/voorwaarden"
                  className="text-white underline-offset-2 hover:underline"
                >
                  voorwaarden
                </Link>{" "}
                en{" "}
                <Link
                  href="/privacy"
                  className="text-white underline-offset-2 hover:underline"
                >
                  privacyverklaring
                </Link>
                .
              </p>
              {errorMsg ? (
                <FormSubmitError message={errorMsg} whatsappIntent="home" />
              ) : null}
              <div className="flex flex-wrap gap-3">
                <GlowButton
                  type="button"
                  variant="outline"
                  onClick={() => setStep("menu")}
                >
                  Terug
                </GlowButton>
                <GlowButton
                  type="submit"
                  variant="flame"
                  disabled={
                    status === "loading" ||
                    cart.length === 0 ||
                    (method === "delivery" &&
                      (!quote || minOrderShortfall > 0))
                  }
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Door naar betalen…
                    </>
                  ) : (
                    `Betaal ${formatPriceCents(totalCents)}`
                  )}
                </GlowButton>
              </div>
            </form>
          )}
        </div>

        <aside className="hidden h-fit rounded-3xl border border-white/10 bg-[#111] p-5 lg:sticky lg:top-28 lg:block">
          <CartPanel
            cart={cart}
            subtotalCents={subtotalCents}
            deliveryFeeCents={deliveryFeeCents}
            totalCents={totalCents}
            method={method}
            minOrderShortfall={minOrderShortfall}
            onQty={setQty}
            onCheckout={() => setStep("checkout")}
            step={step}
          />
        </aside>
      </div>

      {cart.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0a0a]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted-foreground">
                <ShoppingBag className="mr-1 inline size-3.5" aria-hidden />
                {cartCount} items
              </p>
              <p className="font-semibold text-white">
                {formatPriceCents(totalCents)}
              </p>
            </div>
            <GlowButton
              type="button"
              variant="flame"
              className="min-h-11 shrink-0"
              onClick={() => setStep(step === "menu" ? "checkout" : "menu")}
            >
              {step === "menu" ? "Verder" : "Menu"}
            </GlowButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CartPanel({
  cart,
  subtotalCents,
  deliveryFeeCents,
  totalCents,
  method,
  minOrderShortfall,
  onQty,
  onCheckout,
  step,
}: {
  cart: CartLine[];
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  method: FulfillmentMethod;
  minOrderShortfall: number;
  onQty: (key: string, qty: number) => void;
  onCheckout: () => void;
  step: string;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg uppercase tracking-wide text-white">
        Winkelmand
      </h2>
      {cart.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nog leeg — voeg gerechten toe.
        </p>
      ) : (
        <ul className="space-y-3">
          {cart.map((line) => {
            const product = getProductById(line.productId);
            if (!product) return null;
            const linePriced = priceOrderLines([
              {
                productId: line.productId,
                qty: line.qty,
                optionIds: line.optionIds,
                sauceChoice: line.sauceChoice,
              },
            ]);
            const lineTotal = linePriced.ok
              ? linePriced.lines[0]!.lineTotalCents
              : 0;
            return (
              <li
                key={line.key}
                className="rounded-xl border border-white/10 bg-[#0a0a0a] p-3"
              >
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-medium text-white">
                    {product.name}
                  </p>
                  <p className="text-sm text-[#d4af37]">
                    {formatPriceCents(lineTotal)}
                  </p>
                </div>
                {line.sauceChoice ? (
                  <p className="text-muted-foreground mt-1 text-xs">
                    Saus: {line.sauceChoice}
                  </p>
                ) : null}
                {line.optionIds.length > 0 ? (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {line.optionIds
                      .map((id) => getOptionById(id)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-lg border border-white/15 text-white"
                    aria-label="Minder"
                    onClick={() => onQty(line.key, line.qty - 1)}
                  >
                    {line.qty === 1 ? (
                      <Trash2 className="size-3.5" />
                    ) : (
                      <Minus className="size-3.5" />
                    )}
                  </button>
                  <span className="w-6 text-center text-sm text-white">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-lg border border-white/15 text-white"
                    aria-label="Meer"
                    onClick={() =>
                      onQty(
                        line.key,
                        Math.min(product.maxQuantityPerOrder, line.qty + 1),
                      )
                    }
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="space-y-1 border-t border-white/10 pt-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotaal</span>
          <span className="text-white">{formatPriceCents(subtotalCents)}</span>
        </div>
        {method === "delivery" && deliveryFeeCents > 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Bezorgkosten</span>
            <span className="text-[#d4af37]">
              {formatPriceCents(deliveryFeeCents)}
            </span>
          </div>
        ) : null}
        <div className="flex items-center justify-between pt-1">
          <span className="text-muted-foreground">Totaal</span>
          <span className="font-semibold text-white">
            {formatPriceCents(totalCents)}
          </span>
        </div>
        {minOrderShortfall > 0 ? (
          <p className="pt-1 text-xs text-primary">
            Nog {formatPriceCents(minOrderShortfall)} nodig voor bezorging in
            jouw zone.
          </p>
        ) : null}
      </div>
      {step === "menu" ? (
        <GlowButton
          type="button"
          variant="flame"
          className="w-full min-h-11"
          disabled={cart.length === 0}
          onClick={onCheckout}
        >
          Bestel nu
        </GlowButton>
      ) : null}
    </div>
  );
}
