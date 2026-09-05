import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getStripe, TOKEN_PACKS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/config";

export async function POST(req: NextRequest) {
  // kip-pay:route : le tunnel intégré s'annonce par un en-tête.
  const kipIntegre = req.headers.get("x-kip-pay") === "inline";
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
      // kip-pay:route : `ui_mode: custom` refuse `success_url`, `cancel_url` ET
      // `after_expiration` (vérifié contre l'API le 05/09/2026). Le retour passe par `return_url`, dérivé de
      // `success_url` pour ne rien changer à la page d'arrivée.
      ...(kipIntegre
        // 🚨 Les types de ce SDK (v17 et moins) ignorent `ui_mode: "custom"`,
        // ajouté en v18. L'API l'accepte pourtant, avec la version épinglée à la
        // requête juste en dessous — le cast le dit à TypeScript sans rien changer
        // à ce qui part sur le réseau.
        ? ({ ui_mode: "custom", return_url: `${siteConfig.url}/dashboard/tokens?success=true` } as unknown as
           { success_url: string; cancel_url: string })
        : { after_expiration: { recovery: { enabled: true } }, success_url: `${siteConfig.url}/dashboard/tokens?success=true`, cancel_url: `${siteConfig.url}/dashboard/tokens?canceled=true` }),
      metadata,
      payment_intent_data: { metadata },
    }, {
      // 🚨 Cette requête SEULE part en 2025-03-31.basil : la version
      // épinglée du site est plus ancienne et refuserait `ui_mode`.
      // Monter le SDK la changerait pour les webhooks aussi.
      ...(kipIntegre ? { apiVersion: "2025-03-31.basil" as const } : {}),
    });

    return NextResponse.json(
    kipIntegre
      // 🚨 La clé publique repart avec la session : sous Next elle devrait
      // sinon être `NEXT_PUBLIC_` et fournie AU BUILD. Bonus : clé et session
      // viennent forcément du même compte.
      ? { clientSecret: session.client_secret, publishableKey: process.env.STRIPE_PUBLIC_KEY }
      : { url: session.url },
  );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    console.error("checkout-tokens error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
