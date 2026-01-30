/**
 * ============================================
 * DEPARTAMENTOS DA NAVEGAÇÃO (SUPERMERCADO)
 * ============================================
 *
 * O Atual é supermercado: mostramos APENAS departamentos de supermercado.
 * Não incluímos eletrônicos, móveis, telefonia etc. (como o Carrefour
 * hipermercado tem, mas nós não temos).
 *
 * Use esta lista no menu do site para manter consistência.
 */

export type TipoLinkNav = "departamento" | "oferta" | "institucional";

export interface ItemNavDepartamento {
  href: string;
  label: string;
  emoji?: string;
  tipo: TipoLinkNav;
  /** Destaque visual (texto amarelo) */
  destaque?: boolean;
  /** Destaque com fundo (ex: Dicas & Receitas) */
  destaqueComBg?: boolean;
}

/** Lista completa para o dropdown "Departamentos" (hamburger). */
export const DEPARTAMENTOS_SUPERMERCADO: ItemNavDepartamento[] = [
  { href: "/ofertas", label: "OFERTAS", emoji: "🎯", tipo: "oferta" },
  { href: "/hortifruti", label: "HORTIFRUTI (FEIRA)", emoji: "🥬", tipo: "departamento" },
  { href: "/acougue", label: "AÇOUGUE (CHURRASCO)", emoji: "🥩", tipo: "departamento" },
  { href: "/padaria", label: "PADARIA", emoji: "🍞", tipo: "departamento" },
  { href: "/bebidas", label: "BEBIDAS", emoji: "🍺", tipo: "departamento" },
  { href: "/limpeza", label: "LIMPEZA", emoji: "🧹", tipo: "departamento" },
  { href: "/blog", label: "DICAS & RECEITAS", emoji: "📖", tipo: "institucional", destaque: true, destaqueComBg: true },
  { href: "/rastrear-pedido", label: "RASTREAR PEDIDO", emoji: "📦", tipo: "institucional", destaque: true },
];

/** Links da barra horizontal (direita): Ofertas, Feira, Bebidas, Churrasco, Limpeza, etc. */
export const BARRA_LINKS_RAPIDOS: { href: string; label: string }[] = [
  { href: "/ofertas", label: "OFERTAS" },
  { href: "/hortifruti", label: "FEIRA" },
  { href: "/bebidas", label: "BEBIDAS" },
  { href: "/acougue", label: "CHURRASCO" },
  { href: "/limpeza", label: "LIMPEZA" },
  { href: "/padaria", label: "PADARIA" },
];
