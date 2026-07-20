import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, X, AlertTriangle, ExternalLink, MessageSquare } from "lucide-react";
import { siteConfig } from "@/lib/config";

const PAGE_PATH = "/seo/repondre-avis-google-restaurant";
const pageUrl = `${siteConfig.url}${PAGE_PATH}`;

// Chiffres externes datés de cette page. Toute modification impose de revérifier la source liée.
const LAST_CHECKED = "20 juillet 2026";
const LAST_CHECKED_ISO = "2026-07-20T09:00:00+02:00";
const PUBLISHED_ISO = "2026-07-20T09:00:00+02:00";

export const metadata: Metadata = {
  title: "Répondre aux avis Google restaurant : méthode + exemples 2026",
  description:
    "Comment répondre à un avis Google de restaurant : la méthode des 72 h, des exemples avant/après par type d'avis et par cuisine, et l'IA qui lit VOTRE carte pour rebondir sur le bon plat.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Répondre aux avis Google d'un restaurant : la méthode et les exemples",
    description:
      "La méthode des 72 h, une bibliothèque d'exemples avant/après par type d'avis et par cuisine, et le seul générateur de réponses qui connaît votre carte.",
  },
};

/* -------------------------------------------------------------------------- */
/*  Données                                                                    */
/* -------------------------------------------------------------------------- */

type Stat = { fact: string; detail: string; source: string; sourceUrl: string };

// Chiffres issus d'études externes, non de nos données. Chaque ligne est liée à sa source.
const STATS: Stat[] = [
  {
    fact: "+1 étoile = +5 à 9 % de chiffre d'affaires",
    detail:
      "Sur les restaurants indépendants, gagner une étoile de note moyenne fait grimper le CA de 5 à 9 %. Les chaînes, elles, bougent peu : c'est la réputation qui porte l'indépendant.",
    source: "Harvard Business School — M. Luca, Yelp",
    sourceUrl: "https://www.hbs.edu/faculty/Pages/item.aspx?num=41233",
  },
  {
    fact: "88 % choisissent une entreprise qui répond à tous ses avis",
    detail:
      "Le lecteur ne regarde pas que la note : il regarde si vous répondez. Un mur d'avis sans une seule réponse se lit comme un patron absent.",
    source: "BrightLocal — Local Consumer Review Survey",
    sourceUrl: "https://www.brightlocal.com/research/local-consumer-review-survey/",
  },
  {
    fact: "Google recommande de répondre pour gagner en confiance",
    detail:
      "La documentation officielle de Google Business Profile invite explicitement à répondre aux avis : c'est un signal d'établissement actif, vu par le prochain client comme par l'algorithme local.",
    source: "Google Business Profile — Aide",
    sourceUrl: "https://support.google.com/business/answer/3474050",
  },
];

type NegType = {
  label: string;
  tag: string;
  color: string;
  signal: string;
  posture: string;
};

const NEG_TYPES: NegType[] = [
  {
    label: "SOS",
    tag: "Client récupérable",
    color: "border-l-warning",
    signal:
      "Un habitué déçu ou un client de bonne foi qui a vécu un vrai raté (attente, plat froid, erreur de commande). Le ton est plus triste qu'agressif.",
    posture:
      "Reconnaître le fait précis, dire ce qui a changé, proposer un contact direct par mail — pas un geste commercial affiché en public. C'est le seul cas où l'on cherche vraiment à faire revenir.",
  },
  {
    label: "Feedback",
    tag: "Info à garder",
    color: "border-l-neon",
    signal:
      "Un avis 3-4 étoiles nuancé : « très bon, mais bruyant » ou « portions un peu justes ». Le client ne demande rien, il commente.",
    posture:
      "Remercier, valider le point utile, ne rien sur-promettre. Ces avis alimentent vos décisions de carte : notez-les, ils reviennent souvent sur les mêmes plats.",
  },
  {
    label: "Alerte",
    tag: "Public, pas privé",
    color: "border-l-danger",
    signal:
      "Avis faux, concurrent, vengeance, ou plainte impossible à vérifier (« cheveu dans l'assiette », « intoxiqué »). Parfois une personne jamais venue.",
    posture:
      "Vous ne répondez pas à l'auteur, vous répondez au lecteur. Rester factuel, poser une question vérifiable (date, nom de réservation), ne jamais s'excuser d'un fait non établi. Puis signaler à Google si le règlement est enfreint.",
  },
];

