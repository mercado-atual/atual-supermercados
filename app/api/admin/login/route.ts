import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminSessionToken, getSessionCookieName } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD não configurada" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
  }

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Erro ao criar sessão" },
      { status: 500 }
    );
  }

  const cookieName = getSessionCookieName();
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
