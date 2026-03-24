import { Features } from "@/components/landing/features";
import { getLocale } from "@/lib/i18n";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fonctionnalités — 6 Outils IA pour Restaurateurs",
  description: "Menu engineering, descriptions de plats, réponses aux avis, posts réseaux sociaux, traduction de carte et analyse des marges — tout propulsé par l'IA Claude.",
};

export default async function FeaturesPage() {
  const locale = await getLocale();

  return (
    <div className="pt-16">
      <Features locale={locale} />
    </div>
  );
}
