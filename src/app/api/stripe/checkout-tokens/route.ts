import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getStripe, TOKEN_PACKS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const rl = rateLimit(`stripe:tokens:${user.id}`, 5, 60_000);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { amount } = await req.json();

    const pack = TOKEN_PACKS.find((p) => p.amount === amount);

    if (!pack || !pack.stripePriceId) {
      return NextResponse.json({ error: "Invalid token pack" }, { status: 400 });
    }

    const stripe = getStripe();

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id, site: "ia-restaurant.fr" },
      });

      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const metadata = {
      userId: user.id,
      site: "ia-restaurant.fr",
      tokenAmount: String(amount),
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: pack.stripePriceId, quantity: 1 }],
      success_url: `${siteConfig.url}/dashboard/tokens?success=true`,
      cancel_url: `${siteConfig.url}/dashboard/tokens?canceled=true`,
      metadata,
      payment_intent_data: { metadata },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    console.error("checkout-tokens error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
