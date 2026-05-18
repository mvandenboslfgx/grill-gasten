"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BrandLogo } from "@/components/brand-logo";
import { navLinks, site } from "@/lib/site";
import { GlowButton } from "@/components/button";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";
import { whatsappIntentFromPath } from "@/lib/whatsapp";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const scrolled = useScrolled(24);
  const reduceMotion = useReducedMotion();
  const waIntent = whatsappIntentFromPath(pathname);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent pt-[env(safe-area-inset-top,0px)] transition-colors",
        scrolled && "border-white/10 bg-background/90 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex max-w-6xl min-h-[4rem] items-center justify-between gap-3 px-3 py-3 sm:min-h-[4.5rem] sm:px-4 md:min-h-[5rem] md:px-6 lg:px-8">
        <BrandLogo linked priority size="nav" className="min-w-0 flex-1" />

        <nav
          className="hidden items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.18em] lg:flex lg:gap-6 lg:text-xs lg:tracking-[0.2em] xl:gap-8"
          aria-label="Hoofdnavigatie"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-muted-foreground hover:text-white",
                  active && "text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex lg:gap-3">
          <PhoneLink className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-white xl:inline-flex">
            <Phone className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="whitespace-nowrap">{site.phoneDisplay}</span>
          </PhoneLink>
          <WhatsAppButton intent={waIntent} variant="outline" className="border-primary/35 px-3 text-[10px] sm:px-4 sm:text-xs">
            WhatsApp
          </WhatsAppButton>
          <GlowButton href="/catering#booking" variant="flame" className="px-4 text-[10px] sm:px-7 sm:text-sm">
            Boek ons
          </GlowButton>
        </div>

        <button
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white active:scale-95 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            className="max-h-[min(78dvh,32rem)] overflow-y-auto border-t border-white/10 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="mb-4 flex justify-center border-b border-white/10 pb-5">
                <BrandLogo linked size="footer" className="mx-auto justify-center" imageClassName="!object-center" />
              </div>
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-3 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white active:bg-white/5",
                      active && "bg-white/[0.06] text-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-5">
                <PhoneLink
                  showIcon
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                />
                <WhatsAppButton
                  intent={waIntent}
                  variant="outline"
                  className="min-h-12 w-full border-primary/35 justify-center"
                >
                  WhatsApp
                </WhatsAppButton>
                <GlowButton href="/catering#booking" variant="flame" className="min-h-12 w-full">
                  Boek direct
                </GlowButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
