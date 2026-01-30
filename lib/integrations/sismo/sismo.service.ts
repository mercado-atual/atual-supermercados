/**
 * ============================================
 * SERVICE - INTEGRAÇÃO SISMO PDV
 * ============================================
 * 
 * Este service contém métodos placeholder/mockados para integração
 * com a API da SISMO (PDV).
 * 
 * IMPORTANTE: 
 * - Os métodos atuais retornam dados mockados
 * - Quando a API real da SISMO estiver disponível, substitua as
 *   implementações mockadas por chamadas HTTP reais
 * - Configure as variáveis de ambiente necessárias (URL, API Key, etc)
 * 
 * ONDE CONECTAR A API REAL:
 * - Substitua os métodos mockados por chamadas fetch/axios
 * - Use as interfaces definidas em types.ts
 * - Adicione tratamento de erros adequado
 * - Implemente cache/retry se necessário
 */

import type {
  SismoProduct,
  SismoPrice,
  SismoStock,
  SismoCategory,
  SismoProductsResponse,
  SismoPricesResponse,
  SismoStockResponse,
  SismoCategoriesResponse,
  SismoConfig,
  SismoError,
} from './types';

/**
 * Configuração da API SISMO
 * TODO: Mover para variáveis de ambiente quando a API estiver disponível
 */
const SISMO_CONFIG: SismoConfig = {
  baseUrl: process.env.SISMO_API_URL || 'https://api.sismo.com.br',
  apiKey: process.env.SISMO_API_KEY || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    // TODO: Adicionar header de autenticação quando disponível
    // 'Authorization': `Bearer ${process.env.SISMO_API_KEY}`,
  },
};

/**
 * Service para integração com a API SISMO
 */
class SismoService {
  private config: SismoConfig;

  constructor(config: SismoConfig = SISMO_CONFIG) {
    this.config = config;
  }

  /**
   * Busca lista de produtos
   * 
   * TODO: Substituir por chamada real à API SISMO
   * Exemplo: GET {baseUrl}/api/products?page={page}&limit={limit}
   */
  async getProducts(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
  }): Promise<SismoProductsResponse> {
    // MOCK: Retornando dados simulados
    // TODO: Implementar chamada HTTP real
    // const response = await fetch(`${this.config.baseUrl}/api/products`, {
    //   method: 'GET',
    //   headers: this.config.headers,
    //   ...
    // });

    const mockProducts: SismoProduct[] = [
      {
        id: '1',
        code: 'PROD001',
        name: 'Produto Exemplo',
        description: 'Descrição do produto',
        categoryId: '1',
        unit: 'un',
        active: true,
      },
    ];

    return {
      products: mockProducts,
      total: mockProducts.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  }

  /**
   * Busca produto por ID
   * 
   * TODO: Substituir por chamada real à API SISMO
   * Exemplo: GET {baseUrl}/api/products/{id}
   */
  async getProductById(id: string): Promise<SismoProduct | null> {
    // MOCK: Retornando dados simulados
    // TODO: Implementar chamada HTTP real

    return {
      id,
      code: `PROD${id}`,
      name: 'Produto Exemplo',
      description: 'Descrição do produto',
      categoryId: '1',
      unit: 'un',
      active: true,
    };
  }

  /**
   * Busca preços dos produtos
   * 
   * TODO: Substituir por chamada real à API SISMO
   * Exemplo: GET {baseUrl}/api/prices?productIds={ids}
   */
  async getPrices(params?: {
    productIds?: string[];
    categoryId?: string;
  }): Promise<SismoPricesResponse> {
    // MOCK: Retornando dados simulados
    // TODO: Implementar chamada HTTP real

    const mockPrices: SismoPrice[] = [
      {
        id: '1',
        productId: '1',
        salePrice: 10.99,
        priceUnit: 'un',
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      prices: mockPrices,
      total: mockPrices.length,
    };
  }

  /**
   * Busca preço de um produto específico
   * 
   * TODO: Substituir por chamada real à API SISMO
   * Exemplo: GET {baseUrl}/api/prices/{productId}
   */
  async getPriceByProductId(productId: string): Promise<SismoPrice | null> {
    // MOCK: Retornando dados simulados
    // TODO: Implementar chamada HTTP real

    return {
      id: '1',
      productId,
      salePrice: 10.99,
      priceUnit: 'un',
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Busca estoque dos produtos
   * 
   * TODO: Substituir por chamada real à API SISMO
   * Exemplo: GET {baseUrl}/api/stock?productIds={ids}
   */
  async getStock(params?: {
    productIds?: string[];
    categoryId?: string;
    availableOnly?: boolean;
  }): Promise<SismoStockResponse> {
    // MOCK: Retornando dados simulados
    // TODO: Implementar chamada HTTP real

    const mockStocks: SismoStock[] = [
      {
        id: '1',
        productId: '1',
        quantity: 100,
        minQuantity: 10,
        available: true,
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      stocks: mockStocks,
      total: mockStocks.length,
    };
  }

  /**
   * Busca estoque de um produto específico
   * 
   * TODO: Substituir por chamada real à API SISMO
   * Exemplo: GET {baseUrl}/api/stock/{productId}
   */
  async getStockByProductId(productId: string): Promise<SismoStock | null> {
    // MOCK: Retornando dados simulados
    // TODO: Implementar chamada HTTP real

    return {
      id: '1',
      productId,
      quantity: 100,
      minQuantity: 10,
      available: true,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Busca categorias
   * 
   * TODO: Substituir por chamada real à API SISMO
   * Exemplo: GET {baseUrl}/api/categories
   */
  async getCategories(params?: {
    activeOnly?: boolean;
    parentId?: string;
  }): Promise<SismoCategoriesResponse> {
    // MOCK: Retornando dados simulados
    // TODO: Implementar chamada HTTP real

    const mockCategories: SismoCategory[] = [
      {
        id: '1',
        name: 'Hortifruti',
        code: 'HORT',
        active: true,
      },
      {
        id: '2',
        name: 'Açougue',
        code: 'ACOU',
        active: true,
      },
    ];

    return {
      categories: mockCategories,
      total: mockCategories.length,
    };
  }

  /**
   * Busca categoria por ID
   * 
   * TODO: Substituir por chamada real à API SISMO
   * Exemplo: GET {baseUrl}/api/categories/{id}
   */
  async getCategoryById(id: string): Promise<SismoCategory | null> {
    // MOCK: Retornando dados simulados
    // TODO: Implementar chamada HTTP real

    return {
      id,
      name: 'Categoria Exemplo',
      code: 'CAT',
      active: true,
    };
  }

  /**
   * Atualiza configuração do service
   */
  updateConfig(config: Partial<SismoConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Retorna configuração atual
   */
  getConfig(): SismoConfig {
    return { ...this.config };
  }
}

// Exportar instância singleton
export const sismoService = new SismoService();

// Exportar classe para casos onde múltiplas instâncias são necessárias
export { SismoService };




