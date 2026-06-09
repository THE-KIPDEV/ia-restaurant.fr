import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { getCurrentUser, getUserPlan } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { PLANS, type PlanKey } from "@/lib/stripe";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const locale = await getLocale();
  const plan = getUserPlan(user);
  const planKey = plan.toLowerCase() as PlanKey;
  const tokenMax = PLANS[planKey]?.tokens ?? 50;

  return (
    <div className="min-h-screen bg-surface-0">
      <Sidebar
        locale={locale}
        tokenBalance={user.tokenBalance}
        tokenMax={tokenMax}
      />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
