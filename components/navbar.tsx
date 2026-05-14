"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { GlowButton } from "@/components/button";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/use-scrolled";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const scrolled = useScrolled(24);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors",
        scrolled && "border-white/10 bg-background/80 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="font-heading text-2xl tracking-[0.08em] text-white uppercase">
            Grill{" "}
            <span className="text-primary transition-colors group-hover:text-white">
              Gasten
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.22em] md:flex">
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

        <div className="hidden items-center gap-3 md:flex">
          <GlowButton href={site.whatsapp} variant="outline" className="border-primary/35 px-4 text-xs">
            WhatsApp
          </GlowButton>
          <GlowButton href="/catering" variant="flame">
            Boek ons
          </GlowButton>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-[0.2em] text-white"
                >
                  {link.label}
                </Link>
              ))}
              <GlowButton href={site.whatsapp} variant="outline" className="border-primary/35">
                WhatsApp
              </GlowButton>
              <GlowButton href="/catering" variant="flame">
                Boek {site.name}
              </GlowButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
