import { requireUser, getUserPlan } from "@/lib/auth";
import { getUsageStats } from "@/lib/tokens";
import { PLANS, TOKEN_PACKS, type PlanKey } from "@/lib/stripe";
import { getLocale } from "@/lib/i18n";
import { Coins, Zap, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TokenPacks } from "@/components/dashboard/token-packs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Jetons" };

const featureLabels: Record<string, { fr: string; en: string }> = {
  MENU_ANALYSIS: { fr: "Menu Engineering", en: "Menu Engineering" },
  DISH_DESCRIPTION: { fr: "Descriptions IA", en: "AI Descriptions" },
  REVIEW_RESPONSE: { fr: "Réponses avis", en: "Review Responses" },
  SOCIAL_POST: { fr: "Posts sociaux", en: "Social Posts" },
  TRANSLATE: { fr: "Traduction", en: "Translation" },
  MARGIN_ANALYSIS: { fr: "Analyse marges", en: "Margin Analysis" },
};

export default async function TokensPage() {
  const user = await requireUser();
  const locale = await getLocale();
  const plan = getUserPlan(user);
  const planKey = plan.toLowerCase() as PlanKey;
  const tokenMax = PLANS[planKey]?.tokens ?? 50;
  const stats = await getUsageStats(user.id);
  const tokenPercent = tokenMax > 0 ? Math.min((user.tokenBalance / tokenMax) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Coins className="h-6 w-6 text-neon" />
          <span className="gradient-text">{locale === "fr" ? "Jetons" : "Tokens"}</span>
        </h1>
      </div>

      {/* Balance Card */}
      <div className="card neon-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">{locale === "fr" ? "Solde actuel" : "Current Balance"}</p>
            <p className="mt-1 text-4xl font-extrabold neon-text">{user.tokenBalance.toLocaleString()}</p>
            <p className="mt-1 text-sm text-text-muted">/ {tokenMax.toLocaleString()} {locale === "fr" ? "ce mois" : "this month"}</p>
          </div>
          <Zap className="h-16 w-16 text-neon opacity-20" />
        </div>
        <div className="token-bar mt-4">
          <div className="token-bar-fill" style={{ width: `${tokenPercent}%` }} />
        </div>
        {user.tokenResetAt && (
          <p className="mt-2 text-xs text-text-muted">
            {locale === "fr" ? "Renouvellement :" : "Reset:"} {formatDate(user.tokenResetAt, locale === "fr" ? "fr-FR" : "en-US")}
          </p>
        )}
      </div>

      {/* Token Packs */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          {locale === "fr" ? "Acheter des jetons supplémentaires" : "Buy Extra Tokens"}
        </h2>
        <TokenPacks
          locale={locale}
          packs={TOKEN_PACKS.map((p) => ({ amount: p.amount, price: p.price, popular: p.popular }))}
        />
      </div>

      {/* Usage Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <TrendingUp className="h-4 w-4 text-neon" />
            {locale === "fr" ? "Usage par fonctionnalité" : "Usage by Feature"}
          </h3>
          <div className="space-y-3">
            {stats.byFeature.map((item) => (
              <div key={item.feature} className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  {featureLabels[item.feature]?.[locale] || item.feature}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{item._count}x</span>
                  <span className="text-sm font-medium text-neon">{item._sum.tokensUsed} tokens</span>
                </div>
              </div>
            ))}
            {stats.byFeature.length === 0 && (
              <p className="text-sm text-text-muted">{locale === "fr" ? "Aucune utilisation" : "No usage yet"}</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold text-text-primary">
            {locale === "fr" ? "Activité récente" : "Recent Activity"}
          </h3>
          <div className="space-y-2">
            {stats.recent.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-surface-3 p-2.5">
                <div>
                  <p className="text-xs font-medium text-text-primary">
                    {featureLabels[item.feature]?.[locale] || item.feature}
                  </p>
                  {item.restaurant && (
                    <p className="text-xs text-text-muted">{item.restaurant.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-neon">-{item.tokensUsed}</p>
                  <p className="text-xs text-text-muted">{formatDate(item.createdAt, locale === "fr" ? "fr-FR" : "en-US")}</p>
                </div>
              </div>
            ))}
            {stats.recent.length === 0 && (
              <p className="text-sm text-text-muted">{locale === "fr" ? "Aucune activité" : "No activity yet"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
