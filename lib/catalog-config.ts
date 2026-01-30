/**
 * ============================================
 * CONFIGURAÇÃO: MODO CATÁLOGO
 * ============================================
 * 
 * Este arquivo controla se o site está em modo CATÁLOGO (sem vendas)
 * ou modo NORMAL (com vendas habilitadas).
 * 
 * Para REATIVAR as vendas:
 * 1. Altere CATALOG_MODE para false
 * 2. Todas as funcionalidades de compra serão reativadas automaticamente
 * 
 * Para DESATIVAR as vendas (modo catálogo):
 * 1. Altere CATALOG_MODE para true
 * 2. Todas as funcionalidades de compra serão bloqueadas
 */

export const CATALOG_MODE = true;

export const CATALOG_MESSAGE = "Compras online em breve.";

// Textos alternativos para botões em modo catálogo
export const CATALOG_BUTTON_TEXT = "Disponível na loja";
export const CATALOG_BUTTON_TEXT_SHORT = "Disponível";

