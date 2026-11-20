import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

const pageUrl = `${siteConfig.url}/seo/analyse-marge-restaurant`;
const updated = "2026-11-20";

export const metadata: Metadata = {
  title: "Marge d’un plat de restaurant : calcul et exemple",
  description:
    "Calculez la marge brute d’un plat à partir de son prix de vente HT et de son coût matière. Exemple pas à pas et méthode pour comparer les plats.",
  alternates: { canonical: pageUrl },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Marge d’un plat de restaurant : calcul et exemple",
  description: metadata.description,
  inLanguage: "fr",
  url: pageUrl,
  mainEntityOfPage: pageUrl,
  dateModified: updated,
  author: { "@type": "Organization", name: "IA Restaurant", url: siteConfig.url },
  publisher: { "@type": "Organization", name: "IA Restaurant", url: siteConfig.url },
};

export default function AnalyseMargeRestaurantPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <nav aria-label="Fil d’Ariane" className="mb-6 text-sm text-text-muted">
          <Link href="/" className="hover:text-neon transition-colors">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">Marge d’un plat</span>
        </nav>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          <span className="gradient-text">Marge d’un plat de restaurant : calculer et comparer</span>
        </h1>
        <p className="mt-4 text-sm text-text-muted">Mis à jour le 20 novembre 2026 · Exemple pédagogique</p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary">
          <p>
            Pour comparer la rentabilité matière de deux plats, partez de leurs prix de vente hors taxes et de leurs coûts matière. La différence entre ces deux montants donne la marge brute matière en euros. Rapportée au prix de vente HT, elle donne le taux de marge brute matière. Ce calcul porte sur les ingrédients : il ne déduit pas le travail, le loyer, l’énergie ni les autres charges de l’établissement.
          </p>

          <section aria-labelledby="formule" className="card p-6">
            <h2 id="formule" className="text-xl font-bold text-text-primary">La formule</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Marge brute matière (€) = prix de vente HT − coût matière de la portion.</li>
              <li>Taux de marge brute matière (%) = marge brute matière ÷ prix de vente HT × 100.</li>
              <li>Taux de coût matière (%) = coût matière ÷ prix de vente HT × 100.</li>
            </ul>
          </section>

          <section aria-labelledby="exemple">
            <h2 id="exemple" className="text-2xl font-bold text-text-primary">Exemple détaillé, avec des nombres fictifs</h2>
            <p className="mt-3">Supposons un plat vendu 18 € HT, dont les ingrédients pour une portion coûtent 5,40 € HT. Ces montants sont uniquement un exemple de calcul, pas une moyenne ni une recommandation de prix.</p>
            <ol className="mt-4 list-decimal space-y-2 pl-5">
              <li>Soustrayez le coût matière : 18 − 5,40 = 12,60 € de marge brute matière par portion.</li>
              <li>Divisez par le prix HT : 12,60 ÷ 18 = 0,70.</li>
              <li>Multipliez par 100 : le taux de marge brute matière de cet exemple est de 70 % ; son taux de coût matière est de 30 %.</li>
            </ol>
            <p className="mt-3">Pour fiabiliser le coût, additionnez les quantités réellement utilisées, y compris garniture, assaisonnement et pertes de préparation retenues dans votre fiche technique. Utilisez des montants comparables, sur une même base HT.</p>
          </section>

          <section aria-labelledby="comparer">
            <h2 id="comparer" className="text-2xl font-bold text-text-primary">Comparer les plats sans tirer de conclusion trop vite</h2>
            <p className="mt-3">Un taux élevé ne suffit pas à choisir le plat à mettre en avant : il faut aussi regarder combien de portions sont vendues et ce que chaque vente apporte en euros. Complétez donc le calcul unitaire par les ventes sur une période cohérente. Une fiche technique par portion aide à garder les prix d’achat et quantités à jour. La CCI décrit cette fiche comme un moyen de déterminer le coût du produit et de le comparer au prix de vente.</p>
            <p className="mt-3">La marge matière n’est pas le bénéfice net du restaurant. Elle ne couvre pas à elle seule les salaires, le loyer, les frais de livraison ou les autres charges. Les indicateurs de marge varient selon ce qu’ils incluent : Bpifrance Création distingue notamment marge sur consommation de matières, marge commerciale, marge brute et marge opérationnelle. Comparez donc des indicateurs définis de la même façon.</p>
          </section>

          <section aria-labelledby="outil" className="card neon-border p-6">
            <h2 id="outil" className="text-2xl font-bold text-text-primary">Analyser plusieurs plats avec IA Restaurant</h2>
            <p className="mt-3">L’outil d’analyse des marges du tableau de bord permet de saisir le nom, le prix, le coût matière et la catégorie de plusieurs plats, puis de demander une analyse. Vérifiez les données d’entrée et relisez les pistes générées : elles ne remplacent ni votre comptabilité ni le calcul des charges complètes.</p>
            <Link href="/sign-up" className="btn-primary mt-5 inline-flex">Découvrir l’outil</Link>
            <p className="mt-3 text-sm">Pour travailler le prix de vente à partir du coût matière, consultez aussi le <Link href="/seo/comment-fixer-prix-plat-restaurant" className="text-neon underline">guide sur la fixation du prix d’un plat</Link>.</p>
          </section>

          <section aria-labelledby="sources">
            <h2 id="sources" className="text-2xl font-bold text-text-primary">Sources et méthode</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><a className="text-neon underline" href="https://bpifrance-creation.fr/activites-reglementees/restaurant-traditionnel">Bpifrance Création, « Restaurant traditionnel »</a> : repères et définitions des différents indicateurs de marge.</li>
              <li><a className="text-neon underline" href="https://www.business-builder.cci.fr/guide-creation/le-previsionnel-financier/le-chiffre-daffaires-les-achats-et-les-stocks">CCI Business Builder, « Le chiffre d’affaires, les achats et les stocks »</a> : fiche technique, coût par portion et comparaison avec le prix de vente.</li>
            </ul>
            <p className="mt-3 text-sm">L’exemple numérique de cette page est construit pour illustrer la formule ; ce n’est pas une donnée issue de ces sources.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
