"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { whatsappIntentFromPath } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Zwevende WhatsApp — desktop rechtsonder; mobiel boven sticky bar. */
export function FloatingWhatsAppFab() {
  const pathname = usePathname();
  const intent = whatsappIntentFromPath(pathname);

  return (
    <WhatsAppLink
      intent={intent}
      className={cn(
        "fixed z-[55] flex size-14 items-center justify-center rounded-full md:bottom-6",
        "border border-[#25D366]/50 bg-[#25D366] text-white shadow-[0_8px_32px_-4px_rgba(37,211,102,0.55)]",
        "transition hover:brightness-110 active:scale-95",
        "bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] md:bottom-6",
      )}
      ariaLabel="WhatsApp — direct contact met Grill Gasten"
    >
      <MessageCircle className="size-7" strokeWidth={2} aria-hidden />
    </WhatsAppLink>
  );
}
