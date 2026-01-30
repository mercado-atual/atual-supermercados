"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Loader2,
  ChevronRight,
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
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  address: {
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
  createdAt: string;
}

function buildGoogleMapsUrl(address: Order["address"]): string {
  const parts = [
    address.rua,
    address.numero,
    address.complemento,
    address.bairro,
    address.cidade,
    address.estado,
  ].filter(Boolean);
  const query = encodeURIComponent(parts.join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function buildWhatsAppUrl(phone: string, orderCode: string, customerName: string): string {
  const clean = phone.replace(/\D/g, "");
  const num = clean.length >= 10 ? `55${clean}` : clean;
  const msg = encodeURIComponent(
    `Olá ${customerName || "cliente"}! Seu pedido #${orderCode} foi confirmado. Em breve entraremos em contato. Obrigado, Atual Supermercados.`
  );
  return `https://wa.me/${num}?text=${msg}`;
}

function playNewOrderBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // fallback: optional beep via data URL or silent
  }
}

export default function AdminPedidosEsteiraPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const previousCountRef = useRef<number>(0);
  const previousIdsRef = useRef<Set<string>>(new Set());

  const loadOrders = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const list = data.orders as Order[];
        setOrders(list);

        const currentIds = new Set(list.map((o) => o.id));
        const prevIds = previousIdsRef.current;
        const hasNew =
          list.length > previousCountRef.current ||
          list.some((o) => !prevIds.has(o.id));
        if (hasNew && previousCountRef.current > 0) {
          playNewOrderBeep();
        }
        previousCountRef.current = list.length;
        previousIdsRef.current = currentIds;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 8000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

  const formatDate = (s: string) =>
    new Date(s).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Esteira de Pedidos
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadOrders();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 font-medium text-slate-700">Nenhum pedido ainda</p>
          <p className="text-sm text-slate-500">
            Os novos pedidos aparecerão aqui em tempo real.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const mapsUrl = buildGoogleMapsUrl(order.address);
            const whatsappUrl = order.customerPhone
              ? buildWhatsAppUrl(
                  order.customerPhone,
                  order.trackingCode,
                  order.customerName || "Cliente"
                )
              : null;
            const addressLine = [
              order.address.rua,
              order.address.numero,
              order.address.complemento,
              order.address.bairro,
              order.address.cidade,
              order.address.estado,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">
                        #{order.trackingCode}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {order.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900">
                      {order.customerName || "Cliente não informado"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatPrice(order.total)} · {order.items.length} item(ns)
                    </p>
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-600">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                      <span className="break-words">{addressLine}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                      <MapPin size={18} />
                      Ver no mapa
                    </a>
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        <MessageCircle size={18} />
                        Chamar no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
