import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Mobiel: zwevende WhatsApp-knop, boven de catering sticky bar (md+ verborgen). */
export function FloatingWhatsAppFab() {
  return (
    <Link
      href={site.whatsapp}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "fixed z-[60] flex size-14 items-center justify-center rounded-full md:hidden",
        "border border-[#25D366]/50 bg-[#25D366] text-white shadow-[0_8px_32px_-4px_rgba(37,211,102,0.55)]",
        "transition hover:brightness-110 active:scale-95",
        "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
      )}
      aria-label="Open WhatsApp met Grill Gasten"
    >
      <MessageCircle className="size-7" strokeWidth={2} aria-hidden />
    </Link>
  );
}
