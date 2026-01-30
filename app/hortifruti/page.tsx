"use client";

import Link from "next/link";
import { useCart, CATALOG_MESSAGE } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { getProductsByCategory } from "@/lib/products";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { ProductImage } from "@/components/ProductImage";
import { ShoppingCart } from "lucide-react";
import { CATALOG_BUTTON_TEXT_SHORT } from "@/lib/catalog-config";

export default function HortifrutiPage() {
  const { addToCart, isCatalogMode } = useCart();
  const { showToast } = useToast();
  const products = getProductsByCategory("hortifruti");
  const buttonTitle = isCatalogMode ? "Disponível na loja" : "Adicionar ao carrinho";

  const handleAddToCart = (product: typeof products[0]) => {
    if (isCatalogMode) {
      showToast(CATALOG_MESSAGE, "info");
      return;
    }
    // Hortifruti: adicionar com 100g (mínimo)
    if (product.category === "hortifruti" && product.unit === "kg") {
      addToCart(product, 100);
      showToast(`${product.title} (100g) adicionado ao carrinho!`);
    } else {
      addToCart(product);
      showToast(`${product.title} adicionado ao carrinho!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">🥬 Hortifruti Selecionado</h1>
          <p className="text-gray-600">Frescor e qualidade direto para sua mesa!</p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Nenhum produto encontrado nesta categoria.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col relative group hover:shadow-md transition-all animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {product.badge && (
                  <span className="absolute top-1 left-1 bg-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded text-red-900 z-10 shadow-sm">
                    {product.badge}
                  </span>
                )}

                <Link href={`/produto/${product.id}`} className="block relative w-full aspect-square cursor-pointer overflow-hidden">
                  <ProductImage product={product} size="card" className="w-full h-full" />
                </Link>

                <div className="p-2 flex flex-col justify-between flex-1 min-h-0">
                  <div className="min-w-0">
                    <Link href={`/produto/${product.id}`}>
                      <h4 className="text-xs font-medium leading-tight mb-0.5 line-clamp-2 text-gray-700 hover:text-red-700 transition-colors cursor-pointer">
                        {product.title}
                      </h4>
                      {product.marca && (
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5 truncate">
                          {product.marca}
                        </p>
                      )}
                    </Link>
                    <span className="text-[10px] text-gray-400">{product.unit}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 gap-1">
                    <span className="text-sm font-bold text-red-700 truncate">R$ {product.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-red-600 active:bg-red-800 text-white p-1.5 rounded-full transition-colors shadow-sm shadow-red-200 hover:scale-110 active:scale-95 shrink-0"
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
