"use client";

import { useRef } from "react";
import { Download, Upload, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  clearMenu,
  downloadCsv,
  parseMenuCsv,
  toMenuCsv,
  type StoredDish,
} from "@/lib/menu-storage";

interface MenuToolbarProps {
  dishes: StoredDish[];
  /** Remplace la carte courante par celle importée. */
  onImport: (dishes: StoredDish[]) => void;
  /** Remet la carte à zéro (une ligne vide). */
  onClear: () => void;
  /** Nom du fichier exporté, sans extension. */
  exportName: string;
  /** false tant que la carte n'a pas été relue depuis le navigateur. */
  hydrated: boolean;
}

export function MenuToolbar({
  dishes,
  onImport,
  onClear,
  exportName,
  hydrated,
}: MenuToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const saved = dishes.filter((d) => d.name.trim() || d.price.trim() || d.costPrice.trim());

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Permet de ré-importer deux fois le même fichier d'affilée.
    e.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const { dishes: imported, skipped } = parseMenuCsv(text);

      if (imported.length === 0) {
        toast.error(
          "Aucun plat lisible. Attendu : une colonne nom, une prix, une coût."
        );
        return;
      }

      onImport(imported);
      toast.success(
        skipped > 0
          ? `${imported.length} plats importés — ${skipped} ligne(s) ignorée(s) (nom, prix ou coût manquant)`
          : `${imported.length} plats importés`
      );
    } catch {
      toast.error("Fichier illisible. Exportez-le en CSV depuis votre tableur.");
    }
  }

  function handleExport() {
    if (saved.length === 0) {
      toast.error("Votre carte est vide.");
      return;
    }
    downloadCsv(`${exportName}.csv`, toMenuCsv(saved));
  }

  function handleClear() {
    if (saved.length === 0) return;
    if (!window.confirm(`Effacer les ${saved.length} plats de votre carte ?`)) return;
    clearMenu();
    onClear();
    toast.success("Carte effacée");
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv,text/plain"
        onChange={handleFile}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <Upload className="h-4 w-4" /> Importer un CSV
      </button>

      <button
        type="button"
        onClick={handleExport}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <Download className="h-4 w-4" /> Exporter
      </button>

      {saved.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="btn-ghost flex items-center gap-2 text-sm text-text-muted"
        >
          <RotateCcw className="h-4 w-4" /> Vider
        </button>
      )}

      <p className="ml-auto flex items-center gap-1.5 text-xs text-text-muted">
        {hydrated && saved.length > 0 ? (
          <>
            <Save className="h-3.5 w-3.5 text-neon" />
            {saved.length} plat{saved.length > 1 ? "s" : ""} gardé
            {saved.length > 1 ? "s" : ""} dans ce navigateur
          </>
        ) : (
          "Votre carte est gardée dans ce navigateur, jamais sur nos serveurs."
        )}
      </p>
    </div>
  );
}
