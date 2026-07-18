"use client";

import { MessageCircle } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { GlowButton } from "@/components/button";

export function FaqContactCta() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#111] p-6 text-center">
      <p className="text-sm text-white/90">Nog een vraag? Neem contact op — wij denken graag met je mee.</p>
      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <WhatsAppLink
          intent="home"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#25D366]/45 bg-[#25D366]/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
        >
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp
        </WhatsAppLink>
        <PhoneLink
          showIcon
          className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
        />
      </div>
      <GlowButton href="/catering" variant="flame" className="w-full sm:w-auto">
        Catering aanvragen
      </GlowButton>
    </div>
  );
}
