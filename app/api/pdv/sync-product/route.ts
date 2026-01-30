import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Tipos de dados recebidos do PDV
interface PDVProductSync {
  pdvId: string; // ID único no sistema PDV
  title: string;
  price: number;
  stock: number;
  category: string;
  unit: string;
  image?: string;
  description?: string;
  badge?: string;
  updatedAt: string;
}

// Validação de autenticação (API Key do PDV)
function validateAuth(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-pdv-api-key");
  const validApiKey = process.env.PDV_API_KEY || "dev-key-123"; // Em produção, usar variável de ambiente
  
  return apiKey === validApiKey;
}

// POST: Receber atualização de produto do PDV
export async function POST(request: NextRequest) {
  try {
    // Validar autenticação
    if (!validateAuth(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const data: PDVProductSync = await request.json();

    // Validação básica dos dados
    if (!data.pdvId || !data.title || data.price === undefined || data.stock === undefined) {
      return NextResponse.json(
        { error: "Dados inválidos. Campos obrigatórios: pdvId, title, price, stock" },
        { status: 400 }
      );
    }

    // Aqui você salvaria no banco de dados
    // Por enquanto, vamos simular o processo
    
    console.log("📦 Sincronizando produto do PDV:", {
      pdvId: data.pdvId,
      title: data.title,
      price: data.price,
      stock: data.stock,
      category: data.category,
    });

    // TODO: Salvar no banco de dados
    // await db.products.upsert({
    //   where: { pdvId: data.pdvId },
    //   update: { ...data, lastSync: new Date() },
    //   create: { ...data, lastSync: new Date() }
    // });

    // TODO: Invalidar cache do produto
    // await redis.del(`product:${data.pdvId}`);

    // TODO: Notificar frontend via WebSocket se necessário
    // socketIO.emit('product:updated', { pdvId: data.pdvId });

    return NextResponse.json({
      success: true,
      message: "Produto sincronizado com sucesso",
      productId: data.pdvId,
      syncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Erro ao sincronizar produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET: Consultar status de sincronização
export async function GET(request: NextRequest) {
  if (!validateAuth(request)) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const pdvId = searchParams.get("pdvId");

  if (!pdvId) {
    return NextResponse.json(
      { error: "pdvId é obrigatório" },
      { status: 400 }
    );
  }

  // TODO: Buscar no banco de dados
  // const product = await db.products.findUnique({ where: { pdvId } });

  return NextResponse.json({
    pdvId,
    lastSync: new Date().toISOString(),
    status: "synced",
    // product: product || null
  });
}

