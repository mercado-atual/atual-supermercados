import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookieName, isValidAdminSessionToken } from "@/lib/adminSession";
import { fetchSistemaProdutos } from "@/lib/sistema";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieName = getSessionCookieName();
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!isValidAdminSessionToken(token)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!process.env.SISTEMA_API_URL) {
    return NextResponse.json(
      { error: "SISTEMA_API_URL não configurada" },
      { status: 400 }
    );
  }

  const produtos = await fetchSistemaProdutos();

  return NextResponse.json({
    ok: true,
    total: produtos.length,
  });
}
