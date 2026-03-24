"use client";

import { useState } from "react";
import { TrendingUp, Sparkles, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DishMargin {
  name: string;
  price: string;
  costPrice: string;
  category: string;
}

export default function MarginAnalysisPage() {
  const [dishes, setDishes] = useState<DishMargin[]>([
    { name: "", price: "", costPrice: "", category: "Entrées" },
  ]);
  const [currency, setCurrency] = useState("EUR");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function addDish() {
    setDishes([...dishes, { name: "", price: "", costPrice: "", category: "Plats" }]);
  }

  function removeDish(idx: number) {
    setDishes(dishes.filter((_, i) => i !== idx));
  }

  function updateDish(idx: number, field: keyof DishMargin, value: string) {
    const updated = [...dishes];
    updated[idx] = { ...updated[idx], [field]: value };
    setDishes(updated);
  }

  async function handleAnalyze() {
    const valid = dishes.filter((d) => d.name.trim() && d.price && d.costPrice);
    if (valid.length < 2) {
      toast.error("Ajoutez au moins 2 plats");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai/margin-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dishes: valid.map((d) => ({
            name: d.name,
            price: parseFloat(d.price),
            costPrice: parseFloat(d.costPrice),
            category: d.category,
          })),
          currency,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.analysis);
      toast.success(`Terminé ! -${data.tokensUsed} jetons`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  const categories = ["Entrées", "Plats", "Desserts", "Boissons", "Apéritifs", "Fromages"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <TrendingUp className="h-6 w-6 text-purple" />
          <span className="gradient-text">Analyse des marges</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Optimisez la rentabilité de chaque plat — 20 jetons par analyse
        </p>
      </div>

      <div className="card p-6 space-y-4">
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

        <div className="hidden sm:grid sm:grid-cols-[1fr_100px_100px_140px_40px] gap-2 text-xs text-text-muted px-1">
          <span>Nom</span>
          <span>Prix vente</span>
          <span>Coût matière</span>
          <span>Catégorie</span>
          <span></span>
        </div>

        {dishes.map((dish, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_100px_100px_140px_40px]">
            <input type="text" value={dish.name} onChange={(e) => updateDish(i, "name", e.target.value)} placeholder="Nom du plat" className="input-field text-sm" />
            <input type="number" value={dish.price} onChange={(e) => updateDish(i, "price", e.target.value)} placeholder="Prix" className="input-field text-sm" step="0.5" />
            <input type="number" value={dish.costPrice} onChange={(e) => updateDish(i, "costPrice", e.target.value)} placeholder="Coût" className="input-field text-sm" step="0.5" />
            <select value={dish.category} onChange={(e) => updateDish(i, "category", e.target.value)} className="select-field text-sm">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
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
              <><Sparkles className="h-4 w-4" /> Analyser les marges</>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-semibold text-text-primary">Résultat</h3>
          <div
            className="prose-dark text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: result
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                .replace(/^- (.*$)/gm, "<li>$1</li>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      )}
    </div>
  );
}
