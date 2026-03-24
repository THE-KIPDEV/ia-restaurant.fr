import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { hasEnoughTokens, consumeTokens } from "@/lib/tokens";
import { analyzeMenuEngineering } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";
import { TOKEN_COSTS } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const rl = rateLimit(`ai:menu:${user.id}`, 5, 60_000);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const enough = await hasEnoughTokens(user.id, "MENU_ANALYSIS");
    if (!enough) {
      return NextResponse.json({ error: "Jetons insuffisants" }, { status: 402 });
    }

    const { dishes, currency, language } = await req.json();

    if (!dishes?.length || dishes.length < 2) {
      return NextResponse.json({ error: "Au moins 2 plats requis" }, { status: 400 });
    }

    const analysis = await analyzeMenuEngineering({
      dishes,
      currency: currency || "EUR",
      language: language || "fr",
    });

    await consumeTokens(user.id, "MENU_ANALYSIS", undefined, JSON.stringify(dishes), analysis);

    return NextResponse.json({
      analysis,
      tokensUsed: TOKEN_COSTS.MENU_ANALYSIS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    console.error("menu-analysis error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
