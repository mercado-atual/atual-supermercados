"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCart, CATALOG_MESSAGE } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, updateQuantityInGrams, getTotal, clearCart, isCatalogMode } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Migrar itens antigos de hortifruti que não têm quantityInGrams
  useEffect(() => {
    items.forEach((item) => {
      if (item.category === "hortifruti" && item.unit === "kg" && !item.quantityInGrams) {
        // Converter quantity (kg) para gramas
        const grams = item.quantity * 1000;
        updateQuantityInGrams(item.id, grams);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez ao montar

  const formatCurrency = (value: number): string => {
    return value.toFixed(2).replace(".", ",");
  };

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />

        <main className="container mx-auto px-4 py-16 flex-1">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              <ShoppingCart size={80} className="mx-auto text-gray-300" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-8">
              Que tal adicionar alguns produtos deliciosos?
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
            >
              <ArrowLeft size={20} />
              Continuar Comprando
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-gray-900">Meu Carrinho</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Limpar Carrinho
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Itens */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isHortifruti = item.category === "hortifruti" && item.unit === "kg";
              const price = parseFloat(item.price.replace(",", "."));
              
              let subtotal: number;
              let displayQuantity: string;
              
              if (isHortifruti) {
                // Se não tem quantityInGrams, migrar de quantity (kg) para gramas
                // Converter quantity (que seria em kg) para gramas
                const grams = item.quantityInGrams || (item.quantity * 1000);
                
                // Calcular por gramas
                subtotal = (price / 1000) * grams;
                displayQuantity = grams >= 1000 
                  ? `${(grams / 1000).toFixed(2).replace(".", ",")} kg`
                  : `${grams}g`;
              } else {
                // Calcular normalmente
                subtotal = price * item.quantity;
                displayQuantity = `${item.quantity} ${item.unit}`;
              }

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Imagem */}
                  <Link href={`/produto/${item.id}`} className="flex-shrink-0">
                    <div className="relative w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sem imagem</span>
                    </div>
                  </Link>

                  {/* Informações */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/produto/${item.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors mb-1">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">
                        {isHortifruti ? `R$ ${item.price} por kg` : `Por ${item.unit}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Controles de Quantidade */}
                      <div className="flex items-center gap-3">
                        {isHortifruti ? (() => {
                          const currentGrams = item.quantityInGrams || (item.quantity * 1000);
                          return (
                            <>
                              <button
                                onClick={() => updateQuantityInGrams(item.id, currentGrams - 100)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-lg font-bold min-w-[80px] text-center">
                                {displayQuantity}
                              </span>
                              <button
                                onClick={() => updateQuantityInGrams(item.id, currentGrams + 100)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </>
                          );
                        })() : (
                          <>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Preço e Remover */}
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-black text-red-700">
                          R$ {formatCurrency(subtotal)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Aviso de Variação de Peso (Hortifruti) */}
            {items.some((item) => item.category === "hortifruti" && item.unit === "kg") && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                <p className="text-sm text-yellow-900 leading-relaxed">
                  <strong>Atenção:</strong> produtos vendidos por peso podem ter variação.
                  Ao selecionar, por exemplo, 300g, o peso final pode ser um pouco maior ou menor, conforme a pesagem no momento da separação. O valor final será ajustado de acordo com o peso real do produto.
                </p>
              </div>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} itens)</span>
                  <span className="font-medium">R$ {formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-red-700">R$ {formatCurrency(total)}</span>
                </div>
              </div>

              {/* Aviso de Variação de Peso (Hortifruti) */}
              {items.some((item) => item.category === "hortifruti" && item.unit === "kg") && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-900 leading-relaxed">
                    <strong>Atenção:</strong> produtos vendidos por peso podem ter variação.
                    Ao selecionar, por exemplo, 300g, o peso final pode ser um pouco maior ou menor, conforme a pesagem no momento da separação. O valor final será ajustado de acordo com o peso real do produto.
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  if (isCatalogMode) {
                    showToast(CATALOG_MESSAGE, "info");
                    return;
                  }
                  // Verificar se está logado antes de ir para checkout
                  const storedUser = localStorage.getItem("atual_user");
                  if (!storedUser) {
                    router.push("/auth/login?redirect=/checkout");
                    return;
                  }
                  router.push("/checkout");
                }}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg mb-4"
              >
                Finalizar Compra
              </button>

              <Link
                href="/"
                className="block w-full text-center text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                <ArrowLeft size={18} className="inline mr-2" />
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

