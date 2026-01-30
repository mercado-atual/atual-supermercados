import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getProducts } from "@/lib/products-db";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || null;

    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const products = await getProducts();

    return NextResponse.json({
      success: true,
      count: products.length,
    });

  } catch (error) {
    console.error("Erro ao contar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao contar produtos" },
      { status: 500 }
    );
  }
}
