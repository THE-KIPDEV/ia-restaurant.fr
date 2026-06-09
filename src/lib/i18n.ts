export type Locale = "fr" | "en";

const translations = {
  // Navigation
  "nav.features": { fr: "Fonctionnalités", en: "Features" },
  "nav.pricing": { fr: "Tarifs", en: "Pricing" },
  "nav.dashboard": { fr: "Tableau de bord", en: "Dashboard" },
  "nav.signIn": { fr: "Connexion", en: "Sign In" },
  "nav.signUp": { fr: "Inscription", en: "Sign Up" },
  "nav.getStarted": { fr: "Commencer gratuitement", en: "Get Started Free" },

  // Hero
  "hero.badge": { fr: "Propulsé par l'IA Claude", en: "Powered by Claude AI" },
  "hero.title": {
    fr: "L'intelligence artificielle au service de votre restaurant",
    en: "AI-Powered Intelligence for Your Restaurant",
  },
  "hero.subtitle": {
    fr: "Analysez vos marges, optimisez votre carte, générez des descriptions irrésistibles et répondez aux avis — le tout propulsé par l'IA.",
    en: "Analyze margins, optimize your menu, generate irresistible descriptions and respond to reviews — all powered by AI.",
  },
  "hero.cta": { fr: "Essayer gratuitement", en: "Try Free" },
  "hero.cta2": { fr: "Voir les fonctionnalités", en: "See Features" },
  "hero.trustedBy": {
    fr: "Déjà adopté par +500 restaurateurs",
    en: "Already trusted by 500+ restaurant owners",
  },

  // Features
  "features.title": { fr: "Six outils IA puissants", en: "Six Powerful AI Tools" },
  "features.subtitle": {
    fr: "Tout ce dont vous avez besoin pour piloter votre restaurant avec l'IA",
    en: "Everything you need to run your restaurant with AI",
  },
  "features.menuAnalysis.title": { fr: "Menu Engineering", en: "Menu Engineering" },
  "features.menuAnalysis.desc": {
    fr: "Classez vos plats en Stars, Puzzles, Plowhorses et Dogs. Identifiez ce qui fonctionne et ce qui doit changer.",
    en: "Classify dishes as Stars, Puzzles, Plowhorses and Dogs. Identify what works and what needs to change.",
  },
  "features.dishDescription.title": {
    fr: "Descriptions de plats",
    en: "Dish Descriptions",
  },
  "features.dishDescription.desc": {
    fr: "Générez des descriptions appétissantes et évocatrices pour chaque plat de votre carte.",
    en: "Generate appetizing, evocative descriptions for every dish on your menu.",
  },
  "features.reviewResponse.title": {
    fr: "Réponses aux avis",
    en: "Review Responses",
  },
  "features.reviewResponse.desc": {
    fr: "Répondez professionnellement à chaque avis Google ou TripAdvisor en quelques secondes.",
    en: "Respond professionally to every Google or TripAdvisor review in seconds.",
  },
  "features.socialPost.title": {
    fr: "Posts réseaux sociaux",
    en: "Social Media Posts",
  },
  "features.socialPost.desc": {
    fr: "Créez des posts engageants pour Instagram, Facebook et TikTok adaptés à votre restaurant.",
    en: "Create engaging posts for Instagram, Facebook and TikTok tailored to your restaurant.",
  },
  "features.translate.title": {
    fr: "Traduction de carte",
    en: "Menu Translation",
  },
  "features.translate.desc": {
    fr: "Traduisez votre carte dans n'importe quelle langue en préservant l'authenticité culinaire.",
    en: "Translate your menu into any language while preserving culinary authenticity.",
  },
  "features.marginAnalysis.title": {
    fr: "Analyse des marges",
    en: "Margin Analysis",
  },
  "features.marginAnalysis.desc": {
    fr: "Visualisez et optimisez la rentabilité de chaque plat avec des recommandations concrètes.",
    en: "Visualize and optimize the profitability of every dish with actionable recommendations.",
  },

  // Pricing
  "pricing.title": { fr: "Tarifs simples et transparents", en: "Simple, Transparent Pricing" },
  "pricing.subtitle": {
    fr: "Commencez gratuitement. Montez en puissance quand vous êtes prêt.",
    en: "Start free. Scale up when you're ready.",
  },
  "pricing.monthly": { fr: "Mensuel", en: "Monthly" },
  "pricing.yearly": { fr: "Annuel", en: "Yearly" },
  "pricing.yearlyDiscount": { fr: "2 mois offerts", en: "2 months free" },
  "pricing.perMonth": { fr: "/mois", en: "/mo" },
  "pricing.perYear": { fr: "/an", en: "/yr" },
  "pricing.free": { fr: "Gratuit", en: "Free" },
  "pricing.current": { fr: "Plan actuel", en: "Current Plan" },
  "pricing.upgrade": { fr: "Souscrire", en: "Subscribe" },
  "pricing.popular": { fr: "Populaire", en: "Popular" },
  "pricing.tokenPacks": { fr: "Packs de jetons", en: "Token Packs" },
  "pricing.tokenPacksDesc": {
    fr: "Besoin de plus de jetons ? Achetez un pack supplémentaire à tout moment.",
    en: "Need more tokens? Buy an extra pack anytime.",
  },
  "pricing.tokens": { fr: "jetons", en: "tokens" },
  "pricing.buy": { fr: "Acheter", en: "Buy" },

  // Dashboard
  "dashboard.title": { fr: "Tableau de bord", en: "Dashboard" },
  "dashboard.welcome": { fr: "Bienvenue", en: "Welcome" },
  "dashboard.tokens": { fr: "Jetons restants", en: "Tokens Remaining" },
  "dashboard.restaurants": { fr: "Restaurants", en: "Restaurants" },
  "dashboard.usageThisMonth": { fr: "Utilisations ce mois", en: "Uses This Month" },
  "dashboard.recentActivity": { fr: "Activité récente", en: "Recent Activity" },
  "dashboard.quickActions": { fr: "Actions rapides", en: "Quick Actions" },
  "dashboard.noRestaurant": {
    fr: "Ajoutez votre premier restaurant pour commencer",
    en: "Add your first restaurant to get started",
  },
  "dashboard.addRestaurant": { fr: "Ajouter un restaurant", en: "Add Restaurant" },

  // Sidebar
  "sidebar.overview": { fr: "Vue d'ensemble", en: "Overview" },
  "sidebar.menuAnalysis": { fr: "Menu Engineering", en: "Menu Engineering" },
  "sidebar.dishGenerator": { fr: "Descriptions IA", en: "AI Descriptions" },
  "sidebar.reviewResponder": { fr: "Réponses avis", en: "Review Responses" },
  "sidebar.socialPosts": { fr: "Posts sociaux", en: "Social Posts" },
  "sidebar.translator": { fr: "Traduction", en: "Translation" },
  "sidebar.marginAnalysis": { fr: "Marges", en: "Margins" },
  "sidebar.tokens": { fr: "Jetons", en: "Tokens" },
  "sidebar.restaurants": { fr: "Restaurants", en: "Restaurants" },
  "sidebar.settings": { fr: "Paramètres", en: "Settings" },
  "sidebar.billing": { fr: "Facturation", en: "Billing" },

  // Common
  "common.loading": { fr: "Chargement...", en: "Loading..." },
  "common.error": { fr: "Une erreur est survenue", en: "An error occurred" },
  "common.save": { fr: "Enregistrer", en: "Save" },
  "common.cancel": { fr: "Annuler", en: "Cancel" },
  "common.delete": { fr: "Supprimer", en: "Delete" },
  "common.edit": { fr: "Modifier", en: "Edit" },
  "common.generate": { fr: "Générer", en: "Generate" },
  "common.analyze": { fr: "Analyser", en: "Analyze" },
  "common.copy": { fr: "Copier", en: "Copy" },
  "common.copied": { fr: "Copié !", en: "Copied!" },
  "common.tokensRequired": { fr: "jetons requis", en: "tokens required" },
  "common.insufficientTokens": {
    fr: "Jetons insuffisants",
    en: "Insufficient tokens",
  },

  // FAQ
  "faq.title": { fr: "Questions fréquentes", en: "Frequently Asked Questions" },
  "faq.q1": {
    fr: "Comment fonctionne le système de jetons ?",
    en: "How does the token system work?",
  },
  "faq.a1": {
    fr: "Chaque fonctionnalité IA consomme un certain nombre de jetons. Votre plan vous donne un quota mensuel renouvelé automatiquement. Vous pouvez acheter des jetons supplémentaires à tout moment.",
    en: "Each AI feature consumes a certain number of tokens. Your plan gives you a monthly quota renewed automatically. You can purchase extra tokens anytime.",
  },
  "faq.q2": {
    fr: "Quelle IA est utilisée ?",
    en: "What AI is used?",
  },
  "faq.a2": {
    fr: "Nous utilisons Claude d'Anthropic, l'une des IA les plus avancées du marché, spécialement configurée pour la restauration.",
    en: "We use Claude by Anthropic, one of the most advanced AIs on the market, specially configured for the restaurant industry.",
  },
  "faq.q3": {
    fr: "Puis-je essayer gratuitement ?",
    en: "Can I try it for free?",
  },
  "faq.a3": {
    fr: "Oui ! Le plan gratuit inclut 50 jetons par mois, suffisant pour tester toutes les fonctionnalités.",
    en: "Yes! The free plan includes 50 tokens per month, enough to test all features.",
  },
  "faq.q4": {
    fr: "Mes données sont-elles sécurisées ?",
    en: "Is my data secure?",
  },
  "faq.a4": {
    fr: "Absolument. Vos données sont chiffrées et ne sont jamais utilisées pour entraîner des modèles IA. Nous sommes conformes au RGPD.",
    en: "Absolutely. Your data is encrypted and never used to train AI models. We are GDPR compliant.",
  },
  "faq.q5": {
    fr: "Puis-je annuler à tout moment ?",
    en: "Can I cancel anytime?",
  },
  "faq.a5": {
    fr: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace de facturation. Pas d'engagement.",
    en: "Yes, you can cancel your subscription at any time from your billing area. No commitment.",
  },

  // Footer
  "footer.product": { fr: "Produit", en: "Product" },
  "footer.company": { fr: "Entreprise", en: "Company" },
  "footer.legal": { fr: "Légal", en: "Legal" },
  "footer.privacy": { fr: "Politique de confidentialité", en: "Privacy Policy" },
  "footer.terms": { fr: "Conditions d'utilisation", en: "Terms of Service" },
  "footer.legalNotice": { fr: "Mentions légales", en: "Legal Notice" },
  "footer.description": {
    fr: "Plateforme IA pour restaurateurs. Optimisez votre carte, vos marges et votre présence en ligne.",
    en: "AI platform for restaurant owners. Optimize your menu, margins and online presence.",
  },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved." },
} as const;

export type TranslationKey = keyof typeof translations;

export async function getLocale(): Promise<Locale> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  return locale === "en" ? "en" : "fr";
}

export function t(key: TranslationKey, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] || entry.fr;
}

export function createT(locale: Locale) {
  return (key: TranslationKey) => t(key, locale);
}
