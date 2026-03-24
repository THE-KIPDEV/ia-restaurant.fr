import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { hasEnoughTokens, consumeTokens } from "@/lib/tokens";
import { generateDishDescription } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";
import { TOKEN_COSTS } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const rl = rateLimit(`ai:dish:${user.id}`, 10, 60_000);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const enough = await hasEnoughTokens(user.id, "DISH_DESCRIPTION");
    if (!enough) {
      return NextResponse.json({ error: "Jetons insuffisants" }, { status: 402 });
    }

    const body = await req.json();
    const { name, ingredients, cuisine, tone, language } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Nom du plat requis" }, { status: 400 });
    }

    const description = await generateDishDescription({
      name,
      ingredients: ingredients || "",
      cuisine: cuisine || "",
      tone: tone || "elegant",
      language: language || "fr",
    });

    await consumeTokens(user.id, "DISH_DESCRIPTION", undefined, name, description);

    return NextResponse.json({
      description,
      tokensUsed: TOKEN_COSTS.DISH_DESCRIPTION,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    console.error("dish-description error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
