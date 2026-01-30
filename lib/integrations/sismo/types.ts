/**
 * ============================================
 * TIPOS E INTERFACES - INTEGRAÇÃO SISMO PDV
 * ============================================
 * 
 * Este arquivo define as interfaces TypeScript para comunicação
 * com a API da SISMO (PDV).
 * 
 * IMPORTANTE: Estas interfaces são baseadas em suposições genéricas.
 * Quando a documentação real da API SISMO estiver disponível,
 * ajuste estas interfaces conforme necessário.
 */

/**
 * Categoria de produto conforme estrutura da SISMO
 */
export interface SismoCategory {
  /** ID único da categoria no sistema SISMO */
  id: string;
  /** Nome da categoria */
  name: string;
  /** Código/sigla da categoria */
  code?: string;
  /** Categoria pai (para hierarquia) */
  parentId?: string;
  /** Ordem de exibição */
  displayOrder?: number;
  /** Status ativo/inativo */
  active: boolean;
}

/**
 * Produto conforme estrutura da SISMO
 */
export interface SismoProduct {
  /** ID único do produto no sistema SISMO */
  id: string;
  /** Código de barras/EAN */
  barcode?: string;
  /** Código interno do produto */
  code: string;
  /** Nome/título do produto */
  name: string;
  /** Descrição do produto */
  description?: string;
  /** ID da categoria */
  categoryId: string;
  /** Unidade de medida (kg, un, l, etc) */
  unit: string;
  /** URL da imagem do produto */
  imageUrl?: string;
  /** Status ativo/inativo */
  active: boolean;
  /** Data de criação */
  createdAt?: string;
  /** Data de última atualização */
  updatedAt?: string;
}

/**
 * Preço do produto conforme estrutura da SISMO
 */
export interface SismoPrice {
  /** ID único do preço */
  id: string;
  /** ID do produto */
  productId: string;
  /** Preço de venda (em centavos ou valor decimal) */
  salePrice: number;
  /** Preço de custo (opcional) */
  costPrice?: number;
  /** Preço promocional (opcional) */
  promotionalPrice?: number;
  /** Data de início da promoção */
  promotionStartDate?: string;
  /** Data de fim da promoção */
  promotionEndDate?: string;
  /** Unidade de preço (por kg, por unidade, etc) */
  priceUnit: string;
  /** Data de última atualização */
  updatedAt: string;
}

/**
 * Estoque do produto conforme estrutura da SISMO
 */
export interface SismoStock {
  /** ID único do registro de estoque */
  id: string;
  /** ID do produto */
  productId: string;
  /** Quantidade disponível em estoque */
  quantity: number;
  /** Quantidade mínima (ponto de reposição) */
  minQuantity?: number;
  /** Quantidade máxima */
  maxQuantity?: number;
  /** Localização/armazém */
  location?: string;
  /** Status de disponibilidade */
  available: boolean;
  /** Data de última atualização */
  updatedAt: string;
}

/**
 * Resposta da API SISMO para listagem de produtos
 */
export interface SismoProductsResponse {
  /** Lista de produtos */
  products: SismoProduct[];
  /** Total de registros */
  total: number;
  /** Página atual */
  page?: number;
  /** Itens por página */
  limit?: number;
}

/**
 * Resposta da API SISMO para preços
 */
export interface SismoPricesResponse {
  /** Lista de preços */
  prices: SismoPrice[];
  /** Total de registros */
  total: number;
}

/**
 * Resposta da API SISMO para estoque
 */
export interface SismoStockResponse {
  /** Lista de estoques */
  stocks: SismoStock[];
  /** Total de registros */
  total: number;
}

/**
 * Resposta da API SISMO para categorias
 */
export interface SismoCategoriesResponse {
  /** Lista de categorias */
  categories: SismoCategory[];
  /** Total de registros */
  total: number;
}

/**
 * Configuração de conexão com a API SISMO
 */
export interface SismoConfig {
  /** URL base da API SISMO */
  baseUrl: string;
  /** Token de autenticação */
  apiKey?: string;
  /** Timeout para requisições (em ms) */
  timeout?: number;
  /** Headers customizados */
  headers?: Record<string, string>;
}

/**
 * Erro retornado pela API SISMO
 */
export interface SismoError {
  /** Código do erro */
  code: string;
  /** Mensagem de erro */
  message: string;
  /** Detalhes adicionais */
  details?: Record<string, unknown>;
}




