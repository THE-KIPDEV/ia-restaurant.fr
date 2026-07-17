/**
 * Reconnaissance des plats cités dans un avis client, calculée dans le
 * navigateur, à partir de la carte déjà saisie (menu-storage).
 *
 * Pourquoi ce fichier existe. Toutes les règles publiées sur la réponse aux
 * avis disent la même chose : la réponse doit contenir un détail qui prouve que
 * l'avis a été lu. Un générateur de texte ne peut pas inventer ce détail — il
 * ne connaît pas la carte. Nous, si : le menu engineering et l'analyse des
 * marges gardent déjà les plats, leur prix, leur coût matière et leur
 * classement Kasavana & Smith dans le navigateur. On s'en sert ici pour dire au
 * restaurateur, avant même de dépenser un jeton : « cet avis parle de votre
 * Côte de bœuf, votre Vache à lait à 32 % de coût matière ».
 *
 * Deux niveaux de reconnaissance, volontairement lisibles plutôt que malins :
 *
 *   1. `exact`    — le nom complet du plat figure dans l'avis, aux accents et à
 *                   la casse près (« la cote de boeuf était parfaite »).
 *   2. `probable` — un mot du nom du plat figure dans l'avis, et ce mot ne
 *                   désigne qu'UN SEUL plat de la carte. « Tartare » suffit si
 *                   la carte ne porte qu'un tartare ; il ne suffit plus si elle
 *                   en porte deux, et alors on préfère ne rien dire.
 *
 * LIMITE ASSUMÉE — aucune tolérance aux fautes de frappe (pas de distance de
 * Levenshtein). Un client qui écrit « tartar » ne sera pas rattaché. C'est un
 * choix : un faux positif fait dire au restaurateur une bêtise sur un plat qu'il
 * n'a pas servi, ce qui est bien pire qu'un silence. Aucun appel réseau, aucun
 * jeton consommé, la carte ne quitte pas le poste.
 */

import { classifyMenu, type BcgClass } from "./menu-engineering";
import { type StoredDish } from "./menu-storage";

/** Cible de longueur d'une réponse d'avis, en mots. */
export const RESPONSE_WORD_RANGE = { min: 50, max: 200 } as const;

export interface DishMention {
  name: string;
  category: string;
  /** Comment le plat a été reconnu — affiché à l'écran, pas de magie cachée. */
  how: "exact" | "probable";
  /** Le mot de l'avis qui a déclenché la reconnaissance. */
  trigger: string;
  /** Classement Kasavana & Smith, si la carte en compte assez pour comparer. */
  bcg: BcgClass | null;
  /** Marge brute unitaire en devise, null si la ligne n'est pas chiffrée. */
  margin: number | null;
  /** Coût matière en % du prix de vente. */
  foodCostPct: number | null;
}

export interface DishSuggestion {
  name: string;
  category: string;
  bcg: BcgClass;
  margin: number;
}

/* -------------------------------------------------------------------------- */
/*  Normalisation                                                              */
/* -------------------------------------------------------------------------- */

/**
 * minuscules, sans accents, ponctuation et apostrophes réduites à un espace.
 *
 * Les ligatures œ/æ sont dépliées AVANT le passage NFD : « bœuf » ne se
 * décompose pas en « boeuf » tout seul, et une carte française en est pleine
 * (bœuf, œuf, cœur de filet). Sans ça, « Côte de bœuf » ne se reconnaît jamais
 * dans un avis tapé « cote de boeuf » au clavier.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Mots vides + mots de carte trop passe-partout pour identifier un plat.
 * « Burger maison » ne doit pas être reconnu sur le seul mot « maison ».
 */
const IGNORED_TOKENS = new Set([
  // articles, prépositions, liaisons
  "le", "la", "les", "un", "une", "des", "du", "de", "au", "aux", "et", "en",
  "sur", "sous", "avec", "sans", "pour", "son", "sa", "ses", "nos", "notre",
  "leur", "dans", "par",
  // vocabulaire de carte trop générique
  "plat", "plats", "menu", "formule", "portion", "assiette", "entree",
  "dessert", "boisson", "maison", "jour", "chef", "special", "speciale",
  "specialite", "fait", "frais", "fraiche", "grand", "grande", "petit",
  "petite", "cuisine",
]);

