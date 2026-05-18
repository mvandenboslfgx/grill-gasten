"use client";

import * as React from "react";
import { Loader2, MessageCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlowButton } from "@/components/button";
import { PhoneLink } from "@/components/phone-link";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { FormSubmitError } from "@/features/forms/form-submit-error";
import { INQUIRY_FALLBACK_ERROR } from "@/lib/inquiry-errors";
import { site } from "@/lib/site";

const EVENT_TYPES = [
  "Festival",
  "Bedrijfsfeest",
  "Bruiloft",
  "Privéfeest",
  "Foodtruck op locatie",
  "Anders",
] as const;

type FormStatus = "idle" | "loading" | "success" | "error";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-[#0a0a0a] px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CateringBookingForm() {
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      type: "booking" as const,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      eventType: String(fd.get("eventType") ?? ""),
      location: String(fd.get("location") ?? ""),
      date: String(fd.get("date") ?? ""),
      guests: String(fd.get("guests") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? INQUIRY_FALLBACK_ERROR);
        return;
      }

      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Geen verbinding. Probeer WhatsApp of bel direct.");
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-6" role="status">
          <div className="rounded-2xl border border-primary/40 bg-primary/[0.08] p-6">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.28em]">Aanvraag verzonden</p>
          <p className="mt-3 text-sm leading-relaxed text-white">
            Bedankt — je boekingsaanvraag is bij {site.email} binnen. Mike en Matthijs nemen contact op.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink
            intent="catering"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#25D366]/45 bg-[#25D366]/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </WhatsAppLink>
          <PhoneLink className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white">
            <Phone className="size-4 text-primary" aria-hidden />
            {site.phoneDisplay}
          </PhoneLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-primary/35 bg-primary/[0.07] p-5 shadow-[0_0_40px_-18px_rgba(255,90,31,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Snelste route</p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          WhatsApp of bellen — Mike en Matthijs reageren het snelst. Of stuur hieronder een officiële offerte-aanvraag naar{" "}
          {site.email}.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink
            intent="catering"
            className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_0_40px_-10px_rgba(255,90,31,0.85)] transition hover:brightness-110 sm:w-auto"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </WhatsAppLink>
          <PhoneLink
            showIcon
            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white sm:w-auto"
          />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.22em]">
          Offerte per e-mail
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="booking-name">Naam *</Label>
            <Input
              id="booking-name"
              name="name"
              required
              autoComplete="name"
              placeholder="Jouw naam"
              className="min-w-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-phone">Telefoonnummer *</Label>
            <Input
              id="booking-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder={site.phoneDisplay}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-email">E-mail *</Label>
          <Input
            id="booking-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jij@bedrijf.nl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-eventType">Type event *</Label>
          <select id="booking-eventType" name="eventType" required className={selectClass} defaultValue="">
            <option value="" disabled>
              Kies type event
            </option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="booking-location">Locatie *</Label>
            <Input id="booking-location" name="location" required placeholder="Stad / adres" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-date">Datum *</Label>
            <Input id="booking-date" name="date" type="date" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-guests">Aantal personen *</Label>
          <Input id="booking-guests" name="guests" inputMode="numeric" required placeholder="Bijv. 150" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-message">Bericht</Label>
          <Textarea
            id="booking-message"
            name="message"
            rows={5}
            placeholder="Vertel over je event, timing, dieetwensen of gewenste sfeer…"
          />
        </div>

        {errorMsg ? <FormSubmitError message={errorMsg} whatsappIntent="catering" /> : null}

        <GlowButton type="submit" variant="flame" disabled={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Verzenden…
            </>
          ) : (
            "Vraag offerte aan"
          )}
        </GlowButton>
      </form>
    </div>
  );
}
