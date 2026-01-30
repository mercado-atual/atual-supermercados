import type { Produto } from "@/types/Produto";

type ProdutoEntrada = Record<string, unknown>;

const DEFAULT_ESTOQUE = 0;

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = value.replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toStringValue = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
};

// Lista de marcas conhecidas de arroz e produtos alimentícios
const MARCAS_CONHECIDAS = [
  // Arroz
  "TIO JOAO", "TIO JOÃO", "CAMIL", "PRATO FINO", "KITANDA", "BROTO LEGAL",
  "TREMBOM", "TREMBOM", "DONA BENTA", "DONA BENTA", "BOM ARROZ", "BOM ARROZ",
  "ARROZ DO CAMPO", "ARROZ DO CAMPO", "ARROZ DO CAMPO", "ARROZ DO CAMPO",
  "TIO URBANO", "TIO URBANO", "TIO PEDRO", "TIO PEDRO", "TIO JORGE", "TIO JORGE",
  "TIO PAULO", "TIO PAULO", "TIO CARLOS", "TIO CARLOS",
  // Feijão
  "CAMIL", "KITANDA", "BROTO LEGAL", "TREMBOM", "DONA BENTA",
  // Outros
  "JASMINE", "NATURALLIFE", "RAMPINELLI", "BLUE VILLE", "KARUI", "MANINHO",
  "NEILAR", "FIT FOOD", "DIA MAES", "DIA DOS PAIS"
];

/**
 * Constrói o caminho da imagem do produto considerando código e marca
 * Prioridade:
 * 1. /produtos/{codigo}.jpg (imagem por código)
 * 2. /produtos/{codigo}_{marca_normalizada}.jpg (código + marca)
 * 3. /produtos/{marca_normalizada}/{codigo}.jpg (marca/código)
 * 4. Retorna string vazia se não encontrar padrão
 */
function construirCaminhoImagem(codigo: string, marca: string): string {
  if (!codigo) return "";
  
  // Normalizar marca para nome de arquivo (sem espaços, acentos, etc)
  const normalizarParaArquivo = (texto: string): string => {
    return texto
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, "_") // Espaços vira underscore
      .replace(/[^A-Z0-9_]/g, ""); // Remove caracteres especiais
  };
  
  const codigoLimpo = codigo.trim();
  
  // Se tem marca, tentar variações
  if (marca) {
    const marcaNormalizada = normalizarParaArquivo(marca);
    
    // Tentar: /produtos/{codigo}_{marca}.jpg
    const caminhoComMarca = `/produtos/${codigoLimpo}_${marcaNormalizada}.jpg`;
    
    // Tentar: /produtos/{marca}/{codigo}.jpg (estrutura por pasta)
    const caminhoPorPasta = `/produtos/${marcaNormalizada}/${codigoLimpo}.jpg`;
    
    // Por enquanto, retornar o caminho mais comum (código_marca)
    // Em produção, poderia verificar se o arquivo existe antes
    return caminhoComMarca;
  }
  
  // Sem marca, usar apenas código: /produtos/{codigo}.jpg
  return `/produtos/${codigoLimpo}.jpg`;
}

/**
 * Tenta extrair a marca da descrição do produto quando não vem separada
 * Exemplos:
 * - "ARROZ BRANCO TIO JOAO 5KG" → "TIO JOAO"
 * - "ARROZ BRANCO CAMIL 5KG" → "CAMIL"
 * - "FEIJAO PRETO CAMIL 1KG" → "CAMIL"
 */
