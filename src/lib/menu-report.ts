/**
 * Rapport imprimable « Menu Engineering ».
 *
 * Pourquoi ce fichier existe : l'analyse à 30 jetons était affichée à l'écran
 * comme un bloc de texte, impossible à imprimer, à sauvegarder ou à poser sur la
 * table d'une réunion d'équipe. On emballe donc le livrable payant dans un VRAI
 * document : couverture, identité du restaurant, matrice Kasavana & Smith,
 * tableau de classement, recommandations de l'IA, méthode, branding.
 *
 * Le rendu passe par l'impression navigateur (« Enregistrer au format PDF ») :
 * PDF vectoriel, texte sélectionnable, aucune dépendance, coût marginal nul.
 * Thème clair volontaire — le document est fait pour l'encre et le partage, pas
 * pour l'écran sombre de l'app.
 */

import {
  BCG_LABELS,
  classifyMenu,
  type BcgClass,
  type MenuEngineeringReport,
} from "./menu-engineering";
import type { StoredDish } from "./menu-storage";

/** Couleurs d'impression (encre lisible) alignées sur la charte de l'app. */
const CLASS_INK: Record<BcgClass, { bg: string; fg: string; border: string }> = {
  star: { bg: "#e6fcff", fg: "#036672", border: "#8fe3ec" },
  plowhorse: { bg: "#fef3e2", fg: "#8a5200", border: "#f6c877" },
  puzzle: { bg: "#f1eafe", fg: "#5b21b6", border: "#c8b3f2" },
  dog: { bg: "#fdeaea", fg: "#a01d1d", border: "#f2b3b3" },
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

/**
 * Convertit le markdown léger produit par le modèle (**gras**, titres #, listes
 * « - ») en HTML sûr : on échappe d'abord, on formate ensuite. Jamais de HTML
 * brut du modèle injecté tel quel.
 */
function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  const inline = (text: string) =>
    esc(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      closeList();
      const level = Math.min(h[1].length + 2, 5); // # -> h3, ## -> h4...
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(li[1])}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return out.join("\n");
}

export interface MenuReportInput {
  dishes: StoredDish[];
  analysisMarkdown: string;
  currencySymbol: string;
  restaurantName?: string;
}

/** true si l'export a de quoi produire un rapport (au moins 2 plats classables). */
export function canBuildReport(dishes: StoredDish[]): boolean {
  return classifyMenu(dishes) !== null;
}

