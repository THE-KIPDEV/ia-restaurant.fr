/**
 * kip-libelle — le nom du site sur le relevé bancaire de l'acheteur.
 *
 * Le compte Stripe signe « KIPDEV » : une société que l'acheteur n'a jamais vue,
 * et un libellé inconnu se conteste auprès de la banque. Avec le suffixe, le
 * relevé dit « KIPDEV* IA RESTAURANT ».
 *
 * 🚨 Paiement unique seulement : Stripe refuse `payment_intent_data` en mode
 *    abonnement (400, relevé sur le compte live le 11/09/2026).
 * 🚨 Au-delà de 22 caractères, Stripe refuse la session ENTIÈRE : le libellé est
 *    borné à 14 (22 − « KIPDEV* »).
 *
 * Générique plutôt que typé `Stripe.Checkout.SessionCreateParams` : l'appel
 * enveloppé reste vérifié exactement comme avant, sans import de plus.
 */
export const LIBELLE_RELEVE = "IA RESTAURANT";

export function avecLibelle<T>(params: T): T {
  const p = params as unknown as
    | { mode?: unknown; payment_intent_data?: { statement_descriptor_suffix?: unknown } }
    | null
    | undefined;
  if (!p || p.mode !== "payment" || p.payment_intent_data?.statement_descriptor_suffix) return params;
  return {
    ...p,
    payment_intent_data: { ...p.payment_intent_data, statement_descriptor_suffix: LIBELLE_RELEVE },
  } as unknown as T;
}