type Example = {
  kind: string;
  rating: string;
  review: string;
  bad: string;
  badWhy: string;
  good: string;
  goodWhy: string;
};

const EXAMPLES: Example[] = [
  {
    kind: "Avis 5 étoiles",
    rating: "★★★★★",
    review:
      "« Super soirée, la côte de bœuf était parfaite et le service au top. On reviendra ! »",
    bad: "Merci beaucoup pour votre retour ! Toute l'équipe vous remercie et espère vous revoir très bientôt. 😊",
    badWhy:
      "Générique. Rien ne prouve que l'avis a été lu — cette réponse colle à n'importe quel restaurant, n'importe quel plat.",
    good: "Ravi que la côte de bœuf vous ait plu, Marc l'a passée juste comme il faut ce soir-là. La prochaine fois, tentez notre tartare de Charolais coupé au couteau, c'est notre secret le mieux gardé. À très vite. — Yohann",
    goodWhy:
      "Elle nomme le plat cité, crédite une personne réelle, et glisse une suggestion vers un plat à meilleure marge. Le prochain lecteur retient deux plats, pas un merci.",
  },
  {
    kind: "Avis mitigé",
    rating: "★★★☆☆",
    review:
      "« Cuisine correcte mais on a attendu 40 minutes le plat un vendredi soir. Dommage. »",
    bad: "Nous sommes désolés pour cette attente. Nous faisons tout notre possible pour améliorer notre service. N'hésitez pas à revenir.",
    badWhy:
      "Excuse vague, promesse creuse, aucune action. Le client sent le copier-coller et le prochain lecteur aussi.",
    good: "Vous avez raison, 40 minutes un vendredi c'est trop. On a plafonné les réservations à 55 couverts le soir depuis, justement pour que la cuisine suive. Repassez un jeudi si vous voulez juger sur le calme — je vous garde une table. — Yohann",
    goodWhy:
      "Elle valide le fait chiffré (40 min), dit ce qui a concrètement changé, et propose un créneau précis. Zéro langue de bois.",
  },
  {
    kind: "Avis négatif légitime",
    rating: "★☆☆☆☆",
    review:
      "« Risotto tiède et sans goût, envoyé au bout de 25 min. Pour 24 € j'attendais mieux. »",
    bad: "Bonjour, nous sommes navrés de votre déception. Ce n'est pas représentatif de notre qualité habituelle. Contactez-nous.",
    badWhy:
      "« Pas représentatif » nie le ressenti du client. Et « contactez-nous » sans email met la charge sur lui.",
    good: "Un risotto tiède, ça n'a pas d'excuse, et à 24 € encore moins. J'en parle au chef ce service, on revoit l'envoi des plats crémés qui n'attendent pas. Écrivez-moi à contact@… avec votre date de passage, je veux vous réinviter le faire goûter comme il doit l'être. — Yohann",
    goodWhy:
      "Elle reconnaît le fait sans se cacher derrière « habituellement », donne l'email en clair et engage une action interne datée. Le lecteur voit un patron qui assume.",
  },
  {
    kind: "Avis faux ou diffamatoire",
    rating: "★☆☆☆☆",
    review:
      "« Intoxication alimentaire, j'ai été malade toute la nuit. Établissement à fuir. » (aucune réservation retrouvée)",
    bad: "C'est totalement faux, vous n'êtes jamais venu chez nous. Nous allons porter plainte pour diffamation.",
    badWhy:
      "Menacer en public braque le lecteur et transforme votre page en règlement de comptes. On ne gagne jamais une engueulade affichée.",
    good: "Nous prenons toute alerte sanitaire au sérieux et nous n'avons aucune trace d'une réservation à cette date. Pouvez-vous nous écrire à contact@… avec le jour et le nom de réservation ? Sans quoi nous demanderons à Google d'examiner cet avis. Notre cuisine est contrôlée et nos relevés HACCP sont à jour. — La direction",
    goodWhy:
      "Calme, factuelle, elle pose une question vérifiable, rappelle un fait objectif (HACCP), et annonce le signalement sans menacer. Écrite pour le lecteur, pas pour l'auteur.",
  },
];

