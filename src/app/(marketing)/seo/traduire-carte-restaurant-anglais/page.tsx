import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, X, ExternalLink, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/lib/config";

const PAGE_PATH = "/seo/traduire-carte-restaurant-anglais";
const pageUrl = `${siteConfig.url}${PAGE_PATH}`;

const LAST_CHECKED = "24 juillet 2026";
const LAST_CHECKED_ISO = "2026-07-24T09:00:00+02:00";
const PUBLISHED_ISO = "2026-07-24T09:00:00+02:00";

export const metadata: Metadata = {
  title: "Traduire une carte de restaurant en anglais : lexique 2026",
  description:
    "Traduire sa carte FR→EN sans faire fuir les touristes : lexique de 45 termes culinaires, faux-amis (onglet, ris de veau, entrée), erreurs de Google Translate et modèle de carte bilingue.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    url: pageUrl,
    title: "Traduire la carte de son restaurant en anglais : le guide et le lexique",
    description:
      "45 termes culinaires FR→EN, les faux-amis qui font rire ou fuir, les ratés réels de Google Translate, et comment bâtir une carte bilingue qui vend.",
  },
};

/* -------------------------------------------------------------------------- */
/*  Données                                                                    */
/* -------------------------------------------------------------------------- */

type Lex = { fr: string; en: string; note?: string; keep?: boolean; trap?: boolean };

