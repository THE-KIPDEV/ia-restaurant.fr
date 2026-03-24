import { requireUser, getUserPlan } from "@/lib/auth";
import { getLocale, createT } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { PLANS, type PlanKey } from "@/lib/stripe";
import {
  Coins,
  UtensilsCrossed,
  BarChart3,
  ChefHat,
  MessageSquare,
  Share2,
  Languages,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const locale = await getLocale();
  const t = createT(locale);
  const plan = getUserPlan(user);
  const planKey = plan.toLowerCase() as PlanKey;
  const tokenMax = PLANS[planKey]?.tokens ?? 50;

  const [restaurantCount, usageThisMonth] = await Promise.all([
    prisma.restaurant.count({ where: { userId: user.id } }),
    prisma.aiUsage.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const tokenPercent =
    tokenMax > 0 ? Math.min((user.tokenBalance / tokenMax) * 100, 100) : 0;

  const quickActions = [
    { href: "/dashboard/menu-analysis", icon: BarChart3, label: t("sidebar.menuAnalysis"), tokens: 30, color: "neon" },
    { href: "/dashboard/dish-generator", icon: ChefHat, label: t("sidebar.dishGenerator"), tokens: 5, color: "purple" },
    { href: "/dashboard/review-responder", icon: MessageSquare, label: t("sidebar.reviewResponder"), tokens: 5, color: "neon" },
    { href: "/dashboard/social-posts", icon: Share2, label: t("sidebar.socialPosts"), tokens: 5, color: "purple" },
    { href: "/dashboard/translator", icon: Languages, label: t("sidebar.translator"), tokens: 10, color: "neon" },
    { href: "/dashboard/margin-analysis", icon: TrendingUp, label: t("sidebar.marginAnalysis"), tokens: 20, color: "purple" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          {t("dashboard.welcome")},{" "}
          <span className="gradient-text">{user.name || user.email}</span>
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {plan} Plan
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-glow">
              <Coins className="h-5 w-5 text-neon" />
            </div>
            <div>
              <p className="text-xs text-text-muted">{t("dashboard.tokens")}</p>
              <p className="text-xl font-bold text-text-primary">
                {user.tokenBalance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="token-bar mt-3">
            <div className="token-bar-fill" style={{ width: `${tokenPercent}%` }} />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-glow">
              <UtensilsCrossed className="h-5 w-5 text-purple" />
            </div>
            <div>
              <p className="text-xs text-text-muted">{t("dashboard.restaurants")}</p>
              <p className="text-xl font-bold text-text-primary">
                {restaurantCount}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-glow">
              <Zap className="h-5 w-5 text-neon" />
            </div>
            <div>
              <p className="text-xs text-text-muted">{t("dashboard.usageThisMonth")}</p>
              <p className="text-xl font-bold text-text-primary">
                {usageThisMonth}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          {t("dashboard.quickActions")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="card card-glow flex items-center gap-4 p-4 transition-all"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  action.color === "neon"
                    ? "bg-neon-glow"
                    : "bg-purple-glow"
                }`}
              >
                <action.icon
                  className={`h-5 w-5 ${
                    action.color === "neon" ? "text-neon" : "text-purple"
                  }`}
                />
              </div>
              <div>
                <p className="font-medium text-text-primary">{action.label}</p>
                <p className="text-xs text-text-muted">
                  {action.tokens} {locale === "fr" ? "jetons" : "tokens"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* No restaurant prompt */}
      {restaurantCount === 0 && (
        <div className="card neon-border p-8 text-center">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-neon opacity-50" />
          <p className="mt-4 text-text-secondary">
            {t("dashboard.noRestaurant")}
          </p>
          <Link
            href="/dashboard/restaurants"
            className="btn-primary mt-4 inline-block"
          >
            {t("dashboard.addRestaurant")}
          </Link>
        </div>
      )}
    </div>
  );
}
