// Funnel event tracking — voir KIPSTATS-EVENTS.md à la racine du monorepo.
type EventData = Record<string, unknown>;

/** Émet un event funnel kipstats. No-op côté serveur ou si le tracker n'est pas chargé. */
export function track(name: string, data: EventData = {}) {
  if (typeof window === "undefined") return;
  const k = (window as { kipstats?: { event?: (n: string, d: EventData) => void } }).kipstats;
  k?.event?.(name, data);
}

/** Prix abonnement mensuel en centimes par plan (pour checkout_started / purchase). */
export const PLAN_PRICE_CENTS: Record<string, number> = { pro: 2900, business: 7900 };

/** Prix d'un pack de jetons en centimes, indexé par nombre de jetons. */
export const TOKEN_PACK_PRICE_CENTS: Record<number, number> = {
  500: 900,
  2000: 2900,
  5000: 5900,
};
