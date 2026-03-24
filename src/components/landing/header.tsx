"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Menu, X, ChefHat } from "lucide-react";

interface HeaderProps {
  locale: "fr" | "en";
}

export function Header({ locale }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const t = {
    features: locale === "fr" ? "Fonctionnalités" : "Features",
    pricing: locale === "fr" ? "Tarifs" : "Pricing",
    signIn: locale === "fr" ? "Connexion" : "Sign In",
    dashboard: locale === "fr" ? "Tableau de bord" : "Dashboard",
    getStarted: locale === "fr" ? "Commencer" : "Get Started",
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-glow neon-border">
              <ChefHat className="h-5 w-5 text-neon" />
            </div>
            <span className="text-lg font-bold text-text-primary">
              IA <span className="neon-text">Restaurant</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-text-secondary hover:text-neon transition-colors">
              {t.features}
            </Link>
            <Link href="#pricing" className="text-sm text-text-secondary hover:text-neon transition-colors">
              {t.pricing}
            </Link>
            <Link
              href={locale === "fr" ? "/?locale=en" : "/?locale=fr"}
              className="text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              {locale === "fr" ? "EN" : "FR"}
            </Link>
            {isSignedIn ? (
              <Link href="/dashboard" className="btn-primary text-sm">
                {t.dashboard}
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="btn-ghost text-sm">
                  {t.signIn}
                </Link>
                <Link href="/sign-up" className="btn-primary text-sm">
                  {t.getStarted}
                </Link>
              </>
            )}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-text-secondary"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border-dim py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              <Link href="#features" onClick={() => setOpen(false)} className="text-sm text-text-secondary hover:text-neon px-2 py-1">
                {t.features}
              </Link>
              <Link href="#pricing" onClick={() => setOpen(false)} className="text-sm text-text-secondary hover:text-neon px-2 py-1">
                {t.pricing}
              </Link>
              {isSignedIn ? (
                <Link href="/dashboard" className="btn-primary text-sm text-center">
                  {t.dashboard}
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" className="btn-ghost text-sm text-center">
                    {t.signIn}
                  </Link>
                  <Link href="/sign-up" className="btn-primary text-sm text-center">
                    {t.getStarted}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
