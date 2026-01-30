import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/orders";

export const dynamic = 'force-dynamic';

// Simulação de autenticação administrativa
function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.ADMIN_SECRET || 'admin_secret_123'}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const order = getOrderById(resolvedParams.id);

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("❌ Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedido" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const data = await request.json();
    const { status, notes, paymentStatus } = data;

    // BLOQUEAR alteração manual do status de pagamento
    // O status de pagamento só pode ser alterado via webhook Stripe
    if (paymentStatus !== undefined) {
      return NextResponse.json(
        { error: "O status de pagamento não pode ser alterado manualmente. Ele é atualizado exclusivamente via webhook Stripe." },
        { status: 403 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status é obrigatório" },
        { status: 400 }
      );
    }

    // Atualizar apenas o status do pedido (não o status de pagamento)
    const updatedOrder = updateOrderStatus(resolvedParams.id, status, notes);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status do pedido atualizado com sucesso!",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("❌ Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}



