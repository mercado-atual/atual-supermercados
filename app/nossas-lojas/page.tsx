"use client";

import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { MapPin, Phone, Clock, Mail, Navigation } from "lucide-react";
import Link from "next/link";

interface Loja {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
}

const lojas: Loja[] = [
  {
    id: "1",
    nome: "Atual Supermercados – Matriz",
    endereco: "Av. Lupicínio Rodrigues, 1115 – Guaíba/RS",
    telefone: "(51) 3480-1234",
    email: "contato@atualsupermercados.com.br",
    horario: "Segunda a Sábado: 8h às 22h | Domingo: 8h às 20h",
    coordenadas: { lat: -30.1136, lng: -51.3256 },
  },
  {
    id: "2",
    nome: "Atual Supermercados – Filial (Atual do Conde)",
    endereco: "Estr. Ismael Chaves Barcelos, 680 – Guaíba/RS",
    telefone: "(51) 3480-5678",
    email: "contato@atualsupermercados.com.br",
    horario: "Segunda a Sábado: 8h às 22h | Domingo: 8h às 20h",
    coordenadas: { lat: -30.1200, lng: -51.3300 },
  },
];

export default function NossasLojasPage() {
  const abrirNoGoogleMaps = (loja: Loja) => {
    // Criar URL do Google Maps com rota automática
    // Usa o endereço completo para melhor precisão
    const enderecoEncoded = encodeURIComponent(loja.endereco);
    // Formato de direções que já sugere a rota
    const url = `https://www.google.com/maps/dir/?api=1&destination=${enderecoEncoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nossas Lojas</h1>
            <p className="text-lg text-gray-600">
              Encontre a loja Atual Supermercados mais próxima de você
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lojas.map((loja) => (
              <div
                key={loja.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{loja.nome}</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Endereço</p>
                      <p className="text-gray-600">{loja.endereco}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Telefone</p>
                      <a
                        href={`tel:${loja.telefone}`}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        {loja.telefone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">E-mail</p>
                      <a
                        href={`mailto:${loja.email}`}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        {loja.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Horário de Funcionamento</p>
                      <p className="text-gray-600">{loja.horario}</p>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loja.endereco)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    <Navigation size={20} />
                    Abrir no Google Maps
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Mapa ou Informações Adicionais */}
          <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Como Chegar</h3>
            <p className="text-gray-700 mb-4">
              Todas as nossas lojas estão estrategicamente localizadas para facilitar o acesso dos nossos clientes.
              Clique em &quot;Ver no Google Maps&quot; para obter rotas detalhadas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-black text-red-600 mb-2">20+</div>
                <p className="text-gray-600">Anos de Experiência</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-red-600 mb-2">2</div>
                <p className="text-gray-600">Lojas em Guaíba</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-red-600 mb-2">100%</div>
                <p className="text-gray-600">Satisfação do Cliente</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

