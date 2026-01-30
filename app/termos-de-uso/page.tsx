"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermosDeUsoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Voltar</span>
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
              <FileText className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Termos de Uso
            </h1>
            <p className="text-gray-600">
              Atual Supermercados - Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar o site do Atual Supermercados, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. 
                Se você não concorda com qualquer parte destes termos, não deve utilizar nosso site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Serviços Oferecidos</h2>
              <p>
                O Atual Supermercados oferece uma plataforma de e-commerce para compra de produtos alimentícios e relacionados, 
                com opção de entrega em domicílio. Todos os produtos são comercializados de acordo com a legislação brasileira, 
                especialmente o Código de Defesa do Consumidor (Lei nº 8.078/1990).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cadastro e Conta do Usuário</h2>
              <p>
                Para realizar compras, é necessário criar uma conta fornecendo informações precisas e atualizadas, incluindo:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Nome completo</li>
                <li>CPF válido</li>
                <li>Telefone celular com WhatsApp</li>
                <li>E-mail válido</li>
                <li>Endereço completo para entrega</li>
              </ul>
              <p className="mt-4">
                Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Preços e Pagamento</h2>
              <p>
                Os preços dos produtos estão sujeitos a alterações sem aviso prévio. O preço final será confirmado no momento da finalização do pedido.
                Aceitamos pagamento via PIX, cartão de crédito e cartão de débito. O pagamento é processado de forma segura através de gateways de pagamento certificados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Entrega</h2>
              <p>
                A entrega será realizada no endereço cadastrado. O prazo de entrega será informado no momento da finalização do pedido.
                Produtos vendidos por peso (hortifruti) podem ter pequenas variações no peso final, conforme a pesagem no momento da separação.
                O valor será ajustado de acordo com o peso real do produto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Direitos do Consumidor (CDC)</h2>
              <p>
                Em conformidade com o Código de Defesa do Consumidor, você tem direito a:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Produtos com qualidade e segurança adequadas</li>
                <li>Informações claras sobre produtos e serviços</li>
                <li>Proteção contra práticas abusivas</li>
                <li>Arrependimento da compra em até 7 dias (quando aplicável)</li>
                <li>Troca ou devolução de produtos com defeito</li>
              </ul>
              <p className="mt-4">
                Para mais informações sobre seus direitos, consulte a{" "}
                <Link href="/cdc" className="text-red-600 hover:text-red-700 font-bold underline">
                  página do Código de Defesa do Consumidor
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacidade</h2>
              <p>
                Seus dados pessoais são tratados de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) 
                e nossa Política de Privacidade. Não compartilhamos seus dados com terceiros sem sua autorização, 
                exceto quando necessário para processar pedidos ou cumprir obrigações legais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
              <p>
                O Atual Supermercados não se responsabiliza por danos indiretos, lucros cessantes ou danos morais decorrentes 
                do uso ou impossibilidade de uso do site, exceto nos casos previstos em lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Alterações nos Termos</h2>
              <p>
                Reservamos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor 
                imediatamente após sua publicação no site. É sua responsabilidade revisar periodicamente estes termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato</h2>
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco através da{" "}
                <Link href="/contato" className="text-red-600 hover:text-red-700 font-bold underline">
                  página de contato
                </Link>.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Estes termos estão em conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/1990)
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

