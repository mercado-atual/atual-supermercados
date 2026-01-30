"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RefreshCw, Package, ShoppingBag } from "lucide-react";

export default function AdminPage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<{ total?: number; error?: string } | null>(null);

  const loadLastSync = async () => {
    try {
      const res = await fetch("/api/ofertas");
      const data = await res.json();
      setLastSync(data.lastSync || null);
    } catch {
      setLastSync(null);
    }
  };

  useEffect(() => {
    loadLastSync();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sync/sysmo");
      const data = await res.json();
      if (data.ok) {
        setSyncResult({ total: data.total });
        setLastSync(data.lastSync || new Date().toISOString());
      } else {
        setSyncResult({ error: data.error || "Erro ao sincronizar" });
      }
    } catch (e) {
      setSyncResult({ error: e instanceof Error ? e.message : "Erro ao sincronizar" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-gray-50">
      {/* Barra admin */}
      <div className="bg-gray-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold">Painel Admin</span>
        <nav className="flex items-center gap-4">
          <Link href="/admin/produtos" className="text-sm hover:underline flex items-center gap-1">
            <Package size={16} /> Produtos
          </Link>
          <Link href="/admin/pedidos" className="text-sm hover:underline flex items-center gap-1">
            <ShoppingBag size={16} /> Pedidos
          </Link>
          <Link href="/" className="text-sm hover:underline">Site</Link>
        </nav>
      </div>

      {/* Sincronização Sysmo */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Sincronização Sysmo</h2>
          <p className="text-sm text-gray-600 mb-4">
            Atualiza produtos, preços e ofertas do Sysmo. O cron executa a cada 30 minutos.
          </p>
          {lastSync && (
            <p className="text-xs text-gray-500 mb-4">
              Última sincronização: {new Date(lastSync).toLocaleString("pt-BR")}
            </p>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Sincronizando..." : "Sincronizar Sysmo agora"}
          </button>
          {syncResult?.total != null && (
            <p className="text-sm text-green-700 mt-3">✓ {syncResult.total} produtos atualizados.</p>
          )}
          {syncResult?.error && (
            <p className="text-sm text-red-700 mt-3">✗ {syncResult.error}</p>
          )}
        </div>
      </section>

      {/* HERO ADEGA */}
      <section className="relative h-[75vh] w-full overflow-hidden">

        {/* Foto REAL da adega */}
        <Image
          src="/adega/03_vinhos.jpg"
          alt="Adega Atual Supermercados"
          fill
          priority
          className="object-cover"
        />

        {/* Gradiente leve (não escurece a foto) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

        {/* Texto */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-2xl">
            ADEGA ATUAL<br />SUPERMERCADOS
          </h1>

          <p className="mt-4 text-white text-lg md:text-xl drop-shadow-lg max-w-2xl">
            Qualidade e variedade para quem aprecia bons momentos.
          </p>

          <p className="mt-6 text-white/90 text-sm drop-shadow">
            Beba com moderação. Venda proibida para menores de 18 anos.
          </p>
        </div>
      </section>

      {/* ===== DESTAQUES ===== */}
      <section className="bg-white py-14 px-6">
        <h2 className="text-zinc-900 text-3xl font-bold text-center mb-10">
          Destaques da Adega
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">

          <Categoria titulo="Whiskys" imagem="/adega/02_whisky.jpg" />
          <Categoria titulo="Vinhos" imagem="/adega/03_vinhos.jpg" />
          <Categoria titulo="Gins" imagem="/adega/04_gins.jpg" />
          <Categoria titulo="Variedade" imagem="/adega/05_prateleira.jpg" />

        </div>
      </section>

    </main>
  );
}


function Categoria({
  titulo,
  imagem,
}: {
  titulo: string;
  imagem: string;
}) {
  return (
    <div className="relative h-72 rounded-xl overflow-hidden group cursor-pointer shadow-lg">

      <Image
        src={imagem}
        alt={titulo}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
        <span className="text-white text-lg font-semibold drop-shadow">
          {titulo}
        </span>
      </div>

    </div>
  );
}
