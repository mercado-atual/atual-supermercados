"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import {
  Package,
  Wine,
  Apple,
  Croissant,
  SprayCan,
  Tag,
  Beef,
} from "lucide-react";
import { PRODUTOS_BASE, FOTOS_PRODUTOS_BASE, CATEGORY_PLACEHOLDER_LABELS } from "@/lib/product-image-config";

export type ProductImageProduct = {
  id: string;
  title: string;
  image?: string | null;
  category: string;
  gtin?: string | null;
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  acougue: Beef,
  bebidas: Wine,
  hortifruti: Apple,
  padaria: Croissant,
  limpeza: SprayCan,
  higiene: SprayCan,
  ofertas: Tag,
  cdc: Package,
};

type ProductImageProps = {
  product: ProductImageProduct;
  /** Tamanho do container: "card" (lista) ou "detail" (página do produto) */
  size?: "card" | "detail";
  /** Classes adicionais no container */
  className?: string;
  /** Prioridade de carregamento (evita LCP ruim na primeira linha) */
  priority?: boolean;
};

export function ProductImage({
  product,
  size = "card",
  className = "",
  priority = false,
}: ProductImageProps) {
  const { id, title, image, category, gtin } = product;

  const sources = useMemo(() => {
    const list: string[] = [];
    if (image && image.trim()) list.push(image.trim());
    if (gtin && gtin.trim()) list.push(`${FOTOS_PRODUTOS_BASE}/${gtin.trim()}.jpg`);
    list.push(`${FOTOS_PRODUTOS_BASE}/${id}.jpg`);
    list.push(`${PRODUTOS_BASE}/${id}.jpg`);
    return list;
  }, [id, image, gtin]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const showPlaceholder = currentIndex >= sources.length;
  const currentSrc = sources[currentIndex];
  const CategoryIcon = CATEGORY_ICONS[category] || Package;
  const categoryLabel = CATEGORY_PLACEHOLDER_LABELS[category] || "Produto";

  const handleError = () => {
    setCurrentIndex((i) => (i + 1 < sources.length ? i + 1 : sources.length));
  };

  const isCard = size === "card";
  const width = isCard ? 400 : 600;
  const height = isCard ? 400 : 400; // card quadrado
  const minHeight = isCard ? undefined : "280px";

  if (showPlaceholder) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
        style={minHeight ? { minHeight } : undefined}
        title={categoryLabel}
      >
        <div className="flex flex-col items-center gap-0.5 p-1">
          <CategoryIcon size={isCard ? 24 : 48} className="shrink-0" />
          <span className="text-[10px] font-medium text-slate-500 truncate max-w-full px-0.5">
            {categoryLabel}
          </span>
        </div>
      </div>
    );
  }

  const isExternal = currentSrc.startsWith("http://") || currentSrc.startsWith("https://");

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`} style={minHeight ? { minHeight } : undefined}>
      <Image
        key={currentSrc}
        src={currentSrc}
        alt={title}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        onError={handleError}
        unoptimized={isExternal}
        sizes={isCard ? "(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 16vw" : "(max-width: 768px) 100vw, 50vw"}
      />
    </div>
  );
}
