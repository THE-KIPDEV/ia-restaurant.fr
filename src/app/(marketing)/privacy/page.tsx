import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité d'IA Restaurant — ia-restaurant.fr",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold gradient-text">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : mars 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">1. Responsable du traitement</h2>
          <p>Kipdev — SIREN 884120890<br />Responsable : Yohann Music<br />Contact : yohann@kipdev.io</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li>Données d&apos;identification : nom, email (via Clerk)</li>
            <li>Données de paiement : gérées par Stripe (nous ne stockons pas vos coordonnées bancaires)</li>
            <li>Données d&apos;utilisation : restaurants, plats, historique d&apos;utilisation IA</li>
            <li>Données techniques : cookies, adresse IP, type de navigateur</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">3. Finalités</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>Fourniture et amélioration du service</li>
            <li>Gestion des abonnements et paiements</li>
            <li>Communication relative au service</li>
            <li>Respect des obligations légales</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">4. IA et données</h2>
          <p>Vos données envoyées à l&apos;IA (descriptions de plats, avis, menus) sont traitées par Claude d&apos;Anthropic. Ces données ne sont pas utilisées pour entraîner des modèles d&apos;IA. Elles sont traitées de manière éphémère pour générer les résultats demandés.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">5. Durée de conservation</h2>
          <p>Les données sont conservées pendant la durée de votre compte, puis supprimées dans les 30 jours suivant la suppression du compte.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">6. Vos droits (RGPD)</h2>
          <p>Vous disposez des droits d&apos;accès, de rectification, de suppression, de portabilité et d&apos;opposition. Contactez yohann@kipdev.io pour exercer vos droits.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">7. Cookies</h2>
          <p>Nous utilisons des cookies essentiels (authentification, préférences de langue) et analytiques. Vous pouvez les gérer via les paramètres de votre navigateur.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">8. Sous-traitants</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>Clerk (authentification) — USA</li>
            <li>Stripe (paiements) — USA</li>
            <li>Anthropic (IA) — USA</li>
            <li>Railway (hébergement) — USA</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
