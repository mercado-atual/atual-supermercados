"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { CheckCircle2, Package, Copy, Share2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

function PedidoConfirmadoContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const trackingCode = searchParams?.get("codigo") || "";

  const copyTrackingCode = () => {
    navigator.clipboard.writeText(trackingCode);
    showToast("Código copiado para a área de transferência!");
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: "Meu Pedido ATUAL Supermercados",
        text: `Rastreie meu pedido: ${trackingCode}`,
        url: `${window.location.origin}/rastrear-pedido?codigo=${trackingCode}`,
      });
    } else {
      copyTrackingCode();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="text-green-600" size={48} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Pedido Confirmado!
            </h1>
            <p className="text-lg text-gray-600">
              Seu pedido foi recebido e está sendo processado
            </p>
          </div>

          {trackingCode && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Package className="text-gray-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Código de Rastreamento</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-3xl font-black text-red-700 tracking-wider">{trackingCode}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={copyTrackingCode}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Copy size={18} />
                  Copiar
                </button>
                <button
                  onClick={shareOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Share2 size={18} />
                  Compartilhar
                </button>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-2">O que acontece agora?</h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Você receberá um e-mail de confirmação em breve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Seu pedido será preparado e separado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Você receberá atualizações por e-mail e SMS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Quando sair para entrega, você será notificado</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/rastrear-pedido?codigo=${trackingCode}`}
              className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
            >
              <Package size={20} />
              Rastrear Pedido
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    }>
      <PedidoConfirmadoContent />
    </Suspense>
  );
}



