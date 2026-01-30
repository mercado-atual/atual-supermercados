export interface Produto {
  codigo: string;
  descricao: string;
  gtin: string;
  preco: number;
  estoque: number;
  imagem: string;
  marca?: string; // Marca/Fabricante/Industrializador do produto
}
