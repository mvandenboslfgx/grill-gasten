import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phoneE164,
    email: site.email,
    areaServed: [
      { "@type": "City", name: "Rotterdam" },
      { "@type": "AdministrativeArea", name: "Zuid-Holland" },
      { "@type": "Country", name: "Netherlands" },
    ],
    servesCuisine: ["BBQ", "American", "Street Food"],
    priceRange: "€€",
    sameAs: [site.instagram, site.tiktok, site.whatsapp],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phoneE164,
        contactType: "customer service",
        areaServed: "NL",
        availableLanguage: ["Dutch", "English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "reservations",
        url: getWhatsAppHref("footer"),
      },
    ],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/opengraph-image`,
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
  };
}
