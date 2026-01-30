"use client";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useCart, CATALOG_MESSAGE } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { ProductImage } from "@/components/ProductImage";
import { ShoppingCart, Search, Package } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CATALOG_BUTTON_TEXT_SHORT } from "@/lib/catalog-config";

interface Product {
  id: string;
  title: string;
  price: string;
  unit: string;
  image?: string;
  marca?: string;
  category: string;
}

function BuscaPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const { addToCart, isCatalogMode } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products || []);
        } else {
          setError(data.error || "Erro ao buscar");
          setProducts([]);
        }
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Erro ao buscar");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleAddToCart = (product: Product) => {
    if (isCatalogMode) {
      showToast(CATALOG_MESSAGE, "info");
      return;
    }
    addToCart(product);
    showToast(`${product.title} adicionado ao carrinho!`);
  };

  const buttonTitle = isCatalogMode ? "Disponível na loja" : "Adicionar ao carrinho";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {query ? `Resultados para "${query}"` : "Buscar produtos"}
          </h1>
          {query && (
            <p className="text-sm text-gray-600">
              {loading ? "Buscando..." : products.length > 0 ? `${products.length} produto(s) encontrado(s)` : "Nenhum produto encontrado"}
            </p>
          )}
        </div>

        {!query && (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Digite um termo na busca para encontrar produtos</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span>Buscando produtos...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-center">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && query && products.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">Nenhum produto encontrado para "{query}"</p>
            <p className="text-sm text-gray-500">Tente buscar por nome, marca ou código do produto</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col relative group hover:shadow-md transition-all"
              >
                <Link
                  href={`/produto/${product.id}`}
                  className="block relative w-full aspect-square cursor-pointer overflow-hidden"
                >
                  <ProductImage product={product} size="card" className="w-full h-full" />
                </Link>

                <div className="p-2 flex flex-col justify-between flex-1 min-h-0">
                  <div className="min-w-0">
                    <Link href={`/produto/${product.id}`}>
                      <h4 className="text-xs font-medium leading-tight mb-0.5 line-clamp-2 text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                        {product.title}
                      </h4>
                    </Link>
                    <p className="text-[10px] text-gray-600 font-semibold mt-0.5 truncate">
                      {product.marca || "—"}
                    </p>
                    <span className="text-[10px] text-gray-400">{product.unit}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 gap-1">
                    <span className="text-sm font-bold text-red-700 truncate">R$ {product.price}</span>
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
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Carregando...</div>}>
      <BuscaPageContent />
    </Suspense>
  );
}
