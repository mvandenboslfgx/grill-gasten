/**
 * Compat-shim: MenuCard verwacht catalogproducten.
 * @deprecated Gebruik menu-pagina / order-flow.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog/types";
import { formatPriceCents } from "@/lib/catalog/products";

type MenuCardProps = {
  item: CatalogProduct;
};

export function MenuCard({ item }: MenuCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
      <div className="relative aspect-[4/3]">
        <Image src={item.imageSrc} alt={item.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex justify-between gap-2">
          <h3 className="font-heading text-xl uppercase text-white">{item.name}</h3>
          <p className="text-[#d4af37] font-semibold">{formatPriceCents(item.priceCents)}</p>
        </div>
        <p className="text-muted-foreground text-sm">{item.description}</p>
        <Link href="/bestellen" className="text-primary text-xs font-bold uppercase tracking-wider hover:underline">
          Bestellen
        </Link>
      </div>
    </article>
  );
}
