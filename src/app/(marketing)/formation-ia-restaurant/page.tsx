import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, X, AlertTriangle, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

const PAGE_PATH = "/formation-ia-restaurant";
const pageUrl = `${siteConfig.url}${PAGE_PATH}`;

// Dernière vérification des tarifs et règles de financement citées sur cette page.
// Toute modification de ces chiffres impose de re-vérifier la source correspondante.
const LAST_CHECKED = "16 juillet 2026";
const LAST_CHECKED_ISO = "2026-07-16T09:00:00+02:00";
const PUBLISHED_ISO = "2026-07-16T09:00:00+02:00";

export const metadata: Metadata = {
  title: "Formation IA restaurant : comparatif 2026",
  description:
    "Prix réels, éligibilité CPF, ce que l'OPCO rembourse vraiment. Le comparatif des formations IA restauration + un programme gratuit de 4 semaines pour s'en passer.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Formation IA restaurant : le comparatif honnête 2026",
    description:
      "Combien coûtent vraiment les formations IA restauration, ce que l'OPCO rembourse (moins que vous ne croyez), et comment se former seul en 4 semaines.",
  },
};

type Offer = {
  name: string;
  price: string;
  duration: string;
  format: string;
  certifying: string;
  audience: string;
  source: string;
};

// Chaque ligne a été relevée sur la page de l'organisme (ou la presse pro citée) le 16/07/2026.
// Ne jamais compléter une case « non affiché » par une estimation.
const OFFERS: Offer[] = [
  {
    name: "Crews Education",
    price: "1 790 € HT / personne",
    duration: "14 h sur 2 jours",
    format: "Visio ou présentiel, 5 pers. max",
    certifying: "Certificat maison « Spécialisation IA pour les restaurants ». Organisme Qualiopi. CPF non annoncé.",
    audience: "Prérequis : « fondamentaux de la restauration »",
    source: "https://www.crews-education.com/formations/formation-ia-restaurant",
  },
  {
    name: "L'atelier des Chefs",
    price: "590 € TTC",
    duration: "8 h, accès 12 mois",
    format: "E-learning 100 % asynchrone",
    certifying: "Aucune certification RNCP/RS annoncée",
    audience: "Tout profil CHR (patron, chef, resp. de salle)",
    source: "https://aucoeurduchr.fr/article/emploi-formation/atelier-chefs-formation-ia/",
  },
  {
    name: "Gael Roques (Teachizy)",
    price: "397 € TTC (prix relevé sur la page de vente)",
    duration: "26 leçons, e-learning",
    format: "Vidéos + prompts fournis",
    certifying: "Aucune certification RNCP/RS annoncée",
    audience: "Restaurants, boulangeries, pizzerias, fast-food",
    source: "https://gael-roques-expert-ia.teachizy.fr/formations/formation-ia-pour-la-restauration",
  },
  {
    name: "AMKG Formations",
    price: "Non affiché publiquement",
    duration: "Non affichée",
    format: "Inter / intra, sur devis",
    certifying: "Aucune certification RNCP/RS annoncée",
    audience: "Restaurateurs, hôteliers",
    source: "https://www.amkg-formations.fr/",
  },
  {
    name: "Démarre Ton Aventure",
    price: "Non affiché publiquement",
    duration: "Non affichée",
    format: "Coaching individuel personnalisé",
    certifying: "Aucune certification RNCP/RS annoncée",
    audience: "Restaurateurs, indépendants",
    source: "https://www.demarretonaventure.com/formation-ia/formation-ia-restaurateur/",
  },
];

type FundingRow = {
  who: string;
  organism: string;
  rate: string;
  ceiling: string;
  onCrews: string;
};

// Taux relevés le 16/07/2026 sur les pages officielles AKTO et AGEFICE (liens en bas de page).
const FUNDING: FundingRow[] = [
  {
    who: "Vos salariés (resto de moins de 11 salariés)",
    organism: "AKTO (OPCO de la branche HCR)",
    rate: "25 €/h en présentiel · 15 €/h en distanciel (formation inter)",
    ceiling: "2 000 €/an de coûts pédagogiques pour toute l'entreprise",
    onCrews: "14 h × 15 € = 210 € pris en charge. Reste à votre charge : 1 580 € HT.",
  },
  {
    who: "Vous, patron non salarié (gérant majoritaire, auto-entrepreneur)",
    organism: "AGEFICE (fonds d'assurance formation des dirigeants du commerce)",
    rate: "42 €/h présentiel · 35 €/h distanciel synchrone · 20 €/h asynchrone",
    ceiling: "3 000 €/an si votre CFP ≥ 7 € (600 € si CFP < 7 €)",
    onCrews: "14 h × 35 € = 490 € pris en charge. Reste à votre charge : 1 300 € HT.",
  },
  {
    who: "Vous, gérant assimilé salarié (gérant minoritaire/égalitaire, SAS)",
    organism: "AKTO, comme vos salariés",
    rate: "Mêmes plafonds que ci-dessus",
    ceiling: "Sur la même enveloppe de 2 000 €/an",
    onCrews: "Idem : 210 € sur 1 790 €.",
  },
];

type WeekRow = {
  week: string;
  task: string;
  time: string;
  tool: string;
  deliverable: string;
};

