"use client";

import { useState } from "react";
import { Languages, Sparkles, Plus, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/kipstats";

interface MenuItem {
  name: string;
  description: string;
}

export default function TranslatorPage() {
  const [items, setItems] = useState<MenuItem[]>([{ name: "", description: "" }]);
  const [fromLang, setFromLang] = useState("Français");
  const [toLang, setToLang] = useState("English");
  const [results, setResults] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function addItem() {
    setItems([...items, { name: "", description: "" }]);
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof MenuItem, value: string) {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  }

  async function handleTranslate() {
    const validItems = items.filter((i) => i.name.trim());
    if (validItems.length === 0) {
      toast.error("Ajoutez au moins un plat");
      return;
    }
    setLoading(true);
    setResults([]);
    track("tool_started", { tool: "translate" });
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: validItems,
          fromLanguage: fromLang,
          toLanguage: toLang,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.translations);
      track("tool_completed", { tool: "translate" });
      toast.success(`Terminé ! -${data.tokensUsed} jetons`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyAll() {
    const text = results.map((r) => `${r.name}\n${r.description}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const languages = ["Français", "English", "Español", "Deutsch", "Italiano", "Português", "中文", "日本語", "العربية"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Languages className="h-6 w-6 text-neon" />
          <span className="gradient-text">Traduction de carte</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Traduisez votre carte dans n&apos;importe quelle langue — 10 jetons par traduction
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">De</label>
              <select value={fromLang} onChange={(e) => setFromLang(e.target.value)} className="select-field">
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Vers</label>
              <select value={toLang} onChange={(e) => setToLang(e.target.value)} className="select-field">
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-lg bg-surface-3 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Plat {i + 1}</span>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-danger hover:text-danger/80">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(i, "name", e.target.value)}
                  placeholder="Nom du plat"
                  className="input-field text-sm"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="Description (optionnel)"
                  className="input-field text-sm"
                />
              </div>
            ))}
          </div>

          <button onClick={addItem} className="btn-ghost flex w-full items-center justify-center gap-2 text-sm">
            <Plus className="h-4 w-4" /> Ajouter un plat
          </button>

          <button onClick={handleTranslate} disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-50">
            {loading ? (
              <><div className="h-4 w-4 animate-spin rounded-full border-2 border-surface-0 border-t-transparent" /> Traduction...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Traduire</>
            )}
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Traduction</h3>
            {results.length > 0 && (
              <button onClick={handleCopyAll} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
                {copied ? <><Check className="h-3.5 w-3.5 text-success" /> Copié !</> : <><Copy className="h-3.5 w-3.5" /> Tout copier</>}
              </button>
            )}
          </div>
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((item, i) => (
                <div key={i} className="rounded-lg bg-surface-3 p-3">
                  <p className="font-medium text-text-primary text-sm">{item.name}</p>
                  {item.description && (
                    <p className="mt-1 text-xs text-text-secondary">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border-default">
              <p className="text-sm text-text-muted">Les traductions apparaîtront ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
