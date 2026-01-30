"use client";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useCart, CATALOG_MESSAGE } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { getProductsByCategory } from "@/lib/products";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CATALOG_BUTTON_TEXT_SHORT } from "@/lib/catalog-config";

export default function LimpezaPage() {
  const { addToCart, isCatalogMode } = useCart();
  const { showToast } = useToast();
  const products = getProductsByCategory("limpeza");
  const buttonTitle = isCatalogMode ? "Disponível na loja" : "Adicionar ao carrinho";

  const handleAddToCart = (product: typeof products[0]) => {
    if (isCatalogMode) {
      showToast(CATALOG_MESSAGE, "info");
      return;
    }
    addToCart(product);
    showToast(`${product.title} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">🧹 Limpeza</h1>
          <p className="text-gray-600">Produtos de limpeza para sua casa.</p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Nenhum produto encontrado nesta categoria.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group hover:shadow-md transition-all animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded text-red-900 z-10 shadow-sm">
                    {product.badge}
                  </span>
                )}

                <Link href={`/produto/${product.id}`} className="block relative w-full h-24 md:h-28 bg-gray-200 cursor-pointer overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Sem imagem</span>
                    </div>
                  )}
                </Link>

                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <Link href={`/produto/${product.id}`}>
                      <h4 className="text-sm font-medium leading-tight mb-1 line-clamp-2 text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                        {product.title}
                      </h4>
                      {product.marca && (
                        <p className="text-xs text-gray-500 font-semibold mt-0.5">
                          {product.marca}
                        </p>
                      )}
                    </Link>
                    <span className="text-xs text-gray-400">{product.unit}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-bold text-red-700">R$ {product.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-red-600 active:bg-red-800 text-white p-2 rounded-full transition-colors shadow-sm shadow-red-200 hover:scale-110 active:scale-95"
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
