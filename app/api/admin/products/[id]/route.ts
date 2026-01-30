import { NextRequest, NextResponse } from "next/server";
import { products, Product } from "@/lib/products";
import fs from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';

// Simulação de autenticação administrativa
function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token === process.env.ADMIN_SECRET || token === 'admin_secret_123';
}

const PRODUCTS_FILE = path.join(process.cwd(), 'lib', 'products.ts');

// GET: Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });

  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}

// PUT: Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, price, unit, category, description, image, badge } = body;

    // Validações
    if (!title || !price || !unit || !category) {
      return NextResponse.json(
        { error: "Campos obrigatórios: title, price, unit, category" },
        { status: 400 }
      );
    }

    // Validar formato de preço
    const priceStr = typeof price === 'string' 
      ? price.replace(',', '.') 
      : price.toString();
    const priceNum = parseFloat(priceStr);
    
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { error: "Preço inválido. Use formato numérico (ex: 5.99 ou '5,99')" },
        { status: 400 }
      );
    }

    // Formatar preço para exibição
    const formattedPrice = priceNum.toFixed(2).replace('.', ',');

    // Atualizar produto
    const updatedProduct: Product = {
      ...products[productIndex],
      title: title.trim(),
      price: formattedPrice,
      unit: unit.trim(),
      category: category.trim(),
      description: description?.trim() || '',
      image: image?.trim() || '',
      badge: badge?.trim() || undefined,
    };

    products[productIndex] = updatedProduct;

    // Salvar no arquivo
    await saveProductsToFile(products);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Produto atualizado com sucesso",
    });

  } catch (error) {
    console.error("❌ Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

// DELETE: Deletar produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Remover produto
    products.splice(productIndex, 1);

    // Salvar no arquivo
    await saveProductsToFile(products);

    return NextResponse.json({
      success: true,
      message: "Produto deletado com sucesso",
    });

  } catch (error) {
    console.error("❌ Erro ao deletar produto:", error);
    return NextResponse.json(
      { error: "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}

// Função auxiliar para salvar produtos no arquivo
async function saveProductsToFile(productsList: Product[]) {
  try {
    const fileContent = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const arrayStart = fileContent.indexOf('export const products: Product[] = [');
    const arrayEnd = fileContent.lastIndexOf('];');
    
    if (arrayStart === -1 || arrayEnd === -1) {
      throw new Error('Não foi possível encontrar o array de produtos no arquivo');
    }

    // Função para escapar strings JavaScript
    const escapeString = (str: string): string => {
      return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
    };

    // Gerar o novo conteúdo do array
    const productsArray = productsList.map(p => {
      const parts: string[] = [];
      parts.push(`  {`);
      parts.push(`    id: "${escapeString(p.id)}",`);
      parts.push(`    title: "${escapeString(p.title)}",`);
      parts.push(`    price: "${escapeString(p.price)}",`);
      parts.push(`    unit: "${escapeString(p.unit)}",`);
      
      if (p.image) {
        parts.push(`    image: "${escapeString(p.image)}",`);
      } else {
        parts.push(`    image: "",`);
      }
      
      if (p.badge) {
        parts.push(`    badge: "${escapeString(p.badge)}",`);
      }
      
      parts.push(`    category: "${escapeString(p.category)}",`);
      
      if (p.description) {
        parts.push(`    description: "${escapeString(p.description)}",`);
      }
      
      parts.push(`  },`);
      return parts.join('\n');
    }).join('\n');

    const beforeArray = fileContent.substring(0, arrayStart);
    const afterArray = fileContent.substring(arrayEnd + 2);
    const newContent = beforeArray + 'export const products: Product[] = [\n' + productsArray + '\n];' + afterArray;

    await fs.writeFile(PRODUCTS_FILE, newContent, 'utf-8');
    
  } catch (error) {
    console.error('❌ Erro ao salvar produtos no arquivo:', error);
  }
}
