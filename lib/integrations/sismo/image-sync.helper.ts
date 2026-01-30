/**
 * ============================================
 * HELPER: Sincronização de Imagens SISMO
 * ============================================
 * 
 * Este helper adiciona imagens automaticamente aos produtos
 * que vêm da API SISMO (que não têm imagens).
 */

import { searchProductImage, searchProductImagesBatch } from '@/lib/services/image-search.service';
import type { SismoProduct, SismoCategory } from './types';

/**
 * Adiciona imagem a um produto SISMO
 */
export async function enrichProductWithImage(
  product: SismoProduct,
  category?: SismoCategory
): Promise<SismoProduct> {
  // Se já tem imagem, retornar como está
  if (product.imageUrl) {
    return product;
  }
  
  // Buscar imagem automaticamente
  try {
    const imageResult = await searchProductImage(
      product.name,
      category?.name.toLowerCase()
    );
    
    return {
      ...product,
      imageUrl: imageResult.url,
    };
  } catch (error) {
    console.error(`Erro ao buscar imagem para ${product.name}:`, error);
    return product; // Retornar sem imagem se der erro
  }
}

/**
 * Adiciona imagens a múltiplos produtos (em lote)
 */
export async function enrichProductsWithImages(
  products: SismoProduct[],
  categories?: Map<string, SismoCategory>
): Promise<SismoProduct[]> {
  // Filtrar produtos que já têm imagem
  const productsWithoutImage = products.filter(p => !p.imageUrl);
  
  if (productsWithoutImage.length === 0) {
    return products; // Todos já têm imagem
  }
  
  // Preparar dados para busca em lote
  const productsToSearch = productsWithoutImage.map(product => ({
    name: product.name,
    category: categories?.get(product.categoryId)?.name.toLowerCase(),
  }));
  
  // Buscar imagens em lote
  const imageMap = await searchProductImagesBatch(productsToSearch);
  
  // Adicionar imagens aos produtos
  return products.map(product => {
    if (product.imageUrl) {
      return product; // Já tem imagem
    }
    
    const imageUrl = imageMap.get(product.name);
    if (imageUrl) {
      return {
        ...product,
        imageUrl,
      };
    }
    
    return product; // Não encontrou imagem
  });
}

/**
 * Sincroniza imagens para produtos novos do PDV
 * Use esta função quando receber produtos da API SISMO
 */
export async function syncImagesForSismoProducts(
  products: SismoProduct[],
  options?: {
    batchSize?: number;
    delayBetweenBatches?: number;
  }
): Promise<SismoProduct[]> {
  const batchSize = options?.batchSize || 10;
  const delay = options?.delayBetweenBatches || 500;
  
  const enrichedProducts: SismoProduct[] = [];
  
  // Processar em lotes para não sobrecarregar
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    const batchResults = await enrichProductsWithImages(batch);
    enrichedProducts.push(...batchResults);
    
    // Delay entre lotes para respeitar rate limits
    if (i + batchSize < products.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return enrichedProducts;
}

