import {
  BarChart3,
  ChefHat,
  MessageSquare,
  Share2,
  Languages,
  TrendingUp,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { createT } from "@/lib/i18n";
import { TOKEN_COSTS } from "@/lib/config";

export function Features({ locale }: { locale: Locale }) {
  const t = createT(locale);

  const features = [
    {
      icon: BarChart3,
      title: t("features.menuAnalysis.title"),
      description: t("features.menuAnalysis.desc"),
      tokens: TOKEN_COSTS.MENU_ANALYSIS,
      color: "neon",
    },
    {
      icon: ChefHat,
      title: t("features.dishDescription.title"),
      description: t("features.dishDescription.desc"),
      tokens: TOKEN_COSTS.DISH_DESCRIPTION,
      color: "purple",
    },
    {
      icon: MessageSquare,
      title: t("features.reviewResponse.title"),
      description: t("features.reviewResponse.desc"),
      tokens: TOKEN_COSTS.REVIEW_RESPONSE,
      color: "neon",
    },
    {
      icon: Share2,
      title: t("features.socialPost.title"),
      description: t("features.socialPost.desc"),
      tokens: TOKEN_COSTS.SOCIAL_POST,
      color: "purple",
    },
    {
      icon: Languages,
      title: t("features.translate.title"),
      description: t("features.translate.desc"),
      tokens: TOKEN_COSTS.TRANSLATE,
      color: "neon",
    },
    {
      icon: TrendingUp,
      title: t("features.marginAnalysis.title"),
      description: t("features.marginAnalysis.desc"),
      tokens: TOKEN_COSTS.MARGIN_ANALYSIS,
      color: "purple",
    },
  ];

  return (
    <section id="features" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">{t("features.title")}</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="card card-glow group relative overflow-hidden p-6"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-neon opacity-[0.02] blur-[60px] transition-opacity group-hover:opacity-[0.06]" />

              <div
                className={`mb-4 inline-flex items-center justify-center rounded-lg p-2.5 ${
                  feature.color === "neon"
                    ? "bg-neon-glow border border-neon/20"
                    : "bg-purple-glow border border-purple/20"
                }`}
              >
                <feature.icon
                  className={`h-5 w-5 ${
                    feature.color === "neon" ? "text-neon" : "text-purple"
                  }`}
                />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-text-primary">
                {feature.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-text-muted">
                  {feature.tokens} {locale === "fr" ? "jetons" : "tokens"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
