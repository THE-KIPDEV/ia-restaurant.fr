import { prisma } from "./prisma";
import { TOKEN_COSTS, type AiFeatureKey } from "./config";
import { PLANS, type PlanKey } from "./stripe";
import type { AiFeature } from "@prisma/client";

export async function getTokenBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenBalance: true },
  });
  return user?.tokenBalance ?? 0;
}

export async function hasEnoughTokens(
  userId: string,
  feature: AiFeatureKey
): Promise<boolean> {
  const balance = await getTokenBalance(userId);
  return balance >= TOKEN_COSTS[feature];
}

export async function consumeTokens(
  userId: string,
  feature: AiFeatureKey,
  restaurantId?: string,
  inputData?: string,
  outputData?: string
): Promise<{ success: boolean; remaining: number }> {
  const cost = TOKEN_COSTS[feature];
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenBalance: true },
  });

  if (!user || user.tokenBalance < cost) {
    return { success: false, remaining: user?.tokenBalance ?? 0 };
  }

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        tokenBalance: { decrement: cost },
        tokensUsedTotal: { increment: cost },
      },
    }),
    prisma.aiUsage.create({
      data: {
        feature: feature as AiFeature,
        tokensUsed: cost,
        inputData: inputData ? inputData.slice(0, 2000) : null,
        outputData: outputData ? outputData.slice(0, 2000) : null,
        userId,
        restaurantId: restaurantId || null,
      },
    }),
  ]);

  return { success: true, remaining: updatedUser.tokenBalance };
}

export async function addTokens(
  userId: string,
  amount: number
): Promise<number> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { tokenBalance: { increment: amount } },
  });
  return user.tokenBalance;
}

export async function resetMonthlyTokens(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, tokenResetAt: true },
  });

  if (!user) return;

  const now = new Date();
  const resetAt = user.tokenResetAt;

  if (resetAt && resetAt > now) return;

  const planKey = user.plan.toLowerCase() as PlanKey;
  const monthlyTokens = PLANS[planKey]?.tokens ?? 50;

  const nextReset = new Date(now);
  nextReset.setMonth(nextReset.getMonth() + 1);
  nextReset.setDate(1);
  nextReset.setHours(0, 0, 0, 0);

  await prisma.user.update({
    where: { id: userId },
    data: {
      tokenBalance: monthlyTokens,
      tokenResetAt: nextReset,
    },
  });
}

export async function getUsageStats(userId: string) {
  const [totalUsage, byFeature, recent] = await Promise.all([
    prisma.aiUsage.aggregate({
      where: { userId },
      _sum: { tokensUsed: true },
      _count: true,
    }),
    prisma.aiUsage.groupBy({
      by: ["feature"],
      where: { userId },
      _sum: { tokensUsed: true },
      _count: true,
    }),
    prisma.aiUsage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { restaurant: { select: { name: true } } },
    }),
  ]);

  return { totalUsage, byFeature, recent };
}
