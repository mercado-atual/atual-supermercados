import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/orders";
import { getProducts } from "@/lib/products-db";

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const orders = getAllOrders();
    const faturamentoHoje = orders
      .filter((o) => {
        const createdAt = new Date(o.createdAt).getTime();
        return (
          o.paymentStatus === "pago" &&
          createdAt >= today.getTime() &&
          createdAt <= todayEnd.getTime()
        );
      })
      .reduce((sum, o) => sum + o.total, 0);

    const products = await getProducts();
    const estoqueCritico = products
      .filter((p) => p.estoque < 5 && p.estoque >= 0)
      .sort((a, b) => a.estoque - b.estoque)
      .slice(0, 50)
      .map((p) => ({
        codigo: p.codigo,
        descricao: p.descricao,
        estoque: p.estoque,
        preco: p.preco,
      }));

    return NextResponse.json({
      success: true,
      faturamentoHoje: Math.round(faturamentoHoje * 100) / 100,
      totalPedidosHoje: orders.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= today.getTime() && t <= todayEnd.getTime();
      }).length,
      estoqueCritico,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 }
    );
  }
}
