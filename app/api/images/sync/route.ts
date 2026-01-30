import { NextRequest, NextResponse } from 'next/server';
import { syncImagesForSismoProducts } from '@/lib/integrations/sismo/image-sync.helper';
import type { SismoProduct } from '@/lib/integrations/sismo/types';

/**
 * API Route para sincronizar imagens em lote
 * 
 * POST /api/images/sync
 * 
 * Body: {
 *   products: SismoProduct[],
 *   options?: {
 *     batchSize?: number,
 *     delayBetweenBatches?: number
 *   }
 * }
 * 
 * Retorna produtos com imagens adicionadas
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products, options } = body;
    
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Body deve conter um array "products"' },
        { status: 400 }
      );
    }
    
    // Validar estrutura dos produtos
    const validProducts: SismoProduct[] = products.filter(p => 
      p.id && p.name
    );
    
    if (validProducts.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum produto válido encontrado' },
        { status: 400 }
      );
    }
    
    // Sincronizar imagens
    const productsWithImages = await syncImagesForSismoProducts(
      validProducts,
      options
    );
    
    // Estatísticas
    const stats = {
      total: products.length,
      processed: productsWithImages.length,
      withImage: productsWithImages.filter(p => p.imageUrl).length,
      withoutImage: productsWithImages.filter(p => !p.imageUrl).length,
    };
    
    return NextResponse.json({
      products: productsWithImages,
      stats,
    });
  } catch (error) {
    console.error('Erro ao sincronizar imagens:', error);
    return NextResponse.json(
      { error: 'Erro ao sincronizar imagens', details: String(error) },
      { status: 500 }
    );
  }
}

