export interface Promocao {
  id: string;
  produto: {
    codigo: string;
    descricao: string;
    imagem?: string;
  };
  preco: {
    normal: number;
    promocional: number;
    descontoPercentual: number;
  };
  tipo: "desconto_simples";
  vigencia: {
    inicio: string;
    fim: string;
    ativa: boolean;
  };
  selo?: string;
  origem: "arquivo";
}
