import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ExternalLink, Clock, Hash } from "lucide-react";
import { siteConfig } from "@/lib/config";

const PAGE_PATH = "/seo/idee-post-instagram-restaurant";
const pageUrl = `${siteConfig.url}${PAGE_PATH}`;

const LAST_CHECKED = "24 juillet 2026";
const LAST_CHECKED_ISO = "2026-07-24T09:00:00+02:00";
const PUBLISHED_ISO = "2026-07-24T09:00:00+02:00";

export const metadata: Metadata = {
  title: "30 idées de posts Instagram pour restaurant + calendrier 2026",
  description:
    "30 idées de posts Instagram pour restaurant classées par thème, un calendrier éditorial de 4 semaines prêt à l'emploi, les meilleurs horaires, les hashtags locaux et des légendes qui donnent envie.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "30 idées de posts Instagram pour restaurant + calendrier 4 semaines",
    description:
      "Quoi poster quand on tient un restaurant : 30 idées classées, un calendrier de 4 semaines, les bons créneaux, les hashtags et des exemples de légendes.",
  },
};

/* -------------------------------------------------------------------------- */
/*  Données                                                                    */
/* -------------------------------------------------------------------------- */

type IdeaGroup = { theme: string; hint: string; ideas: string[] };

const IDEAS: IdeaGroup[] = [
  {
    theme: "Les plats (le cœur, 40 % de vos posts)",
    hint: "Ce que les gens viennent voir. Priorité à la vidéo courte et au gros plan.",
    ideas: [
      "Le plat du jour filmé au dressage (reel de 8 à 12 s)",
      "Le gros plan « texture » : le coulant du fondant, le fromage qui file, la découpe qui fume",
      "Un nouveau plat de la carte, avec son histoire en une phrase",
      "Le plat signature raconté : d'où vient la recette, pourquoi c'est le vôtre",
      "L'accord mets-vin ou mets-bière du moment",
    ],
  },
  {
    theme: "Les coulisses (l'authenticité qui crée le lien)",
    hint: "Ce qu'aucune photo de plat ne montre : le vrai. Fort taux d'enregistrement et de partage.",
    ideas: [
      "L'arrivage du marché le matin, cageots ouverts",
      "Le chef en action, mains dans la sauce, sans filtre",
      "La préparation d'une sauce ou d'une pâte, en accéléré",
      "La livraison d'un producteur local, visage et nom à l'appui",
      "Le mise en place du service, la salle qui se prépare",
    ],
  },
  {
    theme: "L'équipe (les visages qu'on vient revoir)",
    hint: "Les gens reviennent pour des personnes autant que pour des plats.",
    ideas: [
      "Le portrait d'un membre de l'équipe : son poste, son plat préféré",
      "La nouvelle recrue présentée en story",
      "Le chef qui raconte son parcours en 30 secondes",
      "Un anniversaire ou un pot d'équipe (le côté humain)",
    ],
  },
  {
    theme: "La preuve sociale (les autres parlent pour vous)",
    hint: "Un avis client vaut dix autopromotions. À reposter avec accord.",
    ideas: [
      "Une capture d'un avis 5 étoiles (Google, TheFork), mise en scène",
      "Le repost d'une story où un client vous a identifié",
      "La table d'habitués, la photo de groupe (avec leur accord)",
      "Un « merci » chiffré : « 200 tartes flambées ce week-end »",
    ],
  },
  {
    theme: "Les offres (sans en faire trop, 15 % max)",
    hint: "Une offre claire, un CTA net. Trop de promo tue l'image.",
    ideas: [
      "Le menu du midi mis en avant en début de semaine",
      "L'happy hour ou l'offre after-work",
      "La carte cadeau, idéale avant les fêtes",
      "Une offre de saison limitée (« jusqu'à dimanche »)",
    ],
  },
  {
    theme: "Le saisonnier et le local (le rendez-vous récurrent)",
    hint: "L'algorithme et les clients aiment ce qui colle au moment présent.",
    ideas: [
      "Le produit de saison qui débarque (asperges, cèpes, truffe, tomates)",
      "La terrasse au premier rayon de soleil",
      "Le plat d'hiver réconfortant quand il pleut",
      "Le clin d'œil au quartier : un lieu, un voisin, une fête locale",
    ],
  },
  {
    theme: "L'interactif et l'événement (l'engagement)",
    hint: "Fait parler votre audience : sondages, questions, jeux.",
    ideas: [
      "Le sondage story « quel plat au menu ce week-end ? »",
      "La soirée à thème annoncée puis résumée en stories",
      "Le quiz ou la devinette (« devinez l'ingrédient secret »)",
      "L'ouverture des réservations pour une date spéciale",
    ],
  },
];

