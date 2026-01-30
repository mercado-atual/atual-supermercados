import { NextRequest, NextResponse } from "next/server";
import { searchProductsByDescricao } from "@/lib/products-db";
import { verifyAdminToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return verifyAdminToken(token);
}

/**
 * GET /api/admin/products/by-name?q=termo&limit=50
 * Busca produtos pelo nome (descrição) nos ~16k itens sincronizados.
 * Útil para verificar se um item está no banco.
 */
export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    if (!q.trim()) {
      return NextResponse.json(
        { error: "Parâmetro q (nome/descrição) obrigatório" },
        { status: 400 }
      );
    }

    const { total, products } = await searchProductsByDescricao(q.trim(), limit);

    return NextResponse.json({
      success: true,
      total,
      message:
        total === 0
          ? "Nenhum produto encontrado com esse nome nos itens sincronizados."
          : `${total} produto(s) encontrado(s) nos ~16k itens.`,
      products: products.map((p) => ({
        codigo: p.codigo,
        descricao: p.descricao,
        gtin: p.gtin,
        preco: p.preco,
        estoque: p.estoque,
      })),
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produto por nome:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto por nome" },
      { status: 500 }
    );
  }
}
