import type { Metadata } from "next";
import { AnimatedContainer } from "@/components/animated-container";
import { MenuCard } from "@/components/menu-card";
import { SectionTitle } from "@/components/section-title";
import { menuItems, type MenuCategory } from "@/lib/data/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Smashburgers, loaded fries, snacks en drinks — het Grill Gasten menu. Foodtruck Hoeksche Waard, inzetbaar door heel Nederland.",
};

const order: MenuCategory[] = ["Smash Burgers", "Loaded Fries", "Snacks", "Drinks"];

export default function MenuPage() {
  return (
    <div className="border-t border-white/10 bg-[#080808] pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl space-y-14 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Menu"
            title="Eet luid"
            description="Prijzen zijn indicatief — check onze socials of WhatsApp voor de actuele line-up op jouw event."
          />
        </AnimatedContainer>

        {order.map((category) => {
          const items = menuItems.filter((i) => i.category === category);
          return (
            <section key={category} className="space-y-8">
              <AnimatedContainer>
                <h2 className="font-heading text-3xl tracking-wide text-white uppercase md:text-4xl">
                  {category}
                </h2>
              </AnimatedContainer>
              <div className="grid gap-6 md:grid-cols-2">
                {items.map((item, index) => (
                  <AnimatedContainer key={item.id} delay={index * 0.04}>
                    <MenuCard item={item} />
                  </AnimatedContainer>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
