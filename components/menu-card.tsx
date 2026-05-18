"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/data/menu";

type MenuCardProps = {
  item: MenuItem;
};

export function MenuCard({ item }: MenuCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <Card className="group h-full overflow-hidden border-white/10 bg-gradient-to-b from-[#151515] to-[#0c0c0c] shadow-[0_24px_70px_-40px_rgba(255,90,31,0.45)] transition hover:border-primary/35">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {item.popular ? (
              <Badge className="border border-primary/40 bg-primary/15 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Meest gekozen
              </Badge>
            ) : null}
            {item.spicy ? (
              <Badge
                variant="outline"
                className="border-white/15 bg-white/5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white"
              >
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3 text-primary" aria-hidden />
                  Spicy{" "}
                  <span className="text-muted-foreground">
                    {"·".repeat(item.spicy)}
                  </span>
                </span>
              </Badge>
            ) : null}
          </div>
          <div>
            <h3 className="font-heading text-2xl tracking-wide text-white uppercase">
              {item.name}
            </h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        </CardHeader>
        <CardFooter className="border-t border-white/10 pt-4">
          <p
            className={cn(
              "font-heading text-2xl tracking-wide text-primary",
              "transition group-hover:text-white",
            )}
          >
            {item.price}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
