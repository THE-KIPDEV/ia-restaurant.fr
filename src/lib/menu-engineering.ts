/**
 * Classement Kasavana & Smith, calculé dans le navigateur.
 *
 * Pourquoi ce fichier existe : ranger un plat en Étoile / Vache à lait /
 * Énigme / Poids mort n'est pas un travail de rédaction, c'est une division.
 * La méthode publiée par Michael Kasavana et Donald Smith en 1982 (« Menu
 * Engineering: A Practical Guide to Menu Analysis ») tient en deux axes :
 *
 *   1. Marge brute unitaire (prix de vente − coût matière) comparée à la marge
 *      brute MOYENNE PONDÉRÉE de la carte.
 *   2. Part du mix de ventes comparée à un seuil de (1 / nombre de plats) × 70 %.
 *      Le facteur 0,70 est dans la méthode d'origine : il évite de coller
 *      « impopulaire » à la moitié de la carte par simple effet mécanique.
 *
 * On le calcule donc localement, gratuitement, et on le montre pendant la
 * saisie. Le modèle garde ce qu'il sait faire : commenter, arbitrer, proposer
 * des reformulations de carte.
 *
 * LIMITE ASSUMÉE — la méthode d'origine demande le nombre de couverts vendus
 * par plat sur une période. Ici on n'a qu'une note de popularité de 1 à 5, qui
 * sert de proxy de volume (part du mix = note / somme des notes). Un plat noté
 * 4 pèse donc deux fois un plat noté 2. C'est une approximation, et `isProxy`
 * le dit à l'écran. Le jour où la carte porte de vrais volumes de ventes, seule
 * la construction de `mixShare` change — le reste du classement tient.
 */

import { isBlank, type StoredDish } from "./menu-storage";

export type BcgClass = "star" | "plowhorse" | "puzzle" | "dog";

export interface ClassifiedDish {
  name: string;
  price: number;
  costPrice: number;
  /** Marge brute unitaire, en devise. */
  margin: number;
  /** Coût matière en % du prix de vente — le KPI que le chef regarde. */
  foodCostPct: number;
  popularity: number;
  /** Part du mix de ventes (0-1), estimée depuis la popularité. */
  mixShare: number;
  bcg: BcgClass;
}

export interface MenuEngineeringReport {
  dishes: ClassifiedDish[];
  /** Seuil de l'axe marge : marge brute moyenne pondérée par le mix. */
  avgMargin: number;
  /** Seuil de l'axe popularité : (1 / N) × 0,70. */
  mixThreshold: number;
  /** Coût matière global de la carte, pondéré par le mix. */
  blendedFoodCostPct: number;
  counts: Record<BcgClass, number>;
  /** true tant que la popularité 1-5 remplace de vrais volumes de ventes. */
  isProxy: boolean;
}

export const BCG_LABELS: Record<BcgClass, { fr: string; hint: string }> = {
  star: {
    fr: "Étoile",
    hint: "Marge et ventes au-dessus de la carte. Ne touchez ni à la recette ni à la place sur le menu.",
  },
  plowhorse: {
    fr: "Vache à lait",
    hint: "Ça se vend, ça ne rapporte pas assez. Retravaillez le coût matière ou montez le prix par petits pas.",
  },
  puzzle: {
    fr: "Énigme",
    hint: "Bonne marge, peu de ventes. Problème de nom, de place sur la carte ou de suggestion en salle.",
  },
  dog: {
    fr: "Poids mort",
    hint: "Peu vendu, peu rentable. À sortir, sauf s'il tient la carte (le plat pour enfants, le végé).",
  },
};

/** Facteur 0,70 de la méthode Kasavana & Smith. */
const POPULARITY_FACTOR = 0.7;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Ne garde que les lignes exploitables : nom + prix > 0 + coût cohérent. */
function usable(dish: StoredDish): boolean {
  if (isBlank(dish) || !dish.name.trim()) return false;
  const price = Number.parseFloat(dish.price);
  const cost = Number.parseFloat(dish.costPrice);
  return (
    Number.isFinite(price) &&
    Number.isFinite(cost) &&
    price > 0 &&
    cost >= 0 &&
    cost <= price
  );
}

/**
 * Classe la carte. Renvoie null tant qu'il n'y a pas de quoi comparer :
 * en dessous de 2 plats exploitables, « au-dessus de la moyenne » ne veut
 * rien dire, et afficher un classement serait de la décoration.
 */
export function classifyMenu(dishes: StoredDish[]): MenuEngineeringReport | null {
  const rows = dishes.filter(usable);
  if (rows.length < 2) return null;

  const parsed = rows.map((d) => {
    const price = Number.parseFloat(d.price);
    const costPrice = Number.parseFloat(d.costPrice);
    const popularity =
      Number.isFinite(d.popularity) && d.popularity >= 1 && d.popularity <= 5
        ? d.popularity
        : 3;
    return { name: d.name.trim(), price, costPrice, popularity };
  });

  const totalPopularity = parsed.reduce((sum, d) => sum + d.popularity, 0);
  // Défensif : `usable` n'impose rien sur la popularité, et une somme nulle
  // ferait une division par zéro silencieuse.
  const mixOf = (popularity: number) =>
    totalPopularity > 0 ? popularity / totalPopularity : 1 / parsed.length;

  // Seuil de marge = marge moyenne PONDÉRÉE par le mix, pas moyenne simple :
  // un plat vendu 200 fois pèse plus dans la moyenne de la carte qu'un plat
  // vendu 5 fois. C'est ce que dit la méthode d'origine.
  const avgMargin = parsed.reduce(
    (sum, d) => sum + (d.price - d.costPrice) * mixOf(d.popularity),
    0
  );
  const blendedCost = parsed.reduce(
    (sum, d) => sum + d.costPrice * mixOf(d.popularity),
    0
  );
  const blendedPrice = parsed.reduce(
    (sum, d) => sum + d.price * mixOf(d.popularity),
    0
  );

  const mixThreshold = (1 / parsed.length) * POPULARITY_FACTOR;

  const counts: Record<BcgClass, number> = { star: 0, plowhorse: 0, puzzle: 0, dog: 0 };

  const classified: ClassifiedDish[] = parsed.map((d) => {
    const margin = d.price - d.costPrice;
    const mixShare = mixOf(d.popularity);
    const highMargin = margin >= avgMargin;
    const popular = mixShare >= mixThreshold;

    const bcg: BcgClass = popular
      ? highMargin
        ? "star"
        : "plowhorse"
      : highMargin
        ? "puzzle"
        : "dog";
    counts[bcg]++;

    return {
      name: d.name,
      price: d.price,
      costPrice: d.costPrice,
      margin: round2(margin),
      foodCostPct: Math.round((d.costPrice / d.price) * 100),
      popularity: d.popularity,
      mixShare,
      bcg,
    };
  });

  // Étoiles d'abord, puis marge décroissante : on lit la carte par ce qui
  // rapporte, pas par ordre de saisie.
  const order: Record<BcgClass, number> = { star: 0, plowhorse: 1, puzzle: 2, dog: 3 };
  classified.sort((a, b) => order[a.bcg] - order[b.bcg] || b.margin - a.margin);

  return {
    dishes: classified,
    avgMargin: round2(avgMargin),
    mixThreshold,
    blendedFoodCostPct: blendedPrice > 0 ? Math.round((blendedCost / blendedPrice) * 100) : 0,
    counts,
    isProxy: true,
  };
}
