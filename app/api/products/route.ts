import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products-db";
import { Product } from "@/lib/products";

export const dynamic = 'force-dynamic';

// Lista de marcas conhecidas (mesma do sistema.ts)
const MARCAS_CONHECIDAS = [
  "TIO JOAO", "TIO JOÃO", "CAMIL", "PRATO FINO", "KITANDA", "BROTO LEGAL",
  "TREMBOM", "DONA BENTA", "BOM ARROZ", "ARROZ DO CAMPO",
  "TIO URBANO", "TIO PEDRO", "TIO JORGE", "TIO PAULO", "TIO CARLOS",
  "JASMINE", "NATURALLIFE", "RAMPINELLI", "BLUE VILLE", "KARUI", "MANINHO",
  "NEILAR", "FIT FOOD", "DIA MAES", "DIA DOS PAIS"
];

// Função para extrair marca da descrição (mesma lógica do sistema.ts)
function extrairMarcaDaDescricao(descricao: string): string | undefined {
  if (!descricao) return undefined;
  
  const descUpper = descricao.toUpperCase().trim();
  
  for (const marca of MARCAS_CONHECIDAS) {
    const marcaUpper = marca.toUpperCase();
    const regex = new RegExp(`\\b${marcaUpper.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(descUpper)) {
      return marca;
    }
  }
  
  return undefined;
}

// Função para construir caminho da imagem (mesma lógica do sistema.ts)
function construirCaminhoImagem(codigo: string, marca: string): string {
  if (!codigo) return "";
  
  const normalizarParaArquivo = (texto: string): string => {
    return texto
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "");
  };
  
  const codigoLimpo = codigo.trim();
  
  if (marca) {
    const marcaNormalizada = normalizarParaArquivo(marca);
    return `/produtos/${codigoLimpo}_${marcaNormalizada}.jpg`;
  }
  
  return `/produtos/${codigoLimpo}.jpg`;
}

// GET: Listar produtos (usado pelo frontend)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    // Buscar produtos do banco de dados
    const dbProducts = await getProducts();

    // Converter para formato do site
    let products: Product[] = dbProducts.map((p) => {
      // Mapear categoria baseado na descrição (lógica simples)
      let productCategory = "ofertas";
      const descLower = p.descricao.toLowerCase();
      
      if (descLower.includes("fruta") || descLower.includes("verdura") || descLower.includes("legume") || 
          descLower.includes("banana") || descLower.includes("tomate") || descLower.includes("alface") ||
          descLower.includes("cenoura") || descLower.includes("batata") || descLower.includes("cebola")) {
        productCategory = "hortifruti";
      } else if (descLower.includes("carne") || descLower.includes("frango") || descLower.includes("peixe") ||
                 descLower.includes("bovina") || descLower.includes("porco") || descLower.includes("linguiça") ||
                 descLower.includes("alcatra") || descLower.includes("picanha") || descLower.includes("contrafilé")) {
        productCategory = "acougue";
      } else if (descLower.includes("pão") || descLower.includes("bolo") || descLower.includes("torta") ||
                 descLower.includes("croissant") || descLower.includes("baguete")) {
        productCategory = "padaria";
      } else if (descLower.includes("cerveja") || descLower.includes("refrigerante") || descLower.includes("suco") ||
                 descLower.includes("água") || descLower.includes("bebida") || descLower.includes("coca") ||
                 descLower.includes("guaraná") || descLower.includes("pepsi")) {
        productCategory = "bebidas";
      }

      // Determinar unidade baseado na descrição
      let unit = "un";
      if (descLower.includes("kg") || descLower.includes("quilo") || descLower.includes("grama")) {
        unit = "kg";
      } else if (descLower.includes("litro") || descLower.includes(" l ") || descLower.endsWith("l")) {
        unit = "l";
      } else if (descLower.includes("pacote") || descLower.includes("pct") || descLower.includes("pac")) {
        unit = "pct";
      }

      // Formatar preço para exibição brasileira
      const priceFormatted = p.preco.toFixed(2).replace('.', ',');

      // Buscar imagem do produto (se existir no campo imagem)
      let imagem = (p as any).imagem || '';
      
      // Buscar marca do produto (se existir no campo separado)
      let marca = (p as any).marca || '';
      
      // Se não encontrou marca separada, tentar extrair da descrição
      if (!marca && p.descricao) {
        const marcaExtraida = extrairMarcaDaDescricao(p.descricao);
        if (marcaExtraida) {
          marca = marcaExtraida;
        }
      }
      
      // Se não tem imagem explícita, construir caminho baseado em código e marca
      if (!imagem && p.codigo) {
        imagem = construirCaminhoImagem(p.codigo, marca || "");
      }
      
      return {
        id: p.codigo,
        title: p.descricao,
        price: priceFormatted,
        unit: unit,
        image: imagem || undefined, // Só incluir se tiver valor
        category: productCategory,
        description: p.descricao,
        marca: marca || undefined, // Só incluir se tiver valor
      };
    });

    // Filtrar por categoria
    if (category) {
      products = products.filter((p) => p.category === category);
    }

    // Buscar por termo
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Limitar resultados
    if (limit) {
      const limitNum = parseInt(limit, 10);
      products = products.slice(0, limitNum);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products,
    });

  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
    // Em caso de erro, retornar array vazio
    return NextResponse.json({
      success: true,
      count: 0,
      products: [],
    });
  }
}

