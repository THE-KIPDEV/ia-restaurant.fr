"use client";

import { useState } from "react";
import { Settings, Save, Globe } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [locale, setLocale] = useState("fr");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      document.cookie = `locale=${locale}; path=/; max-age=31536000`;
      toast.success(locale === "fr" ? "Paramètres sauvegardés" : "Settings saved");
      window.location.reload();
    } catch {
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Settings className="h-6 w-6 text-neon" />
          <span className="gradient-text">Paramètres</span>
        </h1>
      </div>

      <div className="card max-w-lg p-6 space-y-4">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-text-primary">
            <Globe className="h-4 w-4 text-neon" />
            Langue / Language
          </label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="select-field"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {locale === "fr" ? "Enregistrer" : "Save"}
        </button>
      </div>
    </div>
  );
}
