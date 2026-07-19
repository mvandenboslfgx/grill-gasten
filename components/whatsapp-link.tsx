"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getWhatsAppHref,
  type WhatsAppIntent,
  whatsappIntentFromPath,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type WhatsAppLinkProps = {
  intent?: WhatsAppIntent;
  className?: string;
  children: React.ReactNode;
  /** Alleen zetten voor icon-only links; bij zichtbare tekst weglaten. */
  ariaLabel?: string;
};

export function WhatsAppLink({ intent, className, children, ariaLabel }: WhatsAppLinkProps) {
  const pathname = usePathname();
  const resolvedIntent = intent ?? whatsappIntentFromPath(pathname);
  const href = getWhatsAppHref(resolvedIntent);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
    >
      {children}
    </Link>
  );
}
