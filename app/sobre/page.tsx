"use client";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { Award, Heart, Users, Clock } from "lucide-react";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Sobre Nós</h1>
            <p className="text-lg text-gray-600">
              Conheça a história do Atual Supermercados
            </p>
          </div>

          {/* História */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Há mais de 20 anos, o Atual Supermercados nasceu com a missão de oferecer qualidade,
              economia e excelência no atendimento para as famílias de Guaíba e região.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Começamos como uma pequena loja de bairro e, com muito trabalho, dedicação e o apoio
              dos nossos clientes, crescemos para nos tornarmos uma referência em supermercados na região.
              Hoje, somos reconhecidos pela qualidade dos nossos produtos, especialmente no setor de
              hortifruti, açougue e padaria.
            </p>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Heart className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nossa Missão</h3>
              <p className="text-gray-600">
                Proporcionar uma experiência de compra agradável, com ofertas especiais,
                produtos frescos e atendimento de excelência para toda a família.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Award className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nossa Visão</h3>
              <p className="text-gray-600">
                Ser o supermercado preferido da região, reconhecido pela qualidade,
                variedade e compromisso com nossos clientes.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nossos Valores</h3>
              <p className="text-gray-600">
                Qualidade, honestidade, respeito ao cliente, compromisso com a comunidade
                e inovação constante.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Horário de Funcionamento</h3>
              <p className="text-gray-600">
                <strong>Segunda a Sábado:</strong> 8h às 22h<br />
                <strong>Domingo:</strong> 8h às 20h
              </p>
            </div>
          </div>

          {/* Diferenciais */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nossos Diferenciais</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-red-600 mb-2">20+</div>
                <p className="text-gray-700 font-medium">Anos de Experiência</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-red-600 mb-2">100%</div>
                <p className="text-gray-700 font-medium">Produtos Selecionados</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-red-600 mb-2">2</div>
                <p className="text-gray-700 font-medium">Lojas em Guaíba</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
