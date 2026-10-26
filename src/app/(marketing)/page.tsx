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
      {/* BEGIN EDITORIAL */}
      <section aria-labelledby="editorial-title" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 id="editorial-title" className="text-2xl font-bold text-text-primary">À la une</h2>
        <article className="mt-4 card p-6">
          <p className="text-sm text-text-muted">Guide · 26 octobre 2026</p>
          <h3 className="mt-2 text-xl font-semibold text-text-primary">
            <a href="/guides/chantage-avis-google-restaurant" className="hover:text-neon transition-colors">Chantage aux avis Google : préparer le bon signalement</a>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">Une demande d’argent pour retirer des avis négatifs ? Identifiez le bon canal Google, rassemblez les preuves et distinguez les protections annoncées en avril 2026 de la procédure accessible aujourd’hui.</p>
          <a href="/guides/chantage-avis-google-restaurant" className="mt-4 inline-block text-sm font-medium text-neon underline">Lire le guide pratique</a>
        </article>
      </section>
      {/* END EDITORIAL */}
    </>
  );
}
