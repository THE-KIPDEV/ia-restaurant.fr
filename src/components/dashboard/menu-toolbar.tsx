"use client";

import { useMemo, useRef, useState } from "react";
import { Download, Upload, Save, RotateCcw, ClipboardPaste, X } from "lucide-react";
import { toast } from "sonner";
import {
  clearMenu,
  downloadCsv,
  isBlank,
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

/** Combien de lignes on affiche dans l'aperçu avant de tronquer. */
const PREVIEW_ROWS = 8;

export function MenuToolbar({
  dishes,
  onImport,
  onClear,
  exportName,
  hydrated,
}: MenuToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const saved = dishes.filter((d) => !isBlank(d));

  // Coller-depuis-Excel : panneau replié par défaut.
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  // Aperçu recalculé à chaque frappe : le restaurateur voit CE QUI sera importé
  // avant de toucher à sa carte. Excel copie en colonnes séparées par des
  // tabulations, que parseMenuCsv détecte déjà comme délimiteur.
  const preview = useMemo(
    () => (pasteText.trim() ? parseMenuCsv(pasteText) : null),
    [pasteText]
  );

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

  function closePaste() {
    setPasteOpen(false);
    setPasteText("");
  }

  /** Remplace toute la carte par le collage. */
  function applyReplace() {
    if (!preview || preview.dishes.length === 0) return;
    onImport(preview.dishes);
    toast.success(`Carte remplacée par ${preview.dishes.length} plats`);
    closePaste();
  }

  /** Ajoute le collage à la fin de la carte existante. */
  function applyAppend() {
    if (!preview || preview.dishes.length === 0) return;
    onImport([...saved, ...preview.dishes]);
    toast.success(`${preview.dishes.length} plats ajoutés à votre carte`);
    closePaste();
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
    <div className="space-y-3 border-b border-white/5 pb-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          onChange={handleFile}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => setPasteOpen((v) => !v)}
          className="btn-ghost flex items-center gap-2 text-sm"
          aria-expanded={pasteOpen}
        >
          <ClipboardPaste className="h-4 w-4" /> Coller ma carte
        </button>

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

      {pasteOpen && (
        <div className="rounded-lg border border-white/10 bg-white/2 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">
                Collez votre carte depuis Excel, Google Sheets ou un CSV
              </h4>
              <p className="mt-0.5 text-xs text-text-muted">
                Sélectionnez vos cellules (nom, prix, coût matière, catégorie), copiez, puis
                collez ici. L&apos;aperçu se met à jour tout seul — rien n&apos;est enregistré
                tant que vous ne validez pas.
              </p>
            </div>
            <button
              type="button"
              onClick={closePaste}
              className="btn-ghost -mr-1 -mt-1 flex h-7 w-7 items-center justify-center p-0"
              aria-label="Fermer le panneau de collage"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={5}
            spellCheck={false}
            placeholder={
              "Burger maison\t14,50\t4,20\tPlats\nTiramisu\t6,50\t1,80\tDesserts\nSpritz\t8\t2,10\tBoissons"
            }
            className="input-field w-full resize-y font-mono text-xs leading-relaxed"
          />

          {preview && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="text-text-secondary">
                  <span className="font-semibold text-neon">{preview.dishes.length}</span> plat
                  {preview.dishes.length > 1 ? "s" : ""} détecté
                  {preview.dishes.length > 1 ? "s" : ""}
                </span>
                {preview.skipped > 0 && (
                  <span className="text-text-muted">
                    {preview.skipped} ligne{preview.skipped > 1 ? "s" : ""} ignorée
                    {preview.skipped > 1 ? "s" : ""} (nom, prix ou coût manquant)
                  </span>
                )}
              </div>

              {preview.dishes.length > 0 && (
                <div className="overflow-x-auto rounded-md border border-white/5">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/3 text-text-muted">
                      <tr>
                        <th className="px-3 py-1.5 font-medium">Plat</th>
                        <th className="px-3 py-1.5 font-medium">Prix</th>
                        <th className="px-3 py-1.5 font-medium">Coût</th>
                        <th className="px-3 py-1.5 font-medium">Catégorie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.dishes.slice(0, PREVIEW_ROWS).map((d, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="px-3 py-1.5 text-text-primary">{d.name}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{d.price}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{d.costPrice}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{d.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {preview.dishes.length > PREVIEW_ROWS && (
                    <p className="border-t border-white/5 px-3 py-1.5 text-xs text-text-muted">
                      … et {preview.dishes.length - PREVIEW_ROWS} autre
                      {preview.dishes.length - PREVIEW_ROWS > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}

              {preview.dishes.length === 0 && pasteText.trim() && (
                <p className="text-xs text-amber-400/90">
                  Rien de lisible pour l&apos;instant. Il faut au moins trois colonnes : le nom,
                  le prix de vente et le coût matière.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={applyReplace}
              disabled={!preview || preview.dishes.length === 0}
              className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remplacer ma carte
            </button>
            {saved.length > 0 && (
              <button
                type="button"
                onClick={applyAppend}
                disabled={!preview || preview.dishes.length === 0}
                className="btn-ghost text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Ajouter à ma carte ({saved.length} déjà)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
