// Sistema de armazenamento de pedidos (simulado - em produção usar banco de dados)

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

export interface OrderAddress {
  cep?: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export type OrderStatus = 'aguardando_pagamento' | 'recebido' | 'aceito' | 'em_separacao' | 'saiu_entrega' | 'entregue' | 'cancelado';

export type PaymentStatus = 'aguardando_pagamento' | 'pago' | 'recusado' | 'cancelado';

export interface Order {
  id: string;
  trackingCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus; // Status do pagamento (atualizado EXCLUSIVAMENTE via webhook Stripe)
  items: OrderItem[];
  address: OrderAddress;
  paymentMethod: string;
  total: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCPF?: string;
  createdAt: string;
  updatedAt: string;
  paymentUpdatedAt?: string; // Data/hora da última atualização do status de pagamento
  notes?: string;
  paymentIntentId?: string; // ID do PaymentIntent na Stripe
}

// Armazenamento em memória (em produção usar banco de dados)
let ordersStorage: Order[] = [];

// Função para inicializar com alguns pedidos de exemplo (apenas para desenvolvimento)
export function initializeOrders() {
  if (typeof window === 'undefined' && ordersStorage.length === 0) {
    // Apenas no servidor, adicionar alguns pedidos de exemplo
    ordersStorage = [
      {
        id: 'order_1',
        trackingCode: 'ATUAL123456',
        status: 'recebido',
        paymentStatus: 'pago',
        items: [
          { id: '1', title: 'Tomate Italiano', quantity: 2, price: 5.99 },
          { id: '2', title: 'Banana Prata', quantity: 1, price: 3.49 },
        ],
        address: {
          rua: 'Rua Exemplo',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
        },
        paymentMethod: 'pix',
        total: 15.47,
        customerName: 'João Silva',
        customerPhone: '(11) 99999-9999',
        customerEmail: 'joao@email.com',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        paymentUpdatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  }
}

// Funções para gerenciar pedidos
export function getAllOrders(): Order[] {
  initializeOrders();
  return [...ordersStorage].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id: string): Order | undefined {
  initializeOrders();
  return ordersStorage.find(order => order.id === id);
}

export function getOrderByTrackingCode(trackingCode: string): Order | undefined {
  initializeOrders();
  return ordersStorage.find(order => order.trackingCode === trackingCode);
}

export function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'paymentStatus' | 'paymentUpdatedAt'>): Order {
  initializeOrders();
  const newOrder: Order = {
    ...order,
    id: `order_${Date.now()}`,
    paymentStatus: 'aguardando_pagamento', // Status inicial sempre aguardando_pagamento
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentUpdatedAt: new Date().toISOString(),
  };
  ordersStorage.push(newOrder);
  return newOrder;
}

export function updateOrderStatus(id: string, status: OrderStatus, notes?: string): Order | null {
  initializeOrders();
  const orderIndex = ordersStorage.findIndex(order => order.id === id);
  if (orderIndex === -1) return null;
  
  ordersStorage[orderIndex] = {
    ...ordersStorage[orderIndex],
    status,
    updatedAt: new Date().toISOString(),
    notes: notes || ordersStorage[orderIndex].notes,
  };
  
  return ordersStorage[orderIndex];
}

/**
 * Atualiza APENAS o status de pagamento (chamado EXCLUSIVAMENTE pelo webhook Stripe)
 * Esta função é a única fonte de verdade para o status de pagamento
 */
export function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
  paymentIntentId?: string,
  notes?: string
): Order | null {
  initializeOrders();
  const orderIndex = ordersStorage.findIndex(order => order.id === id);
  if (orderIndex === -1) return null;
  
  ordersStorage[orderIndex] = {
    ...ordersStorage[orderIndex],
    paymentStatus,
    paymentUpdatedAt: new Date().toISOString(),
    paymentIntentId: paymentIntentId || ordersStorage[orderIndex].paymentIntentId,
    notes: notes || ordersStorage[orderIndex].notes,
    // Atualizar status do pedido baseado no status de pagamento
    status: paymentStatus === 'pago' ? 'recebido' : 
            paymentStatus === 'recusado' || paymentStatus === 'cancelado' ? 'cancelado' :
            ordersStorage[orderIndex].status,
    updatedAt: new Date().toISOString(),
  };
  
  return ordersStorage[orderIndex];
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  initializeOrders();
  return ordersStorage.filter(order => order.status === status);
}

// Exportar storage para uso em API routes
export { ordersStorage };



