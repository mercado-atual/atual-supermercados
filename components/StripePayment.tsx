"use client";

import { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Loader2, CheckCircle2, AlertCircle, Lock } from "lucide-react";

// Inicializar Stripe com a chave pública
// IMPORTANTE: Verificar se a chave existe no runtime do browser
const publishableKey = typeof window !== "undefined" 
  ? (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")
  : "";

// Log para debug (apenas em desenvolvimento)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔑 Stripe Publishable Key:", publishableKey ? "✅ Configurada" : "❌ NÃO configurada");
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface StripePaymentProps {
  clientSecret: string;
  paymentMethod: "card" | "pix";
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
}

function PaymentForm({
  clientSecret,
  paymentMethod,
  onSuccess,
  onError,
  amount,
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "succeeded" | "failed"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [pixQrCode, setPixQrCode] = useState<string>("");
  const [pixStatus, setPixStatus] = useState<string>("");
  const [hasProcessed, setHasProcessed] = useState(false); // Bloquear múltiplos processamentos

  useEffect(() => {
    if (!stripe || !clientSecret) return;

    // Para PIX, obter dados do pagamento e verificar status periodicamente
    if (paymentMethod === "pix") {
      const initializePix = async () => {
        try {
          const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
          
          if (paymentIntent.paymentIntent) {
            const status = paymentIntent.paymentIntent.status;
            setPixStatus(status);

            // Obter QR Code PIX se disponível
            if (paymentIntent.paymentIntent.next_action?.type === "display_bank_transfer_details") {
              const details = (paymentIntent.paymentIntent.next_action as any).display_bank_transfer_details;
              if (details?.hosted_voucher_url) {
                setPixQrCode(details.hosted_voucher_url);
              }
            }

            // Se o pagamento foi confirmado, mostrar sucesso (apenas uma vez)
            if (status === "succeeded" && !hasProcessed) {
              setPaymentStatus("succeeded");
              setHasProcessed(true);
              onSuccess();
            }
          }
        } catch (error) {
          console.error("Erro ao inicializar PIX:", error);
        }
      };

      initializePix();

      // Verificar status a cada 3 segundos
      const checkPaymentStatus = async () => {
        try {
          const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
          
          if (paymentIntent.paymentIntent) {
            const status = paymentIntent.paymentIntent.status;
            setPixStatus(status);

            // Aceitar apenas estados terminais: succeeded ou requires_action
            if (status === "succeeded" && !hasProcessed) {
              setPaymentStatus("succeeded");
              setHasProcessed(true);
              onSuccess();
            } else if (status === "requires_action") {
              // Estado intermediário - aguardar ação do usuário
              setPixStatus(status);
            }
          }
        } catch (error) {
          console.error("Erro ao verificar status do pagamento:", error);
        }
      };

      const interval = setInterval(checkPaymentStatus, 3000);

      return () => clearInterval(interval);
    }
    // hasProcessed omitido de propósito: não reexecutar o efeito ao mudar (evita re-iniciar intervalo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, clientSecret, paymentMethod, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // BLOQUEAR múltiplos submits
    if (isProcessing || hasProcessed || paymentStatus === "succeeded") {
      console.log("⚠️ Tentativa de submit duplicado bloqueada");
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    setPaymentStatus("processing");

    try {
      if (paymentMethod === "card") {
        // Para cartão, confirmar pagamento
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: window.location.origin + "/pedido-confirmado",
          },
          redirect: "if_required",
        });

        if (error) {
          setPaymentStatus("failed");
          setErrorMessage(error.message || "Erro ao processar pagamento");
          onError(error.message || "Erro ao processar pagamento");
        } else if (paymentIntent) {
          // Aceitar apenas estados terminais: succeeded ou requires_action
          if (paymentIntent.status === "succeeded" && !hasProcessed) {
            setPaymentStatus("succeeded");
            setHasProcessed(true);
            onSuccess();
          } else if (paymentIntent.status === "requires_action") {
            // Estado intermediário - aguardar ação do usuário
            setPaymentStatus("processing");
          } else {
            // Outros estados não são terminais - manter processando
            setPaymentStatus("processing");
          }
        }
      } else if (paymentMethod === "pix") {
        // Para PIX, o pagamento é confirmado automaticamente quando o QR Code é escaneado
        // Não precisa chamar confirmPayment manualmente
        // O status será atualizado via polling no useEffect
      }
    } catch (error: any) {
      setPaymentStatus("failed");
      const message = error.message || "Erro ao processar pagamento";
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentMethod === "pix") {
    return (
      <div className="space-y-4">
        {/* PaymentElement para PIX - exibe QR Code automaticamente */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>

        {/* Status do pagamento */}
        {pixStatus && (
          <div className="mb-4">
            {pixStatus === "succeeded" ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-green-800">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">Pagamento confirmado!</span>
                </div>
              </div>
            ) : pixStatus === "requires_payment_method" ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Aguardando pagamento...</strong>
                  <br />
                  Escaneie o QR Code acima com seu app de pagamento.
                  <br />
                  O status será atualizado automaticamente após o pagamento.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Status: {pixStatus}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Valor */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-1">Valor a pagar:</p>
          <p className="text-2xl font-black text-gray-900">
            R$ {amount.toFixed(2).replace(".", ",")}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              <span className="text-sm">{errorMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Para cartão
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle size={20} />
            <span className="text-sm">{errorMessage}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || paymentStatus === "succeeded"}
        className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processando pagamento...
          </>
        ) : paymentStatus === "succeeded" ? (
          <>
            <CheckCircle2 size={20} />
            Pagamento confirmado!
          </>
        ) : (
          <>
            <Lock size={20} />
            Pagar R$ {amount.toFixed(2).replace(".", ",")}
          </>
        )}
      </button>
    </form>
  );
}

export default function StripePayment({
  clientSecret,
  paymentMethod,
  onSuccess,
  onError,
  amount,
}: StripePaymentProps) {
  // Logs para debug (apenas em desenvolvimento)
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log("💳 StripePayment renderizado:", {
      hasClientSecret: !!clientSecret,
      clientSecretLength: clientSecret?.length || 0,
      paymentMethod,
      hasPublishableKey: !!publishableKey,
    });
  }

  // VALIDAÇÃO CRÍTICA: NÃO renderizar se clientSecret for null/undefined/empty
  if (!clientSecret || clientSecret.trim() === "") {
    console.error("❌ StripePayment: clientSecret inválido ou ausente");
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-gray-400" size={32} />
          <p className="text-gray-600">Aguardando preparação do pagamento...</p>
          <p className="text-xs text-gray-500 mt-2">clientSecret não recebido do servidor</p>
        </div>
      </div>
    );
  }

  // VALIDAÇÃO CRÍTICA: Garantir que stripePromise seja válido
  if (!stripePromise || !publishableKey) {
    console.error("❌ StripePayment: publishableKey não configurada");
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={32} />
          <p className="text-red-600 font-bold">Erro de configuração</p>
          <p className="text-sm text-red-500 mt-2">
            Chave pública do Stripe não encontrada. Verifique a variável NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
          </p>
        </div>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#dc2626", // red-600
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#dc2626",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  // Renderizar APENAS com Elements e PaymentElement
  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        clientSecret={clientSecret}
        paymentMethod={paymentMethod}
        onSuccess={onSuccess}
        onError={onError}
        amount={amount}
      />
    </Elements>
  );
}

