import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { resetMonthlyTokens } from "./tokens";
import type { Plan, User } from "@prisma/client";

function signingKey() {
  if (!process.env.JWT_SECRET) throw new Error("Authentication unavailable");
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(signingKey());
}

export async function verifyToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, signingKey(), { algorithms: ["HS256"] });
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ userId: string } | null> {
  const c = await cookies();
  const token = c.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  // Lazy monthly token reset (fixes the "reset never triggered" bug)
  await resetMonthlyTokens(session.userId).catch(() => {});
  return prisma.user.findUnique({ where: { id: session.userId } });
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