type CuisineEx = { cuisine: string; review: string; response: string };

// Exemples par type de cuisine : capter les longues traînes que les guides génériques ratent.
const CUISINE_EX: CuisineEx[] = [
  {
    cuisine: "Bistrot",
    review: "« Œufs mayo parfaits, blanquette comme chez ma grand-mère. »",
    response:
      "Les œufs mayo, on ne les touche pas, c'est la maison. Et la blanquette mijote encore trois heures comme avant. Merci du clin d'œil, revenez pour le bœuf bourguignon du jeudi. — Yohann",
  },
  {
    cuisine: "Pizzeria",
    review: "« Pâte au top, mais la Reine manquait un peu de jambon. »",
    response:
      "Bien noté pour la Reine, je repèse les portions de jambon avec le pizzaïolo dès demain. La pâte, elle, pousse 48 h, content qu'elle vous ait plu. Goûtez la Diavola la prochaine fois. — Luca",
  },
  {
    cuisine: "Food-truck",
    review: "« Burger énorme, frites maison excellentes, file d'attente longue le midi. »",
    response:
      "La file du midi, on la connaît — commandez en ligne 15 min avant, votre burger vous attend au comptoir. Merci pour les frites, on les taille encore à la main chaque matin. On est place de la Victoire jusqu'à vendredi. — L'équipe",
  },
  {
    cuisine: "Gastronomique",
    review: "« Menu dégustation remarquable, l'accord mets-vins sur le pigeon était mémorable. »",
    response:
      "Le pigeon en accord avec le Cornas, c'est le moment que notre sommelier défend le plus, votre mot lui fera plaisir. Au menu d'automne, il prépare un accord autour du cèpe qui devrait vous parler. Merci de votre visite. — Chef Antoine",
  },
];

type Faq = { q: string; a: string };

