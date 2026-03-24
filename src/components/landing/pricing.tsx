"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { PLANS, TOKEN_PACKS } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { createT } from "@/lib/i18n";

export function Pricing({ locale }: { locale: Locale }) {
  const [yearly, setYearly] = useState(false);
  const t = createT(locale);

  const plans = [
    { key: "free" as const, plan: PLANS.free, popular: false },
    { key: "pro" as const, plan: PLANS.pro, popular: true },
    { key: "business" as const, plan: PLANS.business, popular: false },
  ];

  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 hero-gradient opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">{t("pricing.title")}</span>
          </h2>
          <p className="mt-4 text-text-secondary">{t("pricing.subtitle")}</p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border-dim bg-surface-2 p-1">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                !yearly
                  ? "bg-neon text-surface-0"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                yearly
                  ? "bg-neon text-surface-0"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("pricing.yearly")}
              <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                {t("pricing.yearlyDiscount")}
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map(({ key, plan, popular }) => {
            const price = yearly ? plan.price.yearly : plan.price.monthly;
            const period = yearly ? t("pricing.perYear") : t("pricing.perMonth");

            return (
              <div
                key={key}
                className={`card relative overflow-hidden p-6 ${
                  popular ? "neon-border" : ""
                }`}
              >
                {popular && (
                  <div className="absolute top-4 right-4">
                    <span className="badge-neon">
                      <Zap className="h-3 w-3" />
                      {t("pricing.popular")}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-text-primary">
                  {locale === "fr" ? plan.nameFr : plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-text-primary">
                    {price === 0 ? t("pricing.free") : formatPrice(price)}
                  </span>
                  {price > 0 && (
                    <span className="text-sm text-text-muted">{period}</span>
                  )}
                </div>

                <p className="mt-2 text-sm text-neon font-medium">
                  {plan.tokens.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")}{" "}
                  {locale === "fr" ? "jetons/mois" : "tokens/mo"}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                      <span className="text-sm text-text-secondary">
                        {locale === "fr" ? feature.fr : feature.en}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={key === "free" ? "/sign-up" : "/sign-up"}
                  className={`mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
                    popular
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                >
                  {key === "free" ? t("hero.cta") : t("pricing.upgrade")}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Token Packs */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h3 className="mb-2 text-center text-xl font-bold text-text-primary">
            {t("pricing.tokenPacks")}
          </h3>
          <p className="mb-8 text-center text-sm text-text-secondary">
            {t("pricing.tokenPacksDesc")}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {TOKEN_PACKS.map((pack, i) => (
              <div
                key={i}
                className={`card p-5 text-center ${
                  pack.popular ? "neon-border" : ""
                }`}
              >
                {pack.popular && (
                  <span className="badge-neon mb-3 inline-flex">
                    {t("pricing.popular")}
                  </span>
                )}
                <p className="text-3xl font-extrabold text-text-primary">
                  {pack.amount.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")}
                </p>
                <p className="text-sm text-text-muted">{t("pricing.tokens")}</p>
                <p className="mt-2 text-2xl font-bold text-neon">
                  {formatPrice(pack.price)}
                </p>
                <button className="btn-secondary mt-4 w-full text-sm">
                  {t("pricing.buy")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
