import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-01-27.acacia",
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    nameFr: "Gratuit",
    price: { monthly: 0, yearly: 0 },
    tokens: 50,
    restaurants: 1,
    features: [
      { en: "50 AI tokens/month", fr: "50 jetons IA/mois" },
      { en: "1 restaurant", fr: "1 restaurant" },
      { en: "Basic menu analysis", fr: "Analyse de menu basique" },
      { en: "Dish descriptions", fr: "Descriptions de plats" },
    ],
  },
  pro: {
    name: "Pro",
    nameFr: "Pro",
    price: { monthly: 29, yearly: 290 },
    tokens: 2000,
    restaurants: 5,
    stripePriceMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    stripePriceYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    features: [
      { en: "2,000 AI tokens/month", fr: "2 000 jetons IA/mois" },
      { en: "5 restaurants", fr: "5 restaurants" },
      { en: "Advanced menu engineering", fr: "Menu engineering avancé" },
      { en: "Margin analysis", fr: "Analyse des marges" },
      { en: "Review responses", fr: "Réponses aux avis" },
      { en: "Social media posts", fr: "Posts réseaux sociaux" },
      { en: "Menu translation", fr: "Traduction de menu" },
      { en: "Priority support", fr: "Support prioritaire" },
    ],
  },
  business: {
    name: "Business",
    nameFr: "Business",
    price: { monthly: 79, yearly: 790 },
    tokens: 10000,
    restaurants: -1,
    stripePriceMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    stripePriceYearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
    features: [
      { en: "10,000 AI tokens/month", fr: "10 000 jetons IA/mois" },
      { en: "Unlimited restaurants", fr: "Restaurants illimités" },
      { en: "All Pro features", fr: "Toutes les fonctions Pro" },
      { en: "Bulk operations", fr: "Opérations en masse" },
      { en: "API access", fr: "Accès API" },
      { en: "Dedicated support", fr: "Support dédié" },
    ],
  },
} as const;

export const TOKEN_PACKS = [
  {
    amount: 500,
    price: 9,
    stripePriceId: process.env.STRIPE_PRICE_TOKENS_500,
    popular: false,
  },
  {
    amount: 2000,
    price: 29,
    stripePriceId: process.env.STRIPE_PRICE_TOKENS_2000,
    popular: true,
  },
  {
    amount: 5000,
    price: 59,
    stripePriceId: process.env.STRIPE_PRICE_TOKENS_5000,
    popular: false,
  },
] as const;

export type PlanKey = keyof typeof PLANS;
