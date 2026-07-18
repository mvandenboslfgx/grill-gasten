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

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMsg(null);

    const fd = new FormData(form);
    const payload = {
      type: "contact" as const,
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
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
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Geen verbinding. Probeer WhatsApp of bel direct.");
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-6" role="status">
        <div className="rounded-2xl border border-primary/40 bg-primary/[0.08] p-6">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.28em]">Verzonden</p>
          <p className="mt-3 text-sm leading-relaxed text-white">
            Bedankt — we hebben je bericht ontvangen op {site.email}.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink
            intent="contact"
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
      <div className="rounded-2xl border border-primary/35 bg-primary/[0.07] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Direct</p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          WhatsApp of bellen voor de snelste reactie. Of mail via het formulier naar {site.email}.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink
            intent="contact"
            className="relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-primary-foreground sm:w-auto sm:tracking-[0.1em]"
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
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Naam *</Label>
            <Input id="contact-name" name="name" required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Telefoon</Label>
            <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">E-mail *</Label>
          <Input id="contact-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject">Onderwerp</Label>
          <Input id="contact-subject" name="subject" placeholder="Samenwerking / vraag" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-message">Bericht *</Label>
          <Textarea id="contact-message" name="message" rows={5} required placeholder="Waar kunnen we mee helpen?" />
        </div>

        {errorMsg ? <FormSubmitError message={errorMsg} whatsappIntent="contact" /> : null}

        <GlowButton type="submit" variant="outline" disabled={status === "loading"} className="border-primary/40 w-full sm:w-auto">
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Verzenden…
            </>
          ) : (
            "Verstuur bericht"
          )}
        </GlowButton>
      </form>
    </div>
  );
}
