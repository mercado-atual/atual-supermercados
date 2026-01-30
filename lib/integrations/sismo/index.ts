/**
 * ============================================
 * EXPORTS - INTEGRAÇÃO SISMO PDV
 * ============================================
 * 
 * Este arquivo centraliza todas as exportações da integração SISMO.
 * 
 * Uso:
 * import { sismoService, SismoProduct } from '@/lib/integrations/sismo';
 */

// Exportar service
export { sismoService, SismoService } from './sismo.service';

// Exportar tipos e interfaces
export type {
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