// Lexique culinaire FR→EN. keep = terme à garder en français sur la carte.
// trap = faux-ami ou piège de traduction automatique à signaler.
const LEXIQUE: Lex[] = [
  { fr: "Entrée", en: "Starter / Appetizer", trap: true, note: "Piège n°1 : aux États-Unis, « entrée » désigne le PLAT PRINCIPAL. Un Américain qui lit « Entrée » s'attend au plat, pas au hors-d'œuvre. Écrivez « Starter » (UK) ou « Appetizer » (US), jamais « Entree »." },
  { fr: "Plat principal", en: "Main course / Main", note: "« Main » suffit. Évitez « Dish » seul, trop vague." },
  { fr: "Crème brûlée", en: "Crème brûlée", keep: true, trap: true, note: "Google Translate propose « Burnt cream ». On garde le nom français, c'est un plat signature reconnu partout." },
  { fr: "Magret de canard", en: "Seared duck breast", note: "« Duck breast » est correct. Le magret est le blanc d'un canard gavé ; « fillet of duck » est faux." },
  { fr: "Andouillette", en: "Andouillette (coarse tripe sausage)", keep: true, trap: true, note: "Garder le nom + une glose courte. La traduction littérale « chitterling sausage » fait fuir 9 touristes sur 10 ; mieux vaut décrire honnêtement." },
  { fr: "Tartare (de bœuf)", en: "Steak tartare (raw)", trap: true, note: "Ajoutez « raw » : beaucoup d'anglophones ignorent que c'est cru. Ne pas confondre avec « tartar(e) sauce », la sauce tartare." },
  { fr: "Blanquette de veau", en: "Veal stew in white sauce", trap: true, note: "Google Translate donne « Veal blanket » (couverture de veau). À bannir." },
  { fr: "Gratin dauphinois", en: "Gratin dauphinois (sliced potatoes baked in cream)", keep: true, note: "On garde le nom et on explique. « Dauphinois potatoes » passe aussi au Royaume-Uni." },
  { fr: "Confit de canard", en: "Duck confit", keep: true, trap: true, note: "On garde « confit ». Google Translate propose parfois « candied duck » (canard confit... au sucre). Faux et repoussant." },
  { fr: "Onglet (à l'échalote)", en: "Hanger steak (with shallots)", trap: true, note: "Fou rire garanti : « onglet » veut aussi dire « onglet/vignette » en informatique, et Google Translate rend « Thumbnail with shallot ». Le bon terme boucher est « hanger steak »." },
  { fr: "Ris de veau", en: "Veal sweetbreads", trap: true, note: "Le piège absolu : « ris » n'est pas « riz ». Google Translate a longtemps donné « Veal rice ». Ce sont les sweetbreads (thymus), pas du riz." },
  { fr: "Noix de Saint-Jacques", en: "Scallops", trap: true, note: "Traduit mot à mot en « Saint James nut » ou « Saint-Jacques nut ». Ce sont tout simplement des scallops." },
  { fr: "Bavette", en: "Flank steak", note: "« Bavette » signifie aussi « bib » (bavoir) : la machine peut se tromper. Le terme boucher est flank steak." },
  { fr: "Entrecôte", en: "Rib steak / Rib-eye", note: "Rib-eye parle davantage à la clientèle américaine." },
  { fr: "Faux-filet", en: "Sirloin steak", trap: true, note: "Ne surtout pas traduire par « fake fillet ». C'est le sirloin." },
  { fr: "Cuisson saignant", en: "Rare", note: "Bleu = Blue (very rare) · Saignant = Rare · À point = Medium · Bien cuit = Well done. « À point » n'est PAS « medium rare »." },
  { fr: "Œuf mollet", en: "Soft-boiled egg", note: "Œuf à la coque = soft-boiled (in the shell) · Œuf poché = poached · Œuf au plat = fried egg." },
  { fr: "Pâté en croûte", en: "Pâté in a pastry crust", keep: true, trap: true, note: "Garder « pâté ». En anglais « paste » évoque une pâte à tartiner industrielle : à éviter." },
  { fr: "Rillettes", en: "Rillettes (potted pork)", keep: true, note: "On garde le nom et on ajoute « potted pork/duck » pour situer." },
  { fr: "Boudin noir", en: "Blood sausage / Black pudding", note: "« Black pudding » parle aux Britanniques, « blood sausage » aux Américains." },
  { fr: "Pot-au-feu", en: "Pot-au-feu (beef & vegetable stew)", keep: true, note: "Nom conservé + glose. Plat culturel identifiable." },
  { fr: "Bœuf bourguignon", en: "Beef bourguignon", keep: true, note: "Reconnu tel quel, ne pas traduire « bourguignon »." },
  { fr: "Blanc de poulet", en: "Chicken breast", trap: true, note: "Google Translate rend « White chicken » (poulet blanc). C'est le chicken breast." },
  { fr: "Suprême de volaille", en: "Chicken supreme (breast fillet)", trap: true, note: "« Supreme poultry » n'existe pas. Un suprême est un blanc avec l'aileron." },
  { fr: "Cuisses de grenouille", en: "Frog legs", note: "Traduction directe correcte, à assumer telle quelle." },
  { fr: "Escargots", en: "Snails (escargots)", keep: true, note: "« Escargots » est passé dans l'anglais ; ajouter « snails » lève tout doute." },
  { fr: "Fruits de mer", en: "Seafood", trap: true, note: "Jamais « sea fruits ». Un plateau = « seafood platter »." },
  { fr: "Assiette anglaise", en: "Cold cut platter", trap: true, note: "Ce n'est pas une « English plate » : c'est un assortiment de charcuterie froide." },
  { fr: "Charcuterie", en: "Charcuterie / Cured meats", keep: true, note: "« Charcuterie » est compris ; « cold cuts » aux États-Unis." },
  { fr: "Velouté", en: "Velouté (creamy soup)", keep: true, note: "Garder le nom, glose « creamy soup »." },
  { fr: "Potage", en: "Soup", note: "Un simple « soup » suffit." },
  { fr: "Coulis", en: "Coulis (fruit sauce)", keep: true, note: "Terme conservé en anglais gastronomique." },
  { fr: "Mijoté", en: "Slow-cooked / Simmered", note: "Mode de cuisson : « stewed » pour une viande en sauce." },
  { fr: "Poêlé", en: "Pan-fried / Pan-seared", note: "« Seared » pour une saisie vive." },
  { fr: "Émincé", en: "Thinly sliced", note: "« Émincé de bœuf » = thinly sliced beef." },
  { fr: "Pané", en: "Breaded", note: "« Breaded » (US) / « in breadcrumbs » (UK)." },
  { fr: "Flambé", en: "Flambéed", keep: true, note: "Le terme flambé est passé dans l'anglais." },
  { fr: "Pain perdu", en: "French toast", trap: true, note: "Surtout pas « lost bread ». C'est le French toast." },
  { fr: "Île flottante", en: "Floating island (îles flottantes)", keep: true, note: "La traduction littérale est ici l'appellation officielle du dessert." },
  { fr: "Mille-feuille", en: "Mille-feuille (Napoleon)", keep: true, note: "Aux États-Unis, « Napoleon ». « Thousand-sheet » est à proscrire." },
  { fr: "Fondant au chocolat", en: "Molten chocolate cake", note: "« Molten » (cœur coulant) plutôt que « fondant », peu compris." },
  { fr: "Chantilly", en: "Whipped cream", note: "Crème Chantilly = whipped cream (sweetened)." },
  { fr: "Compote", en: "Stewed fruit / Compote", note: "Compote de pommes = apple sauce (US) / stewed apple (UK)." },
  { fr: "Café gourmand", en: "Café gourmand (coffee with mini desserts)", keep: true, note: "Concept français : garder le nom, expliquer. Très vendeur auprès des touristes." },
  { fr: "Plat du jour", en: "Today's special / Dish of the day", note: "« Special of the day » est l'usage le plus courant." },
  { fr: "Formule / Menu", en: "Set menu / Fixed-price menu", trap: true, note: "« Menu » en anglais = la CARTE entière. Votre « menu à 22 € » se dit « set menu ». Et « formule » n'est jamais « formula »." },
];

