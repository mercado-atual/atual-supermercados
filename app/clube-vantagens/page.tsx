"use client";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Star, Gift, Percent, Truck, CreditCard, UserPlus } from "lucide-react";

export default function ClubeVantagensPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6">
              <Star className="text-white" size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Clube de Vantagens Atual
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Ganhe pontos a cada compra e troque por descontos incríveis!
            </p>
            <Link
              href="#cadastro"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <UserPlus size={24} />
              Quero Participar
            </Link>
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Percent className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Descontos Exclusivos</h3>
              <p className="text-gray-600">
                Acesso a promoções especiais apenas para membros do clube
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Gift className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pontos em Todas as Compras</h3>
              <p className="text-gray-600">
                Acumule pontos e troque por produtos ou descontos
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Truck className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Frete Grátis</h3>
              <p className="text-gray-600">
                Frete grátis em compras acima de R$ 100 para membros
              </p>
            </div>
          </div>

          {/* Como Funciona */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Como Funciona</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cadastre-se</h3>
                  <p className="text-gray-600">
                    Preencha o formulário abaixo e receba seu cartão de membro gratuitamente
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Compre e Ganhe Pontos</h3>
                  <p className="text-gray-600">
                    A cada R$ 1,00 gasto, você ganha 1 ponto. Quanto mais compra, mais pontos acumula!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Troque por Benefícios</h3>
                  <p className="text-gray-600">
                    Use seus pontos para obter descontos, produtos grátis ou frete grátis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Cadastro */}
          <div id="cadastro" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Cadastre-se Agora</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    placeholder="(51) 99999-9999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  placeholder="Rua, número, bairro, cidade"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="termos"
                  name="termos"
                  className="mt-1"
                  required
                />
                <label htmlFor="termos" className="text-sm text-gray-600">
                  Aceito os termos e condições do Clube de Vantagens *
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Cadastrar no Clube
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="text-red-600 hover:text-red-700 font-bold">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

