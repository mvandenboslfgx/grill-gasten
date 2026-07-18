"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlowButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "flame" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function GlowButton({
  href,
  children,
  className,
  variant = "flame",
  type = "button",
  disabled,
  onClick,
}: GlowButtonProps) {
  const reduceMotion = useReducedMotion();
  const fullWidth = Boolean(className?.includes("w-full"));

  const base =
    "relative inline-flex min-h-12 max-w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:tracking-[0.1em]";

  const styles =
    variant === "flame"
      ? "bg-primary text-primary-foreground shadow-[0_0_40px_-10px_rgba(255,90,31,0.85)] hover:brightness-110 hover:shadow-[0_0_52px_-6px_rgba(255,90,31,0.95)]"
      : "border border-white/15 bg-white/5 text-white backdrop-blur hover:border-primary/50 hover:bg-white/[0.1] hover:shadow-[0_0_32px_-12px_rgba(255,90,31,0.4)]";

  const content = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,90,31,0.55), transparent 55%)",
        }}
      />
      <span className="relative whitespace-nowrap">{children}</span>
    </>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <motion.div
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        className={cn("inline-flex max-w-full", fullWidth && "w-full")}
      >
        <Link
          href={href}
          className={cn(
            base,
            styles,
            !reduceMotion && "animate-glow-pulse",
            fullWidth && "w-full",
            className,
          )}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className={cn(
        base,
        styles,
        !reduceMotion && "animate-glow-pulse",
        fullWidth && "w-full",
        className,
      )}
    >
      {content}
    </motion.button>
  );
}

export { Button, buttonVariants } from "@/components/ui/button";