type Allergen = { fr: string; en: string };

// Les 14 allergènes à déclaration obligatoire (règlement UE 1169/2011, annexe II).
const ALLERGENS: Allergen[] = [
  { fr: "Gluten (céréales)", en: "Cereals containing gluten" },
  { fr: "Crustacés", en: "Crustaceans" },
  { fr: "Œufs", en: "Eggs" },
  { fr: "Poissons", en: "Fish" },
  { fr: "Arachides", en: "Peanuts" },
  { fr: "Soja", en: "Soybeans" },
  { fr: "Lait", en: "Milk" },
  { fr: "Fruits à coque", en: "Tree nuts" },
  { fr: "Céleri", en: "Celery" },
  { fr: "Moutarde", en: "Mustard" },
  { fr: "Graines de sésame", en: "Sesame seeds" },
  { fr: "Sulfites (anhydride sulfureux)", en: "Sulphur dioxide and sulphites" },
  { fr: "Lupin", en: "Lupin" },
  { fr: "Mollusques", en: "Molluscs" },
];

type Legal = { fr: string; en: string; note: string };

const LEGAL: Legal[] = [
  {
    fr: "Prix nets, service compris",
    en: "All prices include tax and service",
    note: "En France, le service (15 %) et la TVA sont TOUJOURS inclus par la loi. Le dire en anglais évite au client américain de laisser un pourboire de 20 % par culpabilité — ou de croire qu'on l'a floué.",
  },
  {
    fr: "Fait maison",
    en: "Homemade",
    note: "La mention « fait maison » (plat cuisiné sur place à partir de produits bruts) est encadrée en France. « Homemade » est son équivalent direct.",
  },
  {
    fr: "Origine des viandes",
    en: "Origin of meats: [pays]",
    note: "L'affichage de l'origine des viandes bovine, porcine, ovine et de volaille est obligatoire en restauration. Traduisez le pays, pas juste le mot.",
  },
  {
    fr: "Boissons non comprises",
    en: "Drinks not included",
    note: "À préciser sous une formule/set menu pour éviter la mauvaise surprise à l'addition." ,
  },
  {
    fr: "Nos plats peuvent contenir des allergènes, demandez-nous",
    en: "Our dishes may contain allergens — please ask our staff",
    note: "Formule d'appel conforme : la liste détaillée doit rester disponible sur demande (écrit ou oral)." ,
  },
];