type Day = { jour: string; feed: string; story: string };

// Semaine type reproductible sur 4 semaines. Rythme réaliste pour un petit resto :
// 3 à 4 posts au feed + stories quotidiennes légères.
const WEEK: Day[] = [
  { jour: "Lundi", feed: "—", story: "Coulisses : le marché, la mise en place" },
  { jour: "Mardi", feed: "Reel plat du jour au dressage", story: "Rappel du menu du midi" },
  { jour: "Mercredi", feed: "Avis client 5★ mis en scène", story: "Sondage « quel plat ce week-end ? »" },
  { jour: "Jeudi", feed: "Coulisses cuisine / portrait d'équipe", story: "Behind the scene du service" },
  { jour: "Vendredi", feed: "Reel + offre week-end (menu, terrasse)", story: "Teasing du soir, réservations" },
  { jour: "Samedi", feed: "—", story: "Ambiance de salle en direct" },
  { jour: "Dimanche", feed: "Post saisonnier / produit du moment", story: "Repost d'une story client" },
];

// Rotation d'angle sur 4 semaines pour ne jamais se répéter.
const ROTATION: { semaine: string; angle: string }[] = [
  { semaine: "Semaine 1", angle: "Focus produit : nouveaux plats, produits de saison, textures" },
  { semaine: "Semaine 2", angle: "Focus humain : équipe, chef, producteurs, coulisses" },
  { semaine: "Semaine 3", angle: "Focus preuve sociale : avis, reposts clients, habitués" },
  { semaine: "Semaine 4", angle: "Focus événement : soirée à thème, offre, interaction" },
];

type Slot = { moment: string; creneau: string; pourquoi: string };

const SLOTS: Slot[] = [
  { moment: "Le midi", creneau: "11 h 00 – 13 h 00", pourquoi: "Les gens décident où déjeuner. Un plat du jour posté à 11 h peut remplir une table à midi." },
  { moment: "L'apéro / avant-dîner", creneau: "17 h 30 – 19 h 30", pourquoi: "Le créneau où l'on cherche « on va où ce soir ? ». Idéal pour le teasing du service." },
  { moment: "Le week-end", creneau: "Sam. & dim. matin", pourquoi: "Temps libre, scroll détendu, projets de sortie. Bon pour l'ambiance et le brunch." },
];

type Caption = { contexte: string; texte: string };

const CAPTIONS: Caption[] = [
  {
    contexte: "Nouveau plat",
    texte: "On a mis 3 essais avant d'être fiers de celle-là 👇 Notre nouvelle tarte fine aux cèpes arrive ce soir. Vous testez ce week-end ? 🍄",
  },
  {
    contexte: "Coulisses cuisine",
    texte: "6 h du matin, le pain n'est pas encore là mais la sauce, si. Voilà à quoi ressemble un jeudi avant que vous poussiez la porte 👨‍🍳",
  },
  {
    contexte: "Avis client",
    texte: "« Meilleur burger de [quartier], on reviendra » — merci Julie 🙏 On garde la même viande, taillée au couteau chaque matin. À très vite !",
  },
  {
    contexte: "Offre / menu du midi",
    texte: "Entrée + plat + café à [prix] ce midi, service jusqu'à 14 h. On garde une table pour vous ? Réservez en DM ou au [numéro] 📍 [quartier / ville]",
  },
  {
    contexte: "Interaction / sondage",
    texte: "Grand débat de comptoir ⚖️ Frites maison OU gratin dauphinois avec la pièce du boucher ce week-end ? Votez en story, on cuisine le gagnant 🔥",
  },
];