const PROGRAM: WeekRow[] = [
  {
    week: "S1 · lun-mar",
    task: "Réécrire la description de vos 3 plats les plus vendus",
    time: "3 × 20 min",
    tool: "Prompt n°1 ci-dessous",
    deliverable: "3 descriptions collées dans votre carte ou sur TheFork",
  },
  {
    week: "S1 · jeu-ven",
    task: "Répondre à vos 5 derniers avis Google en attente",
    time: "20 min",
    tool: "Prompts n°2 et n°3",
    deliverable: "Taux de réponse Google à 100 % sur le mois",
  },
  {
    week: "S2 · lun",
    task: "Traduire votre carte en anglais avec les allergènes INCO",
    time: "30 min",
    tool: "Prompt n°5",
    deliverable: "Une carte EN relue, prête à imprimer",
  },
  {
    week: "S2 · jeu",
    task: "Écrire 4 posts Instagram (un par semaine du mois suivant)",
    time: "20 min",
    tool: "Prompt n°4",
    deliverable: "4 posts programmés, plus rien à faire du mois",
  },
  {
    week: "S3 · lun",
    task: "Calculer le food cost réel de 5 plats (fiche technique en main)",
    time: "40 min",
    tool: "Prompt n°6",
    deliverable: "5 coûts matière chiffrés, en euros par assiette",
  },
  {
    week: "S3 · jeu",
    task: "Classer votre carte en matrice BCG (Stars/Puzzles/Plowhorses/Dogs)",
    time: "30 min",
    tool: "Analyse menu engineering",
    deliverable: "La liste des plats à retirer et à pousser",
  },
  {
    week: "S4 · lun",
    task: "Appliquer : 2 prix ajustés, 1 plat retiré, 1 plat repositionné",
    time: "30 min",
    tool: "Votre carte",
    deliverable: "Une carte v2 en service",
  },
  {
    week: "S4 · ven",
    task: "Mesurer : ticket moyen, note Google, temps admin gagné",
    time: "20 min",
    tool: "Votre caisse + Google Business",
    deliverable: "3 chiffres avant/après notés sur un carnet",
  },
];

type Prompt = { n: number; title: string; body: string };

const PROMPTS: Prompt[] = [
  {
    n: 1,
    title: "Description d'un plat signature",
    body: `Tu es rédacteur de cartes pour un restaurant. Écris la description d'un plat, en français, pour ma carte papier.

Plat : [nom du plat]
Ingrédients principaux : [liste]
Cuisson / technique : [ex. basse température 6 h]
Origine des produits : [ex. bœuf Limousin, maraîcher à 12 km]
Prix de vente : [X €]
Style de la maison : [bistrot / gastro / brasserie]

Contraintes :
- 25 mots maximum, une seule phrase si possible.
- Pas d'adjectif publicitaire creux ("savoureux", "généreux", "incontournable").
- Cite un fait concret : une origine, une durée, une technique.
- Pas de point d'exclamation.
Donne-moi 3 versions différentes.`,
  },
  {
    n: 2,
    title: "Réponse à un avis Google 1★ (attente en salle)",
    body: `Tu réponds publiquement à un avis Google négatif, au nom du restaurant. Ton : posé, factuel, ni servile ni défensif.

Avis reçu : "[coller l'avis mot pour mot]"
Ce qui s'est réellement passé ce soir-là : [ex. 2 serveurs absents, 70 couverts]
Ce qu'on a changé depuis : [ex. réservation en ligne plafonnée à 55 couverts le samedi]

Contraintes :
- 60 mots maximum.
- Reconnaître le fait précis reproché, sans excuse générique.
- Ne jamais contredire le client sur son ressenti.
- Dire ce qui a changé concrètement, ou ne rien promettre.
- Proposer un contact direct par mail, pas un geste commercial public.
- Signer avec un prénom réel.`,
  },
  {
    n: 3,
    title: "Réponse à un avis 5★ (sans langue de bois)",
    body: `Réponds à cet avis Google 5★ au nom du restaurant.

Avis : "[coller l'avis]"

Contraintes :
- 30 mots maximum.
- Rebondir sur LE détail précis que le client cite (le plat, le serveur, l'occasion).
- Interdit : "Merci pour votre retour", "au plaisir de vous revoir", "toute l'équipe vous remercie".
- Écrire comme un patron qui a lu l'avis, pas comme un service client.
- Signer avec un prénom.`,
  },
  {
    n: 4,
    title: "Post Instagram du plat du jour",
    body: `Écris un post Instagram pour le plat du jour de mon restaurant.

Plat : [nom]
Ingrédients : [liste]
Prix : [X €]
Jour et service : [ex. jeudi midi]
Ville / quartier : [ex. Mérignac centre]

Contraintes :
- 2 phrases courtes maximum avant les hashtags.
- Écrire comme un patron, pas comme une agence.
- Un seul emoji maximum, ou aucun.
- 6 hashtags : 3 locaux (ville, quartier), 3 métier. Pas de #food #yummy #instafood.
- Terminer par l'info pratique : service, horaire, réservation.`,
  },
  {
    n: 5,
    title: "Traduction de carte + allergènes INCO",
    body: `Traduis cette partie de ma carte de restaurant du français vers [langue].

Carte : [coller les plats + descriptions]

Contraintes :
- Garder en français les termes culinaires consacrés (crème brûlée, confit, tartare, magret) sans les traduire littéralement, avec une courte glose entre parenthèses à la première occurrence.
- Pour chaque plat, lister les allergènes présents parmi les 14 de l'annexe II du règlement INCO (UE) 1169/2011.
- Signaler en fin de réponse tout plat pour lequel les ingrédients fournis ne permettent PAS de conclure sur un allergène. Ne devine jamais.
- Rendre un tableau : plat | traduction | allergènes.`,
  },
  {
    n: 6,
    title: "Food cost et marge brute d'un plat",
    body: `Calcule le coût matière et la marge brute de ce plat. Montre le détail ligne par ligne.

Plat : [nom]
Prix de vente TTC : [X €]
TVA applicable : [10 % sur place / 5,5 % à emporter]
Fiche technique (ingrédient, quantité, prix d'achat de l'unité) :
- [ex. filet de bar, 160 g, 24 €/kg]
- [...]
Pertes / parage estimés : [ex. 12 %]

Contraintes :
- Calcule d'abord le prix de vente HT, puis le coût matière par portion (pertes incluses), puis la marge brute en € et en %.
- Compare le résultat à un repère de 65-75 % de marge brute et signale-moi si on est sous 30 %.
- Dis-moi de combien il faudrait monter le prix pour atteindre 70 % de marge.
- Si une donnée manque, demande-la au lieu d'inventer un prix d'achat.`,
  },
];

type Faq = { q: string; a: string };

