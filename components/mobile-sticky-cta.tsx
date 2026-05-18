"use client";

import { MessageCircle } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { cn } from "@/lib/utils";

/** Mobiele sticky bar: WhatsApp + Bel direct */
export function MobileStickyCta() {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0a0a0a]/95 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl md:hidden",
        "supports-[backdrop-filter]:bg-[#0a0a0a]/88",
      )}
      role="region"
      aria-label="Snel contact"
    >
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2.5 px-3">
        <WhatsAppLink
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#25D366]/45 bg-[#25D366]/15 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition active:scale-[0.98] hover:bg-[#25D366]/25"
        >
          <MessageCircle className="size-4 shrink-0 text-[#25D366]" aria-hidden />
          WhatsApp
        </WhatsAppLink>
        <PhoneLink
          variant="compact"
          showIcon
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition active:scale-[0.98] hover:border-primary/40 hover:bg-white/10"
        />
      </div>
    </div>
  );
}
