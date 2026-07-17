"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Sparkles, Copy, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/kipstats";
import { ReviewMenuContext } from "@/components/dashboard/review-menu-context";
import { loadMenu, type StoredDish } from "@/lib/menu-storage";
import {
  countWords,
  findMentionedDishes,
  suggestNextDish,
  RESPONSE_WORD_RANGE,
} from "@/lib/review-dish-match";

export default function ReviewResponderPage() {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(3);
  const [restaurantName, setRestaurantName] = useState("");
  const [tone, setTone] = useState<"professional" | "warm" | "apologetic">("professional");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState<StoredDish[]>([]);

  // La carte saisie dans Menu Engineering / Marges vit dans le navigateur.
  // On la relit pour reconnaître les plats cités dans l'avis — lecture seule,
  // cet outil ne la modifie jamais.
  useEffect(() => {
    setMenu(loadMenu());
  }, []);

  const mentions = useMemo(() => findMentionedDishes(review, menu), [review, menu]);
  const suggestion = useMemo(
    () => suggestNextDish(menu, mentions, rating),
    [menu, mentions, rating]
  );
  const wordCount = countWords(result);
  const inBand =
    wordCount >= RESPONSE_WORD_RANGE.min && wordCount <= RESPONSE_WORD_RANGE.max;

  async function handleGenerate() {
    if (!review.trim()) {
      toast.error("Veuillez coller l'avis client");
      return;
    }
    setLoading(true);
    setResult("");
    track("tool_started", { tool: "review_response" });
    try {
      const res = await fetch("/api/ai/review-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, rating, restaurantName, tone, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.response);
      track("tool_completed", { tool: "review_response" });
      toast.success(`Terminé ! -${data.tokensUsed} jetons`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // La phrase est ajoutée en fin de réponse, jamais à la place de ce qui est
  // écrit : le restaurateur garde la main sur son texte.
  function handleInsert(sentence: string) {
    setResult((current) => (current.trim() ? `${current.trimEnd()} ${sentence}` : sentence));
    toast.success("Phrase ajoutée — relisez avant de publier");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <MessageSquare className="h-6 w-6 text-neon" />
          <span className="gradient-text">Réponses aux avis</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Répondez à chaque avis Google ou TripAdvisor — 5 jetons par réponse. Les plats de
          votre carte cités dans l&apos;avis sont reconnus gratuitement, pendant la saisie.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Nom du restaurant
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Ex: Le Petit Bistrot"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Note du client
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      n <= rating
                        ? "fill-warning text-warning"
                        : "text-surface-5"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-text-muted">{rating}/5</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Avis du client *
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Collez l'avis du client ici..."
              className="input-field min-h-[120px] resize-y"
            />
          </div>

          <ReviewMenuContext
            mentions={mentions}
            suggestion={suggestion}
            rating={rating}
            menuSize={menu.length}
            onInsert={handleInsert}
            canInsert={result.trim().length > 0}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Ton
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as typeof tone)}
                className="select-field"
              >
                <option value="professional">Professionnel</option>
                <option value="warm">Chaleureux</option>
                <option value="apologetic">Apologétique</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Langue
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "fr" | "en")}
                className="select-field"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-surface-0 border-t-transparent" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer la réponse
              </>
            )}
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Réponse générée</h3>
            {result && (
              <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
                {copied ? <><Check className="h-3.5 w-3.5 text-success" /> Copié !</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
              </button>
            )}
          </div>
          {result ? (
            <div className="space-y-2">
              {/* Éditable : une réponse publiée telle quelle se repère, et Google
                  valorise les réponses uniques. Le modèle fait le brouillon. */}
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                aria-label="Réponse générée, modifiable avant publication"
                className="input-field min-h-[200px] resize-y leading-relaxed"
              />
              <div className="flex items-center justify-between text-xs">
                <span className={inBand ? "text-success" : "text-warning"}>
                  {wordCount} mot{wordCount > 1 ? "s" : ""}
                  {inBand
                    ? " — dans la cible"
                    : wordCount < RESPONSE_WORD_RANGE.min
                      ? " — court, ça se lit comme un copier-coller"
                      : " — long, on entend la justification"}
                </span>
                <span className="text-text-muted">
                  cible {RESPONSE_WORD_RANGE.min}-{RESPONSE_WORD_RANGE.max} mots
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border-default">
              <p className="text-sm text-text-muted">La réponse apparaîtra ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
