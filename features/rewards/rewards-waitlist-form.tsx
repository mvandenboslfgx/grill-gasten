"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { GlowButton } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RewardsWaitlistForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    const fd = new FormData(form);

    try {
      let res = await fetch("/api/rewards/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          website: String(fd.get("website") ?? ""),
        }),
      });

      if (res.status >= 500) {
        res = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "rewards",
            name: String(fd.get("name") ?? ""),
            email: String(fd.get("email") ?? ""),
            phone: String(fd.get("phone") ?? ""),
            message: "Aanmelding Grill Rewards waitlist",
            website: String(fd.get("website") ?? ""),
          }),
        });
      }
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-2xl border border-primary/40 bg-primary/[0.08] p-4 text-sm text-white">
        Je staat op de lijst — we mailen je zodra Grill Rewards live gaat.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rw-name">Naam</Label>
          <Input id="rw-name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rw-email">E-mail</Label>
          <Input id="rw-email" name="email" type="email" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rw-phone">Telefoon (optioneel)</Label>
        <Input id="rw-phone" name="phone" type="tel" />
      </div>
      {status === "error" ? (
        <p className="text-sm text-red-300">Verzenden mislukt — probeer later opnieuw.</p>
      ) : null}
      <GlowButton type="submit" variant="flame" disabled={status === "loading"}>
        {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : "Meld me aan"}
      </GlowButton>
    </form>
  );
}
