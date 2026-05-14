"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

const defaultVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

type AnimatedContainerProps = HTMLMotionProps<"div"> & {
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number | "some" | "all";
};

export function AnimatedContainer({
  className,
  delay = 0,
  once = true,
  amount = 0.35,
  children,
  ...props
}: AnimatedContainerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={{ once, amount }}
      transition={{
        duration: reduceMotion ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
        delay: reduceMotion ? 0 : delay,
      }}
      variants={defaultVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
