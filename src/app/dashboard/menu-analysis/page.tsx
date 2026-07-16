"use client";

import { useEffect, useState } from "react";
import { BarChart3, Sparkles, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/kipstats";
import { MenuToolbar } from "@/components/dashboard/menu-toolbar";
import { emptyDish, loadMenu, saveMenu, type StoredDish } from "@/lib/menu-storage";

export default function MenuAnalysisPage() {
  const [dishes, setDishes] = useState<StoredDish[]>([emptyDish()]);
  const [hydrated, setHydrated] = useState(false);
  const [currency, setCurrency] = useState("EUR");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // La carte vit dans le navigateur : on la relit au montage plutôt que de
  // faire retaper 40 lignes à chaque session.
  useEffect(() => {
    const stored = loadMenu();
    if (stored.length > 0) setDishes(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveMenu(dishes);
  }, [dishes, hydrated]);

  function addDish() {
    setDishes([...dishes, emptyDish()]);
  }

  function removeDish(idx: number) {
    setDishes(dishes.filter((_, i) => i !== idx));
  }

  function updateDish(idx: number, field: keyof StoredDish, value: string | number) {
    const updated = [...dishes];
    updated[idx] = { ...updated[idx], [field]: value };
    setDishes(updated);
  }

  async function handleAnalyze() {
    const valid = dishes.filter((d) => d.name.trim() && d.price && d.costPrice);
    if (valid.length < 2) {
      toast.error("Ajoutez au moins 2 plats complets");
      return;
    }
    setLoading(true);
    setResult("");
    track("tool_started", { tool: "menu_analysis" });
    try {
      const res = await fetch("/api/ai/menu-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishes: valid.map((d) => ({
            name: d.name,
            price: parseFloat(d.price),
            costPrice: parseFloat(d.costPrice),
            popularity: d.popularity,
          })),
          currency,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.analysis);
      track("tool_completed", { tool: "menu_analysis" });
      toast.success(`Terminé ! -${data.tokensUsed} jetons`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <BarChart3 className="h-6 w-6 text-neon" />
          <span className="gradient-text">Menu Engineering</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Analysez votre carte avec la matrice BCG — Stars, Puzzles, Plowhorses, Dogs — 30 jetons
        </p>
      </div>

      <div className="space-y-6">
        {/* Input */}
        <div className="card p-6 space-y-4">
          <MenuToolbar
            dishes={dishes}
            onImport={(imported) => setDishes(imported)}
            onClear={() => setDishes([emptyDish()])}
            exportName="ma-carte"
            hydrated={hydrated}
          />

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Vos plats</h3>
            <div className="flex gap-2">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="select-field w-auto text-sm">
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
              <select value={language} onChange={(e) => setLanguage(e.target.value as "fr" | "en")} className="select-field w-auto text-sm">
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_100px_100px_120px_40px] gap-2 text-xs text-text-muted px-1">
            <span>Nom</span>
            <span>Prix vente</span>
            <span>Coût</span>
            <span>Popularité</span>
            <span></span>
          </div>

          {dishes.map((dish, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_100px_100px_120px_40px]">
              <input
                type="text"
                value={dish.name}
                onChange={(e) => updateDish(i, "name", e.target.value)}
                placeholder="Nom du plat"
                className="input-field text-sm"
              />
              <input
                type="number"
                value={dish.price}
                onChange={(e) => updateDish(i, "price", e.target.value)}
                placeholder="Prix"
                className="input-field text-sm"
                step="0.5"
              />
              <input
                type="number"
                value={dish.costPrice}
                onChange={(e) => updateDish(i, "costPrice", e.target.value)}
                placeholder="Coût"
                className="input-field text-sm"
                step="0.5"
              />
              <select
                value={dish.popularity}
                onChange={(e) => updateDish(i, "popularity", parseInt(e.target.value))}
                className="select-field text-sm"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{"★".repeat(n)} ({n}/5)</option>
                ))}
              </select>
              {dishes.length > 1 && (
                <button onClick={() => removeDish(i)} className="text-danger hover:text-danger/80 self-center">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-3">
            <button onClick={addDish} className="btn-ghost flex items-center gap-2 text-sm">
              <Plus className="h-4 w-4" /> Ajouter un plat
            </button>
            <button onClick={handleAnalyze} disabled={loading} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 ml-auto">
              {loading ? (
                <><div className="h-4 w-4 animate-spin rounded-full border-2 border-surface-0 border-t-transparent" /> Analyse...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Analyser le menu</>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">Résultat de l&apos;analyse</h3>
            <div
              className="prose-dark text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: result
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                  .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                  .replace(/^# (.*$)/gm, "<h1>$1</h1>")
                  .replace(/^- (.*$)/gm, "<li>$1</li>")
                  .replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