type Faq = { q: string; a: string };

const FAQ: Faq[] = [
  {
    q: "Faut-il traduire TOUS les plats de la carte en anglais ?",
    a: "Non. Les plats à identité forte — crème brûlée, bœuf bourguignon, cassoulet, café gourmand — se gardent en français : c'est ce que le touriste vient chercher, et le nom fait partie de l'expérience. On traduit (ou on glose) ce qui est vraiment obscur : andouillette, ris de veau, onglet. La bonne carte bilingue garde le nom français en titre et ajoute un sous-titre anglais court sous les plats techniques, pas sous les classiques reconnus.",
  },
  {
    q: "Pourquoi ne pas simplement utiliser Google Translate pour ma carte ?",
    a: "Parce que le vocabulaire culinaire est un champ de mines de faux-amis. Google Translate a rendu « ris de veau » par « veal rice », « onglet à l'échalote » par « thumbnail with shallot », « crème brûlée » par « burnt cream » et « noix de Saint-Jacques » par « Saint James nut ». Ces erreurs ne sont pas juste drôles : elles font douter le client de tout le sérieux de la maison. Une carte est un document commercial imprimé et affiché des mois — l'erreur reste visible longtemps.",
  },
  {
    q: "L'anglais suffit-il, ou faut-il d'autres langues ?",
    a: "L'anglais est la langue-pont n°1 du tourisme : un visiteur allemand, néerlandais, japonais ou espagnol lira l'anglais avant sa propre langue si elle n'est pas là. Commencez donc par une carte bilingue français / anglais soignée. N'ajoutez d'autres langues (espagnol, italien, allemand, chinois) que si votre clientèle le justifie vraiment — une carte à rallonge en 6 langues devient illisible et coûte cher à réimprimer à chaque changement de plat.",
  },
  {
    q: "Comment traduire les mentions légales et les allergènes ?",
    a: "Les 14 allergènes du règlement UE 1169/2011 ont des noms anglais officiels (gluten, crustaceans, eggs, fish, peanuts, soybeans, milk, tree nuts, celery, mustard, sesame seeds, sulphites, lupin, molluscs) : reprenez-les tels quels. Pour le reste, « service compris » se dit « service included » et mérite d'être affiché en anglais — les Américains ne savent pas qu'en France le service est déjà dans le prix. « Fait maison » = « homemade », « plat du jour » = « today's special ».",
  },
  {
    q: "Que veut dire « entrée » pour un client anglophone ?",
    a: "Attention, c'est le piège classique. En anglais britannique « starter » et en anglais américain « appetizer » désignent le hors-d'œuvre. Mais aux États-Unis, le mot « entrée » (emprunté au français) désigne… le PLAT PRINCIPAL. Si vous laissez « Entrée » sur votre carte anglaise, un Américain croira commander son plat et sera perdu. Écrivez toujours « Starters » puis « Main courses ».",
  },
  {
    q: "Une carte bilingue doit-elle être sur deux colonnes ou deux pages ?",
    a: "La forme la plus lisible garde le nom du plat en français une seule fois, puis un sous-titre anglais en plus petit et en italique juste dessous, sur la même ligne d'articles. Deux cartes séparées (une FR, une EN) multiplient les coûts d'impression et les risques de désynchronisation quand vous changez un prix. Une carte unique, français en tête, anglais en appui, reste la solution la plus simple à tenir à jour.",
  },
];

const SOURCES: { label: string; url: string }[] = [
  {
    label: "Règlement (UE) n° 1169/2011 concernant l'information des consommateurs sur les denrées alimentaires (allergènes, annexe II)",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1169",
  },
  {
    label: "Décret n° 2014-1173 relatif à la mention « fait maison » en restauration",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000029492021/",
  },
  {
    label: "Service-Public / DGCCRF — Affichage des prix et information du consommateur au restaurant",
    url: "https://entreprendre.service-public.fr/vosdroits/F31936",
  },
];

