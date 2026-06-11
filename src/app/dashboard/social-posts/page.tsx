"use client";

import { useState } from "react";
import { Share2, Sparkles, Copy, Check, Instagram } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/kipstats";

export default function SocialPostsPage() {
  const [platform, setPlatform] = useState<"instagram" | "facebook" | "tiktok">("instagram");
  const [topic, setTopic] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) {
      toast.error("Veuillez décrire le sujet du post");
      return;
    }
    setLoading(true);
    setResult("");
    track("tool_started", { tool: "social_post" });
    try {
      const res = await fetch("/api/ai/social-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, topic, restaurantName, cuisine, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.post);
      track("tool_completed", { tool: "social_post" });
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
          <Share2 className="h-6 w-6 text-purple" />
          <span className="gradient-text">Posts réseaux sociaux</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Créez des posts engageants pour vos réseaux — 5 jetons par post
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Plateforme
            </label>
            <div className="flex gap-2">
              {(["instagram", "facebook", "tiktok"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-all ${
                    platform === p
                      ? "bg-neon text-surface-0"
                      : "bg-surface-3 text-text-secondary border border-border-default hover:border-border-bright"
                  }`}
                >
                  {p === "instagram" ? "Instagram" : p === "facebook" ? "Facebook" : "TikTok"}
                </button>
              ))}
            </div>
          </div>

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
              Type de cuisine
            </label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="Ex: Française, Italienne..."
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Sujet / Occasion *
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Nouveau plat du jour, Saint-Valentin, brunch du dimanche..."
              className="input-field min-h-[80px] resize-y"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Langue</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value as "fr" | "en")} className="select-field">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <button onClick={handleGenerate} disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-50">
            {loading ? (
              <><div className="h-4 w-4 animate-spin rounded-full border-2 border-surface-0 border-t-transparent" /> Génération...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Générer le post</>
            )}
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Aperçu du post
            </h3>
            {result && (
              <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
                {copied ? <><Check className="h-3.5 w-3.5 text-success" /> Copié !</> : <><Copy className="h-3.5 w-3.5" /> Copier</>}
              </button>
            )}
          </div>
          {result ? (
            <div className="rounded-lg bg-surface-3 p-4">
              <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">{result}</p>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border-default">
              <p className="text-sm text-text-muted">Le post apparaîtra ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
