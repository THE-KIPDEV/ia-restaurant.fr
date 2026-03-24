import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { locale } = await req.json();

  if (locale !== "fr" && locale !== "en") {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ locale });
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}
