"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BrandLogo } from "@/components/brand-logo";
import { navLinks } from "@/lib/site";
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
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const mobileNavRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const firstLink = mobileNavRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent pt-[env(safe-area-inset-top,0px)] transition-colors",
        scrolled && "border-white/10 bg-background/90 backdrop-blur-xl",
      )}
    >
      <div
        className={cn(
          "mx-auto grid h-[var(--site-header-height)] w-full min-w-0 max-w-6xl items-center gap-3 px-4 sm:px-5 md:px-6 lg:px-8",
          "grid-cols-[auto_minmax(0,1fr)_auto]",
        )}
      >
        <BrandLogo linked priority size="nav" className="shrink-0 justify-self-start" />

        <nav
          className="hidden min-w-0 items-center justify-center gap-5 text-xs font-semibold uppercase tracking-[0.08em] xl:flex 2xl:gap-7"
          aria-label="Hoofdnavigatie"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative shrink-0 whitespace-nowrap text-muted-foreground transition-colors hover:text-white",
                  active && "text-primary",
                )}
              >
                {link.label}
                {active ? (
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Mid: Bestel nu naast hamburger — niet op kleinste telefoons */}
        <div className="flex shrink-0 items-center justify-end gap-2 justify-self-end sm:gap-3">
          <GlowButton
            href="/bestellen"
            variant="flame"
            className="hidden px-4 text-xs sm:inline-flex xl:hidden"
          >
            Bestel nu
          </GlowButton>

          <div className="hidden shrink-0 items-center gap-2 xl:flex xl:gap-3">
            <WhatsAppButton
              intent={waIntent}
              variant="outline"
              className="border-primary/35 px-4 text-xs tracking-[0.08em]"
            >
              WhatsApp
            </WhatsAppButton>
            <GlowButton href="/bestellen" variant="flame" className="px-5 text-xs">
              Bestel nu
            </GlowButton>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white active:scale-95 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            ref={mobileNavRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobiel menu"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            className="w-full overflow-y-auto border-t border-white/10 bg-background/98 backdrop-blur-xl xl:hidden"
            style={{ maxHeight: "min(calc(100dvh - var(--site-header-height) - env(safe-area-inset-top, 0px)), 36rem)" }}
          >
            <div className="flex w-full min-w-0 flex-col gap-1 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-3 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white active:bg-white/5",
                      active && "bg-white/[0.06] text-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-5">
                <GlowButton href="/bestellen" variant="flame" className="min-h-12 w-full">
                  Bestel nu
                </GlowButton>
                <WhatsAppButton
                  intent={waIntent}
                  variant="outline"
                  className="min-h-12 w-full justify-center border-primary/35 tracking-[0.08em]"
                >
                  WhatsApp
                </WhatsAppButton>
                <PhoneLink
                  showIcon
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold uppercase tracking-[0.08em] text-white"
                >
                  Bellen
                </PhoneLink>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