/** Mots du nom d'un plat susceptibles de l'identifier à eux seuls. */
function significantTokens(dishName: string): string[] {
  return normalize(dishName)
    .split(" ")
    .filter((t) => t.length >= 4 && !IGNORED_TOKENS.has(t));
}

/** Mot entier dans l'avis, pluriel simple toléré (« tartares », « choux »). */
function containsWord(normalizedReview: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^| )${escaped}(s|x)?( |$)`).test(normalizedReview);
}

function parsePrice(dish: StoredDish): { price: number; cost: number } | null {
  const price = Number.parseFloat(dish.price);
  const cost = Number.parseFloat(dish.costPrice);
  if (!Number.isFinite(price) || !Number.isFinite(cost)) return null;
  if (price <= 0 || cost < 0 || cost > price) return null;
  return { price, cost };
}

/* -------------------------------------------------------------------------- */
/*  Reconnaissance                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Les plats de la carte cités dans l'avis. Ordre de lecture : les
 * reconnaissances certaines d'abord.
 */
export function findMentionedDishes(review: string, dishes: StoredDish[]): DishMention[] {
  const text = normalize(review);
  if (!text) return [];

  const named = dishes.filter((d) => d.name.trim());
  if (named.length === 0) return [];

  // Un mot ne sert d'indice que s'il ne désigne qu'un seul plat de la carte.
  const owners = new Map<string, number>();
  for (const dish of named) {
    for (const token of new Set(significantTokens(dish.name))) {
      owners.set(token, (owners.get(token) ?? 0) + 1);
    }
  }

  const report = classifyMenu(dishes);
  const classified = new Map(report?.dishes.map((d) => [normalize(d.name), d]) ?? []);

  const mentions: DishMention[] = [];
  const seen = new Set<string>();

  for (const dish of named) {
    const key = normalize(dish.name);
    if (!key || seen.has(key)) continue;

    let how: DishMention["how"] | null = null;
    let trigger = "";

    if (containsWord(text, key)) {
      how = "exact";
      trigger = dish.name.trim();
    } else {
      const hit = significantTokens(dish.name).find(
        (t) => owners.get(t) === 1 && containsWord(text, t)
      );
      if (hit) {
        how = "probable";
        trigger = hit;
      }
    }

    if (!how) continue;
    seen.add(key);

    const row = classified.get(key);
    const money = parsePrice(dish);

    mentions.push({
      name: dish.name.trim(),
      category: dish.category,
      how,
      trigger,
      bcg: row?.bcg ?? null,
      margin: row?.margin ?? (money ? Math.round((money.price - money.cost) * 100) / 100 : null),
      foodCostPct: row?.foodCostPct ?? (money ? Math.round((money.cost / money.price) * 100) : null),
    });
  }

  return mentions.sort((a, b) => (a.how === b.how ? 0 : a.how === "exact" ? -1 : 1));
}

/**
 * Le plat à glisser en fin de réponse (« la prochaine fois, laissez-vous
 * tenter par… »). On propose une Énigme : bonne marge, peu de ventes, exactement
 * le plat qu'une suggestion écrite fait décoller. À défaut, une Étoile.
 *
 * Renvoie null sur un avis tiède ou mauvais : sous 4 étoiles, enchaîner sur une
 * suggestion de vente se lit comme un mépris de la plainte.
 */
export function suggestNextDish(
  dishes: StoredDish[],
  mentions: DishMention[],
  rating: number
): DishSuggestion | null {
  if (rating < 4) return null;

  const report = classifyMenu(dishes);
  if (!report) return null;

  const cited = new Set(mentions.map((m) => normalize(m.name)));
  const categoryOf = new Map(dishes.map((d) => [normalize(d.name), d.category]));
  const preferred = mentions[0] ? categoryOf.get(normalize(mentions[0].name)) : undefined;

  const pool = report.dishes.filter(
    (d) => !cited.has(normalize(d.name)) && (d.bcg === "puzzle" || d.bcg === "star")
  );
  if (pool.length === 0) return null;

  const rank = (d: (typeof pool)[number]) => {
    const sameCategory = preferred && categoryOf.get(normalize(d.name)) === preferred;
    return (d.bcg === "puzzle" ? 0 : 10) + (sameCategory ? 0 : 1);
  };

  const best = [...pool].sort((a, b) => rank(a) - rank(b) || b.margin - a.margin)[0];

  return {
    name: best.name,
    category: categoryOf.get(normalize(best.name)) ?? "",
    bcg: best.bcg as "puzzle" | "star",
    margin: best.margin,
  };
}

/**
 * Ce que ce plat, dans ce quadrant, change pour la réponse. Croiser l'avis et
 * le classement de la carte est ce qu'aucun générateur de texte ne peut faire :
 * il ignore ce que le plat rapporte.
 */
export function mentionInsight(mention: DishMention, rating: number): string | null {
  if (!mention.bcg) return null;
  const negative = rating <= 2;

  if (negative) {
    switch (mention.bcg) {
      case "star":
        return "Votre Étoile prend un coup : c'est le plat qui porte la carte, la réponse mérite un geste concret, pas une formule.";
      case "plowhorse":
        return "Vache à lait : ça se vend beaucoup et ça rapporte peu. Un avis négatif dessus vous coûte deux fois — regardez la portion avant de répondre.";
      case "puzzle":
        return "Énigme : peu vendu, bonne marge. Un avis négatif de plus et ce plat n'a plus de raison d'être sur la carte.";
      case "dog":
        return "Poids mort : peu vendu, peu rentable. Répondez, puis posez-vous la vraie question — le garder ?";
    }
  }

  switch (mention.bcg) {
    case "star":
      return "Étoile de votre carte. Nommez-la dans la réponse : c'est votre meilleure publicité auprès du prochain lecteur.";
    case "plowhorse":
      return "Vache à lait : populaire, marge sous la moyenne. Un client content sur ce plat est le bon moment pour l'orienter vers une Énigme.";
    case "puzzle":
      return "Énigme : bonne marge, peu commandée. Un avis positif public dessus vaut mieux qu'un encadré sur la carte.";
    case "dog":
      return "Poids mort qui trouve son public. Rare — à noter avant de le sortir de la carte.";
  }
}

/** Compte les mots d'une réponse (cible 50-200). */
export function countWords(text: string): number {
  const clean = text.trim();
  if (!clean) return 0;
  return clean.split(/\s+/).length;
}

/**
 * Phrase prête à coller dans la réponse, ancrée sur des plats réels.
 *
 * Les noms de plats passent entre guillemets, et pas derrière un article :
 * « le » Tiramisu mais « la » Côte de bœuf, et rien dans la carte ne dit le
 * genre du plat. Deviner, c'est écrire une faute une fois sur deux dans une
 * réponse publique. Les guillemets règlent la question sans mentir.
 */
export function anchorSentence(
  mention: DishMention,
  suggestion: DishSuggestion | null,
  rating: number
): string {
  const dish = `« ${mention.name} »`;
  if (rating <= 2) {
    return `Sur ${dish}, ce que vous décrivez n'est pas ce que nous servons d'habitude — j'en parle au chef dès ce service.`;
  }
  if (rating === 3) {
    return `Merci d'avoir pris le temps : votre remarque sur ${dish} est notée, on la travaille.`;
  }
  if (suggestion) {
    return `Ravi que ${dish} vous ait plu — la prochaine fois, laissez-vous tenter par « ${suggestion.name} ».`;
  }
  return `Ravi que ${dish} vous ait plu, je transmets au chef.`;
}