const FAQ: Faq[] = [
  {
    q: "Combien coûte une formation IA restauration en 2026 ?",
    a: "De 397 € TTC à 1 790 € HT selon le format. L'e-learning asynchrone se situe entre 397 € et 590 € TTC (Gael Roques, L'atelier des Chefs). La formation animée en visio ou présentiel monte à 1 790 € HT pour 14 heures chez Crews Education. Plusieurs organismes (AMKG, Démarre Ton Aventure) n'affichent aucun prix public et fonctionnent sur devis.",
  },
  {
    q: "Une formation IA restaurant est-elle éligible au CPF ?",
    a: "À notre connaissance, aucune ne l'est aujourd'hui. L'article L6323-6 du Code du travail réserve le CPF aux formations sanctionnées par une certification enregistrée au RNCP ou au répertoire spécifique (RS) de France Compétences. Les formations IA restauration que nous avons relevées délivrent des certificats maison, non enregistrés. Vérifiez toujours le numéro de fiche RNCP/RS sur le site de France Compétences avant de croire une mention « CPF ».",
  },
  {
    q: "Qualiopi veut-il dire que c'est finançable par le CPF ?",
    a: "Non, et c'est la confusion la plus fréquente. Qualiopi certifie le processus qualité de l'organisme de formation, ce qui lui ouvre l'accès aux fonds publics et mutualisés (OPCO, France Travail). Le CPF ajoute une condition distincte : la formation doit mener à une certification RNCP ou RS. Un organisme peut donc être Qualiopi sans qu'aucune de ses formations ne soit éligible au CPF.",
  },
  {
    q: "Mon OPCO peut-il financer une formation IA pour mon restaurant ?",
    a: "Oui, partiellement. L'OPCO de la branche HCR est AKTO. Pour un restaurant de moins de 11 salariés, AKTO prend en charge les formations inter-entreprises à 25 €/h en présentiel et 15 €/h en distanciel, dans la limite de 2 000 € par an de coûts pédagogiques pour toute l'entreprise (règles en vigueur au 02/01/2026). Sur une formation à 1 790 € HT pour 14 h en visio, cela représente 210 € : le reste à charge est de 1 580 €.",
  },
  {
    q: "Et si je suis le patron, sans être salarié de mon restaurant ?",
    a: "L'OPCO ne vous couvre pas : il finance les salariés. En tant que dirigeant non salarié du commerce (gérant majoritaire, auto-entrepreneur), vous relevez de l'AGEFICE, qui rembourse en 2026 jusqu'à 42 €/h en présentiel, 35 €/h en distanciel synchrone et 20 €/h en asynchrone, dans un plafond annuel de 3 000 € si votre contribution à la formation professionnelle est d'au moins 7 €. Condition impérative : être à jour de cette CFP.",
  },
  {
    q: "Peut-on se former seul et gratuitement à l'IA en restauration ?",
    a: "Oui, pour la grande majorité des usages qui intéressent un restaurant : descriptions de plats, réponses aux avis, traduction de carte, posts, calcul de marges. Ces tâches se pratiquent sur vos propres données avec un outil grand public. Le programme de 4 semaines plus haut sur cette page couvre ces usages en 12 séances d'environ 20 minutes. La formation payante garde du sens dans les cas listés dans notre grille de décision.",
  },
  {
    q: "Combien de temps faut-il pour être opérationnel ?",
    a: "Comptez une séance de 20 minutes pour votre première description de plat utilisable, et environ 4 semaines à raison de 2 séances par semaine pour couvrir les six usages du quotidien. Le facteur limitant n'est pas la technique : c'est d'avoir vos fiches techniques et vos chiffres de vente sous la main quand vous attaquez les marges.",
  },
  {
    q: "Faut-il des compétences techniques ?",
    a: "Non. Tout se fait en français, en écrivant des phrases. La seule compétence qui compte est de savoir décrire précisément votre demande et de fournir vos chiffres réels. Un patron qui connaît son coût matière ira plus loin en 20 minutes qu'un expert IA sans données.",
  },
  {
    q: "Que vaut un certificat non enregistré au RNCP ?",
    a: "Sur le plan légal, rien d'opposable : ce n'est ni un diplôme, ni un titre professionnel, et il ne donne accès à aucun droit. Il documente une participation. C'est utile si un donneur d'ordre, une franchise ou un dossier vous demande une attestation de formation. Ce n'est pas utile pour valoriser un CV auprès d'un employeur, ni pour mobiliser le CPF.",
  },
  {
    q: "Peut-on mettre des données clients dans ChatGPT (RGPD) ?",
    a: "Ne collez jamais de données nominatives : nom et prénom d'un client, téléphone, e-mail, numéro de réservation, coordonnées bancaires, fiches de paie ou données de santé d'un salarié. Pour répondre à un avis, l'avis est déjà public : vous pouvez le coller, mais retirez le nom de l'auteur, il n'apporte rien à la réponse. Pour les marges, travaillez sur des libellés de plats et des montants, jamais sur des fichiers clients.",
  },
  {
    q: "Comment mesurer le retour sur investissement ?",
    a: "Notez cinq chiffres avant de commencer et relevez-les à 90 jours : ticket moyen, taux de remplissage sur votre service le plus faible, note Google et nombre d'avis, temps passé par semaine sur les tâches administratives, et marge brute moyenne de la carte. Si aucun ne bouge en trois mois, l'outil ne sert à rien chez vous, quel qu'en soit le prix.",
  },
];

