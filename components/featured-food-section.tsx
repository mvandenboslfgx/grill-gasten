/**
 * @deprecated Homepage gebruikt PopularDishesSection.
 */
import Image from "next/image";
import Link from "next/link";
import { AnimatedContainer } from "@/components/animated-container";
import { getFeaturedProducts, formatPriceCents } from "@/lib/catalog/products";

export function FeaturedFoodSection() {
  const items = getFeaturedProducts();
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <AnimatedContainer key={item.id} delay={index * 0.05}>
            <Link href="/bestellen" className="block overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
              <div className="relative aspect-[4/3]">
                <Image src={item.imageSrc} alt={item.name} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="p-4">
                <p className="font-heading text-lg uppercase text-white">{item.name}</p>
                <p className="text-[#d4af37] text-sm">{formatPriceCents(item.priceCents)}</p>
              </div>
            </Link>
          </AnimatedContainer>
        ))}
      </div>
    </section>
  );
}
