"use client";

import * as React from "react";
import { KitchenBoard } from "@/features/kitchen/kitchen-board";

export default function KitchenPage() {
  const [key, setKey] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const k = sessionStorage.getItem("gg-kitchen-key");
    if (k) {
      setKey(k);
      setSaved(true);
    }
    // Verwijder ?key= uit de URL indien aanwezig
    if (typeof window !== "undefined" && window.location.search.includes("key=")) {
      window.history.replaceState({}, "", "/kitchen");
    }
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("gg-kitchen-key", key);
    setSaved(true);
  }

  if (!saved || !key) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4">
        <form onSubmit={save} className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-[#111] p-8">
          <h1 className="font-heading text-2xl uppercase tracking-wide text-white">Keuken login</h1>
          <p className="text-muted-foreground text-sm">Voer de keukensleutel in (KITCHEN_SECRET op Vercel).</p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#0a0a0a] px-4 py-3 text-white"
            placeholder="Keukensleutel"
            autoComplete="off"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
          >
            Open keukenscherm
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl uppercase tracking-wide text-white">
          Keuken <span className="text-primary">🔥</span>
        </h1>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem("gg-kitchen-key");
            setSaved(false);
            setKey("");
          }}
          className="text-xs uppercase tracking-wider text-muted-foreground hover:text-white"
        >
          Uitloggen
        </button>
      </header>
      <KitchenBoard apiKey={key} />
    </div>
  );
}
