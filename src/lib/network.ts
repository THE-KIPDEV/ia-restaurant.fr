// KIPDEV maillage — grappe thématique (généré par automation/maillage-grappes.py, NE PAS ÉDITER À LA MAIN)
// Bloc footer : « Nos autres sites restauration » — uniquement des sites du même thème.

export type NetworkSite = {
  domain: string;
  label: string;
  desc: string;
  category?: string;
  flagship?: boolean;
};

export const NETWORK_SITES: NetworkSite[] = [
  { domain: "fiche-haccp.fr", label: "Fiche HACCP", desc: "Générateur de fiches HACCP" },
  { domain: "creer-menu-restaurant.fr", label: "Créer un menu", desc: "Éditeur de menus restaurant" },
  { domain: "avis-resto.com", label: "Avis Resto", desc: "Gestion des avis clients" },
  { domain: "calcul-food-cost.com", label: "Calcul Food Cost", desc: "Coût matière & marges restaurant" },
  { domain: "carnet-bord-chr.com", label: "Carnet de bord CHR", desc: "Journal de bord du restaurant" },
  { domain: "planning-restaurant.com", label: "Planning Restaurant", desc: "Planning d'équipe restaurant" },
];

export function getNetworkLinks(currentDomain: string, limit = 6): NetworkSite[] {
  return NETWORK_SITES.filter((s) => s.domain !== currentDomain).slice(0, limit);
}
