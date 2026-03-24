"use client";

import { useState, useEffect } from "react";
import { UtensilsCrossed, Plus, Trash2, Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  currency: string;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", cuisine: "", description: "", address: "", city: "", currency: "EUR" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    try {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      setRestaurants(data.restaurants || []);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Nom requis"); return; }
    try {
      const url = editingId ? `/api/restaurants/${editingId}` : "/api/restaurants";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success(editingId ? "Restaurant mis à jour" : "Restaurant ajouté");
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", cuisine: "", description: "", address: "", city: "", currency: "EUR" });
      fetchRestaurants();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce restaurant ?")) return;
    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Restaurant supprimé");
      fetchRestaurants();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  function startEdit(r: Restaurant) {
    setForm({ name: r.name, cuisine: r.cuisine || "", description: r.description || "", address: r.address || "", city: r.city || "", currency: r.currency });
    setEditingId(r.id);
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <UtensilsCrossed className="h-6 w-6 text-purple" />
            <span className="gradient-text">Restaurants</span>
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Gérez vos établissements</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", cuisine: "", description: "", address: "", city: "", currency: "EUR" }); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="card neon-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">{editingId ? "Modifier" : "Nouveau restaurant"}</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-text-muted hover:text-text-primary"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-xs text-text-muted">Nom *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" placeholder="Le Petit Bistrot" /></div>
            <div><label className="mb-1 block text-xs text-text-muted">Cuisine</label><input type="text" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className="input-field text-sm" placeholder="Française" /></div>
            <div><label className="mb-1 block text-xs text-text-muted">Adresse</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field text-sm" /></div>
            <div><label className="mb-1 block text-xs text-text-muted">Ville</label><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field text-sm" /></div>
            <div className="sm:col-span-2"><label className="mb-1 block text-xs text-text-muted">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm min-h-[60px] resize-y" /></div>
          </div>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm"><Save className="h-4 w-4" /> Enregistrer</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-neon border-t-transparent" /></div>
      ) : restaurants.length === 0 ? (
        <div className="card p-8 text-center"><UtensilsCrossed className="mx-auto h-12 w-12 text-text-muted opacity-50" /><p className="mt-4 text-text-secondary">Aucun restaurant</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((r) => (
            <div key={r.id} className="card card-glow p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{r.name}</h3>
                  {r.cuisine && <span className="badge-neon mt-1">{r.cuisine}</span>}
                  {r.city && <p className="mt-2 text-xs text-text-muted">{r.address ? `${r.address}, ` : ""}{r.city}</p>}
                  {r.description && <p className="mt-2 text-xs text-text-secondary">{r.description}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(r)} className="p-1.5 text-text-muted hover:text-neon"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 text-text-muted hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
