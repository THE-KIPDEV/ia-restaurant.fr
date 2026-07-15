import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  MessageSquare,
  Languages,
  TrendingUp,
  ChefHat,
  Share2,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { createT } from "@/lib/i18n";
import CtaLink from "@/components/CtaLink";

export function Hero({ locale }: { locale: Locale }) {
  const t = createT(locale);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="hero-gradient matrix-bg absolute inset-0" />
      <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-neon opacity-5 blur-[120px]" />
      <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-purple opacity-5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon-glow px-4 py-1.5">
            <ChefHat className="h-4 w-4 text-neon" />
            <span className="text-xs font-medium text-neon">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="gradient-text">{t("hero.title")}</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CtaLink
              cta="hero_signup"
              href="/sign-up"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4" />
            </CtaLink>
            <Link
              href="#features"
              className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-base"
            >
              {t("hero.cta2")}
            </Link>
          </div>

          <p className="mt-4 text-sm text-text-secondary">
            {locale === "fr"
              ? "50 jetons offerts chaque mois — sans carte bancaire"
              : "50 free tokens every month — no credit card required"}
          </p>
        </div>

        {/* Feature pills */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: BarChart3, label: locale === "fr" ? "Menu Engineering" : "Menu Engineering" },
            { icon: ChefHat, label: locale === "fr" ? "Descriptions IA" : "AI Descriptions" },
            { icon: MessageSquare, label: locale === "fr" ? "Réponses avis" : "Review Replies" },
            { icon: Share2, label: locale === "fr" ? "Posts sociaux" : "Social Posts" },
            { icon: Languages, label: locale === "fr" ? "Traduction" : "Translation" },
            { icon: TrendingUp, label: locale === "fr" ? "Marges" : "Margins" },
          ].map((item, i) => (
            <div
              key={i}
              className="glass glass-hover flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all duration-300"
            >
              <item.icon className="h-5 w-5 text-neon" />
              <span className="text-xs font-medium text-text-secondary">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
