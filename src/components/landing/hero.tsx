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
      <div className="hero-gradient absolute inset-0" />
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
              ? "Démonstration interactive sans inscription"
              : "Interactive demonstration without registration"}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 rounded-2xl border border-border-default bg-surface-2 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neon">{locale === "fr" ? "Exemple de coût matière" : "Food cost example"}</p>
            <h2 className="mt-3 text-xl font-semibold">{locale === "fr" ? "Un plat à 18 € HT, une matière à 5,40 €" : "A €18 dish, €5.40 in ingredients"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{locale === "fr" ? "Le coût matière représente 30 % du prix HT. Il reste 12,60 € avant les autres charges : ce montant n’est pas votre bénéfice net." : "Ingredients represent 30% of the pre-tax price. €12.60 remains before other costs; this is not net profit."}</p>
          </div>
          <div className="rounded-xl bg-surface-0 p-5">
            <p className="text-sm text-text-secondary">{locale === "fr" ? "Pour décider quoi retravailler" : "To choose what to improve"}</p>
            <p className="mt-3 text-3xl font-bold text-neon">30 % <span className="text-sm font-normal text-text-secondary">{locale === "fr" ? "de coût matière" : "food cost"}</span></p>
            <p className="mt-3 text-sm text-text-secondary">{locale === "fr" ? "Ajoutez les quantités vendues pour comparer popularité et marge de vos plats." : "Add sales quantities to compare dish popularity and margin."}</p>
            <Link href="/seo/comment-fixer-prix-plat-restaurant" className="mt-4 inline-block text-sm font-semibold text-neon underline underline-offset-4">{locale === "fr" ? "Comprendre le calcul →" : "Understand the calculation →"}</Link>
          </div>
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
