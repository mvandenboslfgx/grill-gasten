import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { catalogProducts, formatPriceCents } from "@/lib/catalog/products";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}${site.logo}`,
    email: site.email,
    telephone: site.phoneE164,
    founders: site.founders.split(" en ").map((name) => ({
      "@type": "Person",
      name: name.trim(),
    })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneE164,
      email: site.email,
      contactType: "customer service",
    },
    sameAs: [site.instagram, site.tiktok],
  };
}

/** FoodEstablishment zonder fictief adres of reviews. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phoneE164,
    email: site.email,
    areaServed: site.region,
    servesCuisine: ["Burger", "American"],
    priceRange: "€€",
    sameAs: [site.instagram, site.tiktok],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneE164,
      contactType: "customer service",
      areaServed: "NL",
      availableLanguage: ["Dutch"],
      url: getWhatsAppHref("footer"),
    },
  };
}

export function menuJsonLd() {
  const items = catalogProducts
    .filter((p) => p.availability !== "hidden")
    .map((p) => ({
      "@type": "MenuItem",
      name: p.name,
      description: p.description,
      offers: {
        "@type": "Offer",
        price: (p.priceCents / 100).toFixed(2),
        priceCurrency: "EUR",
        availability:
          p.availability === "available"
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
      },
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${site.name} menu`,
    hasMenuSection: {
      "@type": "MenuSection",
      name: "Smashburgers & fries",
      hasMenuItem: items,
    },
  };
}

export { formatPriceCents };
