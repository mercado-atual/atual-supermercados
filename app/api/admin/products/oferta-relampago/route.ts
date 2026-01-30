import { NextRequest, NextResponse } from "next/server";
import { updateProductBadge } from "@/lib/products-db";
import { verifyAdminToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return verifyAdminToken(token);
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { codigo, badge } = body;
    if (!codigo || typeof codigo !== "string" || !codigo.trim()) {
      return NextResponse.json(
        { success: false, error: "Código do produto obrigatório" },
        { status: 400 }
      );
    }

    const badgeValue = badge === undefined || badge === null ? "Oferta" : String(badge).trim();
    const updated = await updateProductBadge(codigo.trim(), badgeValue);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: { codigo: updated.codigo, badge: updated.badge },
    });
  } catch (error) {
    console.error("❌ Erro ao ativar oferta relâmpago:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao ativar oferta" },
      { status: 500 }
    );
  }
}
