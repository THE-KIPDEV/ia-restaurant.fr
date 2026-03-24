import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales d'IA Restaurant — ia-restaurant.fr",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold gradient-text">Mentions légales</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Éditeur du site</h2>
          <p>
            Kipdev<br />
            SIREN : 884120890<br />
            Représentant : Yohann Music<br />
            Email : yohann@kipdev.io<br />
            <a href="https://www.pappers.fr/entreprise/kipdev-884120890" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">
              Voir sur Pappers
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Hébergement</h2>
          <p>
            Railway Corporation<br />
            San Francisco, CA, USA<br />
            <a href="https://railway.app" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">
              railway.app
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Propriété intellectuelle</h2>
          <p>L&apos;ensemble du contenu du site ia-restaurant.fr (textes, images, code, design) est protégé par le droit d&apos;auteur. Toute reproduction sans autorisation est interdite.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Protection des données</h2>
          <p>Conformément au RGPD, vous disposez de droits sur vos données personnelles. Consultez notre <a href="/privacy" className="text-neon hover:underline">politique de confidentialité</a> pour en savoir plus.</p>
        </section>
      </div>
    </div>
  );
}
