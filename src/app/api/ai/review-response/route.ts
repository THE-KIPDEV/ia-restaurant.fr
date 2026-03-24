import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { hasEnoughTokens, consumeTokens } from "@/lib/tokens";
import { generateReviewResponse } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";
import { TOKEN_COSTS } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const rl = rateLimit(`ai:review:${user.id}`, 10, 60_000);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const enough = await hasEnoughTokens(user.id, "REVIEW_RESPONSE");
    if (!enough) {
      return NextResponse.json({ error: "Jetons insuffisants" }, { status: 402 });
    }

    const { review, rating, restaurantName, tone, language } = await req.json();

    if (!review?.trim()) {
      return NextResponse.json({ error: "Avis requis" }, { status: 400 });
    }

    const response = await generateReviewResponse({
      review,
      rating: rating || 3,
      restaurantName: restaurantName || "",
      tone: tone || "professional",
      language: language || "fr",
    });

    await consumeTokens(user.id, "REVIEW_RESPONSE", undefined, review, response);

    return NextResponse.json({
      response,
      tokensUsed: TOKEN_COSTS.REVIEW_RESPONSE,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    console.error("review-response error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
