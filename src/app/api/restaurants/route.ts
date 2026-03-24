import { NextRequest, NextResponse } from "next/server";
import { requireUser, getUserPlan } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS, type PlanKey } from "@/lib/stripe";

export async function GET() {
  try {
    const user = await requireUser();
    const restaurants = await prisma.restaurant.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ restaurants });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const plan = getUserPlan(user);
    const planKey = plan.toLowerCase() as PlanKey;
    const maxRestaurants = PLANS[planKey]?.restaurants ?? 1;

    if (maxRestaurants > 0) {
      const count = await prisma.restaurant.count({ where: { userId: user.id } });
      if (count >= maxRestaurants) {
        return NextResponse.json(
          { error: `Limite de ${maxRestaurants} restaurant(s) atteinte. Passez au plan supérieur.` },
          { status: 403 }
        );
      }
    }

    const { name, cuisine, description, address, city, currency } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        cuisine: cuisine || null,
        description: description || null,
        address: address || null,
        city: city || null,
        currency: currency || "EUR",
        userId: user.id,
      },
    });

    return NextResponse.json({ restaurant }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
