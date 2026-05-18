import { localBusinessJsonLd, organizationJsonLd } from "@/lib/seo/schema";

export function JsonLd() {
  const data = [organizationJsonLd(), localBusinessJsonLd()];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
