"use client";
import { useEffect } from "react";
import { track } from "@/lib/kipstats";

/**
 * Émet `purchase {plan, amount}` une fois, au retour Stripe (success_url ?success=true).
 * `amount` en centimes. Rendre conditionnellement (page lit le search param côté serveur).
 */
export default function PurchaseSignal({ plan, amount }: { plan: string; amount: number | null }) {
  useEffect(() => {
    track("purchase", { plan, amount });
  }, [plan, amount]);
  return null;
}
