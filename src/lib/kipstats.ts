// Funnel event tracking — voir KIPSTATS-EVENTS.md à la racine du monorepo.
type EventData = Record<string, unknown>;

function fire(name: string, data: EventData): boolean {
  const k = (window as { kipstats?: { event?: (n: string, d: EventData) => void } }).kipstats;
  if (k && typeof k.event === "function") {
    k.event(name, data);
    return true;
  }
  return false;
}

/**
 * Émet un event funnel. No-op côté serveur.
 *
 * 🚨 tracker.js est chargé en différé : sur un event déclenché AU RENDU d'une page
 * — typiquement `purchase` au retour de Stripe — `window.kipstats` peut ne pas
 * encore exister, et l'event était jeté EN SILENCE. Une vente encaissée pouvait
 * donc n'apparaître nulle part dans kipstats, qui affichait « checkout ouvert,
 * pas payé » pour un client qui avait payé.
 * On réessaie jusqu'à ce que le tracker ait posé son pageview. Sur un onclick,
 * rien ne change : le tracker est déjà prêt.
 */
export function track(name: string, data: EventData = {}) {
  if (typeof window === "undefined") return;
  if (fire(name, data)) return;
  let tries = 0;
  const retry = () => {
    if (fire(name, data) || tries++ > 40) return; // ~10 s de rattrapage, puis on renonce
    setTimeout(retry, 250);
  };
  const ric = (window as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
  if (ric) ric(retry);
  else setTimeout(retry, 250);
}

/** Prix abonnement mensuel en centimes par plan (pour checkout_started / purchase). */
export const PLAN_PRICE_CENTS: Record<string, number> = { pro: 2900, business: 7900 };

/** Prix d'un pack de jetons en centimes, indexé par nombre de jetons. */
export const TOKEN_PACK_PRICE_CENTS: Record<number, number> = {
  500: 900,
  2000: 2900,
  5000: 5900,
};