type Faq = { q: string; a: string };

const FAQ: Faq[] = [
  {
    q: "Combien de fois par semaine un restaurant doit-il poster sur Instagram ?",
    a: "Pour un petit restaurant, visez 3 à 4 posts au feed par semaine (reels et photos) plus des stories quasi quotidiennes, plus légères. Mieux vaut 3 posts soignés qu'un post bâclé chaque jour : la régularité tenable dans la durée compte plus que le volume. Les stories, elles, portent le quotidien (plat du jour, coulisses, ambiance) sans exiger de production. Le calendrier de 4 semaines de cette page suit exactement ce rythme.",
  },
  {
    q: "Quels sont les meilleurs jours et horaires pour poster ?",
    a: "Alignez vos publications sur les moments de faim et de décision : le midi (11 h–13 h), quand les gens choisissent où déjeuner, et l'avant-dîner (17 h 30–19 h 30), quand ils cherchent où sortir le soir. Le week-end en matinée fonctionne bien pour l'ambiance et le brunch. Ce sont des repères de départ : votre vraie réponse est dans les statistiques Instagram (onglet « Vos abonnés » de la vue professionnelle), qui indiquent les heures où VOTRE audience est en ligne. Testez, mesurez, ajustez.",
  },
  {
    q: "Quoi poster quand on n'a pas de nouveau plat à montrer ?",
    a: "C'est justement là que servent les coulisses, l'équipe et la preuve sociale. L'arrivage du matin, le chef qui prépare une sauce, le portrait d'un serveur, une capture d'avis 5 étoiles, un sondage story « quel plat ce week-end ? » : aucun de ces posts ne demande un nouveau plat. Les 30 idées de cette page sont classées en 7 thèmes justement pour ne jamais tomber en panne d'inspiration un lundi soir.",
  },
  {
    q: "Combien de hashtags mettre, et lesquels ?",
    a: "Privilégiez 5 à 12 hashtags ciblés plutôt que 30 génériques. Les tags géants (#food, #foodporn, avec des dizaines de millions de posts) vous noient ; les tags locaux et de niche (#restaurant[votreville], #[votreville]food, #miam[votreville]) vous rendent trouvable par des gens qui peuvent réellement venir manger chez vous. Mélangez un ou deux tags de découverte moyens, plusieurs tags locaux, et un tag de votre spécialité (#pizzanapolitaine, #cuisinedumarché).",
  },
  {
    q: "Faut-il privilégier les reels ou les photos ?",
    a: "Les reels (vidéos courtes) ont aujourd'hui la plus forte portée sur Instagram : une vidéo de dressage de 8 à 12 secondes touche généralement plus de comptes qu'une photo. Mais la photo garde son rôle pour la preuve sociale, les avis et les visuels léchés. Le bon équilibre pour un restaurant : au moins la moitié des posts en reels, le reste en photos et carrousels, et le quotidien en stories.",
  },
  {
    q: "Comment écrire une légende qui donne envie ?",
    a: "Une bonne légende ouvre sur un détail concret ou une histoire (« on a mis 3 essais avant d'être fiers de celle-là »), pas sur une description plate du plat. Ajoutez toujours un appel à l'action clair : une question (« vous testez ce week-end ? »), une invitation à réserver, ou un vote en story. Glissez naturellement votre quartier ou ville pour le référencement local. Et gardez votre voix : un food-truck ne parle pas comme une table gastronomique.",
  },
];

const SOURCES: { label: string; url: string }[] = [
  {
    label: "Instagram — Aide : consulter les statistiques et les heures d'activité de votre audience (compte professionnel)",
    url: "https://help.instagram.com/1533933820244654",
  },
  {
    label: "Instagram / Creators — Bonnes pratiques hashtags et reels",
    url: "https://creators.instagram.com/",
  },
];

