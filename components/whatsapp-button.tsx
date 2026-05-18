"use client";

import { GlowButton } from "@/components/button";
import { getWhatsAppHref, type WhatsAppIntent } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  intent?: WhatsAppIntent;
  variant?: "flame" | "outline";
  className?: string;
  children: React.ReactNode;
};

/** GlowButton met juiste vooringevuld WhatsApp-bericht */
export function WhatsAppButton({
  intent = "home",
  variant = "flame",
  className,
  children,
}: WhatsAppButtonProps) {
  return (
    <GlowButton href={getWhatsAppHref(intent)} variant={variant} className={cn(className)}>
      {children}
    </GlowButton>
  );
}
