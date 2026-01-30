import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieName = getSessionCookieName();
  const cookieStore = await cookies();
  cookieStore.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
