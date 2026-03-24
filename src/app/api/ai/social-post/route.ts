import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { hasEnoughTokens, consumeTokens } from "@/lib/tokens";
import { generateSocialPost } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";
import { TOKEN_COSTS } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const rl = rateLimit(`ai:social:${user.id}`, 10, 60_000);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const enough = await hasEnoughTokens(user.id, "SOCIAL_POST");
    if (!enough) {
      return NextResponse.json({ error: "Jetons insuffisants" }, { status: 402 });
    }

    const { platform, topic, restaurantName, cuisine, language } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: "Sujet requis" }, { status: 400 });
    }

    const post = await generateSocialPost({
      platform: platform || "instagram",
      topic,
      restaurantName: restaurantName || "",
      cuisine: cuisine || "",
      language: language || "fr",
    });

    await consumeTokens(user.id, "SOCIAL_POST", undefined, topic, post);

    return NextResponse.json({
      post,
      tokensUsed: TOKEN_COSTS.SOCIAL_POST,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    console.error("social-post error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
