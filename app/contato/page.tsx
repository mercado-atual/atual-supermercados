"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useToast } from "@/contexts/ToastContext";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContatoPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Enviar dados para API/email
    showToast("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({
      nome: "",
      email: "",
      assunto: "",
      mensagem: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Fale Conosco</h1>
            <p className="text-lg text-gray-600">
              Tem alguma dúvida, sugestão ou quer entrar em contato? Estamos aqui para ajudar!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações de Contato */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Phone className="text-red-600 mb-4" size={24} />
                <h3 className="font-bold text-gray-900 mb-2">Telefone</h3>
                <a href="tel:+555134801234" className="text-red-600 hover:text-red-700 transition-colors">
                  (51) 3480-1234
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Mail className="text-red-600 mb-4" size={24} />
                <h3 className="font-bold text-gray-900 mb-2">E-mail</h3>
                <a href="mailto:contato@atualsupermercados.com.br" className="text-red-600 hover:text-red-700 transition-colors">
                  contato@atualsupermercados.com.br
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <MapPin className="text-red-600 mb-4" size={24} />
                <h3 className="font-bold text-gray-900 mb-2">Endereço</h3>
                <p className="text-gray-600 text-sm">
                  Av. Principal, 1234<br />
                  Centro, Guaíba - RS
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Clock className="text-red-600 mb-4" size={24} />
                <h3 className="font-bold text-gray-900 mb-2">Horário</h3>
                <p className="text-gray-600 text-sm">
                  Segunda a Sábado: 8h às 22h<br />
                  Domingo: 8h às 20h
                </p>
              </div>
            </div>

            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
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
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <input
                      type="text"
                      id="assunto"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      placeholder="Ex: Dúvida sobre produto, sugestão, reclamação..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Escreva sua mensagem aqui..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
