import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, isValidAdminSessionToken } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieName = getSessionCookieName();
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  const authenticated = isValidAdminSessionToken(token);
  return NextResponse.json({ authenticated });
}