const SOURCES: { label: string; url: string }[] = [
  {
    label: "Article L6323-6 du Code du travail — actions éligibles au CPF (RNCP / répertoire spécifique)",
    url: "https://code.travail.gouv.fr/code-du-travail/l6323-6",
  },
  {
    label: "AKTO — Règles de prise en charge 2026, branche Hôtels, Cafés, Restaurants (en vigueur au 02/01/2026, mise à jour 09/06/2026)",
    url: "https://www.akto.fr/regles-de-prise-en-charge-hotels-cafes-restaurants/",
  },
  {
    label: "AGEFICE — Plafonds financiers année 2026",
    url: "https://communication-agefice.fr/plafonds-financiers-annee-2026/",
  },
  {
    label: "Service-Public — CPF : la participation forfaitaire obligatoire passe à 150 € au 2 avril 2026 (décret du 30 mars 2026)",
    url: "https://www.service-public.gouv.fr/particuliers/actualites/A17364",
  },
  {
    label: "Crews Education — page de la formation IA pour les restaurants (tarif et durée relevés le 16/07/2026)",
    url: "https://www.crews-education.com/formations/formation-ia-restaurant",
  },
  {
    label: "Au cœur du CHR — L'atelier des Chefs dévoile une formation dédiée à l'IA (article du 24/06/2026)",
    url: "https://aucoeurduchr.fr/article/emploi-formation/atelier-chefs-formation-ia/",
  },
  {
    label: "Règlement (UE) n° 1169/2011 (INCO) — annexe II, liste des 14 allergènes à déclaration obligatoire",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32011R1169",
  },
];

const TOC: { id: string; label: string }[] = [
  { id: "combien", label: "Combien coûte une formation IA restauration" },
  { id: "financement", label: "Qualiopi, CPF, OPCO : ce qui est vrai" },
  { id: "decision", label: "Faut-il payer ? La grille de décision" },
  { id: "programme", label: "Le programme gratuit de 4 semaines" },
  { id: "prompts", label: "6 prompts à copier (CHR)" },
  { id: "chiffres", label: "Les repères chiffrés à connaître" },
  { id: "outils", label: "Les outils, et ce qu'ils ne font pas" },
  { id: "roi", label: "Mesurer le ROI" },
  { id: "rgpd", label: "RGPD : ce qu'on ne colle jamais" },
  { id: "faq", label: "FAQ" },
];

