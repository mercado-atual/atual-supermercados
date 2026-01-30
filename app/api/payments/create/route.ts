import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrderById } from "@/lib/orders";
import { CATALOG_MODE } from "@/lib/catalog-config";

export const dynamic = 'force-dynamic';

// Inicializar Stripe apenas quando necessÃ¡rio (nÃ£o no build time)
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY nÃ£o configurada");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {});
}

// Rastrear requisiÃ§Ãµes em processamento para evitar duplicaÃ§Ã£o
const processingRequests = new Set<string>();

interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: "card" | "pix";
}

export async function POST(request: NextRequest) {
  let orderId: string | undefined;
  let data: CreatePaymentRequest | null = null;
  const cleanup = () => {
    if (orderId) {
      processingRequests.delete(orderId);
    }
  };
  
  try {
    // Bloquear pagamentos em modo catálogo
    if (CATALOG_MODE) {
      return NextResponse.json(
        { error: "Compras online em breve. No momento, o site funciona apenas como catálogo." },
        { status: 403 }
      );
    }

    data = await request.json();
    if (!data) {
      return NextResponse.json({ error: "Dados do pagamento nÃ£o informados" }, { status: 400 });
    }
    orderId = data.orderId;

    if (!data.orderId) {
      return NextResponse.json({ error: "ID do pedido Ã© obrigatÃ³rio" }, { status: 400 });
    }

    if (processingRequests.has(data.orderId)) {
      console.log("âš ï¸ RequisiÃ§Ã£o duplicada bloqueada para pedido:", data.orderId);
      return NextResponse.json({ error: "Pagamento jÃ¡ estÃ¡ sendo processado para este pedido" }, { status: 409 });
    }

    processingRequests.add(data.orderId);

    if (!data.amount || data.amount <= 0) {
      cleanup();
      return NextResponse.json({ error: "Valor do pedido invÃ¡lido" }, { status: 400 });
    }

    if (!data.paymentMethod || !["card", "pix"].includes(data.paymentMethod)) {
      cleanup();
      return NextResponse.json({ error: "MÃ©todo de pagamento invÃ¡lido. Use 'card' ou 'pix'" }, { status: 400 });
    }

    let stripe: Stripe;
    try {
      stripe = getStripe();
    } catch (error) {
      console.error("âŒ STRIPE_SECRET_KEY nÃ£o configurada");
      cleanup();
      return NextResponse.json({ error: "ConfiguraÃ§Ã£o de pagamento nÃ£o disponÃ­vel" }, { status: 500 });
    }

    const order = getOrderById(data.orderId);
    if (!order) {
      cleanup();
      return NextResponse.json({ error: "Pedido nÃ£o encontrado" }, { status: 404 });
    }

    const amountInCents = Math.round(data.amount * 100);

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: amountInCents,
      currency: "brl",
      metadata: {
        orderId: data.orderId,
        trackingCode: order.trackingCode,
        customerName: order.customerName || "",
        customerPhone: order.customerPhone || "",
      },
    };

    // IMPORTANTE: NÃƒO misturar automatic_payment_methods com payment_method_types
    if (data.paymentMethod === "pix") {
      paymentIntentParams.payment_method_types = ["pix"];
    } else if (data.paymentMethod === "card") {
      paymentIntentParams.payment_method_types = ["card"];
    }
    
    console.log("ðŸ”§ PaymentIntent params:", {
      amount: paymentIntentParams.amount,
      currency: paymentIntentParams.currency,
      payment_method_types: paymentIntentParams.payment_method_types,
    });

    const idempotencyKey = `order_${data.orderId}`;
    
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams, {
      idempotencyKey: idempotencyKey,
    });

    console.log("âœ… PaymentIntent criado:", paymentIntent.id, "para pedido:", data.orderId);

    if (!paymentIntent.client_secret) {
      console.error("âŒ PaymentIntent criado sem client_secret:", paymentIntent.id);
      cleanup();
      return NextResponse.json({ error: "Erro ao criar pagamento: client_secret nÃ£o disponÃ­vel" }, { status: 500 });
    }

    console.log("âœ… PaymentIntent client_secret disponÃ­vel:", {
      paymentIntentId: paymentIntent.id,
      clientSecretLength: paymentIntent.client_secret.length,
      status: paymentIntent.status,
    });

    const response = NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      orderId: data.orderId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
    });

    cleanup();
    return response;

  } catch (error: any) {
    console.error("âŒ Erro ao criar PaymentIntent:", error);
    if (orderId) processingRequests.delete(orderId);
    if (error.type === "StripeCardError" || error.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: error.message || "Erro ao processar pagamento" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar pagamento. Tente novamente." }, { status: 500 });
  }
}

