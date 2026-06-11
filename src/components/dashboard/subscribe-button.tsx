"use client";

import { useState } from "react";
import { toast } from "sonner";
import { track, PLAN_PRICE_CENTS } from "@/lib/kipstats";

/** Bouton d'abonnement : emet `checkout_started {plan, price}` puis redirige vers Stripe. */
export function SubscribeButton({
  plan,
  priceId,
  label,
}: {
  plan: "pro" | "business";
  priceId?: string;
  label: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!priceId) {
      toast.error("Offre indisponible");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      track("checkout_started", { plan, price: PLAN_PRICE_CENTS[plan] ?? null });
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="btn-primary mt-4 w-full text-sm disabled:opacity-60"
    >
      {loading ? "Redirection…" : label}
    </button>
  );
}
