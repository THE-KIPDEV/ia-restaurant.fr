"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  ChefHat,
  MessageSquare,
  Share2,
  Languages,
  TrendingUp,
  Coins,
  UtensilsCrossed,
  Settings,
  CreditCard,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  locale: "fr" | "en";
  tokenBalance: number;
  tokenMax: number;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelFr: "Vue d'ensemble", labelEn: "Overview" },
  { href: "/dashboard/menu-analysis", icon: BarChart3, labelFr: "Menu Engineering", labelEn: "Menu Engineering" },
  { href: "/dashboard/dish-generator", icon: ChefHat, labelFr: "Descriptions IA", labelEn: "AI Descriptions" },
  { href: "/dashboard/review-responder", icon: MessageSquare, labelFr: "Réponses avis", labelEn: "Review Responses" },
  { href: "/dashboard/social-posts", icon: Share2, labelFr: "Posts sociaux", labelEn: "Social Posts" },
  { href: "/dashboard/translator", icon: Languages, labelFr: "Traduction", labelEn: "Translation" },
  { href: "/dashboard/margin-analysis", icon: TrendingUp, labelFr: "Marges", labelEn: "Margins" },
  { type: "separator" as const },
  { href: "/dashboard/restaurants", icon: UtensilsCrossed, labelFr: "Restaurants", labelEn: "Restaurants" },
  { href: "/dashboard/tokens", icon: Coins, labelFr: "Jetons", labelEn: "Tokens" },
  { href: "/dashboard/billing", icon: CreditCard, labelFr: "Facturation", labelEn: "Billing" },
  { href: "/dashboard/settings", icon: Settings, labelFr: "Paramètres", labelEn: "Settings" },
] as const;

export function Sidebar({ locale, tokenBalance, tokenMax }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const tokenPercent = tokenMax > 0 ? Math.min((tokenBalance / tokenMax) * 100, 100) : 0;

  const nav = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-border-dim">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-glow neon-border">
          <ChefHat className="h-4 w-4 text-neon" />
        </div>
        <span className="text-sm font-bold">
          IA <span className="neon-text">Restaurant</span>
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item, i) => {
          if ("type" in item) {
            return <div key={i} className="my-2 border-t border-border-dim" />;
          }
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive
                  ? "bg-neon-glow text-neon border border-neon/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {locale === "fr" ? item.labelFr : item.labelEn}
            </Link>
          );
        })}
      </nav>

      {/* Token Bar */}
      <div className="border-t border-border-dim p-4">
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">
              {locale === "fr" ? "Jetons" : "Tokens"}
            </span>
            <span className="font-medium text-neon">
              {tokenBalance.toLocaleString()} / {tokenMax.toLocaleString()}
            </span>
          </div>
          <div className="token-bar mt-1.5">
            <div
              className="token-bar-fill"
              style={{ width: `${tokenPercent}%` }}
            />
          </div>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/auth/deconnexion", { method: "POST" });
            window.location.href = "/";
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {locale === "fr" ? "Déconnexion" : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-surface-2 border border-border-dim p-2 lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-text-primary" />
        ) : (
          <Menu className="h-5 w-5 text-text-primary" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-surface-1 border-r border-border-dim transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {nav}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 lg:bg-surface-1 lg:border-r lg:border-border-dim">
        {nav}
      </aside>
    </>
  );
}
