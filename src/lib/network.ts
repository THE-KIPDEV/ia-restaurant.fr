// KIPDEV inter-site network — source: automation/kipdev-network.json
// Used by the "Nos autres outils" footer block for inter-site maillage (SEO + cross-promo).
// All domains verified live. Keep in sync with the canonical JSON.

export type NetworkSite = {
  domain: string;
  label: string;
  desc: string;
  category: "ia" | "restaurant" | "documents" | "image-video" | "mariage" | "dev";
  flagship?: boolean;
};

export const NETWORK_SITES: NetworkSite[] = [
  { domain: "quelle-ia-choisir.fr", label: "Quelle IA choisir", desc: "Comparateur d'outils IA", category: "ia", flagship: true },
  { domain: "meilleure-formation-ia.fr", label: "Meilleure formation IA", desc: "Comparateur de formations IA", category: "ia" },
  { domain: "metiers-ia.fr", label: "Métiers de l'IA", desc: "Annuaire des métiers de l'IA", category: "ia" },
  { domain: "ia-debutant.fr", label: "IA Débutant", desc: "Formation IA pour débutants", category: "ia" },
  { domain: "ia-restaurant.fr", label: "IA Restaurant", desc: "Outils IA pour restaurateurs", category: "ia" },
  { domain: "generateur-image-ia.fr", label: "Générateur d'images IA", desc: "Créez des images par IA", category: "ia", flagship: true },
  { domain: "generateur-logo-ia.fr", label: "Générateur de logos IA", desc: "Créez un logo par IA", category: "ia" },
  { domain: "coloriage-ia.fr", label: "Coloriage IA", desc: "Coloriages générés par IA", category: "ia" },
  { domain: "kipagent.com", label: "KipAgent", desc: "Chatbot IA pour votre site", category: "ia" },

  { domain: "fiche-haccp.fr", label: "Fiche HACCP", desc: "Générateur de fiches HACCP", category: "restaurant", flagship: true },
  { domain: "pack-hygiene-restaurant.fr", label: "Pack Hygiène Restaurant", desc: "Logiciel hygiène & HACCP", category: "restaurant" },
  { domain: "tableau-allergenes.fr", label: "Tableau des allergènes", desc: "Affichage allergènes obligatoire", category: "restaurant" },
  { domain: "origine-viande.fr", label: "Origine des viandes", desc: "Affichage origine viandes", category: "restaurant" },
  { domain: "creer-menu-restaurant.fr", label: "Créer un menu", desc: "Éditeur de menus restaurant", category: "restaurant" },
  { domain: "my-food-truck.com", label: "My Food Truck", desc: "Site & commandes food truck", category: "restaurant" },

  { domain: "legal-site.fr", label: "Legal Site", desc: "Mentions légales & CGV/CGU", category: "documents", flagship: true },
  { domain: "reglement-interieur-entreprise.fr", label: "Règlement intérieur", desc: "Règlement intérieur entreprise", category: "documents" },
  { domain: "le-registre-unique-personnel.fr", label: "Registre du personnel", desc: "Registre unique du personnel", category: "documents" },
  { domain: "registre-dasri.fr", label: "Registre DASRI", desc: "Registre déchets de soins", category: "documents" },
  { domain: "gestion-notes-de-frais.fr", label: "Notes de frais", desc: "Générateur de notes de frais", category: "documents" },
  { domain: "facture-auto-entrepreneur.fr", label: "Factures auto-entrepreneur", desc: "Facturation auto-entrepreneur", category: "documents", flagship: true },
  { domain: "succession-simulateur.fr", label: "Simulateur succession", desc: "Droits de succession", category: "documents" },
  { domain: "fiche-ronde-maintenance.fr", label: "Fiches de ronde", desc: "Fiches de ronde maintenance", category: "documents" },
  { domain: "woofacture.com", label: "WooFacture", desc: "Facturation Factur-X WooCommerce", category: "documents" },

  { domain: "supprimer-fond-image.fr", label: "Supprimer le fond", desc: "Détourage d'image en 1 clic", category: "image-video", flagship: true },
  { domain: "compresser-image.fr", label: "Compresser une image", desc: "Compression d'images", category: "image-video" },
  { domain: "ma-petite-affiche.fr", label: "Ma Petite Affiche", desc: "Affiches personnalisées", category: "image-video" },
  { domain: "make-autocut.com", label: "Make AutoCut", desc: "Montage vidéo automatique", category: "image-video" },
  { domain: "make-blur.com", label: "Make Blur", desc: "Floutage vidéo automatique", category: "image-video" },
  { domain: "make-vertical.com", label: "Make Vertical", desc: "Vidéo verticale 9:16", category: "image-video" },

  { domain: "mon-budget-mariage.fr", label: "Mon Budget Mariage", desc: "Simulateur de budget mariage", category: "mariage", flagship: true },
  { domain: "plan-de-tables.fr", label: "Plan de Tables", desc: "Plan de table de mariage", category: "mariage" },
  { domain: "creer-faire-part.com", label: "Créer un faire-part", desc: "Faire-part personnalisés", category: "mariage" },
  { domain: "galerie-mariage.fr", label: "Galerie Mariage", desc: "Galerie photo de mariage", category: "mariage" },
  { domain: "galerie-photographe.fr", label: "Galerie Photographe", desc: "Galeries photo pour pros", category: "mariage" },

  { domain: "webhook-toolkit.com", label: "Webhook Toolkit", desc: "Boîte à outils webhooks", category: "dev", flagship: true },
  { domain: "cron-ping.com", label: "Cron Ping", desc: "Monitoring de tâches cron", category: "dev" },
  { domain: "saas-starter.com", label: "SaaS Starter", desc: "Boilerplate SaaS Next.js", category: "dev" },
  { domain: "schema-org-generateur.fr", label: "Générateur Schema.org", desc: "Données structurées SEO", category: "dev" },
  { domain: "woodashai.com", label: "WooDashAI", desc: "Dashboard WooCommerce + IA", category: "dev" },
  { domain: "creer-qrcode.fr", label: "Créer un QR Code", desc: "QR codes dynamiques", category: "dev" },
  { domain: "signature-email-pro.com", label: "Signature Email Pro", desc: "Signatures email pro", category: "dev" },
  { domain: "convertir-fichier.fr", label: "Convertir un fichier", desc: "Conversion de fichiers", category: "dev" },
];

/**
 * Curated list for the current site's "Nos autres outils" footer.
 * Returns same-category siblings first, then flagships from other categories,
 * excluding the current site. Capped at `limit`.
 */
export function getNetworkLinks(currentDomain: string, limit = 6): NetworkSite[] {
  const me = NETWORK_SITES.find((s) => s.domain === currentDomain);
  const others = NETWORK_SITES.filter((s) => s.domain !== currentDomain);
  const siblings = me ? others.filter((s) => s.category === me.category) : [];
  const flagships = others.filter(
    (s) => s.flagship && (!me || s.category !== me.category)
  );
  const seen = new Set<string>();
  const out: NetworkSite[] = [];
  for (const s of [...siblings, ...flagships]) {
    if (seen.has(s.domain)) continue;
    seen.add(s.domain);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}
