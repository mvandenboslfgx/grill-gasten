"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Mobiele sticky bar: catering-first (hoogste ticket).
 * WhatsApp staat op het zwevende icoon (FloatingWhatsAppFab) — geen dubbele WhatsApp in de bar.
 */
export function MobileStickyCta() {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0a0a]/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden",
        "supports-[backdrop-filter]:bg-[#0a0a0a]/85",
      )}
      role="region"
      aria-label="Catering boeken"
    >
      <div className="mx-auto max-w-lg px-4">
        <Link
          href="/catering#booking"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/55 bg-primary py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_36px_-8px_rgba(255,90,31,0.75)] transition active:scale-[0.99] hover:brightness-110"
        >
          <UtensilsCrossed className="size-4 shrink-0" aria-hidden />
          Catering & offerte
        </Link>
        <p className="text-muted-foreground mt-2 text-center text-[10px] font-medium uppercase tracking-[0.2em]">
          {site.founders} · {site.region}
        </p>
      </div>
    </div>
  );
}
