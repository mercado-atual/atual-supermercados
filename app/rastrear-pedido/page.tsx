"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useToast } from "@/contexts/ToastContext";
import { Package, CheckCircle2, Clock, Truck, MapPin, Search, Loader2 } from "lucide-react";
import Link from "next/link";

interface OrderStatus {
  id: string;
  status: "recebido" | "aceito" | "separacao" | "saiu_entrega" | "entregue" | "cancelado";
  statusLabel: string;
  estimatedTime?: string;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  recebido: {
    label: "Pedido Recebido",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Seu pedido foi recebido e está sendo processado",
  },
  aceito: {
    label: "Pedido Aceito",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Pedido confirmado e em preparação",
  },
  separacao: {
    label: "Em Separação",
    icon: Package,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    description: "Produtos estão sendo separados no estoque",
  },
  saiu_entrega: {
    label: "Saiu para Entrega",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Seu pedido está a caminho",
  },
  entregue: {
    label: "Entregue",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Pedido entregue com sucesso!",
  },
  cancelado: {
    label: "Cancelado",
    icon: Clock,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    description: "Pedido foi cancelado",
  },
};

const statusOrder = ["recebido", "aceito", "separacao", "saiu_entrega", "entregue"];

function RastrearPedidoContent() {
  const searchParams = useSearchParams();
  const [trackingCode, setTrackingCode] = useState("");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  // Buscar código de rastreamento da URL
  useEffect(() => {
    const code = searchParams?.get("codigo");
    if (code) {
      setTrackingCode(code);
      fetchOrderStatus(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Atualização em tempo real
  useEffect(() => {
    if (!order || order.status === "entregue" || order.status === "cancelado") {
      return;
    }

    const interval = setInterval(() => {
      fetchOrderStatus(order.trackingCode);
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, [order]);

  const fetchOrderStatus = async (code: string) => {
    try {
      const response = await fetch(`/api/orders/track?code=${code}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "Pedido não encontrado");
        setOrder(null);
      }
    } catch (err) {
      console.error("Erro ao buscar pedido:", err);
      setError("Erro ao buscar informações do pedido");
    }
  };

  const handleSearch = async (code?: string) => {
    const codeToSearch = code || trackingCode.trim();
    
    if (!codeToSearch) {
      showToast("Digite um código de rastreamento", "error");
      return;
    }

    setLoading(true);
    setError("");
    
    await fetchOrderStatus(codeToSearch);
    
    setLoading(false);
  };

  const getStatusIndex = (status: string) => {
    return statusOrder.indexOf(status);
  };

  const isStatusCompleted = (status: string, currentStatus: string) => {
    const currentIndex = getStatusIndex(currentStatus);
    const statusIndex = getStatusIndex(status);
    return statusIndex <= currentIndex;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Rastrear Pedido
            </h1>
            <p className="text-gray-600">
              Acompanhe seu pedido em tempo real
            </p>
          </div>

          {/* Busca */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Digite o código de rastreamento"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Rastrear
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Status do Pedido */}
          {order && (
            <div className="space-y-6">
              {/* Cabeçalho do Pedido */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Código de Rastreamento</p>
                    <p className="text-2xl font-black text-gray-900">{order.trackingCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Pedido Realizado</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline de Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Status do Pedido</h2>
                
                <div className="space-y-6">
                  {statusOrder.map((status, index) => {
                    const config = statusConfig[status as keyof typeof statusConfig];
                    const Icon = config.icon;
                    const isCompleted = isStatusCompleted(status, order.status);
                    const isCurrent = order.status === status;
                    const isLast = index === statusOrder.length - 1;

                    return (
                      <div key={status} className="flex gap-4">
                        {/* Linha Vertical */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted
                                ? `${config.bgColor} ${config.borderColor} ${config.color}`
                                : "bg-gray-100 border-gray-300 text-gray-400"
                            } ${isCurrent ? "ring-4 ring-offset-2 ring-red-200" : ""}`}
                          >
                            <Icon size={24} />
                          </div>
                          {!isLast && (
                            <div
                              className={`w-0.5 h-16 mt-2 ${
                                isCompleted ? config.bgColor : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 pb-6">
                          <div
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isCompleted
                                ? `${config.bgColor} ${config.borderColor}`
                                : "bg-gray-50 border-gray-200"
                            } ${isCurrent ? "ring-2 ring-red-200" : ""}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3
                                className={`text-lg font-bold ${
                                  isCompleted ? config.color : "text-gray-500"
                                }`}
                              >
                                {config.label}
                              </h3>
                              {isCurrent && (
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                  ATUAL
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{config.description}</p>
                            {isCurrent && order.updatedAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Atualizado em:{" "}
                                {new Date(order.updatedAt).toLocaleString("pt-BR")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informações Adicionais */}
              {order.status === "saiu_entrega" && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-purple-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Pedido em Trânsito
                      </h3>
                      <p className="text-gray-700 mb-2">
                        Seu pedido saiu para entrega e deve chegar em breve!
                      </p>
                      {order.estimatedTime && (
                        <p className="text-sm text-gray-600">
                          Tempo estimado: {order.estimatedTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Ajuda */}
              <div className="text-center">
                <Link
                  href="/ajuda"
                  className="text-red-600 hover:text-red-700 font-medium underline"
                >
                  Precisa de ajuda? Entre em contato
                </Link>
              </div>
            </div>
          )}

          {/* Instruções */}
          {!order && !error && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Como rastrear seu pedido?
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Digite o código de rastreamento recebido por e-mail ou SMS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Clique em "Rastrear" para ver o status atualizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>O status é atualizado automaticamente a cada 5 segundos</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RastrearPedidoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    }>
      <RastrearPedidoContent />
    </Suspense>
  );
}
