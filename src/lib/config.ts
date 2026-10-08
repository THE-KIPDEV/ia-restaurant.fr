export const siteConfig = {
  name: "IA Restaurant",
  description: "Your restaurant memory and management copilot",
  descriptionFr: "Toute la mémoire de votre restaurant et un copilote pour le gérer : relevés de caisse, chiffre d’affaires, factures, couverts, salle et recettes. Démonstration interactive sans inscription.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://ia-restaurant.fr",
  domain: "ia-restaurant.fr",
  locale: "fr",
  creator: "Kipdev",
  keywords: [
    "restaurant AI",
    "intelligence artificielle restaurant",
    "menu engineering",
    "analyse marge restaurant",
    "IA restauration",
    "gestion restaurant IA",
    "menu analysis AI",
    "restaurant management",
  ],
  links: {
    legal: "https://www.pappers.fr/entreprise/kipdev-884120890",
  },
};

export const TOKEN_COSTS = {
  MENU_ANALYSIS: 30,
  DISH_DESCRIPTION: 5,
  REVIEW_RESPONSE: 5,
  SOCIAL_POST: 5,
  TRANSLATE: 10,
  MARGIN_ANALYSIS: 20,
  DOCUMENT_READING: 12,
  COPILOT: 5,
} as const;

export type AiFeatureKey = keyof typeof TOKEN_COSTS;
