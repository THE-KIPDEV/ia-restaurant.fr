import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions d'utilisation d'IA Restaurant — ia-restaurant.fr",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold gradient-text">Conditions d&apos;utilisation</h1>
      <p className="mt-2 text-sm text-text-muted">Dernière mise à jour : mars 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">1. Éditeur</h2>
          <p>Le site ia-restaurant.fr est édité par Kipdev, SIREN 884120890. Contact : yohann@kipdev.io</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">2. Description du service</h2>
          <p>IA Restaurant est une plateforme SaaS qui utilise l&apos;intelligence artificielle pour aider les restaurateurs à optimiser leur carte, analyser leurs marges, générer des descriptions de plats, répondre aux avis clients et créer du contenu pour les réseaux sociaux.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">3. Inscription</h2>
          <p>L&apos;inscription est gratuite et donne accès au plan Free (50 jetons/mois). L&apos;utilisateur s&apos;engage à fournir des informations exactes.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">4. Jetons et abonnements</h2>
          <p>Chaque action IA consomme un nombre défini de jetons. Les jetons mensuels sont renouvelés à chaque cycle de facturation. Les jetons achetés en pack n&apos;expirent pas. Les abonnements sont sans engagement et peuvent être annulés à tout moment.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">5. Contenu généré par IA</h2>
          <p>Les contenus générés par l&apos;IA sont fournis à titre indicatif. L&apos;utilisateur est responsable de la vérification et de l&apos;utilisation des contenus générés. Kipdev ne garantit pas l&apos;exactitude des résultats.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">6. Propriété intellectuelle</h2>
          <p>Les contenus générés par l&apos;IA pour l&apos;utilisateur lui appartiennent. La plateforme, son code source et son design restent la propriété de Kipdev.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">7. Limitation de responsabilité</h2>
          <p>Kipdev met en œuvre tous les moyens raisonnables pour assurer la disponibilité du service. La responsabilité de Kipdev est limitée au montant des sommes versées par l&apos;utilisateur au cours des 12 derniers mois.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">8. Droit applicable</h2>
          <p>Les présentes conditions sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.</p>
        </section>
      </div>
    </div>
  );
}
