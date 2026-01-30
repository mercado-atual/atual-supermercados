"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  AlertTriangle,
  Package,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";

type EstoqueCriticoItem = {
  codigo: string;
  descricao: string;
  estoque: number;
  preco: number;
};

type DashboardData = {
  faturamentoHoje: number;
  totalPedidosHoje: number;
  estoqueCritico: EstoqueCriticoItem[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const load = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const json = await res.json();
        if (json.success) {
          setData({
            faturamentoHoje: json.faturamentoHoje ?? 0,
            totalPedidosHoje: json.totalPedidosHoje ?? 0,
            estoqueCritico: json.estoqueCritico ?? [],
          });
        } else {
          setError("Erro ao carregar dashboard");
        }
      } catch {
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        {error}
      </div>
    );
  }

  const d = data!;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/scanner"
        className="block w-full rounded-2xl border-2 border-slate-800 bg-slate-800 px-6 py-8 text-center text-xl font-bold text-white shadow-lg transition hover:bg-slate-700 hover:shadow-xl sm:py-10 sm:text-2xl md:text-3xl"
      >
        📷 ABRIR SCANNER AGORA
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Faturamento hoje
              </p>
              <p className="text-2xl font-bold text-slate-900">
                R$ {d.faturamentoHoje.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Pedidos hoje
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {d.totalPedidosHoje}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Itens em estoque crítico
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {d.estoqueCritico.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Package size={20} />
            Estoque crítico (&lt; 5 unidades)
          </h2>
        </div>
        <div className="overflow-x-auto">
          {d.estoqueCritico.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500">
              Nenhum item em estoque crítico.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {d.estoqueCritico.map((item) => (
                <li
                  key={item.codigo}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.descricao}</p>
                    <p className="text-xs text-slate-500">
                      Código: {item.codigo}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${
                        item.estoque === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.estoque} un
                    </span>
                    <span className="text-sm text-slate-600">
                      R$ {item.preco.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
