import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, getOrdersByStatus } from "@/lib/orders";

export const dynamic = 'force-dynamic';

// Simulação de autenticação administrativa
// Em produção, usar JWT ou sessão segura
function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  // Simulação: em produção verificar token JWT
  return authHeader === `Bearer ${process.env.ADMIN_SECRET || 'admin_secret_123'}`;
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let orders;
    if (status) {
      orders = getOrdersByStatus(status as any);
    } else {
      orders = getAllOrders();
    }

    return NextResponse.json({
      success: true,
      orders,
      total: orders.length,
    });

  } catch (error) {
    console.error("❌ Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}



