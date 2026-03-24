import { requireUser, getUserPlan } from "@/lib/auth";
import { PLANS } from "@/lib/stripe";
import { getLocale } from "@/lib/i18n";
import { CreditCard, Check, ExternalLink } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Facturation" };

export default async function BillingPage() {
  const user = await requireUser();
  const locale = await getLocale();
  const plan = getUserPlan(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <CreditCard className="h-6 w-6 text-neon" />
          <span className="gradient-text">{locale === "fr" ? "Facturation" : "Billing"}</span>
        </h1>
      </div>

      {/* Current Plan */}
      <div className="card neon-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">{locale === "fr" ? "Plan actuel" : "Current Plan"}</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{plan}</p>
            {user.stripeCurrentPeriodEnd && (
              <p className="mt-1 text-sm text-text-muted">
                {locale === "fr" ? "Renouvellement :" : "Renews:"} {formatDate(user.stripeCurrentPeriodEnd)}
              </p>
            )}
          </div>
          {user.stripeSubscriptionId && (
            <form action="/api/stripe/portal" method="POST">
              <button className="btn-secondary flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4" />
                {locale === "fr" ? "Gérer l'abonnement" : "Manage Subscription"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-4 lg:grid-cols-3">
        {(["free", "pro", "business"] as const).map((key) => {
          const p = PLANS[key];
          const isCurrent = plan === key.toUpperCase();
          return (
            <div key={key} className={`card p-5 ${isCurrent ? "neon-border" : ""}`}>
              <h3 className="text-lg font-bold text-text-primary">
                {locale === "fr" ? p.nameFr : p.name}
              </h3>
              <p className="mt-2 text-3xl font-extrabold text-text-primary">
                {p.price.monthly === 0 ? (locale === "fr" ? "Gratuit" : "Free") : formatPrice(p.price.monthly)}
                {p.price.monthly > 0 && <span className="text-sm text-text-muted font-normal">/mois</span>}
              </p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                    {locale === "fr" ? f.fr : f.en}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="mt-4 rounded-lg bg-neon-glow py-2 text-center text-sm font-medium text-neon">
                  {locale === "fr" ? "Plan actuel" : "Current Plan"}
                </div>
              ) : key !== "free" ? (
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="priceId" value={key === "pro" ? PLANS.pro.stripePriceMonthly : PLANS.business.stripePriceMonthly} />
                  <button className="btn-primary mt-4 w-full text-sm">
                    {locale === "fr" ? "Souscrire" : "Subscribe"}
                  </button>
                </form>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
