import { prisma } from "./prisma";
import { TOKEN_COSTS, type AiFeatureKey } from "./config";
import { PLANS, type PlanKey } from "./stripe";
import { Prisma, type AiFeature } from "@prisma/client";

// Lock the balance for every mutation: monthly credits are spent before purchased credits.
export async function debitCredits(tx: Prisma.TransactionClient, userId: string, cost: number) {
  const rows = await tx.$queryRaw<Array<{tokenBalance:number;purchasedTokenBalance:number}>>`
    SELECT "tokenBalance", "purchasedTokenBalance" FROM "users" WHERE id=${userId} FOR UPDATE`;
  const user=rows[0];
  if(!user || user.tokenBalance<cost) return null;
  const purchasedUsed=Math.max(0,cost-(user.tokenBalance-user.purchasedTokenBalance));
  await tx.user.update({where:{id:userId},data:{tokenBalance:{decrement:cost},purchasedTokenBalance:{decrement:purchasedUsed},tokensUsedTotal:{increment:cost}}});
  return {purchasedUsed,remaining:user.tokenBalance-cost};
}
export function nextCreditMonth(date: Date) {
  const next=new Date(date);const day=next.getUTCDate();next.setUTCDate(1);next.setUTCMonth(next.getUTCMonth()+1);
  const last=new Date(Date.UTC(next.getUTCFullYear(),next.getUTCMonth()+1,0)).getUTCDate();next.setUTCDate(Math.min(day,last));return next;
}

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
  const user = await prisma.user.findUnique({where:{id:userId},select:{tokenBalance:true,plan:true,stripeCurrentPeriodEnd:true}});
  return !!user && user.plan !== "FREE" && !!user.stripeCurrentPeriodEnd && user.stripeCurrentPeriodEnd > new Date() && user.tokenBalance >= TOKEN_COSTS[feature];
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

  const updatedUser = await prisma.$transaction(async tx => {
    const debit = await debitCredits(tx,userId,cost);
    if (!debit) return null;
    await tx.aiUsage.create({
      data: {
        feature: feature as AiFeature,
        tokensUsed: cost,
        purchasedTokens: debit.purchasedUsed,
        inputData: inputData ? inputData.slice(0, 2000) : null,
        outputData: outputData ? outputData.slice(0, 2000) : null,
        userId,
        restaurantId: restaurantId || null,
      },
    });
    return tx.user.findUniqueOrThrow({where:{id:userId},select:{tokenBalance:true}});
  });

  return { success: !!updatedUser, remaining: updatedUser?.tokenBalance ?? 0 };
}

export async function addTokens(
  userId: string,
  amount: number
): Promise<number> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { tokenBalance: { increment: amount }, purchasedTokenBalance: { increment: amount } },
  });
  return user.tokenBalance;
}

export async function resetMonthlyTokens(userId: string): Promise<void> {
  await prisma.$transaction(async tx=>{
    await tx.$queryRaw`SELECT id FROM users WHERE id=${userId} FOR UPDATE`;
    const user=await tx.user.findUnique({where:{id:userId}});if(!user) return;
    const now=new Date();if(user.tokenResetAt && user.tokenResetAt>now)return;
    const active=user.plan!=="FREE" && !!user.stripeCurrentPeriodEnd && user.stripeCurrentPeriodEnd>now;
    const monthly=active ? PLANS[user.plan.toLowerCase() as PlanKey].tokens : 0;
    let next=user.tokenResetAt || now;
    do {next=nextCreditMonth(next);}while(next<=now);
    if(active && user.stripeCurrentPeriodEnd && user.stripeCurrentPeriodEnd<next)next=user.stripeCurrentPeriodEnd;
    await tx.user.update({where:{id:userId},data:{tokenBalance:user.purchasedTokenBalance+monthly,tokenResetAt:next}});
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
