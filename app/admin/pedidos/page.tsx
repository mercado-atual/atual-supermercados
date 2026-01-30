"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  LogOut,
  RefreshCw,
  Eye,
  Edit
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  trackingCode: string;
  status: 'recebido' | 'aceito' | 'em_separacao' | 'saiu_entrega' | 'entregue' | 'cancelado';
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
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  recebido: { label: "Recebido", icon: Package, color: "bg-blue-100 text-blue-800" },
  aceito: { label: "Aceito", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  em_separacao: { label: "Em Separação", icon: Package, color: "bg-yellow-100 text-yellow-800" },
  saiu_entrega: { label: "Saiu para Entrega", icon: Truck, color: "bg-purple-100 text-purple-800" },
  entregue: { label: "Entregue", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", icon: XCircle, color: "bg-red-100 text-red-800" },
};

export default function AdminPedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadOrders();
    
    // Atualizar pedidos a cada 30 segundos
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `/api/admin/orders${filter !== "all" ? `?status=${filter}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
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

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow: Record<string, Order['status']> = {
      recebido: "aceito",
      aceito: "em_separacao",
      em_separacao: "saiu_entrega",
      saiu_entrega: "entregue",
    };
    return statusFlow[currentStatus] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-red-700 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Gerenciamento de Pedidos - ATUAL Supermercados
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/produtos"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Produtos
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-red-700 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todos ({orders.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = orders.filter((o) => o.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  filter === key
                    ? "bg-red-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <config.icon className="w-4 h-4" />
                {config.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-600">
                {filter === "all"
                  ? "Ainda não há pedidos cadastrados."
                  : `Não há pedidos com status "${statusConfig[filter as keyof typeof statusConfig]?.label}"`}
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;
              const nextStatus = getNextStatus(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-lg text-gray-900">
                          #{order.trackingCode}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <strong>Cliente:</strong> {order.customerName || "Não informado"}
                        </div>
                        <div>
                          <strong>CPF:</strong> {order.customerCPF || "Não informado"}
                        </div>
                        <div>
                          <strong>Telefone:</strong> {order.customerPhone || "Não informado"}
                        </div>
                        <div>
                          <strong>E-mail:</strong> {order.customerEmail || "Não informado"}
                        </div>
                        <div>
                          <strong>Endereço:</strong> {order.address.rua}, {order.address.numero} - {order.address.bairro}
                        </div>
                        <div>
                          <strong>Cidade:</strong> {order.address.cidade}/{order.address.estado}
                        </div>
                        <div>
                          <strong>Pagamento:</strong> {order.paymentMethod === 'pix' ? 'PIX' : order.paymentMethod === 'credit' ? 'Cartão de Crédito' : order.paymentMethod === 'debit' ? 'Cartão de Débito' : order.paymentMethod}
                        </div>
                        <div>
                          <strong>Data:</strong> {formatDate(order.createdAt)}
                        </div>
                      </div>

                      <div className="mt-3">
                        <strong className="text-gray-700">Itens:</strong>
                        <ul className="mt-1 space-y-1">
                          {order.items.map((item) => (
                            <li key={item.id} className="text-sm text-gray-600">
                              {item.quantity}x {item.title} - {formatPrice(item.price)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3">
                        <strong className="text-lg text-red-700">
                          Total: {formatPrice(order.total)}
                        </strong>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </button>
                      {nextStatus && (
                        <button
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Avançar Status
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">
                  Pedido #{selectedOrder.trackingCode}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Informações do Cliente</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><strong>Nome:</strong> {selectedOrder.customerName || "Não informado"}</p>
                  <p><strong>CPF:</strong> {selectedOrder.customerCPF || "Não informado"}</p>
                  <p><strong>E-mail:</strong> {selectedOrder.customerEmail || "Não informado"}</p>
                  <p><strong>Telefone:</strong> {selectedOrder.customerPhone || "Não informado"}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Endereço de Entrega</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p>
                    {selectedOrder.address.rua}, {selectedOrder.address.numero}
                    {selectedOrder.address.complemento && ` - ${selectedOrder.address.complemento}`}
                  </p>
                  <p>
                    {selectedOrder.address.bairro} - {selectedOrder.address.cidade}/{selectedOrder.address.estado}
                  </p>
                  {selectedOrder.address.cep && <p>CEP: {selectedOrder.address.cep}</p>}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Itens do Pedido</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity}x {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-bold">
                        {formatPrice(item.quantity * item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-black text-red-700">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Forma de pagamento: {selectedOrder.paymentMethod === 'pix' ? 'PIX' : selectedOrder.paymentMethod === 'credit' ? 'Cartão de Crédito' : selectedOrder.paymentMethod === 'debit' ? 'Cartão de Débito' : selectedOrder.paymentMethod}
                </p>
              </div>

              <div className="flex gap-2">
                {getNextStatus(selectedOrder.status) && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Avançar para {statusConfig[getNextStatus(selectedOrder.status)!].label}
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
    </div>
  );
}

