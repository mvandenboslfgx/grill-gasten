"use client";

import * as React from "react";
import { KitchenBoard } from "@/features/kitchen/kitchen-board";

export default function KitchenPage() {
  const [authed, setAuthed] = React.useState(false);
  const [key, setKey] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    // Strip legacy ?key= from URL (never use query secrets)
    if (typeof window !== "undefined" && window.location.search.includes("key=")) {
      window.history.replaceState({}, "", "/kitchen");
    }
    // Probe kitchen API with cookie credentials
    void fetch("/api/kitchen/orders", { credentials: "include", cache: "no-store" })
      .then((r) => {
        if (r.ok) setAuthed(true);
      })
      .finally(() => setChecking(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/kitchen/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Login mislukt.");
        return;
      }
      setKey("");
      setAuthed(true);
    } catch {
      setError("Login mislukt.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/kitchen/session", { method: "DELETE", credentials: "include" });
    setAuthed(false);
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-muted-foreground">
        Laden…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4">
        <form
          onSubmit={save}
          className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-[#111] p-8"
        >
          <h1 className="font-heading text-2xl uppercase tracking-wide text-white">Keuken login</h1>
          <p className="text-muted-foreground text-sm">
            Voer de keukensleutel in (KITCHEN_SECRET, minimaal 32 tekens). De sleutel wordt niet in
            de browser bewaard — alleen een beveiligde sessiecookie.
          </p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#0a0a0a] px-4 py-3 text-white"
            placeholder="Keukensleutel"
            autoComplete="current-password"
            required
            minLength={32}
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Bezig…" : "Open keukenscherm"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl uppercase tracking-[0.04em] text-white">
          Keukenscherm
        </h1>
        <button
          type="button"
          onClick={() => void logout()}
          className="text-xs uppercase tracking-wider text-muted-foreground hover:text-white"
        >
          Uitloggen
        </button>
      </header>
      <KitchenBoard />
    </div>
  );
}
