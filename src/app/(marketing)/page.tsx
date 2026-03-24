import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { getLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/config";

export default async function HomePage() {
  const locale = await getLocale();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description:
      locale === "fr" ? siteConfig.descriptionFr : siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        name: "Free",
      },
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
      <Hero locale={locale} />
      <Features locale={locale} />
      <Pricing locale={locale} />
      <FAQ locale={locale} />
    </>
  );
}
