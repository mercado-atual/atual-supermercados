import { NextRequest, NextResponse } from "next/server";
import { getProductByGtin } from "@/lib/products-db";

export const dynamic = "force-dynamic";

function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.ADMIN_SECRET || "admin_secret_123"}`;
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gtin = searchParams.get("gtin");
    if (!gtin || !gtin.trim()) {
      return NextResponse.json(
        { error: "Parâmetro gtin obrigatório" },
        { status: 400 }
      );
    }

    const product = await getProductByGtin(gtin.trim());
    if (!product) {
      return NextResponse.json(
        { success: false, product: null, message: "Produto não encontrado" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        codigo: product.codigo,
        descricao: product.descricao,
        gtin: product.gtin,
        preco: product.preco,
        precoSysmo: product.preco,
        estoque: product.estoque,
        badge: product.badge || null,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produto por código de barras:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}
