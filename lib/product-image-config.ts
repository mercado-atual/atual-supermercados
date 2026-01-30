/**
 * Configuração de fallback e placeholders por categoria.
 * Ordem de tentativa: image específica -> /fotos-produtos/{id|ean}.jpg -> /produtos/{id}.jpg -> ícone da categoria.
 */

export const FOTOS_PRODUTOS_BASE = "/fotos-produtos";
export const PRODUTOS_BASE = "/produtos";

export type CategoryKey =
  | "acougue"
  | "bebidas"
  | "hortifruti"
  | "padaria"
  | "limpeza"
  | "higiene"
  | "ofertas"
  | "cdc"
  | string;

export const CATEGORY_PLACEHOLDER_LABELS: Record<string, string> = {
  acougue: "Açougue",
  bebidas: "Bebidas",
  hortifruti: "Hortifruti",
  padaria: "Padaria",
  limpeza: "Limpeza",
  higiene: "Higiene",
  ofertas: "Ofertas",
  cdc: "CDC",
};
