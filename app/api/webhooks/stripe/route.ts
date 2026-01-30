import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrderById, updatePaymentStatus } from "@/lib/orders";

export const dynamic = 'force-dynamic';

// Inicializar Stripe apenas quando necessário (não no build time)
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY não configurada");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {});
}

// Armazenamento em memória para idempotência (em produção, usar banco de dados)
const processedEvents = new Set<string>();

/**
 * Webhook endpoint para receber eventos do Stripe
 * 
 * IMPORTANTE: Este endpoint deve ser configurado no dashboard do Stripe
 * e protegido por validação de assinatura.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ Webhook sem assinatura");
    return NextResponse.json(
      { error: "Assinatura não fornecida" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ STRIPE_WEBHOOK_SECRET não configurada");
    return NextResponse.json(
      { error: "Configuração de webhook não disponível" },
      { status: 500 }
    );
  }

  // Inicializar Stripe
  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    console.error("❌ STRIPE_SECRET_KEY não configurada");
    return NextResponse.json(
      { error: "Configuração de pagamento não disponível" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Validar assinatura do webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("❌ Erro ao validar assinatura do webhook:", err.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  // Garantir idempotência: não processar o mesmo evento duas vezes
  if (processedEvents.has(event.id)) {
    console.log("⚠️ Evento já processado:", event.id);
    return NextResponse.json({ received: true, message: "Evento já processado" });
  }

  // Processar eventos específicos
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.canceled":
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`ℹ️ Evento não tratado: ${event.type}`);
    }

    // Marcar evento como processado (idempotência)
    processedEvents.add(event.id);

    console.log("✅ Webhook processado com sucesso:", event.id, event.type);

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("❌ Erro ao processar webhook:", error);
    // Não marcar como processado em caso de erro para permitir retry
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

/**
 * Trata evento de pagamento bem-sucedido
 * ATUALIZA EXCLUSIVAMENTE o status de pagamento via webhook Stripe
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error("❌ PaymentIntent sem orderId no metadata:", paymentIntent.id);
    return;
  }

  // Buscar pedido
  const order = getOrderById(orderId);
  if (!order) {
    console.error("❌ Pedido não encontrado:", orderId);
    return;
  }

  // Atualizar EXCLUSIVAMENTE o status de pagamento (única fonte de verdade)
  updatePaymentStatus(
    orderId,
    "pago",
    paymentIntent.id,
    `Pagamento confirmado via Stripe. PaymentIntent: ${paymentIntent.id}`
  );

  console.log("✅ Status de pagamento atualizado para 'pago':", orderId, "PaymentIntent:", paymentIntent.id);
}

/**
 * Trata evento de falha no pagamento
 * ATUALIZA EXCLUSIVAMENTE o status de pagamento via webhook Stripe
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error("❌ PaymentIntent sem orderId no metadata:", paymentIntent.id);
    return;
  }

  // Buscar pedido
  const order = getOrderById(orderId);
  if (!order) {
    console.error("❌ Pedido não encontrado:", orderId);
    return;
  }

  // Obter motivo da falha
  const failureMessage = paymentIntent.last_payment_error?.message || "Pagamento recusado";
  
  // Atualizar EXCLUSIVAMENTE o status de pagamento (única fonte de verdade)
  updatePaymentStatus(
    orderId,
    "recusado",
    paymentIntent.id,
    `Pagamento recusado via Stripe. Motivo: ${failureMessage}. PaymentIntent: ${paymentIntent.id}`
  );

  console.log("⚠️ Status de pagamento atualizado para 'recusado':", orderId, "PaymentIntent:", paymentIntent.id);
}

/**
 * Trata evento de cancelamento do pagamento
 * ATUALIZA EXCLUSIVAMENTE o status de pagamento via webhook Stripe
 */
async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error("❌ PaymentIntent sem orderId no metadata:", paymentIntent.id);
    return;
  }

  // Buscar pedido
  const order = getOrderById(orderId);
  if (!order) {
    console.error("❌ Pedido não encontrado:", orderId);
    return;
  }

  // Atualizar EXCLUSIVAMENTE o status de pagamento (única fonte de verdade)
  updatePaymentStatus(
    orderId,
    "cancelado",
    paymentIntent.id,
    `Pagamento cancelado via Stripe. PaymentIntent: ${paymentIntent.id}`
  );

  console.log("⚠️ Status de pagamento atualizado para 'cancelado':", orderId, "PaymentIntent:", paymentIntent.id);
}

