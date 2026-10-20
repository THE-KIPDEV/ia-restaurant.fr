import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://ia-restaurant.fr/privacy" },
  title: "Politique de confidentialité",
  description: "Politique de confidentialité d'IA Restaurant — ia-restaurant.fr",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold gradient-text">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : 20 octobre 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">1. Responsable du traitement</h2>
          <p>Kipdev — SIREN 884120890<br />Responsable : Yohann Music<br />Contact : yohann@kipdev.io</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li>Données d&apos;identification : nom, email (authentification gérée en interne, mots de passe hachés via bcrypt)</li>
            <li>Données de paiement : gérées par Stripe (nous ne stockons pas vos coordonnées bancaires)</li>
            <li>Données d&apos;utilisation : restaurants, documents originaux déposés, relevés de caisse, factures, réservations, recettes, équipe, consignes et historique d&apos;utilisation IA</li>
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
          <p>Lors d&apos;une lecture IA, le document choisi est transmis à Anthropic. Lors d&apos;une question, les données du restaurant sélectionnées pour l&apos;analyse et les échanges récents sont transmis à Anthropic. Les documents, leurs corrections et les réponses sont conservés dans votre compte pour constituer la mémoire du restaurant. La démonstration publique n&apos;envoie aucun document ni question à une IA.</p>
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
          <p>Les cookies de connexion et de langue assurent le fonctionnement du service. Orbe+ conserve votre choix de consentement. KipStats est un outil de mesure d’audience sans cookie exploité par KIPDEV, utilisé pour la seule mesure de la fréquentation du site et la production de statistiques anonymes. Il reçoit l’adresse de la page, le site de provenance, la taille d’écran, la langue du navigateur et, comme tout serveur, l’adresse IP, qui n’est pas conservée (seule une empreinte renouvelée chaque jour et propre à ce site est utilisée). Ces données ne sont ni croisées avec d’autres traitements ni transmises à des tiers, et sont conservées 25 mois au plus. Conformément à la délibération CNIL n° 2020-091, cette mesure est exemptée de consentement. Vous pouvez vous y opposer à tout moment avec ce lien : <a href="/?kp_ignore=1">désactiver la mesure d’audience</a> (il pose une marque dans votre navigateur qui coupe toute mesure sur ce site ; <code>?kp_ignore=0</code> la retire). Vous pouvez modifier vos choix de consentement via « Gérer mes cookies » en pied de page.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">8. Sous-traitants</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>Stripe (paiements) — USA</li>
            <li>Anthropic (IA) — USA</li>
            <li>Hostinger (hébergement du service)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
