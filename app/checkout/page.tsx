'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';

import { useCart, CATALOG_MESSAGE } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

import {
  ArrowLeft,
  MapPin,
  Lock,
  Copy,
  CheckCircle2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isCatalogMode } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  // ===============================
  // CALCULAR TOTAL DO CARRINHO
  // ===============================
  const total = useMemo(() => {
    return items.reduce((sum: number, item: any) => {
      const price = item.price ?? item.preco ?? 0;
      const quantity = item.quantity ?? item.quantidade ?? 1;
      return sum + price * quantity;
    }, 0);
  }, [items]);

  // ===============================
  // DADOS PIX – DEFINITIVO
  // ===============================
  const PIX_KEY = '51999660753';
  const PIX_RECEIVER = 'Supermercado Atual';
  const PIX_BANK = 'Banrisul';
  const WHATSAPP_NUMBER = '5551999660753';

  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrinho');
      return;
    }
    // Bloquear acesso ao checkout em modo catálogo
    if (isCatalogMode) {
      showToast(CATALOG_MESSAGE, "info");
      router.push('/carrinho');
    }
  }, [items, router, isCatalogMode, showToast]);

  function copyPixKey() {
    navigator.clipboard.writeText(PIX_KEY);
    alert('Chave PIX copiada!');
  }

  function finalizarPedido() {
    if (isCatalogMode) {
      showToast(CATALOG_MESSAGE, "info");
      return;
    }
    const message = `
🛒 *Novo Pedido – Supermercado Atual*

👤 Cliente: ${user?.nome || 'Não informado'}
💰 Valor total: R$ ${total.toFixed(2)}

🏦 Banco: ${PIX_BANK}
🔑 Chave PIX (celular):
${PIX_KEY}

📌 Após o pagamento, envie o comprovante por aqui.
    `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, '_blank');
  }

  // Se estiver em modo catálogo, não renderizar o checkout
  if (isCatalogMode) {
    return (
      <>
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Indisponível</h1>
            <p className="text-gray-600 mb-6">{CATALOG_MESSAGE}</p>
            <Link
              href="/carrinho"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar ao Carrinho
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/carrinho"
          className="flex items-center gap-2 text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Voltar ao Carrinho
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* COLUNA ESQUERDA */}
          <div className="md:col-span-2 space-y-6">
            {/* ENDEREÇO */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin size={18} /> Endereço de Entrega
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Endereço cadastrado do usuário
              </p>
            </div>

            {/* PAGAMENTO */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Forma de Pagamento
              </h2>

              <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-300 p-4 text-sm text-yellow-800">
                <strong>Aviso:</strong> trabalhamos exclusivamente com pagamento
                via <strong>PIX</strong>. Após o pagamento, envie o comprovante
                pelo WhatsApp.
              </div>

              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Lock size={18} /> PIX – Aprovação imediata
                </div>

                <div className="bg-gray-100 p-3 rounded flex items-center justify-between">
                  <span className="text-sm break-all font-mono">
                    {PIX_KEY}
                  </span>
                  <button
                    onClick={copyPixKey}
                    className="flex items-center gap-1 text-sm text-blue-600"
                  >
                    <Copy size={14} /> Copiar
                  </button>
                </div>

                <p className="text-sm text-gray-700">
                  Recebedor: <strong>{PIX_RECEIVER}</strong><br />
                  Banco: <strong>{PIX_BANK}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* RESUMO */}
          <div className="border rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">
              Resumo do Pedido
            </h2>

            <p className="text-sm mb-2">
              Total: <strong>R$ {total.toFixed(2)}</strong>
            </p>

            <button
              onClick={finalizarPedido}
              className="w-full mt-6 bg-red-600 text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-red-700"
            >
              <CheckCircle2 size={18} />
              Finalizar Pedido
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
