import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, X, ExternalLink, Calculator } from "lucide-react";
import { siteConfig } from "@/lib/config";

const PAGE_PATH = "/seo/comment-fixer-prix-plat-restaurant";
const pageUrl = `${siteConfig.url}${PAGE_PATH}`;

const LAST_CHECKED = "24 juillet 2026";
const LAST_CHECKED_ISO = "2026-07-24T09:00:00+02:00";
const PUBLISHED_ISO = "2026-07-24T09:00:00+02:00";

export const metadata: Metadata = {
  title: "Comment fixer le prix d'un plat de restaurant en 2026",
  description:
    "Méthode pour fixer ET afficher le prix d'un plat : coefficient multiplicateur par type d'établissement, food cost 28-32 %, prix psychologique, ancrage et menu engineering, quand augmenter.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Fixer le prix d'un plat de restaurant : coefficient, prix psychologique, ancrage",
    description:
      "Du coût matière au prix affiché : le coefficient multiplicateur, le food cost cible, le prix psychologique, l'effet leurre et le bon moment pour augmenter.",
  },
};

/* -------------------------------------------------------------------------- */
/*  Données                                                                    */
/* -------------------------------------------------------------------------- */

// Repères de coefficient et de food cost par type d'établissement.
// Le coefficient s'applique au coût matière HT pour obtenir le prix de vente TTC.
type Coef = { type: string; foodCost: string; coef: string; note: string };

const COEFS: Coef[] = [
  {
    type: "Bistrot / cuisine traditionnelle",
    foodCost: "30 – 35 %",
    coef: "×3 à ×3,5",
    note: "Produits frais, portions généreuses : le ratio matière monte, le coefficient descend. On se rattrape sur le volume et les boissons.",
  },
  {
    type: "Brasserie",
    foodCost: "28 – 32 %",
    coef: "×3,5 à ×4",
    note: "Carte large, rotation rapide, part belle aux boissons. Coefficient plus confortable sur les plats standardisés.",
  },
  {
    type: "Gastronomique",
    foodCost: "32 – 38 %",
    coef: "×2,8 à ×3,2",
    note: "Le ratio matière est le plus élevé (produits nobles), mais la marge brute en euros par couvert est la plus forte. On paie la technique et le service, pas le coefficient.",
  },
  {
    type: "Pizzeria / cuisine à faible coût matière",
    foodCost: "22 – 28 %",
    coef: "×4 à ×5",
    note: "Une pizza margherita coûte 2 à 3 € de matière. Le coefficient est élevé, mais le prix psychologique du marché plafonne le prix de vente.",
  },
  {
    type: "Boissons (soft, café, spiritueux)",
    foodCost: "10 – 25 %",
    coef: "×4 à ×7",
    note: "C'est là qu'est la marge. Un café à 0,25 € de matière vendu 2,50 €, c'est un coefficient ×10. Les boissons sauvent le ratio global.",
  },
];

// Exemple de calcul entièrement déroulé, refaisable par le lecteur.
type CalcStep = { label: string; value: string; detail: string };

const CALC: CalcStep[] = [
  { label: "Coût matière du plat (HT)", value: "4,20 €", detail: "Somme des ingrédients pesés, pertes et parures comprises (viande, garniture, sauce, assaisonnement)." },
  { label: "Food cost visé", value: "30 %", detail: "Objectif : la matière représente 30 % du prix de vente HT." },
  { label: "Prix de vente HT théorique", value: "14,00 €", detail: "4,20 € ÷ 0,30 = 14,00 €. C'est le coefficient ×3,33 appliqué au coût matière." },
  { label: "Prix TTC (TVA 10 %)", value: "15,40 €", detail: "14,00 € × 1,10. La TVA restauration sur place est à 10 % (soft à 10 %, alcool à 20 %)." },
  { label: "Prix affiché (psychologique)", value: "15,50 €", detail: "On arrondit à un palier propre. Pas de .90 ici : le positionnement bistrot soigné supporte le rond ou le .50." },
];

type Psy = { titre: string; texte: string };

