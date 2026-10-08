import { MemoryLanding } from "@/components/memory/landing";
import { siteConfig } from "@/lib/config";

export default async function HomePage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description:
      siteConfig.descriptionFr,
    url: siteConfig.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        price: "29",
        priceCurrency: "EUR",
        name: "Pro",
        billingIncrement: "P1M",
      },
      {
        "@type": "Offer",
        price: "79",
        priceCurrency: "EUR",
        name: "Business",
        billingIncrement: "P1M",
      },
    ],
    creator: {
      "@type": "Organization",
      name: "Kipdev",
      url: "https://www.pappers.fr/entreprise/kipdev-884120890",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MemoryLanding />
    </>
  );
}
