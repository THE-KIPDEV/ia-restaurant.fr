/**
 * Carte persistante (côté navigateur).
 *
 * Menu Engineering et Analyse des marges travaillent sur le MÊME objet métier :
 * un plat = nom + prix de vente + coût matière (+ popularité pour la BCG,
 * + catégorie pour les marges). Jusqu'ici chaque page gardait ses plats dans un
 * useState : 40 lignes à retaper à chaque session, et rien de commun entre les
 * deux outils.
 *
 * Ce module garde la carte dans le localStorage du navigateur et sert de source
 * unique aux deux outils. Volontairement sans appel réseau : aucune donnée de
 * carte ne quitte le poste tant que l'utilisateur ne lance pas une analyse.
 */

export interface StoredDish {
  name: string;
  price: string;
  costPrice: string;
  /** 1-5, utilisé par la matrice BCG. */
  popularity: number;
  /** Libellé libre, utilisé par l'analyse des marges. */
  category: string;
}

const STORAGE_KEY = "ia-restaurant:menu:v1";

export const DEFAULT_CATEGORY = "Plats";

export function emptyDish(category = DEFAULT_CATEGORY): StoredDish {
  return { name: "", price: "", costPrice: "", popularity: 3, category };
}

/** Un plat vide (ligne jamais remplie) ne mérite ni sauvegarde ni export. */
export function isBlank(dish: StoredDish): boolean {
  return !dish.name.trim() && !dish.price.trim() && !dish.costPrice.trim();
}

function sanitize(raw: unknown): StoredDish | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const name = typeof d.name === "string" ? d.name : "";
  const price = typeof d.price === "string" ? d.price : "";
  const costPrice = typeof d.costPrice === "string" ? d.costPrice : "";
  const popularity =
    typeof d.popularity === "number" && d.popularity >= 1 && d.popularity <= 5
      ? Math.round(d.popularity)
      : 3;
  const category =
    typeof d.category === "string" && d.category.trim() ? d.category : DEFAULT_CATEGORY;
  const dish = { name, price, costPrice, popularity, category };
  return isBlank(dish) ? null : dish;
}

/** Lit la carte. Retourne [] côté serveur ou si le stockage est illisible. */
export function loadMenu(): StoredDish[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitize).filter((d): d is StoredDish => d !== null);
  } catch {
    // Quota, mode privé, JSON corrompu : on repart d'une carte vide.
    return [];
  }
}

/** Écrit la carte (lignes vides ignorées). Renvoie false si le stockage refuse. */
export function saveMenu(dishes: StoredDish[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    const keep = dishes.filter((d) => !isBlank(d));
    if (keep.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keep));
    return true;
  } catch {
    return false;
  }
}

export function clearMenu(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // rien à faire
  }
}

/* -------------------------------------------------------------------------- */
/*  CSV                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Parseur CSV (guillemets doublés façon RFC 4180, CRLF, délimiteur au choix).
 */
function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  rows.push(row);

  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Excel FR exporte en `;`, les outils anglo-saxons en `,`. On tranche sur l'en-tête. */
function detectDelimiter(firstLine: string): string {
  let semis = 0;
  let commas = 0;
  let tabs = 0;
  let inQuotes = false;
  for (const char of firstLine) {
    if (char === '"') inQuotes = !inQuotes;
    else if (inQuotes) continue;
    else if (char === ";") semis++;
    else if (char === ",") commas++;
    else if (char === "\t") tabs++;
  }
  if (tabs > semis && tabs > commas) return "\t";
  return semis >= commas ? ";" : ",";
}

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

const HEADER_ALIASES: Record<keyof StoredDish, string[]> = {
  name: ["nom", "plat", "name", "dish", "libelle", "designation", "produit", "article"],
  price: ["prix", "prixvente", "prixdevente", "price", "sellprice", "pv", "ttc", "prixttc"],
  costPrice: ["cout", "coutmatiere", "coutdachat", "prixdachat", "cost", "costprice", "pa", "achat"],
  popularity: ["popularite", "popularity", "ventes", "sales", "note", "etoiles"],
  category: ["categorie", "category", "famille", "rubrique", "type", "section"],
};

/** "12,50 €" -> "12.5" ; "" si illisible. */
function parseNumeric(raw: string): string {
  const cleaned = raw
    .replace(/[€$£\s ]/g, "")
    .replace(",", ".")
    .trim();
  if (!cleaned) return "";
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n) || n < 0) return "";
  return String(n);
}

function parsePopularity(raw: string): number {
  const n = Number.parseInt(raw.replace(/[^\d]/g, ""), 10);
  if (!Number.isFinite(n)) return 3;
  return Math.min(5, Math.max(1, n));
}

export interface CsvImportResult {
  dishes: StoredDish[];
  /** Lignes lues mais écartées (pas de nom, ou prix/coût illisibles). */
  skipped: number;
}

/**
 * Lit un CSV de carte. En-tête reconnu par alias (nom/prix/coût/catégorie/
 * popularité, FR ou EN, ordre libre). Sans en-tête reconnaissable, on retombe
 * sur l'ordre nom, prix, coût, catégorie, popularité.
 */
export function parseMenuCsv(text: string): CsvImportResult {
  const clean = text.replace(/^\ufeff/, "");
  if (!clean.trim()) return { dishes: [], skipped: 0 };

  const firstLine = clean.split(/\r?\n/, 1)[0] ?? "";
  const rows = parseCsv(clean, detectDelimiter(firstLine));
  if (rows.length === 0) return { dishes: [], skipped: 0 };

  const header = rows[0].map(normalizeHeader);
  const index: Partial<Record<keyof StoredDish, number>> = {};
  let matched = 0;
  for (const [field, aliases] of Object.entries(HEADER_ALIASES) as [
    keyof StoredDish,
    string[],
  ][]) {
    const at = header.findIndex((h) => aliases.includes(h));
    if (at !== -1) {
      index[field] = at;
      matched++;
    }
  }

  let body: string[][];
  if (matched >= 2) {
    body = rows.slice(1);
  } else {
    // Pas d'en-tête exploitable : ordre par défaut, toutes les lignes comptent.
    index.name = 0;
    index.price = 1;
    index.costPrice = 2;
    index.category = 3;
    index.popularity = 4;
    body = rows;
  }

  const dishes: StoredDish[] = [];
  let skipped = 0;

  for (const row of body) {
    const at = (field: keyof StoredDish): string => {
      const i = index[field];
      return i === undefined ? "" : (row[i] ?? "").trim();
    };

    const name = at("name");
    const price = parseNumeric(at("price"));
    const costPrice = parseNumeric(at("costPrice"));

    if (!name || !price || !costPrice) {
      skipped++;
      continue;
    }

    const rawCategory = at("category");
    const rawPopularity = at("popularity");

    dishes.push({
      name,
      price,
      costPrice,
      popularity: rawPopularity ? parsePopularity(rawPopularity) : 3,
      category: rawCategory || DEFAULT_CATEGORY,
    });
  }

  return { dishes, skipped };
}

function escapeCsv(value: string): string {
  return /[";\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Export en `;` + BOM : double-clic ouvrable dans Excel FR sans assistant. */
export function toMenuCsv(dishes: StoredDish[]): string {
  const rows = [
    ["Nom", "Prix vente", "Cout matiere", "Categorie", "Popularite"],
    ...dishes
      .filter((d) => !isBlank(d))
      .map((d) => [d.name, d.price, d.costPrice, d.category, String(d.popularity)]),
  ];
  return "\ufeff" + rows.map((r) => r.map(escapeCsv).join(";")).join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
