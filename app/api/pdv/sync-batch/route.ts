import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Sincronização em lote (útil para sincronização inicial ou grandes volumes)
interface BatchSyncRequest {
  products: Array<{
    pdvId: string;
    title: string;
    price: number;
    stock: number;
    category: string;
    unit: string;
    image?: string;
    description?: string;
    badge?: string;
  }>;
}

function validateAuth(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-pdv-api-key");
  const validApiKey = process.env.PDV_API_KEY || "dev-key-123";
  return apiKey === validApiKey;
}

export async function POST(request: NextRequest) {
  try {
    if (!validateAuth(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const data: BatchSyncRequest = await request.json();

    if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
      return NextResponse.json(
        { error: "Lista de produtos inválida" },
        { status: 400 }
      );
    }

    // Limite de produtos por requisição (evitar sobrecarga)
    const MAX_PRODUCTS = 1000;
    if (data.products.length > MAX_PRODUCTS) {
      return NextResponse.json(
        { error: `Máximo de ${MAX_PRODUCTS} produtos por requisição` },
        { status: 400 }
      );
    }

    const results = {
      total: data.products.length,
      success: 0,
      errors: 0,
      errorsList: [] as Array<{ pdvId: string; error: string }>,
    };

    // Processar cada produto
    for (const product of data.products) {
      try {
        // Validação básica
        if (!product.pdvId || !product.title || product.price === undefined) {
          results.errors++;
          results.errorsList.push({
            pdvId: product.pdvId || "unknown",
            error: "Dados inválidos",
          });
          continue;
        }

        // TODO: Salvar no banco de dados
        // await db.products.upsert({
        //   where: { pdvId: product.pdvId },
        //   update: { ...product, lastSync: new Date() },
        //   create: { ...product, lastSync: new Date() }
        // });

        results.success++;
      } catch (error) {
        results.errors++;
        results.errorsList.push({
          pdvId: product.pdvId,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    console.log(`📦 Sincronização em lote: ${results.success} sucesso, ${results.errors} erros`);

    return NextResponse.json({
      success: true,
      results,
      syncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Erro na sincronização em lote:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