const FAQ: Faq[] = [
  {
    q: "Peut-on supprimer un avis Google négatif ?",
    a: "Vous ne pouvez pas supprimer un avis vous-même. Vous pouvez seulement le signaler à Google, qui décide de le retirer ou non — et uniquement s'il enfreint son règlement (spam, propos haineux, contenu hors sujet, conflit d'intérêts, fausse localisation). Un avis simplement négatif mais sincère ne sera pas retiré, et c'est normal. La seule réponse qui reste à votre main, c'est la réponse publique : c'est elle que lira le prochain client, pas l'avis seul.",
  },
  {
    q: "Comment signaler un faux avis ou un avis diffamatoire ?",
    a: "Dans Google Business Profile, ouvrez l'avis, cliquez sur les trois points puis « Signaler l'avis » et choisissez le motif (par exemple « Ce n'est pas un avis fondé sur une expérience réelle »). Le traitement prend plusieurs jours et n'aboutit pas toujours. En parallèle, répondez publiquement de façon factuelle : demandez une date ou un nom de réservation vérifiable. Si l'avis met en cause votre hygiène de façon mensongère, gardez une capture d'écran et vos relevés HACCP : c'est votre preuve en cas de recours.",
  },
  {
    q: "Faut-il répondre à TOUS les avis, même les 5 étoiles ?",
    a: "Oui, mais pas de la même manière. Répondre à tous montre un établissement actif — le point que Google et 88 % des lecteurs (BrightLocal) regardent. Pour un 5 étoiles, deux phrases suffisent, à condition de rebondir sur le détail cité (le plat, le serveur, l'occasion). Pour un avis négatif, prenez le temps. Ce qu'il ne faut jamais faire : coller la même réponse « Merci pour votre retour » sous quinze avis d'affilée. Un lecteur le repère en trois secondes.",
  },
  {
    q: "Sous combien de temps répondre à un avis de restaurant ?",
    a: "Visez 72 heures. Assez vite pour montrer que vous suivez, assez lent pour ne pas répondre à chaud sur un avis qui pique. Sur un avis négatif, laissez passer une nuit avant d'écrire : la première version rédigée sous le coup de la colère finit toujours à la corbeille. Bloquez plutôt un créneau fixe par semaine — le dimanche soir, tous les avis de la semaine d'un coup — que d'y revenir dix fois par jour.",
  },
  {
    q: "Peut-on automatiser les réponses aux avis sans perdre l'humain ?",
    a: "Oui, à une condition : que l'outil connaisse quelque chose de vrai sur votre maison. Un générateur qui ne lit que le texte de l'avis produit du « Merci pour votre retour » à la chaîne — l'inverse de l'humain. Notre approche est différente : l'outil reconnaît, dans votre navigateur, le plat de VOTRE carte cité dans l'avis, et vous propose de rebondir dessus. Vous relisez, vous corrigez, vous signez d'un prénom. L'IA écrit le brouillon ancré sur un fait réel ; la dernière main reste la vôtre. C'est ça, automatiser sans se déshumaniser.",
  },
  {
    q: "Répondre aux avis aide-t-il vraiment le référencement local ?",
    a: "Indirectement, oui. Google Business Profile est le premier levier du SEO local, et l'activité — dont les réponses aux avis — fait partie des signaux d'un établissement vivant. Vos réponses sont aussi du texte indexé : glisser naturellement le type de cuisine, un plat signature et le quartier dans vos réponses renforce la cohérence sémantique de votre fiche. Attention : on écrit pour le client d'abord. Une réponse bourrée de mots-clés se voit et dessert. Le bon dosage, c'est un plat nommé et un lieu cité, pas une liste.",
  },
  {
    q: "L'IA générative (ChatGPT, AI Overviews) voit-elle mes réponses ?",
    a: "De plus en plus. Quand un client demande à un assistant « un bon bistrot à Mérignac », le modèle s'appuie sur des contenus publics, dont les avis et vos réponses. Un établissement qui répond avec des détails concrets — plats, provenance, service — donne à ces systèmes de la matière à citer. Un mur d'avis sans réponse, ou avec des réponses vides, n'offre rien à reprendre. Répondre vraiment, c'est aussi exister dans la couche IA de la recherche.",
  },
  {
    q: "Faut-il mettre le nom du client dans la réponse ?",
    a: "Ce n'est pas obligatoire et souvent inutile. L'avis est public, mais reprendre le nom de l'auteur n'ajoute rien à la réponse et peut mettre mal à l'aise. Signez plutôt VOUS d'un prénom réel : c'est ce qui humanise. Côté RGPD, si vous préparez la réponse avec une IA, retirez le nom de l'auteur avant de coller l'avis — il ne sert pas à générer la réponse.",
  },
];

type Compare = { feature: string; others: string; us: string };

const COMPARE: Compare[] = [
  {
    feature: "Connexion à Google Business Profile",
    others: "Oui, publication en 1 clic, traitement en masse",
    us: "Non — copier-coller manuel de l'avis. On l'assume : c'est la brique commoditisée.",
  },
  {
    feature: "Langues de génération",
    others: "Jusqu'à 118 langues, détection automatique",
    us: "9 langues. Suffisant pour une clientèle FR + touristes, pas pour une chaîne mondiale.",
  },
  {
    feature: "Lecture de VOTRE carte",
    others: "Non — le générateur ignore vos plats",
    us: "Oui. Le plat cité dans l'avis est reconnu dans votre navigateur, avec sa marge et son rang BCG.",
  },
  {
    feature: "Cross-sell piloté par la marge",
    others: "Non",
    us: "Sur un avis positif, la réponse peut orienter vers une Énigme (bonne marge, peu vendue).",
  },
  {
    feature: "L'avis devient un signal de gestion",
    others: "Analyse de sentiment générique",
    us: "Un avis négatif récurrent sur un plat faible marge remonte dans votre menu engineering.",
  },
];