export default function FormationIaRestaurantPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Formation IA restaurant : le comparatif 2026 et le programme gratuit",
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
          { "@type": "ListItem", position: 2, name: "Formation IA restaurant", item: pageUrl },
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
          <span className="text-text-secondary">Formation IA restaurant</span>
        </nav>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          <span className="gradient-text">
            Formation IA restaurant : faut-il vraiment payer 1 790 € ?
          </span>
        </h1>

        <p className="mt-4 text-sm text-text-muted">
          Par Yohann Music, exploitant d&apos;un bar-restaurant à Mérignac (33) et éditeur d&apos;IA
          Restaurant · Mise à jour le {LAST_CHECKED} · Tarifs et règles de financement vérifiés à
          cette date · 12 min de lecture
        </p>

        {/* Phrase-balise : réponse autonome, extractible */}
        <div className="mt-8 card neon-border p-6">
          <p className="text-base leading-relaxed text-text-secondary">
            <strong className="text-neon">En résumé :</strong> les formations IA restauration vont de
            397 € TTC en e-learning à 1 790 € HT pour 14 h en visio. Aucune n&apos;est éligible au
            CPF, parce qu&apos;aucune ne débouche sur une certification enregistrée au RNCP ou au
            répertoire spécifique — Qualiopi ne remplace pas cette condition. Et l&apos;OPCO ne
            couvre pas tout : pour un restaurant de moins de 11 salariés, AKTO plafonne le distanciel
            à 15 €/h, soit 210 € sur une formation de 14 h à 1 790 €. Pour un patron seul qui veut
            écrire ses descriptions, répondre à ses avis et regarder ses marges, quatre semaines de
            pratique à 20 minutes par séance suffisent. La formation payante garde du sens dans trois
            cas précis, listés plus bas.
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
                <a href={`#${item.id}`} className="text-text-secondary hover:text-neon transition-colors">
                  <span className="text-text-muted">{i + 1}.</span> {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ---------------- 1. COMBIEN ---------------- */}
        <section id="combien" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Combien coûte une formation IA restauration en 2026 ?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Entre 397 € TTC et 1 790 € HT. L&apos;écart ne vient pas du contenu — il est à peu près
            le même partout — mais du format : de la vidéo qu&apos;on regarde seul d&apos;un côté, un
            formateur en visio de l&apos;autre. Personne ne compare ces offres, alors voici le
            tableau. Chaque ligne a été relevée le 16 juillet 2026 sur la page de l&apos;organisme ou
            dans la presse professionnelle citée en source.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">
                Comparatif des formations IA restauration disponibles en France, juillet 2026
              </caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Organisme</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Prix</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Durée</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Format</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">Certifiant ?</th>
                </tr>
              </thead>
              <tbody>
                {OFFERS.map((o) => (
                  <tr key={o.name} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-text-primary">
                      <a
                        href={o.source}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 hover:text-neon transition-colors"
                      >
                        {o.name}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                      <span className="mt-1 block text-xs font-normal text-text-muted">
                        {o.audience}
                      </span>
                    </th>
                    <td className="py-4 pr-4 text-text-secondary">{o.price}</td>
                    <td className="py-4 pr-4 text-text-secondary">{o.duration}</td>
                    <td className="py-4 pr-4 text-text-secondary">{o.format}</td>
                    <td className="py-4 text-text-secondary">{o.certifying}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-base leading-relaxed text-text-secondary">
            Deux choses sautent aux yeux. D&apos;abord, deux organismes sur cinq n&apos;affichent
            aucun prix — pour un patron qui veut arbitrer un budget, un devis à demander est déjà une
            réponse. Ensuite, aucune de ces formations ne délivre de certification enregistrée au
            RNCP ou au répertoire spécifique. Ça a une conséquence directe sur le financement, et
            c&apos;est la partie que tout le monde évite.
          </p>
        </section>

        {/* ---------------- 2. FINANCEMENT ---------------- */}
        <section id="financement" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Qualiopi, CPF, OPCO : ce qui est vrai et ce qui ne l&apos;est pas
          </h2>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">
            Qualiopi ne veut pas dire éligible au CPF
          </h3>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            C&apos;est la confusion n°1, et elle est entretenue. Qualiopi certifie le processus
            qualité d&apos;un organisme de formation. Elle lui ouvre la porte des fonds mutualisés
            (OPCO, France Travail). Elle ne dit rien de vos droits CPF. Le CPF, lui, obéit à
            l&apos;article L6323-6 du Code du travail : sont éligibles les actions sanctionnées par
            une certification enregistrée au{" "}
            <strong>répertoire national des certifications professionnelles (RNCP)</strong> ou au{" "}
            <strong>répertoire spécifique (RS)</strong> tenus par France Compétences. Un certificat
            créé et délivré par l&apos;organisme lui-même n&apos;entre dans aucun des deux.
          </p>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Le réflexe à avoir : demandez le numéro de fiche RNCP ou RS, et allez le chercher sur le
            site de France Compétences. Pas de numéro, pas de CPF. Le mot « Qualiopi » sur une page
            de vente n&apos;est pas une réponse à cette question. Accessoirement, depuis le 2 avril
            2026, mobiliser son CPF suppose de toute façon une participation forfaitaire de 150 € à
            sa charge (décret du 30 mars 2026), sauf abondement de l&apos;employeur ou statut de
            demandeur d&apos;emploi.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">
            Ce que l&apos;OPCO rembourse vraiment : faites le calcul avant de signer
          </h3>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            « Finançable par votre OPCO » est vrai. « Donc ça ne vous coûte rien » est faux, et
            c&apos;est là que les restaurateurs se font avoir. Votre OPCO, si vous relevez de la
            convention collective HCR, c&apos;est <strong>AKTO</strong>. AKTO ne rembourse pas le
            prix de la facture : il rembourse un tarif horaire plafonné. Voici les chiffres publiés
            par AKTO pour la branche Hôtels-Cafés-Restaurants, en vigueur au 02/01/2026, appliqués à
            une formation type de 14 h facturée 1 790 € HT en visio.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">
                Prise en charge réelle d&apos;une formation IA de 14 h à 1 790 € HT selon votre statut
              </caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Qui se forme</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Financeur</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Taux plafonné</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Plafond annuel</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">Sur 1 790 € / 14 h en visio</th>
                </tr>
              </thead>
              <tbody>
                {FUNDING.map((f) => (
                  <tr key={f.who} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-text-primary">
                      {f.who}
                    </th>
                    <td className="py-4 pr-4 text-text-secondary">{f.organism}</td>
                    <td className="py-4 pr-4 text-text-secondary">{f.rate}</td>
                    <td className="py-4 pr-4 text-text-secondary">{f.ceiling}</td>
                    <td className="py-4 font-medium text-warning">{f.onCrews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 card p-6 border-l-2 border-l-warning">
            <p className="flex gap-3 text-base leading-relaxed text-text-secondary">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-warning" />
              <span>
                Relisez la dernière colonne. Le fameux « c&apos;est pris en charge » représente entre
                210 € et 490 € sur une facture de 1 790 € HT. Vous payez la différence. Le distanciel
                est deux fois moins bien remboursé que le présentiel chez AKTO (15 €/h contre 25 €/h)
                — or c&apos;est justement en visio que ces formations se vendent.
              </span>
            </p>
          </div>

          <p className="mt-6 text-base leading-relaxed text-text-secondary">
            Le conseil qu&apos;aucune page de vente ne vous donnera : avant de payer quoi que ce
            soit, ouvrez l&apos;<strong>Espace Formation</strong> d&apos;AKTO. C&apos;est le
            catalogue négocié par la branche HCR, et sur ces formations-là les coûts pédagogiques
            sont pris en charge intégralement, hors de votre enveloppe de 2 000 €. Si ce qui vous
            intéresse y figure, la question du reste à charge ne se pose plus.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">
            Vous êtes le patron non salarié : c&apos;est l&apos;AGEFICE, pas l&apos;OPCO
          </h3>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Piège classique. L&apos;OPCO finance les <em>salariés</em>. Si vous êtes gérant
            majoritaire ou auto-entrepreneur, vous n&apos;êtes pas salarié de votre restaurant :
            AKTO ne vous couvre pas. Vous dépendez d&apos;un fonds d&apos;assurance formation. Pour
            un restaurateur inscrit comme commerçant, c&apos;est l&apos;<strong>AGEFICE</strong> ; si
            vous êtes immatriculé au répertoire des métiers comme artisan (le cas de certains
            boulangers-restaurateurs, traiteurs, pizzaïolos), c&apos;est le FAFCEA. En cas de doute,
            regardez votre attestation de contribution à la formation professionnelle : elle indique
            le fonds qui vous concerne.
          </p>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            L&apos;AGEFICE publie ses plafonds 2026 : 42 €/h en présentiel, 35 €/h en distanciel
            synchrone, 20 €/h en asynchrone, dans une enveloppe annuelle de 3 000 € par cotisant si
            votre CFP est d&apos;au moins 7 € — et seulement 600 € si elle est inférieure. La
            condition qui bloque le plus de dossiers : être à jour du versement de cette CFP. Une
            enveloppe à 5 000 € existe, mais uniquement pour les formations débouchant sur un diplôme
            national ou un titre RNCP. Aucune formation IA restauration de notre tableau n&apos;entre
            dans cette catégorie.
          </p>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Notez aussi le détail qui tue sur l&apos;e-learning : à 20 €/h en asynchrone, les 8 h de
            L&apos;atelier des Chefs ouvrent droit à 160 € sur 590 € TTC. Et l&apos;AGEFICE précise
            que le temps de travail personnel n&apos;est pas financé.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">
            Et France Travail ?
          </h3>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Ce circuit existe (l&apos;aide individuelle à la formation), mais il s&apos;adresse aux
            demandeurs d&apos;emploi, avec un projet validé par un conseiller. Si vous êtes en
            activité et que vous tenez votre établissement, il ne vous concerne pas. Voyez-le comme
            une piste pour un futur salarié en reconversion, pas pour vous.
          </p>
        </section>

        {/* ---------------- 3. DECISION ---------------- */}
        <section id="decision" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Faut-il payer ? La grille de décision honnête
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Nous vendons un outil IA pour restaurants. Nous avons donc intérêt à vous dire que la
            formation payante ne sert à rien. Ce serait faux, alors voici les deux colonnes. Si vous
            cochez une ligne de gauche, payez : ce sera plus rapide et mieux fait que tout ce que
            vous trouverez gratuitement, y compris chez nous.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="card p-6 border-l-2 border-l-success">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <Check className="h-4 w-4 text-success" />
                Payez la formation si...
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
                <li>
                  <strong className="text-text-primary">Vous avez 5 salariés ou plus à former d&apos;un coup.</strong>{" "}
                  Une intra à la journée devient défendable : AKTO plafonne l&apos;intra à 1 000 €/jour
                  pour les moins de 11 salariés, et le coût par tête s&apos;effondre. Vous formez
                  aussi tout le monde au même vocabulaire le même jour, ce qu&apos;aucun tuto ne fait.
                </li>
                <li>
                  <strong className="text-text-primary">Ce qui vous intéresse est au catalogue Espace Formation d&apos;AKTO.</strong>{" "}
                  Coûts pédagogiques pris en charge en totalité. Il n&apos;y a plus d&apos;arbitrage à
                  faire.
                </li>
                <li>
                  <strong className="text-text-primary">Un tiers exige une attestation.</strong> Franchiseur,
                  donneur d&apos;ordre, appel d&apos;offres, dossier de subvention. Là, le papier est
                  le produit — et vous ne le fabriquerez pas vous-même.
                </li>
                <li>
                  <strong className="text-text-primary">Vous savez que vous ne vous y mettrez jamais seul.</strong>{" "}
                  Se connaître vaut mieux que se mentir. Deux jours bloqués dans un agenda, c&apos;est
                  deux jours où le service ne vous rattrape pas.
                </li>
              </ul>
            </div>

            <div className="card p-6 border-l-2 border-l-danger">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <X className="h-4 w-4 text-danger" />
                Ne payez pas si...
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
                <li>
                  <strong className="text-text-primary">Vous êtes seul, un établissement, pas de salarié à former.</strong>{" "}
                  Vous allez payer 1 300 € de reste à charge (AGEFICE déduite) pour 14 h de contenu
                  que vous pratiquerez de toute façon seul le lundi suivant.
                </li>
                <li>
                  <strong className="text-text-primary">Votre objectif tient en trois mots : descriptions, avis, marges.</strong>{" "}
                  Ces trois usages représentent l&apos;essentiel de ce que l&apos;IA apporte à un
                  restaurant aujourd&apos;hui. Ils s&apos;apprennent en pratiquant, pas en écoutant.
                </li>
                <li>
                  <strong className="text-text-primary">On vous vend un certificat sans numéro RNCP.</strong>{" "}
                  Vous payez un PDF. S&apos;il n&apos;est exigé par personne, il ne vaut rien.
                </li>
                <li>
                  <strong className="text-text-primary">Vous n&apos;avez pas encore essayé 20 minutes.</strong>{" "}
                  Faites l&apos;exercice 1 ci-dessous ce soir après le service. Si dans 20 minutes
                  vous n&apos;avez rien obtenu d&apos;utilisable, alors envisagez de payer — vous
                  saurez au moins quoi demander au formateur.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------- 4. PROGRAMME ---------------- */}
        <section id="programme" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Le programme gratuit de 4 semaines, par la pratique
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Douze séances d&apos;environ 20 minutes, sur vos plats, vos avis, vos marges. Pas de
            slides. Chaque séance produit quelque chose que vous utilisez le lendemain en service.
            L&apos;ordre n&apos;est pas cosmétique : on commence par les tâches à faible enjeu (une
            description ratée ne coûte rien) et on termine par les marges, où une erreur se voit dans
            la caisse.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">
                Programme de formation IA restaurant en 4 semaines, 12 séances de 20 minutes
              </caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Quand</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Ce que vous faites</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Durée</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Avec quoi</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">Ce que vous en sortez</th>
                </tr>
              </thead>
              <tbody>
                {PROGRAM.map((w) => (
                  <tr key={w.week + w.task} className="border-b border-border-dim align-top">
                    <th scope="row" className="whitespace-nowrap py-4 pr-4 text-left font-medium text-neon">
                      {w.week}
                    </th>
                    <td className="py-4 pr-4 text-text-secondary">{w.task}</td>
                    <td className="whitespace-nowrap py-4 pr-4 text-text-muted">{w.time}</td>
                    <td className="py-4 pr-4 text-text-secondary">{w.tool}</td>
                    <td className="py-4 text-text-secondary">{w.deliverable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-base leading-relaxed text-text-secondary">
            Le piège de la semaine 3 : vous n&apos;irez nulle part sans vos fiches techniques. Si
            vous ne connaissez pas le prix d&apos;achat au kilo de votre bar ou de votre magret,
            aucune IA ne le devinera, et une formation à 1 790 € ne le devinera pas non plus. Sortez
            vos factures fournisseurs du mois avant d&apos;attaquer.
          </p>
        </section>

        {/* ---------------- 5. PROMPTS ---------------- */}
        <section id="prompts" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Six prompts à copier, écrits pour un restaurant
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Copiez-les tels quels, remplacez les crochets par vos infos, collez dans ChatGPT, Claude
            ou dans nos outils. Ce qui fait la différence entre un résultat plat et un résultat
            utilisable tient à trois choses qu&apos;on retrouve dans chacun : des contraintes
            chiffrées (25 mots, pas 30), une interdiction explicite du vocabulaire creux, et
            l&apos;ordre de demander l&apos;information manquante plutôt que de l&apos;inventer. Ce
            dernier point est le plus important quand on parle de coût matière ou d&apos;allergènes.
          </p>

          <div className="mt-6 space-y-6">
            {PROMPTS.map((p) => (
              <div key={p.n} className="card p-5">
                <h3 className="text-base font-semibold text-text-primary">
                  <span className="badge-neon mr-2">Prompt {p.n}</span>
                  {p.title}
                </h3>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-surface-3 p-4 text-xs leading-relaxed text-text-secondary">
                  <code className="whitespace-pre-wrap break-words">{p.body}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- 6. CHIFFRES ---------------- */}
        <section id="chiffres" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Les repères chiffrés à avoir en tête
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Une IA ne vous dira jamais si un chiffre est bon ou mauvais : c&apos;est vous qui fixez
            le repère. Ceux-ci sont des repères de gestion couramment utilisés en restauration
            traditionnelle, à ajuster à votre établissement et à votre carte. Ce sont aussi les
            seuils que nos outils appliquent quand ils analysent une carte.
          </p>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-text-secondary">
            <li>
              <strong className="text-neon">65 à 75 % de marge brute</strong> sur un plat : la zone
              de confort visée en restauration traditionnelle.
            </li>
            <li>
              <strong className="text-neon">Moins de 30 %</strong> : seuil d&apos;alerte. Un plat
              sous cette barre ne se rattrape pas au volume, il se retire ou se refait.
            </li>
            <li>
              <strong className="text-neon">Plus de 70 %</strong> : vos meilleurs performers. Ce sont
              eux qu&apos;on met en haut à droite de la carte, pas ceux qu&apos;on aime cuisiner.
            </li>
            <li>
              <strong className="text-neon">Coût matière = prix d&apos;achat + pertes</strong>. Le
              parage et les pertes sont ce qu&apos;on oublie le plus souvent. Un bar entier à
              24 €/kg ne coûte pas 24 €/kg dans l&apos;assiette.
            </li>
            <li>
              <strong className="text-neon">TVA 10 % sur place, 5,5 % à emporter</strong> : calculez
              toujours la marge sur le prix HT, jamais sur le TTC affiché.
            </li>
          </ul>
          <p className="mt-6 text-base leading-relaxed text-text-secondary">
            Notre analyse de carte s&apos;appuie sur ces seuils et sur la matrice BCG : chaque plat
            atterrit en Star (marge et ventes fortes), Puzzle (marge forte, ventes faibles),
            Plowhorse (ventes fortes, marge faible) ou Dog (les deux faibles), et le tout ressort en
            un score de santé du menu sur 100. Le détail de la méthode est sur notre page{" "}
            <Link href="/seo/menu-engineering-ia" className="text-neon hover:underline">
              menu engineering par l&apos;IA
            </Link>
            .
          </p>
        </section>

        {/* ---------------- 7. OUTILS ---------------- */}
        <section id="outils" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Les outils dont on vous parlera, et ce qu&apos;ils ne font pas
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Les articles sur l&apos;IA en restauration alignent les noms d&apos;outils sans jamais
            dire où s&apos;arrête chacun. Voilà la version courte, y compris pour le nôtre.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">
                Outils cités dans les formations IA restauration et limites de chacun
              </caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Outil</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Ce qu&apos;il fait bien</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">Ce qu&apos;il ne fait pas</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    t: "ChatGPT / Claude",
                    y: "Écrire, traduire, reformuler, expliquer un calcul que vous lui donnez.",
                    n: "Connaître vos prix d'achat, vos ventes, votre carte. Sans vos chiffres, il improvise.",
                  },
                  {
                    t: "Toast, Square (caisse)",
                    y: "Enregistrer ce qui se vend, sortir vos volumes par plat.",
                    n: "Vous dire quoi faire de ces volumes. C'est de la donnée, pas une décision.",
                  },
                  {
                    t: "MarketMan, Kitchen CUT, BlueCart",
                    y: "Suivre stocks, achats, fiches techniques, coût matière au fil de l'eau.",
                    n: "Rédiger votre carte ou répondre à vos clients. Rarement rentable sous 2-3 établissements.",
                  },
                  {
                    t: "Google Business Profile",
                    y: "Recevoir les avis, publier, mesurer votre note et le nombre d'avis.",
                    n: "Rédiger les réponses. C'est là que passent vos heures.",
                  },
                  {
                    t: "TheFork",
                    y: "Apporter des couverts, collecter des avis.",
                    n: "Optimiser vos marges. Il prend même une commission dessus.",
                  },
                  {
                    t: "IA Restaurant (nous)",
                    y: "Descriptions, réponses aux avis, traduction avec allergènes, marges et menu engineering, avec vos données.",
                    n: "Ni caisse, ni stock, ni réservation, ni HACCP. On ne remplace pas votre logiciel de caisse.",
                  },
                ].map((row) => (
                  <tr key={row.t} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-text-primary">
                      {row.t}
                    </th>
                    <td className="py-4 pr-4 text-text-secondary">{row.y}</td>
                    <td className="py-4 text-text-muted">{row.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------------- 8. ROI ---------------- */}
        <section id="roi" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Mesurer le ROI : cinq chiffres, avant et après
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Relevez-les aujourd&apos;hui sur un carnet, avant la première séance. Reprenez-les à 90
            jours. C&apos;est la seule façon de savoir si tout ça vous sert, et le seul moyen de
            juger honnêtement une formation payante que vous auriez suivie. Les colonnes « après »
            sont à remplir par vous : nous ne pouvons pas les préremplir sans inventer vos résultats.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="sr-only">
                Indicateurs à relever avant et 90 jours après le démarrage
              </caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Indicateur</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Où le trouver</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">Ce qui doit bouger</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Ticket moyen", w: "Votre caisse, par service", m: "Le levier le plus direct d'une carte retravaillée." },
                  { k: "Marge brute moyenne de la carte", w: "Fiches techniques + prix de vente", m: "Se juge plat par plat, pas en moyenne globale." },
                  { k: "Note Google et nombre d'avis", w: "Google Business Profile", m: "Le nombre d'avis bouge avant la note. Regardez le volume." },
                  { k: "Taux de remplissage du service faible", w: "Réservations + couverts réels", m: "Ciblez un seul service, pas la semaine entière." },
                  { k: "Temps admin par semaine", w: "Un carnet, honnêtement tenu", m: "Le gain arrive ici en premier, souvent dès la semaine 2." },
                ].map((r) => (
                  <tr key={r.k} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-text-primary">{r.k}</th>
                    <td className="py-4 pr-4 text-text-secondary">{r.w}</td>
                    <td className="py-4 text-text-secondary">{r.m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-base leading-relaxed text-text-secondary">
            Une remarque de terrain : le premier chiffre qui bouge n&apos;est presque jamais le
            chiffre d&apos;affaires, c&apos;est le temps. Répondre à dix avis un dimanche soir,
            c&apos;est une heure. Le même travail en dix minutes, ça ne se voit pas dans la caisse le
            mois suivant — ça se voit dans le fait que les avis reçoivent enfin une réponse.
          </p>
        </section>

        {/* ---------------- 9. RGPD ---------------- */}
        <section id="rgpd" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            RGPD : ce qu&apos;on ne colle jamais dans un prompt
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Pas de philosophie, juste la liste. Ces règles valent quel que soit l&apos;outil, y
            compris le nôtre.
          </p>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-text-secondary">
            <li>
              <strong className="text-danger">Jamais</strong> : nom et prénom d&apos;un client,
              téléphone, e-mail, adresse, numéro de carte, fichier de réservation exporté.
            </li>
            <li>
              <strong className="text-danger">Jamais</strong> : fiches de paie, contrats de travail,
              arrêts maladie, données de santé d&apos;un salarié.
            </li>
            <li>
              <strong className="text-text-primary">Un avis Google est déjà public</strong> : vous
              pouvez le coller pour préparer une réponse. Retirez quand même le nom de l&apos;auteur,
              il n&apos;ajoute rien.
            </li>
            <li>
              <strong className="text-text-primary">Photos de plats générées par IA</strong> : une
              image qui ne correspond pas à l&apos;assiette servie vous expose sur le terrain de la
              pratique commerciale trompeuse. Photographiez ce que vous servez.
            </li>
            <li>
              <strong className="text-text-primary">Allergènes</strong> : l&apos;affichage relève du
              règlement INCO (UE) 1169/2011 et engage votre responsabilité. Une IA aide à mettre en
              forme le tableau. Elle ne valide pas le contenu de l&apos;assiette — c&apos;est le
              cuisinier qui sait ce qu&apos;il a mis dedans.
            </li>
            <li>
              <strong className="text-text-primary">Traçabilité HACCP</strong> : relevés de
              températures, plan de nettoyage, DLC. Ça ne se génère pas, ça se constate. Aucune IA ne
              remplace un relevé.
            </li>
          </ul>
        </section>

        {/* ---------------- 10. FAQ ---------------- */}
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

        {/* ---------------- CTA ---------------- */}
        <section className="mt-16 card neon-border p-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Faites l&apos;exercice 1 maintenant
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Prenez votre plat signature, le prompt n°1, et vingt minutes. Le plan gratuit inclut 50
            jetons par mois, sans carte bancaire : de quoi générer une dizaine de descriptions ou de
            réponses aux avis, ou lancer une analyse de carte. Crews demande 1 790 € et une session
            en septembre. Vous, vous saurez ce soir si ça marche chez vous.
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

        {/* ---------------- MAILLAGE ---------------- */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-text-primary">Pour aller plus loin</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Chaque usage du programme de 4 semaines a sa page détaillée :
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/seo/menu-engineering-ia", label: "Menu engineering par l'IA", desc: "La matrice BCG appliquée à votre carte" },
              { href: "/seo/analyse-marge-restaurant", label: "Analyse des marges", desc: "Calculer la marge réelle de chaque plat" },
              { href: "/seo/repondre-avis-google-restaurant", label: "Répondre aux avis Google", desc: "Les réponses de la semaine 1" },
              { href: "/seo/traduction-carte-restaurant", label: "Traduire sa carte", desc: "9 langues, termes culinaires préservés" },
              { href: "/seo/description-plat-ia", label: "Descriptions de plats", desc: "L'exercice n°1, en détail" },
              { href: "/seo/intelligence-artificielle-restauration", label: "L'IA en restauration", desc: "Le panorama général des usages" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="card card-glow p-4 transition-colors"
              >
                <span className="block text-sm font-medium text-text-primary">{l.label}</span>
                <span className="mt-1 block text-xs text-text-muted">{l.desc}</span>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-text-secondary">
            Nos autres outils pour le CHR, hors IA :{" "}
            <a href="https://pack-hygiene-restaurant.fr" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">
              pack hygiène et HACCP
            </a>
            ,{" "}
            <a href="https://affichage-obligatoire-restaurant.fr" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">
              affichages obligatoires
            </a>
            ,{" "}
            <a href="https://creer-menu-restaurant.fr" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">
              éditeur de menu
            </a>{" "}
            et{" "}
            <a href="https://ouvrir-un-bar.fr" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">
              ouvrir un bar
            </a>
            .
          </p>
        </section>

        {/* ---------------- SOURCES ---------------- */}
        <section className="mt-16 border-t border-border-dim pt-8">
          <h2 className="text-lg font-bold text-text-primary">Sources</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Tarifs, plafonds et règles d&apos;éligibilité relevés le {LAST_CHECKED}. Le financement
            de la formation évolue par décret et par décision de branche : vérifiez la date de mise à
            jour des pages ci-dessous avant d&apos;engager un dossier, et confirmez votre cas auprès
            de votre conseiller AKTO ou AGEFICE.
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
            Cette page est éditée par Kipdev (SIREN 884120890), éditeur d&apos;IA Restaurant. Nous
            vendons un logiciel, pas de la formation, et nous ne sommes pas organisme de formation :
            nous n&apos;avons ni Qualiopi, ni certification enregistrée, et nous ne touchons aucune
            commission sur les formations citées. Les liens vers les organismes ne sont pas affiliés.
          </p>
        </section>
      </article>
    </div>
  );
}
