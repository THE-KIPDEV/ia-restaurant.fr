import { Pricing } from "@/components/landing/pricing";
import { getLocale } from "@/lib/i18n";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs — Plans et Jetons",
  description: "Découvrez nos tarifs : plan gratuit 50 jetons/mois, Pro à 29€/mois (2 000 jetons), Business à 79€/mois (10 000 jetons). Packs de jetons supplémentaires disponibles.",
};

export default async function PricingPage() {
  const locale = await getLocale();

  return (
    <div className="pt-16">
      <Pricing locale={locale} />
    </div>
  );
}