const SOURCES: { label: string; url: string }[] = [
  {
    label:
      "Harvard Business School — Michael Luca, « Reviews, Reputation, and Revenue: The Case of Yelp.com » (working paper 12-016)",
    url: "https://www.hbs.edu/faculty/Pages/item.aspx?num=41233",
  },
  {
    label: "BrightLocal — Local Consumer Review Survey (enquête annuelle sur les avis en ligne)",
    url: "https://www.brightlocal.com/research/local-consumer-review-survey/",
  },
  {
    label: "Google Business Profile — Aide : lire et répondre aux avis",
    url: "https://support.google.com/business/answer/3474050",
  },
  {
    label: "Google — Règlement relatif aux contenus et avis publiés par les utilisateurs",
    url: "https://support.google.com/contributionpolicy/answer/7400114",
  },
];

const TOC: { id: string; label: string }[] = [
  { id: "pourquoi", label: "Pourquoi répondre change vraiment le CA" },
  { id: "methode", label: "La méthode des 72 heures" },
  { id: "typologie", label: "Les 3 types d'avis négatifs" },
  { id: "exemples", label: "Exemples avant / après par type d'avis" },
  { id: "cuisines", label: "Exemples par type de cuisine" },
  { id: "carte", label: "L'IA qui lit VOTRE carte" },
  { id: "seo", label: "Réponses et SEO local" },
  { id: "faq", label: "Questions fréquentes" },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function RepondreAvisGooglePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Répondre aux avis Google d'un restaurant : la méthode et les exemples",
        description: metadata.description,
        inLanguage: "fr",
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        datePublished: PUBLISHED_ISO,
        dateModified: LAST_CHECKED_ISO,
        author: {
          "@type": "Person",
          name: "Yohann Music",
          url: `${siteConfig.url}/legal`,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${siteConfig.url}#organization`,
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Répondre aux avis Google restaurant",
            item: pageUrl,
          },
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
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "IA Restaurant — Réponses aux avis",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
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
        <nav aria-label="Fil d'ariane" className="mb-6 text-sm text-text-muted">
          <Link href="/" className="hover:text-neon transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">Répondre aux avis Google restaurant</span>
        </nav>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          <span className="gradient-text">
            Répondre aux avis Google de restaurant : la méthode, les exemples, et l&apos;IA qui lit
            votre carte
          </span>
        </h1>

        <p className="mt-4 text-sm text-text-muted">
          Par Yohann Music, exploitant d&apos;un bar-restaurant à Mérignac (33) et éditeur d&apos;IA
          Restaurant · Mise à jour le {LAST_CHECKED} · 11 min de lecture
        </p>

        {/* Phrase-balise extractible */}
        <div className="mt-8 card neon-border p-6">
          <p className="text-base leading-relaxed text-text-secondary">
            <strong className="text-neon">En résumé :</strong> répondez à tous vos avis sous 72
            heures, en rebondissant sur le détail précis que le client cite — un plat, un serveur,
            une occasion. Sur les indépendants, une étoile gagnée vaut 5 à 9 % de chiffre
            d&apos;affaires (Harvard Business School), et 88 % des lecteurs privilégient un
            établissement qui répond (BrightLocal). Un avis négatif se traite selon son type : SOS
            (client récupérable), feedback (info à garder), alerte (faux avis, on écrit pour le
            lecteur). Vous ne pouvez pas supprimer un avis, seulement le signaler s&apos;il enfreint
            le règlement Google. Notre outil fait ce qu&apos;aucun générateur pur ne fait : il
            reconnaît le plat de VOTRE carte cité dans l&apos;avis et propose de rebondir dessus.
          </p>
        </div>

        {/* Sommaire */}
        <nav aria-label="Sommaire" className="mt-10 card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Sur cette page
          </h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {TOC.map((item, i) => (
              <li key={item.id} className="text-sm">
                <a
                  href={`#${item.id}`}
                  className="text-text-secondary hover:text-neon transition-colors"
                >
                  <span className="text-text-muted">{i + 1}.</span> {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 1. POURQUOI */}
        <section id="pourquoi" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Pourquoi répondre aux avis change vraiment votre chiffre d&apos;affaires
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Répondre aux avis, ce n&apos;est pas de la politesse, c&apos;est du marketing gratuit.
            Le prochain client lit rarement la moyenne : il lit les trois derniers avis négatifs et
            regarde si vous avez répondu. Voici les repères à connaître — issus d&apos;études
            externes, pas de nos données, et chacun lié à sa source.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">
                Repères chiffrés sur l&apos;impact des avis et des réponses en restauration
              </caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">
                    Ce que disent les études
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">
                    Ce que ça change pour vous
                  </th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {STATS.map((s) => (
                  <tr key={s.fact} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-neon">
                      {s.fact}
                    </th>
                    <td className="py-4 pr-4 text-text-secondary">{s.detail}</td>
                    <td className="py-4 text-text-secondary">
                      <a
                        href={s.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 hover:text-neon transition-colors"
                      >
                        {s.source}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. METHODE 72H */}
        <section id="methode" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">La méthode des 72 heures</h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Un rythme et cinq gestes, rien de plus. Le but n&apos;est pas de répondre vite, c&apos;est
            de répondre juste et régulièrement.
          </p>
          <ol className="mt-6 space-y-4">
            {[
              {
                t: "Bloquez un créneau fixe par semaine",
                d: "Le dimanche soir, tous les avis de la semaine d'un coup. Mieux qu'y revenir dix fois par jour et répondre à chaud.",
              },
              {
                t: "Sur un avis négatif, laissez passer une nuit",
                d: "La version écrite sous le coup de l'agacement finit toujours à la corbeille. 72 h, c'est assez vite pour montrer que vous suivez, assez lent pour ne pas déraper.",
              },
              {
                t: "Repérez le détail précis cité",
                d: "Le plat, le serveur, l'attente en minutes, l'occasion. C'est ce détail qui prouve au lecteur que vous avez lu — pas le « merci pour votre retour ».",
              },
              {
                t: "Répondez au lecteur, pas seulement à l'auteur",
                d: "Chaque réponse est une vitrine publique. Le vrai destinataire, c'est le prochain client qui hésite entre vous et le voisin.",
              },
              {
                t: "Signez d'un prénom réel",
                d: "« La direction » sur un litige sérieux, un prénom partout ailleurs. C'est ce qui transforme une réponse d'entreprise en réponse de patron.",
              },
            ].map((step, i) => (
              <li key={step.t} className="card p-5 flex gap-4">
                <span className="badge-neon shrink-0">{i + 1}</span>
                <div>
                  <p className="font-semibold text-text-primary">{step.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. TYPOLOGIE */}
        <section id="typologie" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Les trois types d&apos;avis négatifs — et la bonne posture pour chacun
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            « Avis négatif » ne veut rien dire tant qu&apos;on n&apos;a pas trié. Un habitué déçu et
            un faux avis de concurrent n&apos;appellent pas la même réponse. Trois cas, trois
            postures.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {NEG_TYPES.map((n) => (
              <div key={n.label} className={`card p-5 border-l-2 ${n.color}`}>
                <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                  {n.label}
                  <span className="text-xs font-normal text-text-muted">· {n.tag}</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  <strong className="text-text-primary">Le signal :</strong> {n.signal}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  <strong className="text-text-primary">La posture :</strong> {n.posture}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. EXEMPLES AVANT/APRES */}
        <section id="exemples" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Bibliothèque d&apos;exemples avant / après, par type d&apos;avis
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Quatre situations, la mauvaise réponse (celle que tout le monde écrit) et la bonne, avec
            l&apos;explication. Ces exemples sont rédigés à la main pour illustrer la méthode —
            adaptez-les à vos vrais plats et à votre voix.
          </p>
          <div className="mt-6 space-y-6">
            {EXAMPLES.map((ex) => (
              <div key={ex.kind} className="card p-5">
                <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                  <span className="badge-neon">{ex.kind}</span>
                  <span className="text-warning" aria-hidden>
                    {ex.rating}
                  </span>
                </h3>
                <p className="mt-3 text-sm italic leading-relaxed text-text-secondary">
                  {ex.review}
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border-l-2 border-l-danger bg-surface-3 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-danger">
                      <X className="h-4 w-4" /> À éviter
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{ex.bad}</p>
                    <p className="mt-3 text-xs leading-relaxed text-text-muted">{ex.badWhy}</p>
                  </div>
                  <div className="rounded-lg border-l-2 border-l-success bg-surface-3 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-success">
                      <Check className="h-4 w-4" /> À faire
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{ex.good}</p>
                    <p className="mt-3 text-xs leading-relaxed text-text-muted">{ex.goodWhy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. PAR CUISINE */}
        <section id="cuisines" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Exemples par type de cuisine
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Les guides génériques donnent des réponses passe-partout. Le vocabulaire d&apos;un
            bistrot n&apos;est pas celui d&apos;un food-truck. Quatre déclinaisons pour trouver votre
            ton.
          </p>
          <div className="mt-6 space-y-4">
            {CUISINE_EX.map((c) => (
              <div key={c.cuisine} className="card p-5">
                <h3 className="text-base font-semibold text-neon">{c.cuisine}</h3>
                <p className="mt-2 text-sm italic leading-relaxed text-text-secondary">
                  {c.review}
                </p>
                <p className="mt-3 flex gap-3 text-sm leading-relaxed text-text-secondary">
                  <MessageSquare className="mt-1 h-4 w-4 shrink-0 text-neon" />
                  <span>{c.response}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. L'IA QUI LIT VOTRE CARTE */}
        <section id="carte" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Le seul répondeur d&apos;avis qui lit VOTRE carte
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Les gros outils (Localo, BonjourAvis) se branchent sur Google Business Profile et publient
            en un clic. C&apos;est bien, et c&apos;est commoditisé — nous ne jouons pas là-dessus.
            Notre différence est ailleurs : nous sommes la seule suite qui connaît déjà la carte
            réelle du restaurant. Le menu engineering et l&apos;analyse des marges gardent vos plats,
            leur prix, leur coût matière et leur rang BCG dans votre navigateur. Quand un avis cite un
            plat, on le reconnaît — en local, sans dépenser un jeton, sans que la carte quitte votre
            poste. Trois choses qu&apos;aucun générateur de texte pur ne peut faire en découlent.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="card p-5">
              <h3 className="text-base font-semibold text-text-primary">1. Rebondir sur le bon plat</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                L&apos;avis parle de votre côte de bœuf ? La réponse le nomme, puis propose une
                Énigme — bonne marge, peu commandée. Le cross-sell est piloté par la matrice BCG,
                pas au hasard.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-base font-semibold text-text-primary">
                2. Transformer l&apos;avis en signal
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Un avis négatif qui revient sur un plat à faible marge remonte comme alerte dans
                votre menu engineering : un Poids mort critiqué, c&apos;est le plat à retravailler ou
                à sortir.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-base font-semibold text-text-primary">3. Une signature cohérente</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Les plats sont cités avec le vrai vocabulaire de votre carte, entre guillemets pour
                ne jamais se tromper de genre. Pas d&apos;invention, pas de faute publique.
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">
                Comparaison honnête entre les générateurs d&apos;avis grand public et notre approche
              </caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary"></th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">
                    Générateurs GBP (Localo, BonjourAvis)
                  </th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">
                    IA Restaurant
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((c) => (
                  <tr key={c.feature} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-text-primary">
                      {c.feature}
                    </th>
                    <td className="py-4 pr-4 text-text-muted">{c.others}</td>
                    <td className="py-4 text-text-secondary">{c.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            Honnêteté d&apos;éditeur : si votre besoin est de traiter 50 avis d&apos;un coup,
            connectés à Google, en 118 langues, un outil branché GBP fera mieux que nous. Notre pari
            est le restaurateur qui veut des réponses justes, ancrées sur sa carte, et qui veut que
            chaque avis serve aussi sa gestion.
          </p>
        </section>

        {/* 7. SEO LOCAL */}
        <section id="seo" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Vos réponses et le référencement local
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Vos réponses sont du texte public indexé. Bien écrites, elles renforcent la cohérence de
            votre fiche Google et donnent de la matière aux assistants IA quand un client demande
            « un bon [cuisine] à [quartier] ». La règle tient en une ligne : on écrit pour le client
            d&apos;abord, le mot-clé se glisse tout seul.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="card p-5 border-l-2 border-l-success">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <Check className="h-4 w-4 text-success" /> Naturel, ça marche
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                « Content que notre pizza napolitaine vous ait plu, on est les seuls du quartier
                Saint-Michel à faire pousser la pâte 48 h. »
              </p>
              <p className="mt-2 text-xs text-text-muted">
                Type de cuisine + plat + quartier, dans une phrase qu&apos;un humain dirait vraiment.
              </p>
            </div>
            <div className="card p-5 border-l-2 border-l-danger">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <X className="h-4 w-4 text-danger" /> Bourré, ça dessert
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                « Merci pour votre avis sur notre pizzeria à Bordeaux, meilleure pizza Bordeaux,
                restaurant italien Bordeaux centre, pizza Bordeaux Saint-Michel. »
              </p>
              <p className="mt-2 text-xs text-text-muted">
                Le lecteur le voit, Google aussi. Une signature honnête pèse plus qu&apos;une liste.
              </p>
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
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

        {/* CTA */}
        <section className="mt-16 card neon-border p-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Répondez à votre prochain avis avec votre carte en main
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Collez l&apos;avis, l&apos;outil reconnaît le plat cité dans votre carte et vous propose
            une réponse à relire et signer. Le plan gratuit inclut 50 jetons par mois, sans carte
            bancaire — de quoi générer une dizaine de réponses. Chaque réponse coûte 5 jetons, la
            reconnaissance de vos plats est gratuite et locale.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2">
              Commencer gratuitement (50 jetons)
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm text-text-muted">
              Sans carte bancaire · Pro à 29 €/mois si vous continuez
            </span>
          </div>
        </section>

        {/* MAILLAGE */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-text-primary">Pour aller plus loin</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/seo/menu-engineering-ia",
                label: "Menu engineering par l'IA",
                desc: "La matrice BCG qui alimente le cross-sell de vos réponses",
              },
              {
                href: "/seo/analyse-marge-restaurant",
                label: "Analyse des marges",
                desc: "Savoir quel plat proposer, et lequel retirer",
              },
              {
                href: "/formation-ia-restaurant",
                label: "Se former (ou pas) à l'IA restauration",
                desc: "Les prompts pour répondre aux avis 1★ et 5★, RGPD compris",
              },
              {
                href: "/seo/intelligence-artificielle-restauration",
                label: "L'IA en restauration",
                desc: "Le panorama général des usages",
              },
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
            Chiffres et règles vérifiés le {LAST_CHECKED}. Les études citées sont externes ; les
            réponses d&apos;exemple sont rédigées par nos soins pour illustrer la méthode. Les règles
            de Google Business Profile évoluent : vérifiez la page d&apos;aide avant tout signalement.
          </p>
          <ol className="mt-4 space-y-2 text-sm">
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-text-secondary hover:text-neon transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-relaxed text-text-muted">
            Cette page est éditée par Kipdev (SIREN 884120890), éditeur d&apos;IA Restaurant. Les
            noms d&apos;outils tiers cités (Localo, BonjourAvis) le sont à titre de comparaison ; nous
            n&apos;avons aucun lien avec eux et ne touchons aucune commission.
          </p>
        </section>
      </article>
    </div>
  );
}
