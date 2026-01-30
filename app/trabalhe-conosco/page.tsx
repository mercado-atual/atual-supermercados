"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { Upload, FileText, User, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export default function TrabalheConoscoPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cargo: "",
    experiencia: "",
    mensagem: "",
    arquivo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, arquivo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Enviar dados para API/email
    showToast("Currículo enviado com sucesso! Entraremos em contato em breve.");
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
      cargo: "",
      experiencia: "",
      mensagem: "",
      arquivo: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Trabalhe Conosco</h1>
            <p className="text-lg text-gray-600">
              Faça parte da equipe do Atual Supermercados! Envie seu currículo e venha crescer conosco.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={24} className="text-red-600" />
                  Dados Pessoais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
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
                      <Mail size={16} className="inline mr-1" />
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
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-1" />
                      Telefone/WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(51) 99999-9999"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-1" />
                      Endereço
                    </label>
                    <input
                      type="text"
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      placeholder="Cidade, Estado"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Informações Profissionais */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={24} className="text-red-600" />
                  Informações Profissionais
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                      Cargo de Interesse *
                    </label>
                    <select
                      id="cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="caixa">Caixa</option>
                      <option value="repositor">Repositor</option>
                      <option value="açougueiro">Açougueiro</option>
                      <option value="padaria">Auxiliar de Padaria</option>
                      <option value="hortifruti">Auxiliar de Hortifruti</option>
                      <option value="gerente">Gerente</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="estoquista">Estoquista</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-2">
                      Experiência Profissional *
                    </label>
                    <textarea
                      id="experiencia"
                      name="experiencia"
                      value={formData.experiencia}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Descreva sua experiência profissional anterior..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Upload de Currículo */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={24} className="text-red-600" />
                  Currículo
                </h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <label htmlFor="arquivo" className="cursor-pointer">
                    <span className="text-red-600 font-medium hover:text-red-700">
                      Clique para fazer upload
                    </span>
                    <span className="text-gray-500"> ou arraste o arquivo aqui</span>
                  </label>
                  <input
                    type="file"
                    id="arquivo"
                    name="arquivo"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  {formData.arquivo && (
                    <p className="mt-2 text-sm text-gray-600">
                      Arquivo selecionado: {formData.arquivo.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)</p>
                </div>
              </div>

              {/* Mensagem Adicional */}
              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem Adicional (Opcional)
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Conte-nos mais sobre você, suas expectativas, disponibilidade..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl active:scale-95"
              >
                Enviar Currículo
              </button>

              <p className="text-xs text-gray-500 text-center">
                * Campos obrigatórios. Seus dados serão tratados com confidencialidade.
              </p>
            </form>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Por que trabalhar no Atual?</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✅ Ambiente de trabalho acolhedor e profissional</li>
              <li>✅ Oportunidades de crescimento e desenvolvimento</li>
              <li>✅ Benefícios competitivos</li>
              <li>✅ Equipe unida e comprometida</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

