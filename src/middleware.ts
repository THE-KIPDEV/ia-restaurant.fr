import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-me-in-production-ia-restaurant"
);

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin",
  "/api/ai",
  "/api/stripe",
  "/api/restaurants",
  "/api/tokens",
];

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function middleware(req: NextRequest) {
  // 1) www → apex 301 (avoid duplicate content in GSC)
  const host = req.headers.get("host") || "";
  if (host.startsWith("www.")) {
    const apex = host.slice(4).split(":")[0];
    const url = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      `https://${apex}`
    );
    return NextResponse.redirect(url, 301);
  }

  // 2) Auth protection (edge — JWT signature verify only, no Prisma)
  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/") || path.startsWith(p)
  );

  if (isProtected) {
    const ok = await isAuthenticated(req);
    if (!ok) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