/** Construit le document HTML complet, autoportant, prêt à imprimer. */
export function buildMenuReportHtml(input: MenuReportInput): string | null {
  const report = classifyMenu(input.dishes);
  if (!report) return null;

  const cur = input.currencySymbol;
  const name = (input.restaurantName || "").trim();
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const kpis = kpiCards(report, cur);
  const quadrants = quadrantGrid(report);
  const table = classificationTable(report, cur);
  const analysis = markdownToHtml(input.analysisMarkdown);

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Rapport Menu Engineering${name ? " — " + esc(name) : ""}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #14141f; line-height: 1.5; font-size: 12px; background: #fff;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .wrap { max-width: 760px; margin: 0 auto; padding: 24px; }
  .brandbar { height: 6px; border-radius: 4px; background: linear-gradient(90deg,#00c4cc,#7c3aed); margin-bottom: 22px; }
  header .kicker { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: #7c3aed; font-weight: 700; }
  header h1 { font-size: 24px; margin: 4px 0 2px; letter-spacing: -.01em; }
  header .sub { color: #55556a; font-size: 12px; }
  header .meta { margin-top: 10px; font-size: 11px; color: #6a6a82; }
  header .meta strong { color: #14141f; }
  section { margin-top: 26px; }
  h2.block { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: #14141f;
    border-bottom: 2px solid #ececf3; padding-bottom: 6px; margin: 0 0 14px; }
  .kpis { display: flex; gap: 10px; }
  .kpi { flex: 1; border: 1px solid #ececf3; border-radius: 10px; padding: 12px 14px; background: #fafafc; }
  .kpi .label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #7a7a90; }
  .kpi .value { font-size: 20px; font-weight: 700; margin-top: 4px; }
  .kpi .hint { font-size: 10px; color: #9a9aab; margin-top: 2px; }
  .quads { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-top: 4px; }
  .quad { border: 1px solid #ececf3; border-radius: 10px; padding: 10px 12px; }
  .quad .q-name { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #55556a; }
  .quad .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
  .quad .q-count { font-size: 22px; font-weight: 700; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  thead th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .04em;
    color: #7a7a90; border-bottom: 2px solid #ececf3; padding: 0 8px 8px; font-weight: 600; }
  tbody td { padding: 8px; border-bottom: 1px solid #f1f1f6; vertical-align: middle; }
  tbody tr:nth-child(even) td { background: #fafafc; }
  td.num { white-space: nowrap; color: #33334a; }
  .badge { display: inline-block; border-radius: 999px; padding: 2px 9px; font-size: 10.5px; font-weight: 600; border: 1px solid; white-space: nowrap; }
  .legend { margin-top: 12px; font-size: 10.5px; color: #55556a; }
  .legend .row { display: flex; gap: 6px; margin-top: 4px; }
  .legend .row b { color: #14141f; white-space: nowrap; }
  .analysis h3 { font-size: 15px; margin: 16px 0 6px; }
  .analysis h4, .analysis h5 { font-size: 12.5px; margin: 12px 0 4px; color: #2a2a40; }
  .analysis p { margin: 6px 0; }
  .analysis ul { margin: 6px 0 6px 18px; padding: 0; }
  .analysis li { margin: 3px 0; }
  .analysis strong { color: #14141f; }
  .note { margin-top: 8px; font-size: 10px; color: #8a8a9c; background: #fafafc; border: 1px solid #ececf3;
    border-radius: 8px; padding: 10px 12px; }
  footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #ececf3; display: flex;
    justify-content: space-between; align-items: center; font-size: 10px; color: #9a9aab; }
  footer .brand { font-weight: 700; color: #14141f; }
  .analysis, section, .kpi, .quad { page-break-inside: avoid; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="brandbar"></div>
    <header>
      <div class="kicker">Rapport Menu Engineering</div>
      <h1>${name ? esc(name) : "Analyse de votre carte"}</h1>
      <div class="sub">Méthode Kasavana &amp; Smith — Étoile / Vache à lait / Énigme / Poids mort</div>
      <div class="meta">Généré le <strong>${date}</strong> · ${report.dishes.length} plats analysés · ia-restaurant.fr</div>
    </header>

    <section>
      <h2 class="block">Indicateurs clés de la carte</h2>
      <div class="kpis">${kpis}</div>
    </section>

    <section>
      <h2 class="block">Répartition de la matrice</h2>
      <div class="quads">${quadrants}</div>
    </section>

    <section>
      <h2 class="block">Classement plat par plat</h2>
      ${table}
      <div class="legend">
        ${quadrantLegend(report)}
      </div>
    </section>

    <section class="analysis">
      <h2 class="block">Recommandations de l'IA</h2>
      ${analysis || "<p>—</p>"}
    </section>

    ${
      report.isProxy
        ? `<div class="note">Réserve de méthode : la matrice d'origine compare les couverts réellement vendus sur une période. Ici la note de popularité (1 à 5) en tient lieu, donc l'axe « ventes » reste une estimation. L'axe « marge » est exact — il ne dépend que de vos prix et de vos coûts matière.</div>`
        : ""
    }

    <footer>
      <span class="brand">ia-restaurant.fr</span>
      <span>Rapport généré automatiquement · ne remplace pas un conseil comptable</span>
    </footer>
  </div>
</body>
</html>`;
}

function kpiCards(report: MenuEngineeringReport, cur: string): string {
  const cards = [
    {
      label: "Marge brute moyenne",
      value: `${fmt(report.avgMargin)} ${cur}`,
      hint: "par couvert, pondérée",
    },
    {
      label: "Coût matière global",
      value: `${report.blendedFoodCostPct} %`,
      hint: "cible usuelle 28-35 %",
    },
    {
      label: "Plats étoiles",
      value: `${report.counts.star} / ${report.dishes.length}`,
      hint: "marge et ventes au top",
    },
    {
      label: "À retravailler",
      value: `${report.counts.plowhorse + report.counts.puzzle + report.counts.dog}`,
      hint: "vaches, énigmes, poids morts",
    },
  ];
  return cards
    .map(
      (c) =>
        `<div class="kpi"><div class="label">${esc(c.label)}</div><div class="value">${esc(
          c.value
        )}</div><div class="hint">${esc(c.hint)}</div></div>`
    )
    .join("");
}

const DOTS: Record<BcgClass, string> = {
  star: "#00c4cc",
  plowhorse: "#f59e0b",
  puzzle: "#7c3aed",
  dog: "#ef4444",
};

function quadrantGrid(report: MenuEngineeringReport): string {
  return (["star", "plowhorse", "puzzle", "dog"] as BcgClass[])
    .map(
      (q) =>
        `<div class="quad"><div class="q-name"><span class="dot" style="background:${
          DOTS[q]
        }"></span>${esc(BCG_LABELS[q].fr)}</div><div class="q-count">${report.counts[q]}</div></div>`
    )
    .join("");
}

function classificationTable(report: MenuEngineeringReport, cur: string): string {
  const rows = report.dishes
    .map((d) => {
      const s = CLASS_INK[d.bcg];
      return `<tr>
        <td>${esc(d.name)}</td>
        <td class="num">${fmt(d.price)} ${cur}</td>
        <td class="num">${fmt(d.margin)} ${cur}</td>
        <td class="num">${d.foodCostPct} %</td>
        <td><span class="badge" style="background:${s.bg};color:${s.fg};border-color:${
        s.border
      }">${esc(BCG_LABELS[d.bcg].fr)}</span></td>
      </tr>`;
    })
    .join("");
  return `<table>
    <thead><tr><th>Plat</th><th>Prix</th><th>Marge</th><th>Coût matière</th><th>Classement</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function quadrantLegend(report: MenuEngineeringReport): string {
  return (["star", "plowhorse", "puzzle", "dog"] as BcgClass[])
    .filter((q) => report.counts[q] > 0)
    .map(
      (q) =>
        `<div class="row"><b>${esc(BCG_LABELS[q].fr)} —</b><span>${esc(
          BCG_LABELS[q].hint
        )}</span></div>`
    )
    .join("");
}

/**
 * Imprime le rapport via un iframe caché (« Enregistrer au format PDF » du
 * navigateur). iframe plutôt que window.open : pas de blocage de pop-up, et on
 * n'écrase pas l'app ouverte. Retourne false si le rapport ne peut être bâti.
 */
export function printMenuReport(input: MenuReportInput): boolean {
  const html = buildMenuReportHtml(input);
  if (!html || typeof window === "undefined") return false;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.srcdoc = html;

  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) return;
    // Laisse le layout se poser avant l'appel d'impression.
    setTimeout(() => {
      try {
        win.focus();
        win.print();
      } finally {
        // Retire l'iframe une fois la boîte d'impression fermée.
        setTimeout(() => iframe.remove(), 1000);
      }
    }, 150);
  };

  document.body.appendChild(iframe);
  return true;
}
