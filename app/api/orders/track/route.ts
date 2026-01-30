import { NextRequest, NextResponse } from "next/server";
import { getOrderByTrackingCode } from "@/lib/orders";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Código de rastreamento é obrigatório" },
        { status: 400 }
      );
    }

    const order = getOrderByTrackingCode(code.toUpperCase());

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado. Verifique o código de rastreamento." },
        { status: 404 }
      );
    }

    const statusLabels: Record<string, string> = {
      recebido: "Pedido Recebido",
      aceito: "Pedido Aceito",
      em_separacao: "Em Separação",
      saiu_entrega: "Saiu para Entrega",
      entregue: "Entregue",
      cancelado: "Cancelado",
    };

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        trackingCode: order.trackingCode,
        status: order.status,
        statusLabel: statusLabels[order.status],
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });

  } catch (error) {
    console.error("❌ Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao buscar informações do pedido" },
      { status: 500 }
    );
  }
}

