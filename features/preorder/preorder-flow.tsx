"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { GlowButton } from "@/components/button";
import { FormSubmitError } from "@/features/forms/form-submit-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { menuItems } from "@/lib/data/menu";
import {
  cartToMessage,
  cartTotal,
  formatEur,
  getMenuItemById,
  loadCart,
  parsePriceEur,
  saveCart,
  type CartLine,
} from "@/lib/preorder/cart";
import { PICKUP_TIME_SLOTS } from "@/lib/preorder/timeslots";
import { FOOD } from "@/lib/data/food-imagery";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-[#0a0a0a] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const itemImages: Record<string, string> = {
  "classic-smash": FOOD.heroSmash.src,
  "double-trouble": FOOD.smashHands.src,
  "pulled-chicken-loaded": FOOD.loadedTray.src,
  "bbq-bacon-fries": FOOD.loadedBacon.src,
};

type Step = "menu" | "checkout" | "done";

export function PreorderFlow() {
  const [step, setStep] = React.useState<Step>("menu");
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCart(loadCart());
  }, []);

  function persist(next: CartLine[]) {
    setCart(next);
    saveCart(next);
  }

  function addItem(id: string) {
    const item = getMenuItemById(id);
    if (!item) return;
    const existing = cart.find((l) => l.id === id);
    if (existing) {
      persist(cart.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)));
    } else {
      persist([
        ...cart,
        { id, name: item.name, priceEur: parsePriceEur(item.price), qty: 1 },
      ]);
    }
  }

  function changeQty(id: string, delta: number) {
    persist(
      cart
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  }

  async function submitCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMsg(null);

    const fd = new FormData(form);
    const lines = loadCart();
    if (lines.length === 0) {
      setStatus("error");
      setErrorMsg("Voeg minstens één gerecht toe.");
      return;
    }

    const payload = {
      type: "preorder" as const,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      date: String(fd.get("date") ?? ""),
      time: String(fd.get("time") ?? ""),
      location: String(fd.get("location") ?? "Foodtruck"),
      message: cartToMessage(lines) + `\n\nTotaal indicatie: ${formatEur(cartTotal(lines))}`,
      website: String(fd.get("website") ?? ""),
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        orderId?: string;
        qrDataUrl?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Verzenden mislukt.");
        return;
      }

      setOrderId(data.orderId ?? null);
      setQrDataUrl(data.qrDataUrl ?? null);
      saveCart([]);
      setCart([]);
      setStep("done");
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMsg("Geen verbinding. Probeer WhatsApp of bel direct.");
    }
  }

  if (step === "done") {
    return (
      <div className="space-y-6 rounded-3xl border border-primary/40 bg-primary/[0.08] p-6 md:p-8">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.28em]">Reservering bevestigd</p>
        <h2 className="font-heading text-3xl uppercase tracking-wide text-white">Bedankt!</h2>
        {orderId ? (
          <p className="text-muted-foreground text-sm">
            Ordernummer: <span className="font-mono text-white">{orderId}</span>
          </p>
        ) : null}
        <p className="text-muted-foreground text-sm leading-relaxed">
          Je ontvangt een bevestiging per e-mail. Toon onderstaande QR bij de truck om af te halen.
        </p>
        {qrDataUrl ? (
          <Image
            src={qrDataUrl}
            alt={`QR code voor order ${orderId}`}
            width={280}
            height={280}
            className="mx-auto rounded-2xl border border-white/10"
            unoptimized
          />
        ) : null}
        <GlowButton href="/" variant="outline">
          Terug naar home
        </GlowButton>
      </div>
    );
  }

  const total = cartTotal(cart);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        {step === "menu" ? (
          <>
            <p className="text-muted-foreground text-sm">
              Kies je gerechten — daarna datum en tijdslot. Betaling aan de truck of op factuur bij events.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {menuItems.map((item) => {
                const img = itemImages[item.id] ?? FOOD.heroSmash.src;
                return (
                  <article
                    key={item.id}
                    className="premium-card flex gap-4 rounded-2xl border border-white/10 bg-[#111] p-4"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-lg uppercase tracking-wide text-white">{item.name}</h3>
                        <p className="shrink-0 font-heading text-lg text-primary">{item.price}</p>
                      </div>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{item.description}</p>
                      <button
                        type="button"
                        onClick={() => addItem(item.id)}
                        className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:text-white"
                      >
                        + Toevoegen
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <form onSubmit={submitCheckout} className="space-y-4">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="po-name">Naam *</Label>
                <Input id="po-name" name="name" required autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="po-phone">Telefoon *</Label>
                <Input id="po-phone" name="phone" type="tel" required autoComplete="tel" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-email">E-mail *</Label>
              <Input id="po-email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="po-date">Datum *</Label>
                <Input id="po-date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="po-time">Tijdslot *</Label>
                <select id="po-time" name="time" required className={selectClass} defaultValue="">
                  <option value="" disabled>
                    Kies tijd
                  </option>
                  {PICKUP_TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-location">Locatie / event</Label>
              <Input id="po-location" name="location" placeholder="Festival, bedrijf of adres" />
            </div>
            {errorMsg ? <FormSubmitError message={errorMsg} whatsappIntent="catering" /> : null}
            <div className="flex flex-wrap gap-3">
              <GlowButton type="button" variant="outline" onClick={() => setStep("menu")}>
                Terug
              </GlowButton>
              <GlowButton type="submit" variant="flame" disabled={status === "loading"}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Bevestigen…
                  </>
                ) : (
                  "Reserveer bestelling"
                )}
              </GlowButton>
            </div>
          </form>
        )}
      </div>

      <aside className="sticky top-28 h-fit rounded-3xl border border-white/10 bg-[#111] p-5">
        <div className="flex items-center gap-2 text-white">
          <ShoppingBag className="size-5 text-primary" aria-hidden />
          <h2 className="font-heading text-xl uppercase tracking-wide">Je mand</h2>
        </div>
        {cart.length === 0 ? (
          <p className="text-muted-foreground mt-4 text-sm">Nog leeg — voeg smash of loaded fries toe.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {cart.map((line) => (
              <li key={line.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-white">
                  {line.qty}× {line.name}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Minder"
                    className="rounded-full border border-white/15 p-1"
                    onClick={() => changeQty(line.id, -1)}
                  >
                    <Minus className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label="Meer"
                    className="rounded-full border border-white/15 p-1"
                    onClick={() => changeQty(line.id, 1)}
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 border-t border-white/10 pt-4 font-heading text-2xl text-primary">
          {formatEur(total)}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">Indicatie — definitief bij afhalen of op factuur.</p>
        {step === "menu" && cart.length > 0 ? (
          <GlowButton type="button" variant="flame" className="mt-4 w-full" onClick={() => setStep("checkout")}>
            Naar afhalen
          </GlowButton>
        ) : null}
        <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
          Grill Rewards: €1 = 1 punt — meld je aan op /rewards.
        </p>
      </aside>
    </div>
  );
}
