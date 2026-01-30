import { NextRequest, NextResponse } from 'next/server';
import { searchProductImage, searchProductImagesBatch } from '@/lib/services/image-search.service';

/**
 * API Route para buscar imagem de um produto
 * 
 * GET /api/images/search?name=Alcatra&category=acougue
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const category = searchParams.get('category') || undefined;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Parâmetro "name" é obrigatório' },
        { status: 400 }
      );
    }
    
    const imageResult = await searchProductImage(name, category);
    
    return NextResponse.json({
      url: imageResult.url,
      source: imageResult.source,
      width: imageResult.width,
      height: imageResult.height,
    });
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar imagem' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/images/search
 * Busca imagens em lote
 * 
 * Body: { products: [{ name: string, category?: string }] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body;
    
    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Body deve conter um array "products"' },
        { status: 400 }
      );
    }
    
    const imageMap = await searchProductImagesBatch(products);
    
    // Converter Map para objeto
    const result: Record<string, string> = {};
    imageMap.forEach((url, name) => {
      result[name] = url;
    });
    
    return NextResponse.json({
      images: result,
      total: Object.keys(result).length,
    });
  } catch (error) {
    console.error('Erro ao buscar imagens em lote:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar imagens' },
      { status: 500 }
    );
  }
}

