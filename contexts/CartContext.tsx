"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/products";
import { CATALOG_MODE, CATALOG_MESSAGE } from "@/lib/catalog-config";

interface CartItem extends Product {
  quantity: number;
  quantityInGrams?: number; // Para produtos de hortifruti (quantidade em gramas)
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantityInGrams?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateQuantityInGrams: (productId: string, grams: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isCatalogMode: boolean;
}

// Re-exportar para compatibilidade com componentes que já importam de CartContext
export { CATALOG_MESSAGE };

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar carrinho do localStorage ao montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("atual-cart");
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Erro ao carregar carrinho:", error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem("atual-cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantityInGrams?: number) => {
    // Se estiver em modo catálogo, não adiciona ao carrinho
    // A mensagem será exibida pelo componente que chama addToCart
    if (CATALOG_MODE) {
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      // Se for hortifruti, usar gramas
      if (product.category === "hortifruti" && product.unit === "kg") {
        const grams = quantityInGrams || 100; // Mínimo 100g
        
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { 
                  ...item, 
                  quantityInGrams: (item.quantityInGrams || 100) + grams,
                  quantity: Math.ceil(((item.quantityInGrams || 100) + grams) / 1000) // Para compatibilidade
                }
              : item
          );
        }
        return [...prevItems, { 
          ...product, 
          quantity: 1, // Para compatibilidade
          quantityInGrams: grams 
        }];
      }
      
      // Para outras categorias, comportamento normal
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          // Se for hortifruti, não usar updateQuantity diretamente
          // Usar updateQuantityInGrams
          if (item.category === "hortifruti" && item.unit === "kg") {
            return item; // Não alterar
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const updateQuantityInGrams = (productId: string, grams: number) => {
    if (grams < 100) {
      removeFromCart(productId);
      return;
    }
    // Arredondar para múltiplo de 100g
    const roundedGrams = Math.round(grams / 100) * 100;
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId 
          ? { 
              ...item, 
              quantityInGrams: roundedGrams,
              quantity: Math.ceil(roundedGrams / 1000) // Para compatibilidade
            } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = (): number => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(",", "."));
      
      // Se for hortifruti vendido por kg, calcular por gramas
      if (item.category === "hortifruti" && item.unit === "kg" && item.quantityInGrams) {
        // Preço por kg / 1000 * quantidade em gramas
        return total + (price / 1000) * item.quantityInGrams;
      }
      
      // Para outras categorias, cálculo normal
      return total + price * item.quantity;
    }, 0);
  };

  const getItemCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateQuantityInGrams,
        clearCart,
        getTotal,
        getItemCount,
        isCatalogMode: CATALOG_MODE,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}

