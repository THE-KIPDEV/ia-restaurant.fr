import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { addTokens } from "@/lib/tokens";
import { rateLimit } from "@/lib/rate-limit";
import type { Plan } from "@prisma/client";

export async function POST(req: NextRequest) {
  const rl = rateLimit("webhook:stripe", 100, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.metadata?.site !== "ia-restaurant.fr") break;
        const userId = session.metadata?.userId;
        if (!userId) break;

        // Token pack one-time payments are credited via payment_intent.succeeded
        if (session.mode !== "subscription") break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const priceId = subscription.items.data[0]?.price.id;
        let plan: Plan = "FREE";

        if (
          priceId === PLANS.pro.stripePriceMonthly ||
          priceId === PLANS.pro.stripePriceYearly
        ) {
          plan = "PRO";
        } else if (
          priceId === PLANS.business.stripePriceMonthly ||
          priceId === PLANS.business.stripePriceYearly
        ) {
          plan = "BUSINESS";
        }

        const monthlyTokens = plan === "BUSINESS" ? 10000 : plan === "PRO" ? 2000 : 50;

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              ((subscription.items.data[0] as { current_period_end?: number })
                ?.current_period_end ?? Date.now() / 1000) * 1000
            ),
            plan,
            tokenBalance: monthlyTokens,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripeCurrentPeriodEnd: new Date(
              ((subscription.items.data[0] as { current_period_end?: number })
                ?.current_period_end ?? Date.now() / 1000) * 1000
            ),
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const priceId = subscription.items.data[0]?.price.id;
        let plan: Plan = "FREE";

        if (
          priceId === PLANS.pro.stripePriceMonthly ||
          priceId === PLANS.pro.stripePriceYearly
        ) {
          plan = "PRO";
        } else if (
          priceId === PLANS.business.stripePriceMonthly ||
          priceId === PLANS.business.stripePriceYearly
        ) {
          plan = "BUSINESS";
        }

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              ((subscription.items.data[0] as { current_period_end?: number })
                ?.current_period_end ?? Date.now() / 1000) * 1000
            ),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan: "FREE",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            tokenBalance: 50,
          },
        });
        break;
      }

      // Token pack one-time purchase
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        if (paymentIntent.metadata?.site !== "ia-restaurant.fr") break;
        const userId = paymentIntent.metadata?.userId;
        const tokenAmount = parseInt(paymentIntent.metadata?.tokenAmount || "0");

        if (userId && tokenAmount > 0) {
          const newBalance = await addTokens(userId, tokenAmount);
          await prisma.tokenOrder.create({
            data: {
              amount: tokenAmount,
              price: (paymentIntent.amount || 0) / 100,
              stripePaymentId: paymentIntent.id,
              userId,
            },
          });
          console.log(`Added ${tokenAmount} tokens to user ${userId}. New balance: ${newBalance}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
