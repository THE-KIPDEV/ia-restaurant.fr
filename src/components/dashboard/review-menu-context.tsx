"use client";

import { UtensilsCrossed } from "lucide-react";
import { CLASS_STYLE } from "@/components/dashboard/bcg-preview";
import { BCG_LABELS } from "@/lib/menu-engineering";
import {
  anchorSentence,
  mentionInsight,
  type DishMention,
  type DishSuggestion,
} from "@/lib/review-dish-match";

interface ReviewMenuContextProps {
  mentions: DishMention[];
  suggestion: DishSuggestion | null;
  rating: number;
  /** Nombre de plats exploitables dans la carte enregistrée. */
  menuSize: number;
  /** Colle la phrase d'ancrage dans la réponse en cours. */
  onInsert: (sentence: string) => void;
  /** false tant qu'aucune réponse n'a été générée. */
  canInsert: boolean;
}

function fmt(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

/**
 * Ce que la carte enregistrée dit de l'avis collé, calculé pendant la saisie.
 * Aucun jeton : c'est de la lecture de données, pas de la rédaction.
 *
 * L'intérêt n'est pas cosmétique. Toutes les recommandations sur la réponse aux
 * avis demandent « un détail qui prouve que l'avis a été lu ». Un modèle ne peut
 * que le paraphraser ; ici on le SAIT — nom exact du plat, sa marge, son
 * quadrant. C'est la seule chose qu'un générateur d'avis sans données de carte
 * ne pourra jamais faire.
 */
export function ReviewMenuContext({
  mentions,
  suggestion,
  rating,
  menuSize,
  onInsert,
  canInsert,
}: ReviewMenuContextProps) {
  if (menuSize === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border-default p-4">
        <p className="text-xs text-text-muted">
          Votre carte n&apos;est pas encore enregistrée. Saisissez-la une fois dans{" "}
          <a href="/dashboard/menu-analysis" className="text-neon hover:underline">
            Menu Engineering
          </a>{" "}
          et cet outil reconnaîtra les plats cités dans vos avis.
        </p>
      </div>
    );
  }

  if (mentions.length === 0) return null;

  const first = mentions[0];
  const sentence = anchorSentence(first, suggestion, rating);

  return (
    <div className="space-y-3 rounded-lg border border-neon/30 bg-neon/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
          <UtensilsCrossed className="h-4 w-4 text-neon" />
          Cet avis parle de votre carte
        </h3>
        <span className="rounded-full border border-neon/30 bg-neon/10 px-2 py-0.5 text-xs text-neon">
          0 jeton
        </span>
      </div>

      <ul className="space-y-2.5">
        {mentions.map((m) => {
          const insight = mentionInsight(m, rating);
          return (
            <li key={m.name} className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-text-primary">{m.name}</span>
                {m.bcg && (
                  <span
                    className={`inline-block rounded-full border px-2 py-0.5 text-xs whitespace-nowrap ${CLASS_STYLE[m.bcg].chip}`}
                  >
                    {BCG_LABELS[m.bcg].fr}
                  </span>
                )}
                {m.margin !== null && m.foodCostPct !== null && (
                  <span className="text-xs whitespace-nowrap text-text-muted">
                    marge {fmt(m.margin)} € · coût matière {m.foodCostPct} %
                  </span>
                )}
                {m.how === "probable" && (
                  <span className="text-xs text-text-muted">
                    (reconnu sur « {m.trigger} »)
                  </span>
                )}
              </div>
              {insight && <p className="text-xs text-text-secondary">{insight}</p>}
            </li>
          );
        })}
      </ul>

      <div className="space-y-2 border-t border-neon/20 pt-3">
        <p className="text-xs text-text-muted">
          Le détail qui prouve que vous avez lu l&apos;avis :
        </p>
        <p className="rounded bg-surface-3 p-2.5 text-sm text-text-secondary">{sentence}</p>
        <button
          type="button"
          onClick={() => onInsert(sentence)}
          disabled={!canInsert}
          className="btn-ghost px-3 py-1.5 text-xs disabled:opacity-40"
        >
          {canInsert ? "Insérer dans la réponse" : "Générez d'abord une réponse"}
        </button>
      </div>
    </div>
  );
}
