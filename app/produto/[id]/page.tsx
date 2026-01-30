"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart, CATALOG_MESSAGE } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";
import { getProductById, getProductsByCategory, Product } from "@/lib/products";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { ProductImage } from "@/components/ProductImage";
import { ArrowLeft, ShoppingCart, Package, Scale, Plus, Minus, Loader2 } from "lucide-react";
import { CATALOG_BUTTON_TEXT } from "@/lib/catalog-config";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { addToCart, isCatalogMode } = useCart();
  const { showToast } = useToast();
  const [quantityInGrams, setQuantityInGrams] = useState(100);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const buttonText = isCatalogMode ? CATALOG_BUTTON_TEXT : "Adicionar ao Carrinho";

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products/${encodeURIComponent(productId)}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.success && data?.product) {
          setProduct(data.product);
        } else {
          setProduct(getProductById(productId) ?? null);
        }
      })
      .catch(() => {
        setProduct(getProductById(productId) ?? null);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const isHortifruti = product?.category === "hortifruti" && product?.unit === "kg";

  const handleAddToCart = () => {
    if (!product) return;
    
    if (isCatalogMode) {
      showToast(CATALOG_MESSAGE, "info");
      return;
    }
    
    if (isHortifruti) {
      addToCart(product, quantityInGrams);
      const displayQuantity = quantityInGrams >= 1000 
        ? `${(quantityInGrams / 1000).toFixed(2).replace(".", ",")} kg`
        : `${quantityInGrams}g`;
      showToast(`${product.title} (${displayQuantity}) adicionado ao carrinho!`);
    } else {
      addToCart(product);
      showToast(`${product.title} adicionado ao carrinho!`);
    }
  };

  const adjustGrams = (delta: number) => {
    const newGrams = quantityInGrams + delta;
    if (newGrams >= 100) {
      setQuantityInGrams(Math.round(newGrams / 100) * 100); // Arredondar para múltiplo de 100
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <main className="container mx-auto px-4 py-12 flex items-center justify-center flex-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={24} className="animate-spin" />
            <span>Carregando produto...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">O produto que você está procurando não existe.</p>
          <Link
            href="/ofertas"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Ver ofertas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container mx-auto px-4 py-8">
        {/* BOTÃO VOLTAR */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Voltar</span>
        </button>

        {/* GRID DO PRODUTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* IMAGEM REDUZIDA */}
          <div className="relative w-full h-[280px] md:h-[320px] rounded-xl overflow-hidden shadow-lg">
            {product.badge && (
              <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-red-900 z-10 shadow-md">
                {product.badge}
              </span>
            )}
            <ProductImage
              product={product}
              size="detail"
              className="w-full h-full"
              priority
            />
          </div>

          {/* INFORMAÇÕES DO PRODUTO COMPACTADAS */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{product.title}</h1>
            
            {/* MARCA - sempre exibir */}
            <p className="text-base text-gray-600 font-semibold mb-3">
              Marca: {product.marca || "—"}
            </p>

            {/* PREÇO */}
            <div className="mb-4">
              <span className="text-3xl md:text-4xl font-black text-red-700">R$ {product.price}</span>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                {product.unit === "kg" ? (
                  <Scale size={16} />
                ) : (
                  <Package size={16} />
                )}
                <span className="text-xs font-medium">Por {product.unit}</span>
              </div>
            </div>

            {/* DESCRIÇÃO */}
            {product.description && (
              <div className="mb-5">
                <h2 className="text-base font-bold text-gray-800 mb-2">Descrição</h2>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{product.description}</p>
              </div>
            )}

            {/* SELETOR DE QUANTIDADE (HORTIFRUTI) */}
            {isHortifruti && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Quantidade
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustGrams(-100)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-xl font-bold text-gray-900">
                      {quantityInGrams >= 1000 
                        ? `${(quantityInGrams / 1000).toFixed(2).replace(".", ",")} kg`
                        : `${quantityInGrams}g`
                      }
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Mínimo: 100g • Incremento: 100g
                    </div>
                  </div>
                  <button
                    onClick={() => adjustGrams(100)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="mt-1.5 text-xs text-gray-600">
                  Preço: R$ {product.price} por kg
                </div>
              </div>
            )}

            {/* BOTÕES DE AÇÃO */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl active:scale-95"
              >
                <ShoppingCart size={20} />
                {buttonText}
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-300 px-6 py-3 rounded-lg font-bold text-base hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={18} />
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>

        {/* PRODUTOS RELACIONADOS */}
        {(() => {
          const relatedProducts = getProductsByCategory(product.category)
            .filter(p => p.id !== product.id)
            .slice(0, 4);
          
          if (relatedProducts.length === 0) return null;

          const categoryNames: Record<string, string> = {
            hortifruti: "Mais do Hortifruti",
            acougue: "Mais do Açougue",
            padaria: "Mais da Padaria",
            bebidas: "Mais Bebidas",
            ofertas: "Mais Ofertas"
          };

          return (
            <div className="mt-10">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {categoryNames[product.category] || "Produtos Relacionados"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => {
                  const isRelatedHortifruti = relatedProduct.category === "hortifruti" && relatedProduct.unit === "kg";
                  
                  const handleRelatedAddToCart = () => {
                    if (isCatalogMode) {
                      showToast(CATALOG_MESSAGE, "info");
                      return;
                    }
                    if (isRelatedHortifruti) {
                      addToCart(relatedProduct, 100);
                      showToast(`${relatedProduct.title} (100g) adicionado ao carrinho!`);
                    } else {
                      addToCart(relatedProduct);
                      showToast(`${relatedProduct.title} adicionado ao carrinho!`);
                    }
                  };

                  return (
                    <div
                      key={relatedProduct.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all"
                    >
                      <Link href={`/produto/${relatedProduct.id}`} className="block relative w-full h-24 bg-gray-200 cursor-pointer flex items-center justify-center">
                        {relatedProduct.badge && (
                          <span className="absolute top-1 left-1 bg-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded text-red-900 z-10">
                            {relatedProduct.badge}
                          </span>
                        )}
                        <span className="text-gray-400 text-xs">Sem imagem</span>
                      </Link>
                      <div className="p-2 flex flex-col justify-between flex-1">
                        <Link href={`/produto/${relatedProduct.id}`}>
                          <h3 className="text-xs font-medium leading-tight mb-1 line-clamp-2 text-gray-700 hover:text-red-700 transition-colors">
                            {relatedProduct.title}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-red-700">R$ {relatedProduct.price}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRelatedAddToCart();
                            }}
                            className="bg-red-600 active:bg-red-800 text-white p-1.5 rounded-full transition-colors shadow-sm hover:scale-110 active:scale-95"
                            title={isCatalogMode ? "Disponível na loja" : "Adicionar ao carrinho"}
                          >
                            <ShoppingCart size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </main>
      <Footer />
    </div>
  );
}