const PSY: Psy[] = [
  {
    titre: "Terminaisons : .90/.95 crient « pas cher », le rond dit « qualité »",
    texte: "Les prix en .90 ou .99 (charm pricing) signalent la promo et la bonne affaire — parfaits pour un fast-good ou un menu du midi. Un restaurant qui se veut soigné passe au .50 ou au rond : 18 € et 18,50 € envoient un signal de qualité que 17,95 € détruit. Le chiffre de fin est un message, pas un détail.",
  },
  {
    titre: "Retirez le signe € et l'alignement en colonne",
    texte: "Une étude de la Cornell School of Hotel Administration (Yang, Kimes & Sessarego, 2009) a montré que les clients dépensent davantage quand les prix sont écrits sans symbole monétaire (« 18 » plutôt que « 18 € »). Le signe € rappelle qu'on dépense. De même, une colonne de prix alignée à droite avec des pointillés invite le client à comparer les prix ligne à ligne au lieu de lire les plats. Placez le prix juste après la description, dans le fil du texte, sans le mettre en gras.",
  },
  {
    titre: "Un seul chiffre après la virgule, pas de « 12,00 »",
    texte: "Écrire « 12 » plutôt que « 12,00 » allège la lecture et gomme la sensation de précision comptable. Les décimales inutiles ancrent l'attention sur l'argent. Sur une carte, la sobriété typographique du prix vaut de l'argent.",
  },
];

type Faq = { q: string; a: string };

const FAQ: Faq[] = [
  {
    q: "Quel est le bon coefficient multiplicateur pour un plat ?",
    a: "Il n'y a pas UN coefficient, il y a une cible de food cost. La plupart des restaurants visent un coût matière de 28 à 32 % du prix de vente HT, ce qui correspond à un coefficient d'environ ×3 à ×3,5 sur le coût matière HT, puis on applique la TVA. Un bistrot à produits frais tourne autour de ×3, une pizzeria peut monter à ×4 ou ×5 car sa matière est très basse, et les boissons vont de ×4 à ×7. Le coefficient n'est qu'une conséquence de votre food cost cible et de votre coût matière réel.",
  },
  {
    q: "Comment calculer le prix de vente à partir du coût matière ?",
    a: "Divisez le coût matière HT par votre food cost cible, puis ajoutez la TVA. Exemple : un plat qui coûte 4,20 € de matière, pour un food cost visé de 30 %, donne 4,20 ÷ 0,30 = 14,00 € HT, soit 15,40 € TTC avec une TVA restauration de 10 %. Vous arrondissez ensuite à un palier psychologique propre (15,50 €). Attention : le coût matière doit inclure les pertes, les parures et l'assaisonnement, pas seulement l'ingrédient principal.",
  },
  {
    q: "Faut-il mettre des prix en .90 ou en chiffres ronds ?",
    a: "Cela dépend du signal que vous voulez envoyer. Les terminaisons .90 ou .99 (charm pricing) évoquent la bonne affaire : elles conviennent à un menu du midi ou à une offre volume. Un établissement qui se positionne sur la qualité utilise plutôt le .50 ou le rond, qui signalent la valeur et non la promo. Le pire mélange est un restaurant soigné avec des prix en .95 : le chiffre contredit le positionnement de la carte.",
  },
  {
    q: "Où placer le plat que je veux vraiment vendre sur la carte ?",
    a: "Le plat que vous voulez pousser — votre « star », forte marge et attrait — ne se place pas au hasard. Sortez-le de la liste alignée : encadrez-le, illustrez-le d'une courte description, ou isolez-le en tête de catégorie. À l'inverse, le plat le plus cher de la carte sert souvent d'ancre : il n'est pas là pour se vendre en masse mais pour rendre le deuxième plus cher (celui que vous voulez vendre) raisonnable par comparaison. C'est l'effet leurre.",
  },
  {
    q: "De combien augmenter un prix sans perdre de clients ?",
    a: "Par petits pas et jamais partout en même temps. Une hausse de 3 à 8 % sur un plat passe presque inaperçue ; au-delà de 10 % d'un coup sur un plat repère, le client le remarque. Augmentez d'abord les plats à faible sensibilité au prix (plats signature, spécialités qu'on ne trouve pas ailleurs) et laissez tranquilles les plats-repères que le client utilise pour juger vos prix (l'entrecôte-frites, la formule du midi, le Coca). Étalez les hausses sur plusieurs semaines plutôt que de tout remonter le même jour.",
  },
  {
    q: "Quand faut-il revoir les prix de sa carte ?",
    a: "Dès que votre ratio matière dérive de 2 à 3 points au-dessus de votre cible, c'est le signal d'un repricing. Concrètement : si vous visez 30 % de food cost et que vous êtes monté à 33 % à cause de la hausse d'un ingrédient, un plat est devenu moins rentable qu'il n'y paraît. Profitez aussi d'un changement de carte (saison, nouveau plat) pour reprendre les prix : une hausse passe mieux quand le plat évolue un peu (nouvelle garniture, nouvelle présentation) que sur un plat identique au centime près.",
  },
  {
    q: "Le prix affiché doit-il être TTC en France ?",
    a: "Oui. En restauration, les prix affichés au client sont toujours toutes taxes et service compris (le service de 15 % et la TVA sont inclus par la loi). Vous raisonnez en HT pour votre marge et votre food cost, mais le chiffre sur la carte est un prix TTC final. La TVA sur la restauration sur place est de 10 % pour la nourriture et les boissons sans alcool, et de 20 % pour les boissons alcoolisées.",
  },
];

