import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { hasEnoughTokens, consumeTokens } from "@/lib/tokens";
import { translateMenu } from "@/lib/ai";
import { rateLimit } from "@/lib/rate-limit";
import { TOKEN_COSTS } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const rl = rateLimit(`ai:translate:${user.id}`, 5, 60_000);
    if (!rl.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const enough = await hasEnoughTokens(user.id, "TRANSLATE");
    if (!enough) {
      return NextResponse.json({ error: "Jetons insuffisants" }, { status: 402 });
    }

    const { items, fromLanguage, toLanguage } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "Au moins 1 plat requis" }, { status: 400 });
    }

    const translations = await translateMenu({
      items,
      fromLanguage: fromLanguage || "Français",
      toLanguage: toLanguage || "English",
    });

    await consumeTokens(user.id, "TRANSLATE", undefined, JSON.stringify(items), JSON.stringify(translations));

    return NextResponse.json({
      translations,
      tokensUsed: TOKEN_COSTS.TRANSLATE,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    console.error("translate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
