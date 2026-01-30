"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronDown, Search, ShoppingCart, Package, CreditCard, Truck, User } from "lucide-react";

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    categoria: "Compras",
    pergunta: "Como faço uma compra no site?",
    resposta: "É muito simples! Navegue pelos produtos, adicione ao carrinho e finalize sua compra. Você pode buscar produtos pela barra de pesquisa ou navegar pelas categorias.",
  },
  {
    id: "2",
    categoria: "Compras",
    pergunta: "Posso retirar meu pedido na loja?",
    resposta: "Sim! Oferecemos a opção de retirada na loja. Ao finalizar sua compra, escolha a opção 'Retirada na Loja' e selecione a unidade mais próxima.",
  },
  {
    id: "3",
    categoria: "Entrega",
    pergunta: "Qual o prazo de entrega?",
    resposta: "O prazo de entrega varia conforme sua região. Em média, entregamos em 24-48 horas para a região de Guaíba. Consulte o prazo exato no carrinho antes de finalizar.",
  },
  {
    id: "4",
    categoria: "Entrega",
    pergunta: "Qual o valor do frete?",
    resposta: "O frete é calculado conforme a distância e peso dos produtos. Membros do Clube de Vantagens têm frete grátis em compras acima de R$ 100.",
  },
  {
    id: "5",
    categoria: "Pagamento",
    pergunta: "Quais formas de pagamento são aceitas?",
    resposta: "Aceitamos cartões de crédito (Visa, Mastercard, Elo), débito, PIX e dinheiro na entrega. Também aceitamos vale-alimentação e vale-refeição.",
  },
  {
    id: "6",
    categoria: "Pagamento",
    pergunta: "Meu pagamento é seguro?",
    resposta: "Sim! Utilizamos tecnologia de criptografia SSL para garantir a segurança de todas as transações. Seus dados estão protegidos.",
  },
  {
    id: "7",
    categoria: "Produtos",
    pergunta: "Os produtos são frescos?",
    resposta: "Sim! Trabalhamos apenas com fornecedores certificados e nossos produtos são selecionados diariamente para garantir máxima qualidade e frescor.",
  },
  {
    id: "8",
    categoria: "Produtos",
    pergunta: "E se o produto estiver fora de estoque?",
    resposta: "Se um produto estiver fora de estoque, você será notificado. Podemos adicionar você em uma lista de espera e avisar quando o produto estiver disponível novamente.",
  },
  {
    id: "9",
    categoria: "Clube",
    pergunta: "Como faço parte do Clube de Vantagens?",
    resposta: "É fácil! Acesse a página do Clube de Vantagens, preencha o formulário de cadastro e receba seu cartão gratuitamente. Comece a acumular pontos na sua primeira compra!",
  },
  {
    id: "10",
    categoria: "Clube",
    pergunta: "Como funcionam os pontos?",
    resposta: "A cada R$ 1,00 gasto, você ganha 1 ponto. Acumule pontos e troque por descontos, produtos grátis ou frete grátis. Quanto mais compra, mais benefícios!",
  },
];

const categorias = ["Todos", "Compras", "Entrega", "Pagamento", "Produtos", "Clube"];

export default function AjudaPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [perguntaAberta, setPerguntaAberta] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const faqsFiltradas = faqs.filter((faq) => {
    const matchCategoria = categoriaFiltro === "Todos" || faq.categoria === categoriaFiltro;
    const matchBusca =
      busca === "" ||
      faq.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Central de Ajuda</h1>
            <p className="text-lg text-gray-600 mb-8">
              Encontre respostas para suas dúvidas mais frequentes
            </p>

            {/* Busca */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar ajuda..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Filtros por Categoria */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  categoriaFiltro === cat
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-4 mb-12">
            {faqsFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma pergunta encontrada com esses filtros.</p>
              </div>
            ) : (
              faqsFiltradas.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setPerguntaAberta(perguntaAberta === faq.id ? null : faq.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="text-xs font-bold text-red-600 uppercase mb-1 block">
                        {faq.categoria}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{faq.pergunta}</h3>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform ${
                        perguntaAberta === faq.id ? "transform rotate-180" : ""
                      }`}
                      size={24}
                    />
                  </button>
                  {perguntaAberta === faq.id && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.resposta}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Links Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <Link
              href="/contato"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                  <User className="text-red-600 group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Fale Conosco</h3>
                  <p className="text-sm text-gray-600">Não encontrou o que procurava? Entre em contato</p>
                </div>
              </div>
            </Link>

            <Link
              href="/clube-vantagens"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                  <Package className="text-yellow-600 group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Clube de Vantagens</h3>
                  <p className="text-sm text-gray-600">Saiba mais sobre benefícios e pontos</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Contato Direto */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ainda precisa de ajuda?</h3>
            <p className="text-gray-700 mb-6">
              Nossa equipe está pronta para ajudar você!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contato"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Enviar Mensagem
              </Link>
              <a
                href="tel:+555134801234"
                className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors"
              >
                Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

