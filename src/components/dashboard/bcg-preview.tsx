"use client";

import { useMemo } from "react";
import { Info } from "lucide-react";
import {
  BCG_LABELS,
  classifyMenu,
  type BcgClass,
  type ClassifiedDish,
} from "@/lib/menu-engineering";
import type { StoredDish } from "@/lib/menu-storage";

interface BcgPreviewProps {
  dishes: StoredDish[];
  /** Symbole affiché à côté des montants (€, $, £). */
  currencySymbol: string;
}

const CLASS_STYLE: Record<BcgClass, { chip: string; dot: string }> = {
  star: { chip: "bg-neon/10 text-neon border-neon/30", dot: "bg-neon" },
  plowhorse: {
    chip: "bg-warning/10 text-warning border-warning/30",
    dot: "bg-warning",
  },
  puzzle: { chip: "bg-purple/10 text-purple border-purple/30", dot: "bg-purple" },
  dog: { chip: "bg-danger/10 text-danger border-danger/30", dot: "bg-danger" },
};

const QUADRANTS: BcgClass[] = ["star", "plowhorse", "puzzle", "dog"];

function fmt(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

/**
 * Le classement Kasavana & Smith, calculé pendant la saisie et gratuit.
 * Le bouton « Analyser » (30 jetons) reste au-dessus : il sert à commenter et
 * arbitrer, pas à faire des soustractions.
 */
export function BcgPreview({ dishes, currencySymbol }: BcgPreviewProps) {
  const report = useMemo(() => classifyMenu(dishes), [dishes]);

  if (!report) return null;

  return (
    <div className="card p-6 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-text-primary">
          Votre matrice, calculée en direct
        </h3>
        <span className="rounded-full border border-neon/30 bg-neon/10 px-2 py-0.5 text-xs text-neon">
          0 jeton
        </span>
      </div>

      <p className="text-sm text-text-secondary">
        {report.dishes.length} plats classés. Marge brute moyenne de la carte :{" "}
        <strong className="text-text-primary">
          {fmt(report.avgMargin)} {currencySymbol}
        </strong>{" "}
        par couvert, coût matière global{" "}
        <strong className="text-text-primary">{report.blendedFoodCostPct} %</strong>. Un plat
        passe « populaire » au-dessus de {(report.mixThreshold * 100).toFixed(1)} % du mix —
        c&apos;est le seuil (1 / {report.dishes.length}) × 70 % de la méthode.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUADRANTS.map((q) => (
          <div key={q} className="rounded-lg border border-border-dim bg-surface-2 p-3">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${CLASS_STYLE[q].dot}`} />
              <span className="text-xs text-text-muted">{BCG_LABELS[q].fr}</span>
            </div>
            <p className="mt-1 text-xl font-bold text-text-primary">{report.counts[q]}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Classement des plats de la carte selon la matrice de menu engineering
          </caption>
          <thead>
            <tr className="text-xs text-text-muted">
              <th scope="col" className="pb-2 pr-3 font-normal">
                Plat
              </th>
              <th scope="col" className="pb-2 pr-3 font-normal">
                Marge
              </th>
              <th scope="col" className="pb-2 pr-3 font-normal">
                Coût matière
              </th>
              <th scope="col" className="pb-2 font-normal">
                Classement
              </th>
            </tr>
          </thead>
          <tbody>
            {report.dishes.map((d: ClassifiedDish, i: number) => (
              <tr key={`${d.name}-${i}`} className="border-t border-border-dim">
                <td className="py-2 pr-3 text-text-primary">{d.name}</td>
                <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">
                  {fmt(d.margin)} {currencySymbol}
                </td>
                <td className="py-2 pr-3 whitespace-nowrap text-text-secondary">
                  {d.foodCostPct} %
                </td>
                <td className="py-2">
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-xs whitespace-nowrap ${CLASS_STYLE[d.bcg].chip}`}
                  >
                    {BCG_LABELS[d.bcg].fr}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="space-y-1.5 border-t border-border-dim pt-4 text-xs text-text-secondary">
        {QUADRANTS.filter((q) => report.counts[q] > 0).map((q) => (
          <div key={q} className="flex gap-2">
            <dt className="shrink-0 font-semibold text-text-primary">{BCG_LABELS[q].fr} —</dt>
            <dd>{BCG_LABELS[q].hint}</dd>
          </div>
        ))}
      </dl>

      {report.isProxy && (
        <p className="flex gap-2 rounded-lg border border-border-dim bg-surface-2 p-3 text-xs text-text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            À lire avec une réserve : la méthode d&apos;origine compare les couverts réellement
            vendus sur une période. Ici votre note de 1 à 5 en tient lieu, donc l&apos;axe
            popularité reste une estimation. L&apos;axe marge, lui, est exact — il ne dépend que
            de vos prix et de vos coûts.
          </span>
        </p>
      )}
    </div>
  );
}
