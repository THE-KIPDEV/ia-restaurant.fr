import type { Metadata } from "next";

const pageUrl = "https://ia-restaurant.fr/guides/chantage-avis-google-restaurant";
const title = "Chantage aux avis Google : que faire pour votre restaurant ?";
const description = "Avis négatifs suivis d’une demande d’argent : preuves à réunir, formulaire Google et suivi. Guide restaurateur vérifié le 26 octobre 2026.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    url: pageUrl,
    title,
    description,
    locale: "fr_FR",
    publishedTime: "2026-10-26",
    modifiedTime: "2026-10-26",
  },
  twitter: { card: "summary", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: title,
      description,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      inLanguage: "fr-FR",
      datePublished: "2026-10-26",
      dateModified: "2026-10-26",
      author: { "@type": "Organization", name: "IA Restaurant", url: "https://ia-restaurant.fr" },
      publisher: { "@type": "Organization", name: "Kipdev", url: "https://ia-restaurant.fr/legal" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://ia-restaurant.fr" },
        { "@type": "ListItem", position: 2, name: "Chantage aux avis Google", item: pageUrl },
      ],
    },
  ],
};

export default function ReviewExtortionGuide() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <nav aria-label="Fil d’ariane" className="mb-6 text-sm text-text-muted">
          <a href="/" className="hover:text-neon underline">Accueil</a>
          <span className="mx-2">/</span>
          <span>Chantage aux avis Google</span>
        </nav>
        <h1 className="text-3xl font-bold leading-tight text-text-primary sm:text-4xl">Chantage aux avis Google : que faire pour votre restaurant ?</h1>
        <p className="mt-4 text-sm text-text-muted">Par IA Restaurant · Publié le <time dateTime="2026-10-26">26 octobre 2026</time> · Sources vérifiées le même jour</p>

        <div className="mt-8 card neon-border p-6">
          <p className="leading-relaxed text-text-secondary">Une série d’avis négatifs suivie d’un message exigeant de l’argent pour les retirer appelle un signalement spécifique. Google recommande de ne pas payer ni négocier et de conserver les preuves. Son <a href="https://support.google.com/business/contact/merchant_extortion?hl=fr" className="text-neon underline">formulaire de signalement d’extorsion</a> est accessible au jour de notre vérification. Il ne garantit pas le retrait des avis.</p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Ce que Google a annoncé en 2026</h2>
          <p className="mt-4 leading-relaxed text-text-secondary">Le <a href="https://blog.google/products-and-platforms/products/maps/new-ways-were-protecting-businesses-on-maps/" className="text-neon underline">16 avril 2026, Google a annoncé</a> des protections contre les attaques d’avis : détection renforcée, retrait du spam, suspension temporaire de nouveaux avis lors de pics suspects, alerte au propriétaire et bannière pour les internautes. L’annonce prévoyait un déploiement mondial dans les semaines suivantes.</p>
          <p className="mt-4 leading-relaxed text-text-secondary">Cette annonce ne permet pas de confirmer l’activation sur votre fiche. Ne comptez pas sur un bouton pour suspendre vous-même les avis : préparez le signalement. La procédure dédiée était déjà présentée dans le <a href="https://blog.google/innovation-and-ai/technology/safety-security/fraud-and-scams-advisory-november-2025/" className="text-neon underline">bulletin Google du 6 novembre 2025</a>.</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Choisir le bon canal</h2>
          <dl className="mt-5 space-y-4">
            <div className="card p-5">
              <dt className="font-semibold text-text-primary">Avis négatifs et demande d’argent ou de faveurs pour les enlever</dt>
              <dd className="mt-2 leading-relaxed text-text-secondary">Utilisez le formulaire d’extorsion. L’<a href="https://support.google.com/business/answer/16404809?hl=fr" className="text-neon underline">aide Google</a> réserve ce canal aux établissements directement visés par une telle demande.</dd>
            </div>
            <div className="card p-5">
              <dt className="font-semibold text-text-primary">Avis suspect sans demande de contrepartie</dt>
              <dd className="mt-2 leading-relaxed text-text-secondary">Passez par le <a href="https://support.google.com/business/answer/4596773?hl=fr" className="text-neon underline">signalement ordinaire des avis</a> et indiquez la règle enfreinte. Une note basse ou une réservation introuvable ne prouve pas, à elle seule, une manipulation.</dd>
            </div>
            <div className="card p-5">
              <dt className="font-semibold text-text-primary">Client déçu relatant son expérience</dt>
              <dd className="mt-2 leading-relaxed text-text-secondary">Traitez sa réclamation. Google ne retire pas un avis uniquement parce que le restaurateur le conteste. Notre <a href="/seo/repondre-avis-google-restaurant" className="text-neon underline">guide des réponses aux avis</a> aide à préparer une réponse adaptée.</dd>
            </div>
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Préparer le dossier avant d’ouvrir le formulaire</h2>
          <p className="mt-4 leading-relaxed text-text-secondary">Réunissez les pièces dans un dossier réservé aux responsables du restaurant. La <a href="https://support.google.com/business/answer/16404809?hl=fr" className="text-neon underline">liste de justificatifs de Google</a> précise les éléments attendus.</p>
          <ol className="mt-5 list-decimal space-y-4 pl-6 leading-relaxed text-text-secondary">
            <li><strong className="text-text-primary">Identifier l’établissement.</strong> Préparez son nom, son adresse, le lien public Maps et les coordonnées du responsable.</li>
            <li><strong className="text-text-primary">Relier les avis à la demande.</strong> Conservez leurs liens directs, puis les messages reçus avec l’expéditeur, la date et l’heure visibles. Gardez les originaux.</li>
            <li><strong className="text-text-primary">Établir une chronologie.</strong> Notez le début des avis suspects, la première demande et ce qui est exigé en échange du retrait.</li>
            <li><strong className="text-text-primary">Remplir et relire.</strong> Le formulaire demande notamment la période concernée, les avis suspects et les modalités du contact. Joignez les pièces qui étayent les faits décrits, puis envoyez.</li>
          </ol>
          <p className="mt-4 leading-relaxed text-text-secondary">Conseil d’organisation : désignez une personne pour le suivi et notez la date d’envoi. Ne publiez pas les échanges privés sous les avis.</p>
        </section>

        <section className="mt-12 card p-6">
          <h2 className="text-2xl font-bold text-text-primary">Exemple fictif de chronologie à adapter</h2>
          <p className="mt-3 leading-relaxed text-text-secondary">Un restaurant constate plusieurs avis rapprochés, puis reçoit une demande de paiement. Son dossier peut prendre cette forme, en remplaçant chaque crochet par une donnée vérifiée :</p>
          <blockquote className="mt-4 border-l-2 border-neon pl-4 leading-relaxed text-text-secondary">[Date et heure] : premiers avis suspects, liens joints. [Date et heure] : message de [identifiant] proposant leur retrait contre [demande exacte]. Pièces : captures des avis et du message avec horodatage. Lien de notre fiche : [URL Maps].</blockquote>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">Ce modèle est une aide à la rédaction, pas un témoignage. Si une information manque, indiquez-le ; ne complétez pas le dossier avec une supposition ou une preuve créée par IA.</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Après l’envoi : suivre sans promettre un délai</h2>
          <p className="mt-4 leading-relaxed text-text-secondary">Pour l’extorsion, Google indique examiner les pièces et communiquer le résultat, sans donner de délai garanti. Pour un signalement ordinaire, l’outil de gestion des avis affiche son état ; si aucune infraction n’est retenue, un appel ponctuel peut être proposé. Ce sont deux parcours distincts : ne transposez pas les statuts de l’un à l’autre.</p>
          <p className="mt-4 leading-relaxed text-text-secondary">Si vous préparez une réponse publique, limitez-la aux faits vérifiés et relisez-la avant publication. Le <a href="/dashboard/review-responder" className="text-neon underline">rédacteur de réponses aux avis</a>, accessible dans votre espace, peut aider à formuler un brouillon ; il ne transmet pas de signalement à Google. Consultez aussi les <a href="/seo/repondre-avis-google-restaurant#exemples" className="text-neon underline">exemples de réponses</a> pour les réclamations ordinaires.</p>
        </section>

        <section className="mt-12 border-t border-border-dim pt-8">
          <h2 className="text-xl font-bold text-text-primary">Sources officielles</h2>
          <p className="mt-3 text-sm text-text-muted">Consultées le 26 octobre 2026. L’accès au formulaire a été vérifié sans envoi de dossier ni test de traitement.</p>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed">
            <li><a href="https://blog.google/products-and-platforms/products/maps/new-ways-were-protecting-businesses-on-maps/" className="text-neon underline">Google Maps, protections annoncées le 16 avril 2026</a></li>
            <li><a href="https://blog.google/innovation-and-ai/technology/safety-security/fraud-and-scams-advisory-november-2025/" className="text-neon underline">Google, bulletin sur les escroqueries du 6 novembre 2025</a></li>
            <li><a href="https://support.google.com/business/answer/16404809?hl=fr" className="text-neon underline">Aide Google, procédure d’extorsion et justificatifs</a></li>
            <li><a href="https://support.google.com/business/contact/merchant_extortion?hl=fr" className="text-neon underline">Google, formulaire de signalement d’extorsion</a></li>
            <li><a href="https://support.google.com/business/answer/4596773?hl=fr" className="text-neon underline">Aide Google, signalement ordinaire et appel</a></li>
          </ul>
        </section>
      </article>
    </div>
  );
}
