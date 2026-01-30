/**
 * ============================================
 * SERVIÇO DE BUSCA AUTOMÁTICA DE IMAGENS
 * ============================================
 * 
 * Este serviço busca imagens automaticamente baseado no nome do produto.
 * Usa APIs gratuitas (Unsplash, Pexels) para encontrar imagens relevantes.
 * 
 * Funcionalidades:
 * - Busca automática por nome do produto
 * - Cache para evitar requisições repetidas
 * - Fallback para múltiplas fontes
 * - Mapeamento inteligente de termos
 */

interface ImageSearchResult {
  url: string;
  source: 'unsplash' | 'pexels' | 'placeholder';
  width: number;
  height: number;
}

interface CacheEntry {
  url: string;
  timestamp: number;
  source: string;
}

// Cache em memória (em produção, usar Redis ou banco de dados)
const imageCache = new Map<string, CacheEntry>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias

/**
 * Normaliza o nome do produto para busca
 * Ex: "Alcatra Peça" -> "alcatra carne"
 */
function normalizeProductName(productName: string, category?: string): string {
  let normalized = productName.toLowerCase();
  
  // Remover palavras comuns
  normalized = normalized
    .replace(/\b(kg|un|pct|unidade|pacote|caixa|fardo|litro|ml|g)\b/gi, '')
    .replace(/\b(peça|pedaço|fatia|bandeja|maço)\b/gi, '')
    .replace(/\b(tipo|marca|fabricante)\b/gi, '')
    .trim();
  
  // Mapeamento de termos específicos
  const termMap: Record<string, string> = {
    'alcatra': 'alcatra carne bovina',
    'picanha': 'picanha carne bovina',
    'contrafilé': 'contrafile carne bovina',
    'filé mignon': 'file mignon carne',
    'frango': 'frango carne',
    'porco': 'carne suina',
    'linguiça': 'linguica salsicha',
    'tomate italiano': 'tomate',
    'banana prata': 'banana',
    'alface americana': 'alface',
    'batata doce': 'batata doce',
    'pão francês': 'pao frances',
    'cerveja': 'cerveja lata',
    'refrigerante': 'refrigerante garrafa',
    'água mineral': 'agua mineral garrafa',
  };
  
  // Aplicar mapeamento
  for (const [key, value] of Object.entries(termMap)) {
    if (normalized.includes(key)) {
      normalized = value;
      break;
    }
  }
  
  // Adicionar categoria se disponível
  if (category) {
    const categoryMap: Record<string, string> = {
      'acougue': 'carne',
      'hortifruti': 'fruta verdura',
      'padaria': 'pao',
      'bebidas': 'bebida',
    };
    if (categoryMap[category.toLowerCase()]) {
      normalized = `${normalized} ${categoryMap[category.toLowerCase()]}`;
    }
  }
  
  return normalized.trim();
}

/**
 * Busca imagem no Unsplash (gratuito, sem API key necessário para uso básico)
 */
async function searchUnsplash(query: string): Promise<ImageSearchResult | null> {
  try {
    // Unsplash Source API (gratuito, sem autenticação para uso básico)
    // Usa o serviço de proxy do Unsplash
    const searchQuery = encodeURIComponent(query);
    const url = `https://source.unsplash.com/400x400/?${searchQuery}`;
    
    // Verificar se a imagem existe fazendo uma requisição HEAD
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      return {
        url,
        source: 'unsplash',
        width: 400,
        height: 400,
      };
    }
  } catch (error) {
    console.error('Erro ao buscar no Unsplash:', error);
  }
  
  return null;
}

/**
 * Busca imagem usando Pexels (requer API key, mas tem plano gratuito generoso)
 */
async function searchPexels(query: string): Promise<ImageSearchResult | null> {
  try {
    // Pexels tem API gratuita com 200 requisições/hora
    // Para usar, adicione PEXELS_API_KEY no .env.local
    const apiKey = process.env.PEXELS_API_KEY;
    
    if (!apiKey) {
      return null; // Sem API key, não tenta
    }
    
    const searchQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1&orientation=square`,
      {
        headers: {
          'Authorization': apiKey,
        },
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return {
        url: photo.src.medium || photo.src.large,
        source: 'pexels',
        width: photo.width,
        height: photo.height,
      };
    }
  } catch (error) {
    console.error('Erro ao buscar no Pexels:', error);
  }
  
  return null;
}

/**
 * Gera URL de placeholder personalizado
 */
function getPlaceholderImage(productName: string, category?: string): ImageSearchResult {
  // Usar um serviço de placeholder com texto
  const text = encodeURIComponent(productName.substring(0, 20));
  const bgColor = category === 'acougue' ? 'FF6B6B' : 
                  category === 'hortifruti' ? '51CF66' :
                  category === 'padaria' ? 'FFD93D' :
                  category === 'bebidas' ? '4DABF7' : '868E96';
  
  return {
    url: `https://via.placeholder.com/400x400/${bgColor}/FFFFFF?text=${text}`,
    source: 'placeholder',
    width: 400,
    height: 400,
  };
}

/**
 * Busca imagem para um produto
 * Tenta múltiplas fontes em ordem de preferência
 */
export async function searchProductImage(
  productName: string,
  category?: string
): Promise<ImageSearchResult> {
  // Verificar cache primeiro
  const cacheKey = `${productName.toLowerCase()}_${category || 'geral'}`;
  const cached = imageCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      url: cached.url,
      source: cached.source as 'unsplash' | 'pexels' | 'placeholder',
      width: 400,
      height: 400,
    };
  }
  
  // Normalizar nome para busca
  const searchQuery = normalizeProductName(productName, category);
  
  // Tentar buscar em ordem de preferência
  let result: ImageSearchResult | null = null;
  
  // 1. Tentar Pexels (melhor qualidade, mas requer API key)
  result = await searchPexels(searchQuery);
  
  // 2. Tentar Unsplash (gratuito, sem API key)
  if (!result) {
    result = await searchUnsplash(searchQuery);
  }
  
  // 3. Fallback para placeholder
  if (!result) {
    result = getPlaceholderImage(productName, category);
  }
  
  // Salvar no cache
  if (result) {
    imageCache.set(cacheKey, {
      url: result.url,
      timestamp: Date.now(),
      source: result.source,
    });
  }
  
  return result;
}

/**
 * Busca imagens em lote (para sincronização)
 */
export async function searchProductImagesBatch(
  products: Array<{ name: string; category?: string }>
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  // Processar em lotes para não sobrecarregar
  const batchSize = 10;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (product) => {
        try {
          const imageResult = await searchProductImage(product.name, product.category);
          results.set(product.name, imageResult.url);
          
          // Pequeno delay para não exceder rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Erro ao buscar imagem para ${product.name}:`, error);
        }
      })
    );
  }
  
  return results;
}

/**
 * Limpa o cache de imagens
 */
export function clearImageCache(): void {
  imageCache.clear();
}

/**
 * Retorna estatísticas do cache
 */
export function getCacheStats(): { size: number; entries: string[] } {
  return {
    size: imageCache.size,
    entries: Array.from(imageCache.keys()),
  };
}