const SOURCES: { label: string; url: string }[] = [
  {
    label: "Yang, S., Kimes, S. E., & Sessarego, M. M. (2009). « $ or Dollars: Effects of Menu-Price Formats on Restaurant Checks » — Cornell Hospitality Report / School of Hotel Administration",
    url: "https://scholarship.sha.cornell.edu/chrpubs/",
  },
  {
    label: "Service-Public / DGCCRF — Affichage des prix et TVA en restauration (prix TTC service compris)",
    url: "https://entreprendre.service-public.fr/vosdroits/F31936",
  },
  {
    label: "impots.gouv.fr — Taux de TVA applicables à la restauration (10 % / 20 %)",
    url: "https://www.impots.gouv.fr/professionnel/questions/quels-sont-les-taux-de-tva-applicables-la-restauration",
  },
];

const TOC: { id: string; label: string }[] = [
  { id: "coefficient", label: "Le coefficient multiplicateur et le food cost" },
  { id: "calcul", label: "Le calcul déroulé, étape par étape" },
  { id: "psycho", label: "Le prix psychologique" },
  { id: "ancrage", label: "Ancrage, leurre et placement sur la carte" },
  { id: "augmenter", label: "Quand et de combien augmenter" },
  { id: "faq", label: "Questions fréquentes" },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function FixerPrixPlatPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Comment fixer le prix d'un plat de restaurant",
        description: metadata.description,
        inLanguage: "fr",
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        datePublished: PUBLISHED_ISO,
        dateModified: LAST_CHECKED_ISO,
        author: { "@type": "Person", name: "Yohann Music", url: `${siteConfig.url}/legal` },
        publisher: {
          "@type": "Organization",
          "@id": `${siteConfig.url}#organization`,
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      {
        "@type": "HowTo",
        "@id": `${pageUrl}#howto`,
        name: "Fixer le prix de vente d'un plat à partir de son coût matière",
        description: "Méthode en 5 étapes pour passer du coût matière au prix affiché sur la carte.",
        step: CALC.map((c, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: c.label,
          text: `${c.value} — ${c.detail}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Fixer le prix d'un plat de restaurant", item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <nav aria-label="Fil d'ariane" className="mb-6 text-sm text-text-muted">
          <Link href="/" className="hover:text-neon transition-colors">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">Fixer le prix d&apos;un plat</span>
        </nav>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          <span className="gradient-text">
            Comment fixer le prix d&apos;un plat de restaurant : la méthode complète
          </span>
        </h1>

        <p className="mt-4 text-sm text-text-muted">
          Par Yohann Music, exploitant d&apos;un bar-restaurant à Mérignac (33) et éditeur d&apos;IA
          Restaurant · Mise à jour le {LAST_CHECKED} · 11 min de lecture
        </p>

        <div className="mt-8 card neon-border p-6">
          <p className="text-base leading-relaxed text-text-secondary">
            <strong className="text-neon">En résumé :</strong> le prix d&apos;un plat se construit en
            deux temps. D&apos;abord le prix plancher — coût matière divisé par un food cost cible de
            28 à 32 %, soit un coefficient d&apos;environ ×3 à ×3,5, puis la TVA (10 %). Ensuite le
            prix affiché — arrondi psychologique, sans signe €, sans alignement en colonne, avec le
            plat « star » sorti de la liste et un plat-ancre plus cher pour rendre les autres
            raisonnables. On augmente par petits pas (3 à 8 %), sur les plats signature d&apos;abord,
            jamais sur les plats-repères, et on reprice dès que le ratio matière dérive de 2-3
            points.
          </p>
        </div>

        <nav aria-label="Sommaire" className="mt-10 card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">Sur cette page</h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {TOC.map((item, i) => (
              <li key={item.id} className="text-sm">
                <a href={`#${item.id}`} className="text-text-secondary hover:text-neon transition-colors">
                  <span className="text-text-muted">{i + 1}.</span> {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 1. COEFFICIENT */}
        <section id="coefficient" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Le coefficient multiplicateur, décidé par votre food cost
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Le réflexe « je multiplie mon coût par 4 » est trop grossier. La bonne boussole,
            c&apos;est le food cost : la part du coût matière dans le prix de vente HT. La profession
            vise en général 28 à 32 %. En dessous, vous risquez de paraître cher ; au-dessus, vous
            travaillez à perte de marge. Le coefficient multiplicateur n&apos;est que
            l&apos;inverse de ce ratio : viser 30 % de food cost revient à multiplier le coût matière
            HT par environ 3,33, puis à ajouter la TVA. Mais ce coefficient varie fortement selon le
            type d&apos;établissement et la catégorie de produit.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <caption className="sr-only">Coefficient multiplicateur et food cost cible par type d&apos;établissement</caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Type d&apos;établissement</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Food cost cible</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Coefficient (sur coût matière)</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">Ce qui l&apos;explique</th>
                </tr>
              </thead>
              <tbody>
                {COEFS.map((c) => (
                  <tr key={c.type} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-neon">{c.type}</th>
                    <td className="py-4 pr-4 font-medium text-text-primary">{c.foodCost}</td>
                    <td className="py-4 pr-4 font-medium text-text-primary">{c.coef}</td>
                    <td className="py-4 text-text-secondary">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            À retenir : le food cost d&apos;un plat isolé n&apos;est pas votre objectif. C&apos;est la
            moyenne pondérée par les ventes qui compte. Un plat à 40 % de food cost mais très vendu
            peut être équilibré par des boissons à 15 %. Le pricing plat par plat sert la marge
            globale, pas la performance d&apos;une ligne.
          </p>
        </section>

        {/* 2. CALCUL */}
        <section id="calcul" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Du coût matière au prix affiché : le calcul déroulé
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Prenons un plat concret et déroulons chaque étape. Les chiffres sont volontairement
            simples pour que vous puissiez refaire le calcul avec les vôtres.
          </p>
          <ol className="mt-6 space-y-3">
            {CALC.map((c, i) => (
              <li key={c.label} className="card p-5 flex gap-4">
                <span className="badge-neon shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <p className="font-semibold text-text-primary">{c.label}</p>
                    <p className="text-lg font-bold text-neon">{c.value}</p>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{c.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 card p-5 border-l-2 border-l-neon flex gap-3">
            <Calculator className="mt-1 h-5 w-5 shrink-0 text-neon" />
            <p className="text-sm leading-relaxed text-text-secondary">
              La formule à garder : <strong className="text-text-primary">prix de vente HT = coût matière ÷ food cost cible</strong>,
              puis <strong className="text-text-primary">prix TTC = prix HT × (1 + taux de TVA)</strong>.
              Ne fixez jamais un prix « au feeling » sans avoir chiffré le coût matière réel, pertes
              comprises.
            </p>
          </div>
        </section>

        {/* 3. PRIX PSYCHOLOGIQUE */}
        <section id="psycho" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Le prix psychologique : comment l&apos;afficher change ce qu&apos;on dépense
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Une fois le prix plancher connu, le chiffre exact que vous affichez et la façon dont vous
            l&apos;écrivez influencent la perception — et le ticket moyen. Trois leviers, tous
            gratuits.
          </p>
          <div className="mt-6 space-y-4">
            {PSY.map((p) => (
              <div key={p.titre} className="card p-5">
                <h3 className="text-base font-semibold text-neon">{p.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{p.texte}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ANCRAGE */}
        <section id="ancrage" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Ancrage, effet leurre et placement du plat « star »
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Le prix d&apos;un plat ne se lit jamais seul : il se lit à côté des autres. C&apos;est le
            menu engineering. Deux mécanismes bien documentés changent la donne sans toucher à vos
            coûts.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <h3 className="text-base font-semibold text-text-primary">Le plat-ancre le plus cher</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Le plat le plus cher de la carte n&apos;est pas là pour se vendre en masse. Il fixe la
                référence : à côté d&apos;un plat à 42 €, celui à 28 € (celui que vous voulez vraiment
                vendre) paraît raisonnable. Sans cette ancre, votre 28 € devient « le plus cher », et
                le regard fuit vers le bas de la carte.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-base font-semibold text-text-primary">Sortir la « star » de la liste</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Votre plat à forte marge et fort attrait (la « Star » du menu engineering) doit être
                mis en scène : encadré, illustré d&apos;une courte description, ou placé en tête de
                catégorie — jamais noyé dans une colonne alignée. L&apos;œil s&apos;arrête sur ce qui
                rompt la liste.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-base font-semibold text-text-primary">L&apos;effet leurre à trois options</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Proposez trois formats (verre / pichet / bouteille, ou 3 tailles) et l&apos;option du
                milieu devient le choix majoritaire par effet de compromis. Le plus petit sert de
                repère bas, le plus grand de repère haut, et vous vendez celui du centre — souvent le
                mieux margé.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-base font-semibold text-text-primary">Grouper par envie, pas par prix</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                N&apos;ordonnez pas les plats du moins cher au plus cher : ça transforme la carte en
                comparateur de prix. Groupez par type (viandes, poissons, végétal) et laissez le prix
                se lire après la description, pas avant.
              </p>
            </div>
          </div>
        </section>

        {/* 5. AUGMENTER */}
        <section id="augmenter" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Quand et de combien augmenter un prix sans perdre de clients
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="card p-5 border-l-2 border-l-success">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <Check className="h-4 w-4 text-success" /> Ce qui passe
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
                <li>Une hausse de 3 à 8 % sur un plat : presque invisible.</li>
                <li>Augmenter les plats signature et spécialités qu&apos;on ne trouve pas ailleurs.</li>
                <li>Repricer à l&apos;occasion d&apos;un changement (saison, nouvelle garniture).</li>
                <li>Étaler les hausses sur plusieurs semaines, plat après plat.</li>
                <li>Reprendre les prix dès que le ratio matière dérive de 2-3 points.</li>
              </ul>
            </div>
            <div className="card p-5 border-l-2 border-l-danger">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <X className="h-4 w-4 text-danger" /> Ce qui braque
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
                <li>Plus de 10 % d&apos;un coup sur un plat identique au centime près.</li>
                <li>Augmenter les plats-repères (entrecôte-frites, formule du midi, Coca).</li>
                <li>Tout remonter le même jour : le client le voit d&apos;un coup.</li>
                <li>Franchir un palier symbolique sans rien changer au plat (de 19 à 21 €).</li>
                <li>Ignorer une hausse de matière pendant des mois puis rattraper d&apos;un bloc.</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-text-muted">
            Le plat-repère mérite une attention particulière : c&apos;est celui que le client connaît
            partout et sur lequel il juge si vous êtes « cher ». Gardez-le stable et augmentez sur les
            plats où vous êtes seul à proposer ce que vous proposez.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-16 card neon-border p-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Chiffrez l&apos;impact d&apos;un changement de prix avant de l&apos;afficher
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Notre analyse de marge calcule le food cost réel de chaque plat et simule ce qu&apos;un
            repricing change à votre marge — « +1,50 € sur ce plat = +12 % de marge » — pour prioriser
            les hausses qui rapportent sans effrayer. Le plan gratuit inclut 50 jetons par mois, sans
            carte bancaire.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2">
              Analyser mes marges gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm text-text-muted">50 jetons offerts · sans carte bancaire</span>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">Questions fréquentes</h2>
          <dl className="mt-6 space-y-6">
            {FAQ.map((f) => (
              <div key={f.q} className="card p-5">
                <dt className="text-base font-semibold text-text-primary">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* MAILLAGE */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-text-primary">Pour aller plus loin</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/seo/analyse-marge-restaurant", label: "Analyser les marges de sa carte", desc: "Le food cost plat par plat, base de tout pricing" },
              { href: "/seo/menu-engineering-ia", label: "Menu engineering (matrice BCG)", desc: "Repérer Stars, Énigmes, Chevaux de labour et Poids morts" },
              { href: "/seo/optimiser-carte-restaurant", label: "Optimiser sa carte", desc: "Structure et placement des plats sur la carte" },
              { href: "/seo/rentabilite-restaurant-ia", label: "Rentabilité du restaurant", desc: "Où vous gagnez et où vous perdez de l'argent" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="card card-glow p-4 transition-colors">
                <span className="block text-sm font-medium text-text-primary">{l.label}</span>
                <span className="mt-1 block text-xs text-text-muted">{l.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* SOURCES */}
        <section className="mt-16 border-t border-border-dim pt-8">
          <h2 className="text-lg font-bold text-text-primary">Sources</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Taux et cadre fiscal vérifiés le {LAST_CHECKED}. Les fourchettes de food cost et de
            coefficient sont des repères de gestion usuels en restauration ; l&apos;effet
            d&apos;affichage des prix s&apos;appuie sur la recherche de la Cornell School of Hotel
            Administration.
          </p>
          <ol className="mt-4 space-y-2 text-sm">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-text-secondary hover:text-neon transition-colors">
                  {s.label}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-relaxed text-text-muted">
            Cette page est éditée par Kipdev (SIREN 884120890), éditeur d&apos;IA Restaurant. Elle a
            une visée informative et ne constitue pas un conseil fiscal ou comptable individualisé.
          </p>
        </section>
      </article>
    </div>
  );
}
