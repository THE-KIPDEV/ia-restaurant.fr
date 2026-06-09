import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BarChart3, ChefHat, MessageSquare, TrendingUp, Languages, Share2 } from "lucide-react";
import { siteConfig } from "@/lib/config";

const seoPages: Record<string, {
  title: string;
  h1: string;
  description: string;
  content: string[];
  features: string[];
}> = {
  "ia-restaurant-paris": {
    title: "IA Restaurant Paris — Intelligence Artificielle pour Restaurants Parisiens",
    h1: "L'IA au service des restaurants parisiens",
    description: "Optimisez votre restaurant à Paris avec l'intelligence artificielle. Menu engineering, analyse des marges, descriptions de plats et gestion des avis automatisée.",
    content: [
      "Paris compte plus de 40 000 restaurants. Dans un marché aussi compétitif, chaque avantage compte. L'intelligence artificielle permet aux restaurateurs parisiens d'optimiser leur carte, d'analyser leurs marges et de gérer leur réputation en ligne de manière automatisée.",
      "Avec IA Restaurant, accédez à des outils d'analyse puissants propulsés par Claude, l'IA d'Anthropic. Que vous gériez un bistrot dans le Marais, un restaurant gastronomique dans le 8ème ou une brasserie à Montmartre, nos outils s'adaptent à votre cuisine et votre clientèle.",
      "Le menu engineering vous permet de classer chaque plat de votre carte selon la matrice BCG : Stars (haute marge + haute popularité), Puzzles (haute marge, basse popularité), Plowhorses (basse marge, haute popularité) et Dogs (basse marge + basse popularité). Cette analyse vous donne des recommandations concrètes pour augmenter votre rentabilité.",
    ],
    features: ["Menu Engineering BCG", "Analyse des marges par plat", "Descriptions de plats IA", "Réponses aux avis Google/TripAdvisor", "Traduction de carte multilingue", "Posts Instagram/Facebook/TikTok"],
  },
  "intelligence-artificielle-restauration": {
    title: "Intelligence Artificielle et Restauration — Le Guide Complet 2026",
    h1: "Comment l'IA révolutionne la restauration en 2026",
    description: "Découvrez comment l'intelligence artificielle transforme la restauration : menu engineering, analyse de marges, gestion des avis et marketing automatisé.",
    content: [
      "L'intelligence artificielle transforme profondément le secteur de la restauration. De l'optimisation des cartes à la gestion de la réputation en ligne, l'IA offre des outils puissants pour augmenter la rentabilité et améliorer l'expérience client.",
      "Le menu engineering assisté par IA analyse simultanément les marges, la popularité et le positionnement de chaque plat. En quelques secondes, l'IA identifie vos Stars (plats à promouvoir), vos Puzzles (plats à repositionner), vos Plowhorses (plats à optimiser) et vos Dogs (plats à retirer ou repenser).",
      "La gestion des avis clients est l'un des domaines où l'IA apporte le plus de valeur. Répondre à chaque avis Google, TripAdvisor ou TheFork prend un temps considérable. L'IA génère des réponses personnalisées, professionnelles et adaptées au ton de chaque situation en quelques secondes.",
    ],
    features: ["Analyse automatisée de carte", "Calcul de marges instantané", "Génération de descriptions", "Réponses aux avis personnalisées", "Traduction multilingue", "Content marketing IA"],
  },
  "menu-engineering-ia": {
    title: "Menu Engineering IA — Optimisez votre carte avec l'intelligence artificielle",
    h1: "Menu Engineering propulsé par l'IA",
    description: "Utilisez la matrice BCG et l'intelligence artificielle pour optimiser votre carte de restaurant. Identifiez vos Stars, Puzzles, Plowhorses et Dogs.",
    content: [
      "Le menu engineering est une discipline essentielle de la gestion de restaurant. Elle consiste à analyser chaque plat de votre carte selon deux axes : sa marge bénéficiaire et sa popularité auprès des clients. Cette analyse permet de classer chaque plat dans l'une des quatre catégories de la matrice BCG.",
      "Les Stars sont vos plats les plus rentables et les plus populaires. Ce sont les champions de votre carte : haute marge et forte demande. L'IA vous aide à identifier ces plats et vous suggère de les mettre en avant dans votre carte, sur vos réseaux sociaux et dans votre communication.",
      "Les Puzzles ont une marge élevée mais une faible popularité. L'IA analyse pourquoi ces plats ne se vendent pas bien et propose des solutions : repositionnement dans la carte, nouvelle description, changement de prix ou de présentation.",
      "Les Plowhorses sont populaires mais peu rentables. L'IA calcule précisément la marge de chaque plat et suggère des ajustements : réduction des portions, substitution d'ingrédients coûteux, ou légère augmentation de prix. Les Dogs sont à la fois peu populaires et peu rentables : l'IA recommande leur retrait ou une refonte complète.",
    ],
    features: ["Matrice BCG automatisée", "Score de santé du menu (0-100)", "Recommandations concrètes", "Suggestions de repricing", "Analyse par catégorie", "Export des résultats"],
  },
  "analyse-marge-restaurant": {
    title: "Analyse des Marges Restaurant — Calculateur IA de Rentabilité",
    h1: "Analysez et optimisez vos marges avec l'IA",
    description: "Calculez la marge de chaque plat de votre restaurant avec l'IA. Identifiez les plats les plus et les moins rentables et recevez des recommandations.",
    content: [
      "La marge brute d'un plat est l'indicateur clé de la rentabilité de votre restaurant. En moyenne, un restaurant doit viser une marge brute de 65 à 75% sur les plats. Mais chaque plat est différent, et sans analyse précise, il est impossible d'optimiser sa carte.",
      "Notre outil d'analyse des marges propulsé par l'IA Claude va bien au-delà d'un simple calculateur. Il analyse la structure de vos coûts par catégorie, identifie les plats dont la marge est dangereusement basse (moins de 30%), met en lumière vos meilleurs performers (marge supérieure à 70%) et propose des recommandations concrètes pour améliorer votre rentabilité globale.",
      "L'IA estime également l'impact financier de chaque recommandation, vous permettant de prioriser les actions les plus rentables. Augmenter le prix d'un plat de 1€ ? Changer un ingrédient coûteux ? Réduire la portion d'un accompagnement ? L'IA calcule tout pour vous.",
    ],
    features: ["Calcul automatique des marges", "Analyse par catégorie", "Détection des marges dangereuses", "Recommandations chiffrées", "Impact financier estimé", "Comparaison avec les moyennes du secteur"],
  },
  "description-plat-ia": {
    title: "Générateur de Descriptions de Plats IA — Menu Copywriting",
    h1: "Descriptions de plats générées par l'IA",
    description: "Générez des descriptions de plats appétissantes et professionnelles en quelques secondes avec l'IA Claude. Parfait pour cartes, sites web et réseaux sociaux.",
    content: [
      "Une bonne description de plat peut augmenter les ventes de 20 à 30%. Les mots utilisés pour décrire un plat influencent directement la perception du client et sa décision de commande. Mais écrire des descriptions évocatrices et appétissantes pour chaque plat de sa carte est un exercice chronophage.",
      "Notre générateur de descriptions IA crée des textes sur mesure pour chaque plat en quelques secondes. Indiquez le nom du plat, ses ingrédients principaux, le type de cuisine et le ton souhaité (élégant, décontracté ou ludique), et l'IA génère une description professionnelle.",
      "Les descriptions sont disponibles en français et en anglais, avec un vocabulaire culinaire adapté à votre style de cuisine. L'IA évite les clichés et crée des textes uniques et évocateurs qui mettent en valeur chaque plat.",
    ],
    features: ["Génération en 3 secondes", "3 tons disponibles", "Bilingue FR/EN", "Vocabulaire culinaire adapté", "Copier-coller en un clic", "5 jetons par description"],
  },
  "repondre-avis-google-restaurant": {
    title: "Répondre aux Avis Google Restaurant avec l'IA — Automatisez vos réponses",
    h1: "Automatisez vos réponses aux avis Google",
    description: "Répondez professionnellement à chaque avis Google et TripAdvisor en quelques secondes grâce à l'IA. Gérez votre e-réputation sans effort.",
    content: [
      "Répondre aux avis Google est crucial pour votre e-réputation. 89% des consommateurs lisent les réponses des restaurateurs aux avis en ligne. Un avis négatif sans réponse peut dissuader 22% des clients potentiels. Mais répondre à chaque avis prend un temps considérable.",
      "Notre outil de réponse aux avis IA génère des réponses personnalisées et professionnelles en quelques secondes. L'IA analyse le contenu et le ton de l'avis, puis génère une réponse adaptée. Pour un avis positif, elle remercie et rebondit sur les points positifs. Pour un avis négatif, elle reste professionnelle, empathique et propose des solutions.",
      "Trois tons sont disponibles : professionnel (neutre et efficace), chaleureux (personnalisé et engageant) et apologétique (pour les situations délicates). Chaque réponse est unique et fait référence aux détails spécifiques mentionnés dans l'avis.",
    ],
    features: ["Réponses en 2 secondes", "3 tons adaptables", "Personnalisation automatique", "Gestion avis positifs et négatifs", "Bilingue FR/EN", "5 jetons par réponse"],
  },
  "traduction-carte-restaurant": {
    title: "Traduction de Carte Restaurant IA — Multilingue Instantanée",
    h1: "Traduisez votre carte en toutes langues avec l'IA",
    description: "Traduction professionnelle et instantanée de votre carte de restaurant en 9+ langues. Préserve l'authenticité culinaire et les termes spécialisés.",
    content: [
      "Dans les zones touristiques, proposer sa carte en plusieurs langues est indispensable. Mais une traduction automatique classique donne souvent des résultats approximatifs voire comiques pour les termes culinaires. 'Crème brûlée' traduit littéralement en 'Burnt cream' fait perdre tout le charme du plat.",
      "Notre outil de traduction IA est spécialement entraîné pour les menus de restaurant. Il préserve les termes culinaires authentiques quand c'est approprié (crème brûlée, carpaccio, tartare) et traduit avec précision les descriptions et ingrédients.",
      "9 langues sont disponibles : français, anglais, espagnol, allemand, italien, portugais, chinois, japonais et arabe. Traduisez plusieurs plats en une seule fois pour un coût de seulement 10 jetons par traduction.",
    ],
    features: ["9 langues disponibles", "Préservation des termes culinaires", "Traduction en lot", "Descriptions et noms", "Copier-coller facile", "10 jetons par traduction"],
  },
  "optimiser-carte-restaurant": {
    title: "Optimiser sa Carte de Restaurant — Guide IA 2026",
    h1: "Comment optimiser votre carte de restaurant avec l'IA",
    description: "Guide complet pour optimiser votre carte de restaurant avec l'IA : menu engineering, pricing, descriptions, marges et positionnement.",
    content: [
      "Votre carte est l'outil de vente le plus puissant de votre restaurant. Une carte bien optimisée peut augmenter votre chiffre d'affaires de 15 à 25% sans changer un seul plat. L'intelligence artificielle rend cette optimisation accessible à tous les restaurateurs.",
      "L'optimisation d'une carte repose sur plusieurs piliers : le menu engineering (classification des plats par marge et popularité), le pricing intelligent (fixer les prix qui maximisent la marge sans freiner les ventes), les descriptions de plats (des textes qui déclenchent l'envie) et la structure de la carte (placement stratégique des plats).",
      "IA Restaurant combine tous ces outils en une seule plateforme. Commencez par analyser vos marges, puis lancez une analyse menu engineering complète, et enfin régénérez les descriptions de vos plats les plus rentables. Le tout pour quelques dizaines de jetons.",
    ],
    features: ["Menu Engineering complet", "Analyse de marges", "Génération de descriptions", "Recommandations de pricing", "Analyse par catégorie", "Plan d'action concret"],
  },
  "social-media-restaurant-ia": {
    title: "Réseaux Sociaux Restaurant IA — Posts Instagram, Facebook, TikTok",
    h1: "Créez vos posts restaurant avec l'IA",
    description: "Générez des posts Instagram, Facebook et TikTok professionnels pour votre restaurant en quelques secondes. Hashtags et emojis inclus.",
    content: [
      "Les réseaux sociaux sont devenus incontournables pour les restaurants. 72% des clients consultent le profil Instagram d'un restaurant avant de réserver. Mais créer du contenu régulier et engageant est chronophage.",
      "Notre générateur de posts IA crée du contenu adapté à chaque plateforme. Pour Instagram, des descriptions avec des hashtags ciblés. Pour Facebook, des posts plus longs et informatifs. Pour TikTok, des scripts accrocheurs et tendance.",
      "Indiquez simplement le sujet ou l'occasion (nouveau plat, événement, promotion, saison) et l'IA génère un post prêt à publier avec les hashtags appropriés et les suggestions d'emojis. 5 jetons par post, soit 400 posts avec le plan Pro.",
    ],
    features: ["3 plateformes", "Hashtags automatiques", "Emojis suggérés", "Adapté à votre cuisine", "Bilingue FR/EN", "5 jetons par post"],
  },
  "gestion-restaurant-ia": {
    title: "Gestion de Restaurant par IA — Plateforme SaaS Complète",
    h1: "Gérez votre restaurant avec l'intelligence artificielle",
    description: "Plateforme SaaS complète pour la gestion de restaurant assistée par IA. Menu engineering, marges, avis, réseaux sociaux et traduction.",
    content: [
      "La gestion d'un restaurant implique de jongler entre de nombreuses tâches : optimisation de la carte, gestion des avis en ligne, marketing sur les réseaux sociaux, analyse financière, traduction pour les touristes. Chacune de ces tâches peut être assistée et accélérée par l'IA.",
      "IA Restaurant regroupe 6 outils IA spécialisés pour la restauration dans une seule plateforme. Un système de jetons transparent vous permet de contrôler vos coûts : le plan gratuit offre 50 jetons par mois, le plan Pro 2 000 jetons et le plan Business 10 000 jetons.",
      "La plateforme est bilingue français/anglais, conçue mobile-first et fonctionne sur tous les appareils. Inscrivez-vous gratuitement et testez toutes les fonctionnalités avec vos 50 jetons offerts.",
    ],
    features: ["6 outils IA", "Système de jetons", "Plan gratuit 50 jetons/mois", "Bilingue FR/EN", "Multi-restaurants", "Support prioritaire"],
  },
  "logiciel-restauration-ia": {
    title: "Logiciel de Restauration IA — Solution SaaS pour Restaurateurs",
    h1: "Le logiciel IA pensé pour les restaurateurs",
    description: "Logiciel de restauration propulsé par l'IA Claude d'Anthropic. Optimisez votre carte, vos marges et votre communication en ligne.",
    content: [
      "Les logiciels de restauration traditionnels se concentrent sur la caisse et les réservations. IA Restaurant se positionne différemment : c'est un copilote IA pour la stratégie et la communication de votre restaurant.",
      "Propulsé par Claude d'Anthropic, l'une des IA les plus avancées au monde, chaque fonctionnalité est spécialisée pour la restauration. L'IA comprend le vocabulaire culinaire, les enjeux de marge, les dynamiques des avis en ligne et les codes de communication de chaque réseau social.",
      "Aucune installation nécessaire : IA Restaurant est accessible depuis votre navigateur. Créez votre compte en 30 secondes, ajoutez votre restaurant et commencez à utiliser les outils IA immédiatement.",
    ],
    features: ["100% en ligne", "IA Claude d'Anthropic", "Aucune installation", "Données sécurisées RGPD", "Multi-appareils", "Mises à jour automatiques"],
  },
  "rentabilite-restaurant-ia": {
    title: "Rentabilité Restaurant IA — Optimisez vos profits avec l'intelligence artificielle",
    h1: "Améliorez la rentabilité de votre restaurant avec l'IA",
    description: "Utilisez l'IA pour analyser et améliorer la rentabilité de votre restaurant. Analyse des marges, menu engineering et recommandations concrètes.",
    content: [
      "La rentabilité d'un restaurant repose sur l'optimisation de chaque plat. Avec des marges moyennes de 65-75% dans la restauration traditionnelle, chaque point de marge gagné peut représenter des milliers d'euros de bénéfice supplémentaire par an.",
      "IA Restaurant vous aide à identifier précisément où vous perdez de l'argent et où vous pouvez en gagner. L'analyse des marges plat par plat révèle les écarts entre vos plats les plus et les moins rentables. Le menu engineering classifie chaque plat et vous dit exactement quoi faire.",
      "Les recommandations de l'IA sont concrètes et chiffrées : 'Augmentez le prix du Tartare de 1.50€ pour une marge supplémentaire de 12%' ou 'Remplacez la truffe par des cèpes dans le Risotto pour économiser 2.80€ par assiette'. Chaque conseil vient avec une estimation d'impact financier.",
    ],
    features: ["Analyse de rentabilité complète", "Recommandations chiffrées", "Impact financier estimé", "Menu engineering BCG", "Suivi dans le temps", "Plan d'action priorisé"],
  },
};

export async function generateStaticParams() {
  return Object.keys(seoPages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = seoPages[slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${siteConfig.url}/seo/${slug}` },
  };
}

export default async function SeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = seoPages[slug];
  if (!page) notFound();

  const icons = [BarChart3, ChefHat, MessageSquare, TrendingUp, Languages, Share2];

  const pageUrl = `${siteConfig.url}/seo/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.title,
        description: page.description,
        inLanguage: "fr",
        url: pageUrl,
        author: {
          "@type": "Organization",
          name: "IA Restaurant",
          url: siteConfig.url,
        },
        publisher: {
          "@type": "Organization",
          name: "IA Restaurant",
          url: siteConfig.url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.h1,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          <span className="gradient-text">{page.h1}</span>
        </h1>

        <div className="mt-8 space-y-6">
          {page.content.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-text-secondary">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Fonctionnalités incluses
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {page.features.map((feature, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="card p-4 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-neon shrink-0" />
                  <span className="text-sm text-text-secondary">{feature}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 card neon-border p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Essayez gratuitement
          </h2>
          <p className="mt-2 text-text-secondary">
            50 jetons offerts — aucune carte bancaire requise
          </p>
          <Link
            href="/sign-up"
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
