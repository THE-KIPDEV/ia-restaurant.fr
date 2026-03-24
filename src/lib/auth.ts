import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import type { Plan, User } from "@prisma/client";

export async function getCurrentUser(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  return prisma.user.findUnique({
    where: { id: clerkUser.id },
  });
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function syncUser(): Promise<User> {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  return prisma.user.upsert({
    where: { id: clerkUser.id },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
      imageUrl: clerkUser.imageUrl,
      tokenBalance: 50,
    },
  });
}

export function getUserPlan(user: User): Plan {
  if (
    user.plan !== "FREE" &&
    user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd > new Date()
  ) {
    return user.plan;
  }
  return "FREE";
}

export function isAdmin(user: User): boolean {
  return user.role === "ADMIN";
}

export function hasActiveSubscription(user: User): boolean {
  return (
    user.plan !== "FREE" &&
    !!user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd > new Date()
  );
}
