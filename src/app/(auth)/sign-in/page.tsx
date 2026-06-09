"use client";

import Link from "next/link";
import { useState } from "react";
import { ChefHat } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      window.location.href = "/dashboard";
    } catch {
      setError("Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-0 matrix-bg">
      <div className="absolute inset-0 hero-gradient opacity-30" />
      <div className="relative w-full max-w-md px-4">
        <div className="rounded-2xl bg-surface-2 border border-border-dim p-8 shadow-2xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-neon-glow neon-border">
              <ChefHat className="h-6 w-6 text-neon" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Connexion
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Accédez à votre espace IA Restaurant
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-surface-3 border border-border-default px-4 py-2 text-text-primary outline-none focus:border-neon"
                placeholder="vous@exemple.fr"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-surface-3 border border-border-default px-4 py-2 text-text-primary outline-none focus:border-neon"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Pas encore de compte ?{" "}
            <Link href="/sign-up" className="text-neon hover:text-neon-dim">
              Inscription
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
