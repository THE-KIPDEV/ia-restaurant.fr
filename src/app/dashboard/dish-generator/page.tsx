"use client";

import { useState } from "react";
import { ChefHat, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function DishGeneratorPage() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [tone, setTone] = useState<"elegant" | "casual" | "playful">("elegant");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!name.trim()) {
      toast.error("Veuillez entrer le nom du plat");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai/dish-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ingredients, cuisine, tone, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.description);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ChefHat className="h-6 w-6 text-purple" />
          <span className="gradient-text">Descriptions IA</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Générez des descriptions de plats irrésistibles — 5 jetons par génération
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="card p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Nom du plat *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tartare de saumon aux agrumes"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Ingrédients principaux
            </label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Ex: Saumon frais, citron vert, avocat, sésame..."
              className="input-field min-h-[80px] resize-y"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Type de cuisine
            </label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="Ex: Française, Japonaise, Fusion..."
              className="input-field"
            />
          </div>

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
                <option value="elegant">Élégant</option>
                <option value="casual">Décontracté</option>
                <option value="playful">Ludique</option>
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
                Générer la description
              </>
            )}
          </button>
        </div>

        {/* Result */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Résultat</h3>
            {result && (
              <button
                onClick={handleCopy}
                className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" /> Copié !
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copier
                  </>
                )}
              </button>
            )}
          </div>

          {result ? (
            <div className="rounded-lg bg-surface-3 p-4">
              <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">
                {result}
              </p>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border-default">
              <p className="text-sm text-text-muted">
                Le résultat apparaîtra ici
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
