import type Stripe from "stripe";
import { Prisma, type Plan } from "@prisma/client";
import { prisma } from "./prisma";
import { PLANS } from "./stripe";
import { nextCreditMonth } from "./tokens";

export function subscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const compatible=subscription as Stripe.Subscription & {current_period_end?:number};
  const item=subscription.items.data[0] as {current_period_end?:number}|undefined;
  const seconds=compatible.current_period_end ?? item?.current_period_end;
  if(!seconds || !Number.isFinite(seconds)) throw new Error("Subscription period missing");
  return new Date(seconds*1000);
}
export function subscriptionPlan(subscription: Stripe.Subscription):Plan {
  if(subscription.status!=="active")return "FREE";
  const price=subscription.items.data[0]?.price.id;
  if(price && [PLANS.pro.stripePriceMonthly,PLANS.pro.stripePriceYearly].includes(price))return "PRO";
  if(price && [PLANS.business.stripePriceMonthly,PLANS.business.stripePriceYearly].includes(price))return "BUSINESS";
  return "FREE";
}
export async function syncSubscription(subscription:Stripe.Subscription,userId?:string,grant=true) {
  if(subscription.metadata.site!=="ia-restaurant.fr")return;
  const plan=subscriptionPlan(subscription),periodEnd=subscriptionPeriodEnd(subscription);
  await prisma.$transaction(async tx=>{
    const owner=await tx.user.findFirst({where:userId?{id:userId}:{stripeSubscriptionId:subscription.id}});
    if(!owner)return;
    const customer=typeof subscription.customer==="string"?subscription.customer:subscription.customer.id;
    if(owner.stripeCustomerId!==customer)throw new Error("Subscription customer mismatch");
    await tx.$queryRaw`SELECT id FROM users WHERE id=${owner.id} FOR UPDATE`;
    const user=await tx.user.findUniqueOrThrow({where:{id:owner.id}});
    const firstActivation=grant && plan!=="FREE" && (user.stripeSubscriptionId!==subscription.id || !user.creditPeriodEnd || periodEnd>user.creditPeriodEnd);
    const annual=subscription.items.data[0]?.price.recurring?.interval==="year";
    const allocation=plan==="BUSINESS"?PLANS.business.tokens:plan==="PRO"?PLANS.pro.tokens:0;
    await tx.user.update({where:{id:user.id},data:{
      stripeSubscriptionId:subscription.id,stripePriceId:subscription.items.data[0]?.price.id,
      stripeCurrentPeriodEnd:periodEnd,plan,
      ...(firstActivation?{tokenBalance:user.purchasedTokenBalance+allocation,tokenResetAt:annual?nextCreditMonth(new Date()):periodEnd,creditPeriodEnd:periodEnd}:{}),
    }});
  });
}
export async function creditPurchase(userId:string,amount:number,price:number,paymentId:string) {
  try {await prisma.$transaction(async tx=>{
    await tx.tokenOrder.create({data:{userId,amount,price,stripePaymentId:paymentId}});
    await tx.user.update({where:{id:userId},data:{tokenBalance:{increment:amount},purchasedTokenBalance:{increment:amount}}});
  });}catch(error){if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2002")return;throw error;}
}
