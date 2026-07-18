import { localBusinessJsonLd, menuJsonLd, organizationJsonLd } from "@/lib/seo/schema";

export function JsonLd() {
  const data = [organizationJsonLd(), localBusinessJsonLd(), menuJsonLd()];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
