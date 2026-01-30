"use client";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useCart, CATALOG_MESSAGE } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { ProductImage } from "@/components/ProductImage";
import { ShoppingCart, Sparkles, RefreshCw, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CATALOG_BUTTON_TEXT_SHORT } from "@/lib/catalog-config";

interface ProdutoVitrine {
  id: string;
  title: string;
  price: string;
  unit: string;
  image?: string;
  marca?: string;
  badge?: string;
}

interface Bloco {
  id: string;
  label: string;
  produtos: ProdutoVitrine[];
}

export default function OfertasPage() {
  const { addToCart, isCatalogMode } = useCart();
  const { showToast } = useToast();
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOfertas = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cache no servidor já está implementado (30s), aqui só busca
      const res = await fetch("/api/ofertas");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao carregar ofertas");
      setBlocos(data.blocos || []);
      setLastSync(data.lastSync || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar ofertas");
      setBlocos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfertas();
  }, []);

  const buttonTitle = isCatalogMode ? "Disponível na loja" : "Adicionar ao carrinho";

  const handleAddToCart = (product: ProdutoVitrine) => {
    if (isCatalogMode) {
      showToast(CATALOG_MESSAGE, "info");
      return;
    }
    const p = {
      id: product.id,
      title: product.title,
      price: product.price,
      unit: product.unit,
      image: product.image,
      category: "ofertas",
      marca: product.marca,
    };
    addToCart(p);
    showToast(`${product.title} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <section className="bg-gradient-to-r from-red-600 via-red-700 to-yellow-500 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-yellow-300" size={32} />
            <h1 className="text-4xl md:text-5xl font-black">OFERTAS DA SEMANA</h1>
            <Sparkles className="text-yellow-300" size={32} />
          </div>
          <p className="text-xl font-medium text-red-100 mb-2">Aproveite os melhores preços!</p>
          {lastSync && (
            <p className="text-sm text-red-200">
              Atualizado em: {new Date(lastSync).toLocaleString("pt-BR")}
            </p>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 flex-1">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
            <RefreshCw className="animate-spin" size={24} />
            <span>Carregando ofertas...</span>
          </div>
        )}

        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-center mb-6">
            <p>{error}</p>
            <button
              onClick={loadOfertas}
              className="mt-2 text-amber-700 underline font-medium"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && blocos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhuma oferta disponível no momento.</p>
            <p className="text-sm mt-1">As ofertas são atualizadas a cada 30 minutos a partir do Sysmo.</p>
          </div>
        )}

        {!loading && !error && blocos.length > 0 && (
          <div className="space-y-12">
            {blocos.map(
              (bloco) =>
                bloco.produtos.length > 0 && (
                  <section key={bloco.id}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
                      {bloco.label}
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                      {bloco.produtos.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg shadow-sm border-2 border-yellow-400 overflow-hidden flex flex-col relative group hover:shadow-lg transition-all"
                        >
                          {product.badge && (
                            <span className="absolute top-1 left-1 bg-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded text-red-900 z-10">
                              {product.badge}
                            </span>
                          )}

                          <Link
                            href={`/produto/${product.id}`}
                            className="block relative w-full aspect-square cursor-pointer overflow-hidden"
                          >
                            <ProductImage
                              product={{ ...product, category: "ofertas" }}
                              size="card"
                              className="w-full h-full"
                            />
                          </Link>

                          <div className="p-2 flex flex-col justify-between flex-1 min-h-0">
                            <div className="min-w-0">
                              <Link href={`/produto/${product.id}`}>
                                <h4 className="text-xs font-medium leading-tight mb-0.5 line-clamp-2 text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                                  {product.title}
                                </h4>
                              </Link>
                              <p className="text-[10px] text-gray-600 font-semibold mt-0.5 truncate">
                                {product.marca ? product.marca : "—"}
                              </p>
                              <span className="text-[10px] text-gray-400">{product.unit}</span>
                            </div>

                            <div className="flex items-center justify-between mt-2 gap-1">
                              <span className="text-sm font-bold text-red-700 truncate">
                                R$ {product.price}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                                className="bg-red-600 active:bg-red-800 text-white p-1.5 rounded-full transition-colors shadow-sm hover:scale-110 active:scale-95 shrink-0"
                                title={buttonTitle}
                              >
                                <ShoppingCart size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
