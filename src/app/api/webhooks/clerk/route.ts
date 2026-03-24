import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { Webhook } from "svix";

interface ClerkUserEvent {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
}

export async function POST(req: NextRequest) {
  const rl = rateLimit("webhook:clerk", 100, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  let event: { type: string; data: ClerkUserEvent };

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const { type, data } = event;

    switch (type) {
      case "user.created":
      case "user.updated": {
        const email = data.email_addresses[0]?.email_address ?? "";
        const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

        await prisma.user.upsert({
          where: { id: data.id },
          update: { email, name, imageUrl: data.image_url },
          create: {
            id: data.id,
            email,
            name,
            imageUrl: data.image_url,
            tokenBalance: 50,
          },
        });
        break;
      }

      case "user.deleted": {
        await prisma.user.delete({ where: { id: data.id } }).catch(() => {});
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
