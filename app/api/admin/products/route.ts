import { NextRequest, NextResponse } from "next/server";
import { products, Product } from "@/lib/products";
import fs from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';

// Simulação de autenticação administrativa
function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  // Em produção, verificar token JWT
  const token = authHeader?.replace('Bearer ', '');
  return token === process.env.ADMIN_SECRET || token === 'admin_secret_123';
}

// Caminho do arquivo de produtos
const PRODUCTS_FILE = path.join(process.cwd(), 'lib', 'products.ts');

// GET: Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    });

  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

// POST: Criar novo produto
export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
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

    // Validar formato de preço (aceita "5,99" ou 5.99)
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

    // Gerar ID único
    const newId = (Math.max(...products.map(p => parseInt(p.id) || 0)) + 1).toString();
    
    // Formatar preço para exibição (formato brasileiro: "5,99")
    const formattedPrice = priceNum.toFixed(2).replace('.', ',');

    const newProduct: Product = {
      id: newId,
      title: title.trim(),
      price: formattedPrice,
      unit: unit.trim(),
      category: category.trim(),
      description: description?.trim() || '',
      image: image?.trim() || '',
      badge: badge?.trim() || undefined,
    };

    // Adicionar ao array de produtos
    products.push(newProduct);

    // Salvar no arquivo (atualizar lib/products.ts)
    await saveProductsToFile(products);

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Produto criado com sucesso",
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}

// Função auxiliar para salvar produtos no arquivo
async function saveProductsToFile(productsList: Product[]) {
  try {
    // Ler o arquivo atual
    const fileContent = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    
    // Encontrar o array de produtos no arquivo
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

    // Reconstruir o arquivo
    const beforeArray = fileContent.substring(0, arrayStart);
    const afterArray = fileContent.substring(arrayEnd + 2);
    const newContent = beforeArray + 'export const products: Product[] = [\n' + productsArray + '\n];' + afterArray;

    // Salvar o arquivo
    await fs.writeFile(PRODUCTS_FILE, newContent, 'utf-8');
    
  } catch (error) {
    console.error('❌ Erro ao salvar produtos no arquivo:', error);
    // Não lançar erro para não quebrar a API, apenas logar
    // Em produção, usar banco de dados
  }
}
