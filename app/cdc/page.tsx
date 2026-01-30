"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { Scale, ArrowLeft, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CDCPage() {
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
              <Scale className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Código de Defesa do Consumidor (CDC)
            </h1>
            <p className="text-gray-600">
              Lei nº 8.078, de 11 de setembro de 1990
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen size={20} />
                O que é o CDC?
              </h2>
              <p>
                O Código de Defesa do Consumidor (CDC) é a lei brasileira que estabelece normas de proteção e defesa do consumidor. 
                Ele garante direitos básicos e estabelece responsabilidades para fornecedores de produtos e serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Principais Direitos do Consumidor</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">1. Direito à Informação</h3>
                  <p className="text-sm">
                    O consumidor tem direito a informações claras, precisas e em língua portuguesa sobre produtos e serviços, 
                    incluindo características, composição, qualidade, preço e riscos.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">2. Direito à Qualidade</h3>
                  <p className="text-sm">
                    Produtos e serviços devem atender às expectativas do consumidor e às normas técnicas de qualidade, 
                    segurança e durabilidade.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">3. Direito de Arrependimento</h3>
                  <p className="text-sm">
                    Em compras realizadas fora do estabelecimento comercial (como compras online), o consumidor pode 
                    se arrepender em até 7 dias, sem necessidade de justificativa.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">4. Direito à Proteção Contra Práticas Abusivas</h3>
                  <p className="text-sm">
                    É proibida qualquer prática que coloque o consumidor em desvantagem excessiva, como cobrança de preços abusivos, 
                    venda casada ou publicidade enganosa.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">5. Direito à Reparação de Danos</h3>
                  <p className="text-sm">
                    O fornecedor é responsável pelos danos causados ao consumidor por defeitos do produto ou serviço, 
                    independentemente de culpa.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">6. Direito à Troca e Devolução</h3>
                  <p className="text-sm">
                    Produtos com defeito ou que não correspondam às características anunciadas podem ser trocados ou devolvidos, 
                    com restituição do valor pago.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsabilidades do Fornecedor</h2>
              <p>
                O Atual Supermercados, como fornecedor, tem as seguintes responsabilidades perante o consumidor:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Fornecer produtos com qualidade adequada</li>
                <li>Informar corretamente sobre características e preços</li>
                <li>Garantir a segurança dos produtos</li>
                <li>Honrar compromissos assumidos</li>
                <li>Reparar danos causados por defeitos</li>
                <li>Respeitar prazos de entrega</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Exercer Seus Direitos</h2>
              <p>
                Se você acredita que seus direitos foram violados:
              </p>
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>
                  <strong>Entre em contato conosco:</strong> Utilize nossa{" "}
                  <Link href="/contato" className="text-red-600 hover:text-red-700 font-bold underline">
                    página de contato
                  </Link>{" "}
                  para relatar o problema.
                </li>
                <li>
                  <strong>Procure o PROCON:</strong> Se não houver solução, você pode procurar o órgão de defesa do consumidor 
                  (PROCON) da sua cidade.
                </li>
                <li>
                  <strong>Considere a Justiça:</strong> Em casos mais graves, você pode buscar a Justiça para reparação de danos.
                </li>
              </ol>
            </section>

            <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Importante</h2>
              <p className="text-sm">
                Esta página é apenas informativa. Para consultar o texto completo da Lei nº 8.078/1990, 
                acesse o site oficial do governo brasileiro ou consulte a legislação em bibliotecas jurídicas.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Links Úteis</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/termos-de-uso" className="text-red-600 hover:text-red-700 font-bold underline">
                  Termos de Uso do Atual Supermercados
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-red-600 hover:text-red-700 font-bold underline">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

