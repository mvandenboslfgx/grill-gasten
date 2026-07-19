"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const defaultVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

type AnimatedContainerProps = {
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  children?: React.ReactNode;
  /** Use `li` when wrapping list items so `<ul>`/`<ol>` stays valid. */
  as?: "div" | "li";
};

export function AnimatedContainer({
  className,
  delay = 0,
  once = true,
  amount = 0.35,
  children,
  as = "div",
}: AnimatedContainerProps) {
  const reduceMotion = useReducedMotion();
  const motionProps = {
    className: cn(className),
    initial: reduceMotion ? false : ("hidden" as const),
    whileInView: reduceMotion ? undefined : ("show" as const),
    viewport: { once, amount },
    transition: {
      duration: reduceMotion ? 0 : 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: reduceMotion ? 0 : delay,
    },
    variants: defaultVariants,
  };

  if (as === "li") {
    return <motion.li {...motionProps}>{children}</motion.li>;
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}
