/**
 * Categorização de produtos para vitrine de ofertas.
 * Separa por blocos/gêneros: cesta básica, alimentos, limpeza, higiene, bebidas.
 * Não mistura alimentos com sabão, etc.
 */

export type BlocoOferta =
  | "cesta_basica"
  | "alimentos"
  | "bebidas"
  | "limpeza"
  | "higiene"
  | "outros";

export interface ProdutoVitrine {
  id: string;
  title: string;
  price: string;
  unit: string;
  image?: string;
  category: string;
  description?: string;
  marca?: string;
  badge?: string;
  bloco: BlocoOferta;
}

const BLOCO_LABELS: Record<BlocoOferta, string> = {
  cesta_basica: "Cesta Básica",
  alimentos: "Alimentos",
  bebidas: "Bebidas",
  limpeza: "Limpeza e Casa",
  higiene: "Higiene e Beleza",
  outros: "Outros",
};

// Cesta Básica: apenas itens essenciais básicos (arroz, feijão, óleo, açúcar, macarrão, farinha, café, sal, etc.)
// NÃO inclui: biscoitos, bolachas, chocolate, doces, guloseimas
const PALAVRAS_CESTA_BASICA = [
  "arroz", "feijao", "feijão", "oleo", "óleo", "acucar", "açúcar", "macarrao", "macarrão",
  "farinha", "fubá", "fuba", "cafe", "café", "sal", "azeite", "vinagre", "extrato tomate", "molho tomate",
  "milho", "ervilha", "lentilha", "grao", "grão", "grão de bico",
  "leite", "margarina", "manteiga",
];

const PALAVRAS_ALIMENTOS = [
  "alimento", "comida", "conserva", "enlatado", "molho", "tempero", "sopas", "sopa",
  "carne", "frango", "peixe", "bovina", "linguica", "linguiça", "presunto", "mortadela",
  "queijo", "iogurte", "requeijao", "requeijão", "cream cheese", "doce", "geleia",
  "chocolate", "bombom", "bala", "sorvete", "salgadinho", "snack", "pipoca",
  "cereal", "barra", "nutricional", "whey", "suplemento", "vitamina",
  "fruta", "verdura", "legume", "hortaliça", "tomate", "batata", "cebola", "cenoura",
  "alface", "banana", "maca", "maçã", "laranja", "abacaxi", "uva", "mamao", "mamão",
  "pao ", "pão ", "bolo", "torta", "croissant", "baguete", "bolacha", "biscoito",
  "massas", "massa ", "lasanha", "pizza", "hamburguer", "embutido", "leite condensado",
];

const PALAVRAS_BEBIDAS = [
  "bebida", "refrigerante", "suco", "água", "agua", "cerveja", "vinho", "whisky",
  "energetico", "energético", "isotônico", "isotonico", "cha", "chá", "cafe", "café",
  "achocolatado", "nescau", "toddy", "coca", "pepsi", "guarana", "guaraná", "sprite",
  "lata", "garrafa", "pet", "long neck", "litro", "ml", " ml",
];

const PALAVRAS_LIMPEZA = [
  "sabao", "sabão", "detergente", "desinfetante", "alvejante", "agua sanitaria",
  "água sanitária", "limpa", "multiuso", "lustra", "cera", "pano", "esponja",
  "saco lixo", "lixo", "desodorante ambiente", "aromatizante", "inseticida",
  "lavanderia", "amaciante", "sabão líquido", "sabao liquido", "omo", "ype",
  "tixan", "assim", "veja", "qboa", "bombril", "limpol",
];

const PALAVRAS_HIGIENE = [
  "shampoo", "condicionador", "sabonete", "creme", "pasta dental", "escova",
  "papel higienico", "papel higiênico", "toalha papel", "lenco", "lenço",
  "fralda", "absorvente", "barbeador", "desodorante", "protetor solar",
  "higiene", "beleza", "cosmético", "cosmetico", "perfume", "colonia",
  "cotonete", "algodao", "algodão", "creme dental", "enxaguante",
];

function normalizar(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Pré-normalizar listas de palavras uma vez (otimização)
const PALAVRAS_CESTA_BASICA_NORM = PALAVRAS_CESTA_BASICA.map(normalizar);
const PALAVRAS_ALIMENTOS_NORM = PALAVRAS_ALIMENTOS.map(normalizar);
const PALAVRAS_BEBIDAS_NORM = PALAVRAS_BEBIDAS.map(normalizar);
const PALAVRAS_LIMPEZA_NORM = PALAVRAS_LIMPEZA.map(normalizar);
const PALAVRAS_HIGIENE_NORM = PALAVRAS_HIGIENE.map(normalizar);

function contemAlguma(descricaoNormalizada: string, palavrasNormalizadas: string[]): boolean {
  return palavrasNormalizadas.some((p) => descricaoNormalizada.includes(p));
}

export function classificarBlocoOferta(descricao: string): BlocoOferta {
  const d = normalizar(descricao);
  if (contemAlguma(d, PALAVRAS_CESTA_BASICA_NORM)) return "cesta_basica";
  if (contemAlguma(d, PALAVRAS_LIMPEZA_NORM)) return "limpeza";
  if (contemAlguma(d, PALAVRAS_HIGIENE_NORM)) return "higiene";
  if (contemAlguma(d, PALAVRAS_BEBIDAS_NORM)) return "bebidas";
  if (contemAlguma(d, PALAVRAS_ALIMENTOS_NORM)) return "alimentos";
  return "outros";
}

export function getBlocoLabel(bloco: BlocoOferta): string {
  return BLOCO_LABELS[bloco];
}

export const ORDEM_BLOCOS: BlocoOferta[] = [
  "cesta_basica",
  "alimentos",
  "bebidas",
  "limpeza",
  "higiene",
  "outros",
];