const TOC: { id: string; label: string }[] = [
  { id: "pourquoi", label: "Pourquoi l'anglais d'abord" },
  { id: "gt", label: "Ce que rate Google Translate" },
  { id: "lexique", label: "Lexique de 45 termes culinaires" },
  { id: "structure", label: "Structurer une carte bilingue" },
  { id: "allergenes", label: "Allergènes et mentions légales en anglais" },
  { id: "checklist", label: "Checklist avant impression" },
  { id: "faq", label: "Questions fréquentes" },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function TraduireCarteAnglaisPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: "Traduire la carte de son restaurant en anglais : lexique et méthode",
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
          { "@type": "ListItem", position: 2, name: "Traduire une carte de restaurant en anglais", item: pageUrl },
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
        name: "IA Restaurant — Traduction de carte",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
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
          <span className="text-text-secondary">Traduire une carte en anglais</span>
        </nav>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          <span className="gradient-text">
            Traduire la carte de son restaurant en anglais : le lexique, les faux-amis, la méthode
          </span>
        </h1>

        <p className="mt-4 text-sm text-text-muted">
          Par Yohann Music, exploitant d&apos;un bar-restaurant à Mérignac (33) et éditeur d&apos;IA
          Restaurant · Mise à jour le {LAST_CHECKED} · 10 min de lecture
        </p>

        <div className="mt-8 card neon-border p-6">
          <p className="text-base leading-relaxed text-text-secondary">
            <strong className="text-neon">En résumé :</strong> l&apos;anglais est la langue-pont n°1
            des touristes — un Allemand ou un Japonais lira l&apos;anglais avant sa propre langue.
            Gardez le nom français des plats iconiques (crème brûlée, cassoulet, café gourmand) et
            ajoutez un sous-titre anglais court sous les seuls plats techniques. Fuyez la traduction
            automatique brute : Google Translate a rendu « ris de veau » par <em>veal rice</em>,
            « onglet » par <em>thumbnail</em> et « crème brûlée » par <em>burnt cream</em>. Traduisez
            les 14 allergènes avec leurs noms anglais officiels et affichez « service included »
            pour vos clients américains. Le lexique de 45 termes ci-dessous couvre les pièges les
            plus fréquents.
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

        {/* 1. POURQUOI */}
        <section id="pourquoi" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Pourquoi commencer par l&apos;anglais, et pas par 9 langues
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            La tentation d&apos;une carte en six langues est un piège : illisible, coûteuse à
            réimprimer au moindre changement de plat, et jamais totalement à jour. La réalité du
            terrain est plus simple. L&apos;anglais est la langue véhiculaire du tourisme :
            un visiteur néerlandais, scandinave, japonais ou brésilien lira spontanément la version
            anglaise s&apos;il ne trouve pas la sienne. Une carte bilingue français / anglais
            soignée couvre donc l&apos;écrasante majorité de votre clientèle étrangère, là où une
            carte multilingue bâclée les perd tous.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Le vrai enjeu n&apos;est pas la quantité de langues, c&apos;est la qualité de la seule
            qui compte vraiment. Une carte anglaise truffée de contresens fait exactement
            l&apos;inverse de ce qu&apos;on cherche : au lieu de rassurer, elle sème le doute sur le
            sérieux de la cuisine.
          </p>
        </section>

        {/* 2. GOOGLE TRANSLATE */}
        <section id="gt" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Ce que rate la traduction automatique — vrais exemples
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Le vocabulaire de cuisine est un nid de faux-amis. Un moteur généraliste traduit mot à
            mot un terme qui a un sens technique précis. Voici des ratés bien réels, du genre qui
            circule en capture d&apos;écran et fait rire… aux dépens du restaurant.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { fr: "Onglet à l'échalote", ko: "Thumbnail with shallot", ok: "Hanger steak with shallots", why: "« Onglet » veut aussi dire « vignette/onglet » en informatique : la machine choisit le mauvais sens." },
              { fr: "Ris de veau", ko: "Veal rice", ok: "Veal sweetbreads", why: "« Ris » confondu avec « riz ». Ce sont les sweetbreads, pas une garniture de riz." },
              { fr: "Crème brûlée", ko: "Burnt cream", ok: "Crème brûlée", why: "Traduction littérale d'un plat qui n'a pas besoin d'être traduit du tout." },
              { fr: "Noix de Saint-Jacques", ko: "Saint James nut", ok: "Scallops", why: "« Noix » pris pour un fruit à coque, « Saint-Jacques » traduit comme un nom propre." },
            ].map((e) => (
              <div key={e.fr} className="card p-5">
                <p className="text-sm font-semibold text-neon">{e.fr}</p>
                <p className="mt-3 flex items-start gap-2 text-sm text-text-secondary">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  <span>Google Translate : <span className="italic text-text-muted">« {e.ko} »</span></span>
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm text-text-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>Le bon terme : <strong className="text-text-primary">{e.ok}</strong></span>
                </p>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">{e.why}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 card p-5 border-l-2 border-l-warning flex gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-warning" />
            <p className="text-sm leading-relaxed text-text-secondary">
              Une carte est un support imprimé et affiché des mois, parfois plastifié. Une erreur de
              traduction n&apos;est pas un tweet qu&apos;on efface : elle reste sous les yeux de
              chaque client anglophone jusqu&apos;à la prochaine réimpression. Le coût d&apos;une
              relecture sérieuse est dérisoire face à ça.
            </p>
          </div>
        </section>

        {/* 3. LEXIQUE */}
        <section id="lexique" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Lexique de 45 termes culinaires FR → EN
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Les termes marqués <span className="badge-neon">à garder en FR</span> restent en français
            sur la carte (avec éventuellement une glose). Les termes marqués{" "}
            <span className="inline-flex items-center gap-1 text-warning"><AlertTriangle className="h-3.5 w-3.5" /> faux-ami</span>{" "}
            sont ceux où la traduction automatique se plante le plus souvent.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">Lexique de traduction français-anglais des termes de cuisine</caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Français</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Anglais</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">À savoir</th>
                </tr>
              </thead>
              <tbody>
                {LEXIQUE.map((l) => (
                  <tr key={l.fr} className="border-b border-border-dim align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-medium text-neon">
                      {l.fr}
                      <span className="mt-1 flex flex-wrap gap-1">
                        {l.keep && <span className="badge-neon text-[10px]">à garder en FR</span>}
                        {l.trap && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-warning">
                            <AlertTriangle className="h-3 w-3" /> faux-ami
                          </span>
                        )}
                      </span>
                    </th>
                    <td className="py-4 pr-4 font-medium text-text-primary">{l.en}</td>
                    <td className="py-4 text-text-secondary">{l.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. STRUCTURE */}
        <section id="structure" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Structurer une carte bilingue qui reste lisible
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            Le bon format ne dédouble pas la carte : il l&apos;enrichit. Nom français en titre, appui
            anglais dessous, uniquement là où c&apos;est utile.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="card p-5 border-l-2 border-l-success">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <Check className="h-4 w-4 text-success" /> À faire
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
                <li>Garder le nom du plat en français, une seule fois, en titre de l&apos;article.</li>
                <li>Ajouter un sous-titre anglais en italique, plus petit, sous les seuls plats techniques.</li>
                <li>Laisser les classiques reconnus sans traduction (bœuf bourguignon, ratatouille).</li>
                <li>Traduire les sections : <em>Starters, Main courses, Desserts, Set menus</em>.</li>
                <li>Une carte unique, tenue à jour d&apos;un seul coup quand un prix change.</li>
              </ul>
            </div>
            <div className="card p-5 border-l-2 border-l-danger">
              <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary">
                <X className="h-4 w-4 text-danger" /> À éviter
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary">
                <li>Traduire les plats signature (le nom fait partie de l&apos;expérience).</li>
                <li>Laisser « Entrée » sur la carte anglaise (un Américain comprend « plat principal »).</li>
                <li>Deux cartes séparées FR et EN qui se désynchronisent au premier changement.</li>
                <li>Le mot « Menu » en anglais pour parler d&apos;une formule (« menu » = la carte entière).</li>
                <li>Une glose sous CHAQUE plat : la carte devient un dictionnaire illisible.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. ALLERGENES + LEGAL */}
        <section id="allergenes" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">
            Allergènes et mentions légales en anglais
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">
            L&apos;information sur les allergènes est une obligation (règlement UE 1169/2011). Les 14
            allergènes à déclaration ont des noms anglais officiels : reprenez-les tels quels, ne les
            inventez pas.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <caption className="sr-only">Les 14 allergènes à déclaration obligatoire en français et en anglais</caption>
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold text-text-primary">Allergène (FR)</th>
                  <th scope="col" className="py-3 font-semibold text-text-primary">Allergen (EN)</th>
                </tr>
              </thead>
              <tbody>
                {ALLERGENS.map((a) => (
                  <tr key={a.fr} className="border-b border-border-dim">
                    <td className="py-3 pr-4 text-text-secondary">{a.fr}</td>
                    <td className="py-3 font-medium text-text-primary">{a.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 text-lg font-semibold text-text-primary">Les mentions à ne pas oublier</h3>
          <div className="mt-4 space-y-4">
            {LEGAL.map((l) => (
              <div key={l.fr} className="card p-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-text-primary">{l.fr}</span>
                  <span className="text-sm text-neon">→ {l.en}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{l.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CHECKLIST */}
        <section id="checklist" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-text-primary">Checklist avant d&apos;envoyer à l&apos;impression</h2>
          <ol className="mt-6 space-y-3">
            {[
              "Les sections sont traduites : Starters / Main courses / Desserts / Set menus.",
              "Aucun « Entrée » ni « Menu » ambigu ne subsiste sur la version anglaise.",
              "Les plats signature restent en français ; seuls les plats techniques ont une glose EN.",
              "Chaque faux-ami du lexique (onglet, ris de veau, faux-filet, blanquette) est vérifié à la main.",
              "Les 14 allergènes portent leur nom anglais officiel.",
              "« Service included » est affiché pour la clientèle américaine.",
              "Les prix sont identiques entre les deux langues (un seul document, une seule mise à jour).",
              "Un anglophone a relu la carte à voix haute avant le bon à tirer.",
            ].map((item, i) => (
              <li key={i} className="card p-4 flex gap-3">
                <span className="badge-neon shrink-0">{i + 1}</span>
                <span className="text-sm leading-relaxed text-text-secondary">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="mt-16 card neon-border p-8">
          <h2 className="text-2xl font-bold text-text-primary">
            Traduisez votre carte sans les pièges de la machine
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Notre outil de traduction est entraîné pour les cartes de restaurant : il garde les
            termes culinaires qui doivent l&apos;être et traduit le reste avec le bon vocabulaire, en
            lot. Vous gardez la main : relisez, ajustez, imprimez. Le plan gratuit inclut 50 jetons
            par mois, sans carte bancaire ; une traduction coûte 10 jetons.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/sign-up" className="btn-primary inline-flex items-center justify-center gap-2">
              Traduire ma carte gratuitement
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
              { href: "/seo/traduction-carte-restaurant", label: "Traduire sa carte en 9 langues", desc: "L'outil de traduction multilingue, au-delà de l'anglais" },
              { href: "/seo/optimiser-carte-restaurant", label: "Optimiser sa carte de restaurant", desc: "Structure, descriptions et positionnement des plats" },
              { href: "/seo/comment-fixer-prix-plat-restaurant", label: "Fixer le prix d'un plat", desc: "Coefficient, prix psychologique et affichage sur la carte" },
              { href: "/seo/description-plat-ia", label: "Descriptions de plats par l'IA", desc: "Des textes appétissants, en français et en anglais" },
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
            Cadre réglementaire vérifié le {LAST_CHECKED}. Les traductions du lexique sont établies
            par nos soins pour un usage de carte ; les ratés de traduction automatique cités sont des
            erreurs constatées sur des moteurs grand public.
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
