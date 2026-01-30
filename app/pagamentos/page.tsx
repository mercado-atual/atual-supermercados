"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye,
  Package,
  RefreshCw,
  ArrowLeft
} from "lucide-react";

interface Order {
  id: string;
  trackingCode: string;
  status: 'aguardando_pagamento' | 'recebido' | 'aceito' | 'em_separacao' | 'saiu_entrega' | 'entregue' | 'cancelado';
  paymentStatus: 'aguardando_pagamento' | 'pago' | 'recusado' | 'cancelado'; // Status de pagamento (atualizado EXCLUSIVAMENTE via webhook Stripe)
  paymentMethod: string;
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  createdAt: string;
  updatedAt: string;
  paymentUpdatedAt?: string; // Data/hora da última atualização do status de pagamento
  notes?: string;
  paymentIntentId?: string; // ID do PaymentIntent na Stripe
}

type PaymentStatus = 'aguardando_pagamento' | 'pago' | 'recusado' | 'cancelado';

interface PaymentStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: any;
}

const paymentStatusConfig: Record<PaymentStatus, PaymentStatusConfig> = {
  aguardando_pagamento: {
    label: "Aguardando Pagamento",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100",
    icon: Clock,
  },
  pago: {
    label: "Pago",
    color: "text-green-800",
    bgColor: "bg-green-100",
    icon: CheckCircle2,
  },
  recusado: {
    label: "Recusado",
    color: "text-red-800",
    bgColor: "bg-red-100",
    icon: XCircle,
  },
  cancelado: {
    label: "Cancelado",
    color: "text-gray-800",
    bgColor: "bg-gray-100",
    icon: XCircle,
  },
};

// Usar diretamente o status de pagamento do pedido (atualizado EXCLUSIVAMENTE via webhook Stripe)
// O frontend apenas LÊ o status, nunca altera
function getPaymentStatus(order: Order): PaymentStatus {
  // O status de pagamento vem diretamente do banco, atualizado pelo webhook Stripe
  return order.paymentStatus || 'aguardando_pagamento';
}

export default function PagamentosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
    
    // Atualizar pedidos a cada 30 segundos
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      // Para uso operacional, usar token fixo ou autenticação simples
      const token = 'admin_secret_123'; // Em produção, usar autenticação adequada
      const response = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSepararPedido = async (orderId: string) => {
    try {
      const token = 'admin_secret_123'; // Em produção, usar autenticação adequada
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "em_separacao" }),
      });

      if (response.ok) {
        showToast("Pedido movido para separação", "success");
        loadOrders();
        setSelectedOrder(null);
      } else {
        showToast("Erro ao atualizar pedido", "error");
      }
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      showToast("Erro ao atualizar pedido", "error");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Cartão';
      case 'pix':
        return 'PIX';
      case 'credit':
        return 'Cartão';
      case 'debit':
        return 'Cartão';
      default:
        return method;
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    // Toast simples - pode integrar com ToastContext depois
    alert(message);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-red-700 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando pagamentos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-4"
            >
              <ArrowLeft size={18} />
              Voltar
            </Link>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Gestão de Pagamentos
            </h1>
            <p className="text-gray-600">
              Controle de pagamentos dos pedidos - ATUAL Supermercados
            </p>
          </div>

          {/* Tabela de Pagamentos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum pedido encontrado
                        </h3>
                        <p className="text-gray-600">
                          Ainda não há pedidos cadastrados.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      // Usar diretamente o status de pagamento (atualizado EXCLUSIVAMENTE via webhook Stripe)
                      const paymentStatus = getPaymentStatus(order);
                      const statusConfig = paymentStatusConfig[paymentStatus];
                      const StatusIcon = statusConfig.icon;
                      const canSeparate = paymentStatus === 'pago';

                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-gray-900">
                              #{order.trackingCode}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {order.customerName || "Não informado"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-900">
                              {formatPrice(order.total)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {getPaymentMethodLabel(order.paymentMethod)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.color}`}
                            >
                              <StatusIcon size={14} />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {canSeparate ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSepararPedido(order.id);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                <Package size={16} />
                                Separar Pedido
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Detalhes do Pagamento */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">
                  Detalhes do Pagamento
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status do Pagamento */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Status do Pagamento</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {(() => {
                    // Usar diretamente o status de pagamento (atualizado EXCLUSIVAMENTE via webhook Stripe)
                    const paymentStatus = getPaymentStatus(selectedOrder);
                    const statusConfig = paymentStatusConfig[paymentStatus];
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${statusConfig.bgColor} ${statusConfig.color}`}
                        >
                          <StatusIcon size={20} />
                          {statusConfig.label}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Método de Pagamento */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Método de Pagamento</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-medium text-gray-900">
                    {getPaymentMethodLabel(selectedOrder.paymentMethod)}
                  </p>
                </div>
              </div>

              {/* Data/Hora */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Data e Hora</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Criado em:</strong> {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Última atualização do pagamento:</strong> {selectedOrder.paymentUpdatedAt ? formatDate(selectedOrder.paymentUpdatedAt) : formatDate(selectedOrder.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Gateway */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Gateway</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-medium text-gray-900">Stripe</p>
                </div>
              </div>

              {/* Informações do Pedido */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Informações do Pedido</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p>
                    <strong>Pedido:</strong> #{selectedOrder.trackingCode}
                  </p>
                  <p>
                    <strong>Cliente:</strong> {selectedOrder.customerName || "Não informado"}
                  </p>
                  <p>
                    <strong>Valor Total:</strong> {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {getPaymentStatus(selectedOrder) === 'pago' && (
                  <button
                    onClick={() => {
                      handleSepararPedido(selectedOrder.id);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Package size={20} />
                    Separar Pedido
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