function extrairMarcaDaDescricao(descricao: string): string | undefined {
  if (!descricao) return undefined;
  
  const descUpper = descricao.toUpperCase().trim();
  
  // Primeiro, tentar encontrar marcas conhecidas na descrição
  for (const marca of MARCAS_CONHECIDAS) {
    const marcaUpper = marca.toUpperCase();
    // Procurar a marca como palavra completa (não parte de outra palavra)
    const regex = new RegExp(`\\b${marcaUpper.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(descUpper)) {
      return marca; // Retornar com capitalização original
    }
  }
  
  // Se não encontrou marca conhecida, tentar padrões comuns
  // Padrão: "PRODUTO MARCA TAMANHO" ou "PRODUTO MARCA"
  // Remover palavras comuns de produto e tamanho
  const palavrasComuns = [
    'ARROZ', 'BRANCO', 'INTEGRAL', 'PARBOILIZADO', 'TIPO', '1', '2', '3',
    'FEIJAO', 'FEIJÃO', 'PRETO', 'CARIOCA', 'PRETINHO',
    'KG', 'G', 'ML', 'L', 'UN', 'UNIDADE', 'PCT', 'PACOTE', 'EMBALAGEM',
    '5', '1', '2', '3', '4', '500', '1000', '900', '750'
  ];
  
  const palavras = descUpper.split(/\s+/).filter(p => 
    p.length > 2 && !palavrasComuns.includes(p) && !/^\d+$/.test(p)
  );
  
  // Se sobraram 1-3 palavras após remover comuns, pode ser a marca
  if (palavras.length >= 1 && palavras.length <= 3) {
    // Verificar se não são palavras genéricas
    const genericas = ['SELECIONADO', 'PREMIUM', 'ESPECIAL', 'TRADICIONAL', 'INTEGRAL'];
    const marcaCandidata = palavras.filter(p => !genericas.includes(p)).join(' ');
    if (marcaCandidata && marcaCandidata.length > 2) {
      return marcaCandidata;
    }
  }
  
  return undefined;
}

const normalizeProduto = (item: ProdutoEntrada): Produto | null => {
  // Mapear código (várias possibilidades do Sysmo)
  const codigo = toStringValue(
    item.codigo ?? 
    item.codigo_produto ?? 
    item.id ?? 
    item.sku ?? 
    item.codigo_barras
  );
  
  // Mapear descrição (várias possibilidades do Sysmo)
  const descricao = toStringValue(
    item.descricao ?? 
    item.nome ?? 
    item.nome_produto ?? 
    item.title ?? 
    item.descricao_produto
  );
  
  if (!codigo || !descricao) return null;

  // Mapear GTIN/código de barras
  const gtin = toStringValue(
    item.gtin ?? 
    item.codigo_barras ?? 
    item.ean ?? 
    item.codigo ?? 
    item.id ?? 
    ""
  );
  
  // Mapear preço (várias possibilidades do Sysmo)
  const preco = toNumber(
    item.preco ?? 
    item.preco_venda ?? 
    item.preco_promocional ?? 
    item.valor ?? 
    item.price ?? 
    item.preco_unitario
  );
  
  // Mapear estoque (várias possibilidades do Sysmo)
  const estoque = toNumber(
    item.estoque ?? 
    item.estoque_atual ?? 
    item.quantidade ?? 
    item.qtd_estoque ?? 
    item.saldo_estoque ?? 
    DEFAULT_ESTOQUE
  );
  
  // Mapear marca/fabricante/industrializador (várias possibilidades do Sysmo)
  let marca = toStringValue(
    item.marca ?? 
    item.fabricante ?? 
    item.industrializador ?? 
    item.fornecedor ?? 
    item.brand ?? 
    item.manufacturer ?? 
    item.marca_produto ?? 
    ""
  );

  // Se não encontrou marca separada, tentar extrair da descrição
  if (!marca && descricao) {
    const marcaExtraida = extrairMarcaDaDescricao(descricao);
    if (marcaExtraida) {
      marca = marcaExtraida;
    }
  }

  // Mapear imagem (várias possibilidades)
  let imagem = toStringValue(
    item.imagem ?? 
    item.image ?? 
    item.foto ?? 
    item.url_imagem ?? 
    item.imagem_url ?? 
    ""
  );

  // Se não tem imagem explícita, construir caminho baseado em código e marca
  if (!imagem && codigo) {
    imagem = construirCaminhoImagem(codigo, marca || "");
  }

  return {
    codigo,
    descricao,
    gtin,
    preco,
    estoque,
    imagem,
    marca: marca || undefined, // Só incluir se tiver valor
  };
};

export const mapProdutosFromFile = (data: unknown): Produto[] => {
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => normalizeProduto(item as ProdutoEntrada))
    .filter((item): item is Produto => Boolean(item));
};

export const fetchSistemaProdutos = async (): Promise<Produto[]> => {
  const baseUrl = process.env.SISTEMA_API_URL;
  const user = process.env.SISTEMA_API_USER;
  const pass = process.env.SISTEMA_API_PASS;

  if (!baseUrl || !user || !pass) {
    console.warn("⚠️ Variáveis de ambiente do Sysmo não configuradas");
    return [];
  }

  try {
    const auth = Buffer.from(`${user}:${pass}`).toString("base64");
    
    const url = baseUrl.endsWith("/")
      ? `${baseUrl}hubprodutos.listar_produtos`
      : `${baseUrl}/hubprodutos.listar_produtos`;

    // Buscar produtos com paginação (começando com página 1, tamanho 100)
    const todosProdutos: Produto[] = [];
    let pagina = 1;
    const tamanhoPagina = 100; // Buscar 100 por vez
    let temMaisPaginas = true;

    while (temMaisPaginas) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          pagina: String(pagina),
          tamanho_pagina: String(tamanhoPagina),
          partner_key: "",
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        const erroTexto = await response.text();
        console.error(`❌ Erro ao buscar produtos (página ${pagina}):`, erroTexto);
        // Se der erro na primeira página, retorna vazio
        if (pagina === 1) return [];
        // Se der erro em páginas seguintes, para a paginação
        break;
      }

      const data = await response.json();
      
      // A resposta do Sysmo vem em data.dados
      const produtosPagina = data?.dados ?? [];
      
      if (!Array.isArray(produtosPagina) || produtosPagina.length === 0) {
        temMaisPaginas = false;
        break;
      }

      const produtosNormalizados = mapProdutosFromFile(produtosPagina);
      todosProdutos.push(...produtosNormalizados);

      // Se retornou menos que o tamanho da página, não há mais páginas
      if (produtosPagina.length < tamanhoPagina) {
        temMaisPaginas = false;
      } else {
        pagina++;
        // Limite de segurança: não buscar mais de 50 páginas (5000 produtos)
        if (pagina > 50) {
          console.warn("⚠️ Limite de paginação atingido (50 páginas)");
          temMaisPaginas = false;
        }
      }
    }

    console.log(`✅ Produtos baixados do Sysmo: ${todosProdutos.length} itens`);
    return todosProdutos;
  } catch (error) {
    console.error("❌ Erro ao buscar produtos do sistema:", error);
    return [];
  }
};