const TOC: { id: string; label: string }[] = [
  { id: "idees", label: "30 idées de posts classées par thème" },
  { id: "calendrier", label: "Le calendrier éditorial de 4 semaines" },
  { id: "horaires", label: "Meilleurs jours et horaires" },
  { id: "hashtags", label: "Hashtags locaux et légendes" },
  { id: "faq", label: "Questions fréquentes" },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function IdeePostInstagramPage() {
  const totalIdeas = IDEAS.reduce((n, g) => n + g.ideas.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "30 idées de posts Instagram pour restaurant + calendrier de 4 semaines",
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
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Idées de posts Instagram pour restaurant", item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#ideas`,
        name: "30 idées de posts Instagram pour restaurant",
        numberOfItems: totalIdeas,
        itemListElement: IDEAS.flatMap((g) => g.ideas).map((idea, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: idea,
        })),
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
          <span className="text-text-secondary">Idées de posts Instagram restaurant</span>
        </nav>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          <span className="gradient-text">
            30 idées de posts Instagram pour restaurant + un calendrier de 4 semaines prêt à
            l&apos;emploi
          </span>
        </h1>

        <p className="mt-4 text-sm text-text-muted">
          Par Yohann Music, exploitant d&apos;un bar-restaurant à Mérignac (33) et éditeur d&apos;IA
          Restaurant · Mise à jour le {LAST_CHECKED} · 9 min de lecture
        </p>

        <div className="mt-8 card neon-border p-6">
          <p className="text-base leading-relaxed text-text-secondary">
            <strong className="text-neon">En résumé :</strong> le vrai problème n&apos;est pas
            « comment poster » mais « quoi poster ». Voici {totalIdeas} idées classées en 7 thèmes
            (plats, coulisses, équipe, preuve sociale, offres, saisonnier, interactif) et un
            calendrier de 4 semaines qui les répartit sans jamais se répéter. Rythme réaliste pour un
            petit resto : 3 à 4 posts au feed par semaine plus des stories quotidiennes légères,
            postés aux moments de faim (le midi 11 h-13 h, l&apos;avant-dîner 17 h 30-19 h 30). Vos
            vrais horaires se lisent dans les statistiques Instagram. Hashtags : 5 à 12 tags locaux
            plutôt que 30 génériques.
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

        {/* 1. IDEES */}
        <section id="idees" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            {totalIdeas} idées de posts, classées par thème
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Le secret d&apos;un compte qui tient dans la durée, c&apos;est de faire tourner les
            thèmes. Voici les sept familles à alterner, avec le rôle de chacune et des idées
            concrètes à décliner.
          </p>
          <div className="mt-6 space-y-6">
            {IDEAS.map((g) => (
              <div key={g.theme} className="card p-5">
                <h3 className="text-base font-semibold text-neon">{g.theme}</h3>
                <p className="mt-1 text-xs italic text-text-muted">{g.hint}</p>
                <ul className="mt-3 space-y-2">
                  {g.ideas.map((idea) => (
                    <li key={idea} className="flex gap-2 text-sm leading-relaxed text-text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden />
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 2. CALENDRIER */}
        <section id="calendrier" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Le calendrier éditorial de 4 semaines
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Voici une semaine type — 3 à 4 posts au feed, des stories chaque jour — que vous répétez
            quatre fois. Pour ne jamais vous répéter, chaque semaine change d&apos;angle dominant. Le
            squelette reste le même ; le contenu tourne.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">Semaine type de publication pour un restaurant sur Instagram</caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Jour</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Post au feed</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">Story</th>
                </tr>
              </thead>
              <tbody>
                {WEEK.map((d) => (
                  <tr key={d.jour} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-neon">{d.jour}</th>
                    <td className="py-4 pr-4 text-text-secondary">{d.feed}</td>
                    <td className="py-4 text-text-secondary">{d.story}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">L&apos;angle dominant, semaine par semaine</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ROTATION.map((r) => (
              <div key={r.semaine} className="card p-4">
                <p className="text-sm font-semibold text-neon">{r.semaine}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{r.angle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. HORAIRES */}
        <section id="horaires" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Les meilleurs jours et horaires pour publier
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            La règle d&apos;or d&apos;un restaurant : postez quand les gens ont faim et décident où
            manger. Voici les trois fenêtres qui marchent le mieux — à confirmer avec VOS statistiques.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {SLOTS.map((s) => (
              <div key={s.moment} className="card p-5">
                <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                  <Clock className="h-4 w-4 text-neon" /> {s.moment}
                </h3>
                <p className="mt-2 text-sm font-medium text-neon">{s.creneau}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.pourquoi}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 card p-5 border-l-2 border-l-neon">
            <p className="text-sm leading-relaxed text-text-secondary">
              <strong className="text-text-primary">Le seul horaire qui compte vraiment est le vôtre.</strong>{" "}
              Passez en compte professionnel (gratuit) et ouvrez les statistiques : l&apos;onglet
              « Vos abonnés » indique les heures et jours où votre audience est réellement en ligne.
              Ces fenêtres sont un point de départ, pas une vérité — testez deux semaines, comparez la
              portée, gardez ce qui marche chez vous.
            </p>
          </div>
        </section>

        {/* 4. HASHTAGS + LEGENDES */}
        <section id="hashtags" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Hashtags locaux et légendes qui donnent envie
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Sur les hashtags, la règle a changé : 5 à 12 tags ciblés valent mieux que 30 génériques.
            Un restaurant se fait trouver par la proximité, pas par #foodporn (des dizaines de
            millions de posts où vous disparaissez en une seconde).
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Hash className="h-4 w-4 text-neon" /> Locaux (priorité)
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                #restaurant[ville], #[ville]food, #miam[ville], #[quartier], #bonplan[ville]. Ce sont
                eux qui amènent des gens capables de pousser votre porte.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Hash className="h-4 w-4 text-neon" /> Spécialité
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                #pizzanapolitaine, #cuisinedumarché, #brunch[ville], #foodtruck[ville]. Le tag qui dit
                ce que vous faites précisément.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Hash className="h-4 w-4 text-neon" /> Découverte (1-2 max)
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Un ou deux tags de taille moyenne pour élargir, jamais les géants où l&apos;on se
                noie. Vérifiez le volume avant d&apos;ajouter.
              </p>
            </div>
          </div>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">5 modèles de légendes à adapter</h3>
          <p className="mt-2 text-sm text-text-secondary">
            Une bonne légende ouvre sur un détail concret et se termine par un appel à l&apos;action.
            Remplacez les crochets par vos vrais mots.
          </p>
          <div className="mt-4 space-y-4">
            {CAPTIONS.map((c) => (
              <div key={c.contexte} className="card p-5">
                <p className="text-sm font-semibold text-neon">{c.contexte}</p>
                <blockquote className="mt-2 rounded-lg border-l-2 border-l-neon bg-surface-3 p-4 text-sm leading-relaxed text-text-secondary">
                  {c.texte}
                </blockquote>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 card neon-border p-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Transformez chaque idée en post prêt à publier
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Vous avez l&apos;idée, il vous manque le texte ? Notre générateur de posts écrit la
            légende, adapte le ton à votre cuisine et propose les hashtags — pour Instagram, Facebook
            ou TikTok. Vous partez d&apos;une des 30 idées ci-dessus et vous obtenez un post à relire
            et publier. Le plan gratuit inclut 50 jetons par mois, sans carte bancaire ; un post coûte
            5 jetons.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2">
              Générer mes posts gratuitement
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
              { href: "/seo/social-media-restaurant-ia", label: "Réseaux sociaux restaurant par l'IA", desc: "Le générateur de posts Instagram, Facebook, TikTok" },
              { href: "/seo/repondre-avis-google-restaurant", label: "Répondre aux avis Google", desc: "Transformer la preuve sociale en réponses qui vendent" },
              { href: "/seo/description-plat-ia", label: "Descriptions de plats par l'IA", desc: "Des textes appétissants réutilisables en légende" },
              { href: "/seo/optimiser-carte-restaurant", label: "Optimiser sa carte", desc: "Mettre en valeur les plats que vous montrez en photo" },
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
            Repères vérifiés le {LAST_CHECKED}. Les créneaux horaires sont des points de départ à
            valider dans vos propres statistiques Instagram ; les fonctionnalités (compte pro,
            statistiques d&apos;audience) sont documentées par Instagram.
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
            Cette page est éditée par Kipdev (SIREN 884120890), éditeur d&apos;IA Restaurant.
          </p>
        </section>
      </article>
    </div>
  );
}
