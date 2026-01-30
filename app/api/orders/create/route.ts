import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { CATALOG_MODE } from "@/lib/catalog-config";

export const dynamic = 'force-dynamic';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

interface CreateOrderRequest {
  items: OrderItem[];
  address: {
    cep?: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  paymentMethod: string;
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCPF?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Bloquear criação de pedidos em modo catálogo
    if (CATALOG_MODE) {
      return NextResponse.json(
        { error: "Compras online em breve. No momento, o site funciona apenas como catálogo." },
        { status: 403 }
      );
    }

    const data: CreateOrderRequest = await request.json();

    // Validação básica
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio" },
        { status: 400 }
      );
    }

    if (!data.address.rua || !data.address.numero || !data.address.bairro || !data.address.cidade) {
      return NextResponse.json(
        { error: "Endereço incompleto" },
        { status: 400 }
      );
    }

    if (!data.paymentMethod) {
      return NextResponse.json(
        { error: "Forma de pagamento não selecionada" },
        { status: 400 }
      );
    }

    // Validações críticas
    if (!data.customerName || !data.customerName.trim()) {
      return NextResponse.json(
        { error: "Nome do cliente é obrigatório" },
        { status: 400 }
      );
    }

    if (!data.customerPhone || !data.customerPhone.trim()) {
      return NextResponse.json(
        { error: "Telefone do cliente é obrigatório" },
        { status: 400 }
      );
    }

    // Validar formato de telefone
    const phoneNumbers = data.customerPhone.replace(/\D/g, "");
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      return NextResponse.json(
        { error: "Telefone inválido" },
        { status: 400 }
      );
    }

    // Gerar código de rastreamento único
    const trackingCode = `ATUAL${Date.now().toString().slice(-6)}`;

    // Criar pedido com status inicial "aguardando_pagamento"
    // O status de pagamento será atualizado EXCLUSIVAMENTE via webhook Stripe
    const order = createOrder({
      trackingCode,
      status: "aguardando_pagamento",
      items: data.items,
      address: data.address,
      paymentMethod: data.paymentMethod,
      total: data.total,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerCPF: data.customerCPF,
    });

    console.log("✅ Novo pedido criado:", trackingCode);

    return NextResponse.json({
      success: true,
      message: "Pedido criado com sucesso!",
      order,
      trackingCode,
    });

  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao processar pedido" },
      { status: 500 }
    );
  }
}
