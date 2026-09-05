"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { track, TOKEN_PACK_PRICE_CENTS } from "@/lib/kipstats";

type Pack = {
  amount: number;
  price: number;
  popular: boolean;
};

export function TokenPacks({ locale, packs }: { locale: Locale; packs: Pack[] }) {
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);

  async function handleBuy(amount: number) {
    setLoadingAmount(amount);
    try {
      // kip-pay:bouton — le paiement se fait dans la page, à la marque du site.
      // La page hébergée de Stripe reste le repli : le tunnel y bascule seul.
      const kipTunnel = (globalThis as { KipPayTunnel?: { ouvrir: (o: Record<string, unknown>) => void } }).KipPayTunnel;
      if (kipTunnel) {
        kipTunnel.ouvrir({
          endpoint: "/api/stripe/checkout-tokens",
          payload: { amount },
          logoUrl: "/favicon.svg",
          siteName: "Ia Restaurant",
        });
        return;
      }
      const res = await fetch("/api/stripe/checkout-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      track("checkout_started", {
        plan: `tokens_${amount}`,
        price: TOKEN_PACK_PRICE_CENTS[amount] ?? null,
      });
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur";
      toast.error(
        locale === "fr"
          ? "Impossible de démarrer le paiement"
          : "Unable to start checkout",
        { description: message }
      );
      setLoadingAmount(null);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {packs.map((pack, i) => (
        <div key={i} className={`card p-5 text-center ${pack.popular ? "neon-border" : ""}`}>
          {pack.popular && <span className="badge-neon mb-2 inline-flex">{locale === "fr" ? "Populaire" : "Popular"}</span>}
          <p className="text-3xl font-extrabold text-text-primary">{pack.amount.toLocaleString()}</p>
          <p className="text-sm text-text-muted">{locale === "fr" ? "jetons" : "tokens"}</p>
          <p className="mt-2 text-2xl font-bold text-neon">{formatPrice(pack.price)}</p>
          <p className="text-xs text-text-muted">{formatPrice(pack.price / pack.amount * 100)}/100 tokens</p>
          <button
            onClick={() => handleBuy(pack.amount)}
            disabled={loadingAmount !== null}
            className="btn-primary mt-4 w-full text-sm disabled:opacity-60"
          >
            {loadingAmount === pack.amount
              ? locale === "fr" ? "Redirection…" : "Redirecting…"
              : locale === "fr" ? "Acheter" : "Buy"}
          </button>
        </div>
      ))}
    </div>
  );
}
