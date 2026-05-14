"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlowButton } from "@/components/button";
import { site } from "@/lib/site";
import { whatsappUrlWithPrefilledText } from "@/lib/whatsapp";

function buildCateringMessage(fd: FormData): string {
  const org = String(fd.get("org") ?? "").trim();
  const guests = String(fd.get("guests") ?? "").trim();
  const date = String(fd.get("date") ?? "").trim();
  const city = String(fd.get("city") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const brief = String(fd.get("brief") ?? "").trim();

  const lines = [
    "Cateringaanvraag — Grill Gasten",
    "",
    `Organisatie: ${org || "—"}`,
    `Aantal gasten: ${guests || "—"}`,
    `Eventdatum: ${date || "—"}`,
    `Locatie (stad): ${city || "—"}`,
    `E-mail: ${email || "—"}`,
    "",
    "Event brief:",
    brief || "—",
  ];
  return lines.join("\n");
}

export function CateringBookingForm() {
  const [hint, setHint] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const message = buildCateringMessage(fd);
    const url = whatsappUrlWithPrefilledText(site.whatsapp, message);
    window.open(url, "_blank", "noopener,noreferrer");
    setHint(
      `Geen WhatsApp? Mail ${site.email} of gebruik de groene WhatsApp-knop hierboven met je eigen bericht.`,
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-primary/35 bg-primary/[0.07] p-5 shadow-[0_0_40px_-18px_rgba(255,90,31,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Snelste route</p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Boekingen en beschikbaarheid lopen het snelst via WhatsApp — Mike &amp; Matthijs reageren daar direct op.
        </p>
        <div className="mt-4">
          <GlowButton href={site.whatsapp} variant="flame" className="w-full sm:w-auto">
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp — nu contact
          </GlowButton>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.22em]">
          Optioneel — vul in, dan zetten we je bericht klaar in WhatsApp
        </p>
        <form onSubmit={onSubmit} className="mt-4 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="org">Organisatie</Label>
              <Input id="org" name="org" placeholder="Bedrijf / festival" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Aantal gasten</Label>
              <Input id="guests" name="guests" inputMode="numeric" placeholder="Bijv. 150" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Eventdatum</Label>
              <Input id="date" name="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Locatie (stad)</Label>
              <Input id="city" name="city" placeholder="Amsterdam" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="you@domain.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brief">Event brief</Label>
            <Textarea
              id="brief"
              name="brief"
              rows={5}
              placeholder="Vertel ons over je event, timing, vibe en wensen…"
            />
          </div>
          <GlowButton type="submit" variant="outline" className="border-primary/40">
            <MessageCircle className="size-4" aria-hidden />
            Open WhatsApp met dit bericht
          </GlowButton>
          {hint ? (
            <p className="text-muted-foreground text-sm leading-relaxed" role="status">
              {hint}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
