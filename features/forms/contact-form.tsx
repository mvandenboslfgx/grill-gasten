"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlowButton } from "@/components/button";
import { site } from "@/lib/site";
import { whatsappUrlWithPrefilledText } from "@/lib/whatsapp";

function buildContactMessage(fd: FormData): string {
  const name = String(fd.get("name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const subject = String(fd.get("subject") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();

  const lines = [
    "Bericht via grillgasten.eu (contactformulier)",
    "",
    `Naam: ${name || "—"}`,
    `E-mail: ${email || "—"}`,
    `Onderwerp: ${subject || "—"}`,
    "",
    message || "—",
  ];
  return lines.join("\n");
}

export function ContactForm() {
  const [hint, setHint] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    if (!name || !message) {
      setHint("Vul minimaal je naam en je bericht in — of gebruik de WhatsApp-knop hierboven.");
      return;
    }
    const text = buildContactMessage(fd);
    const url = whatsappUrlWithPrefilledText(site.whatsapp, text);
    window.open(url, "_blank", "noopener,noreferrer");
    setHint(
      `Geen WhatsApp? Mail ${site.email} — dan lezen wij het daar.`,
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-primary/35 bg-primary/[0.07] p-5 shadow-[0_0_40px_-18px_rgba(255,90,31,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Primair contact</p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Voor boekingen en snelle vragen: WhatsApp. Persoonlijk en zonder wachtrij in een inbox.
        </p>
        <div className="mt-4">
          <GlowButton href={site.whatsapp} variant="flame" className="w-full sm:w-auto">
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp — {site.name}
          </GlowButton>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.22em]">
          Optioneel — bericht klaarzetten in WhatsApp
        </p>
        <form onSubmit={onSubmit} className="mt-4 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Naam</Label>
              <Input id="name" name="name" required placeholder="Jouw naam" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="you@domain.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Onderwerp</Label>
            <Input id="subject" name="subject" placeholder="Samenwerking / vraag" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Bericht</Label>
            <Textarea id="message" name="message" rows={5} required placeholder="Vertel ons wat je zoekt…" />
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
