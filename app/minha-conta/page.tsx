"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { User, Star, Bell, Package, MapPin, Mail, Phone, LogOut, Settings, Gift, Edit, Save, X } from "lucide-react";
import Link from "next/link";

export default function MinhaContaPage() {
  const { user, logout, updateNotificationPreferences, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [notificacoesEmail, setNotificacoesEmail] = useState(user?.notificacoesEmail ?? true);
  const [notificacoesSMS, setNotificacoesSMS] = useState(user?.notificacoesSMS ?? true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    telefone: user?.telefone || "",
    endereco: user?.endereco || "",
    cpf: user?.cpf || "",
  });

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/auth/login");
    }
    return null;
  }

  const handleLogout = () => {
    logout();
    showToast("Você saiu da sua conta");
    router.push("/");
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    await updateNotificationPreferences(notificacoesEmail, notificacoesSMS);
    showToast("Preferências salvas com sucesso!");
    setSaving(false);
  };

  const handleStartEdit = () => {
    setEditData({
      telefone: user?.telefone || "",
      endereco: user?.endereco || "",
      cpf: user?.cpf || "",
    });
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditData({
      telefone: user?.telefone || "",
      endereco: user?.endereco || "",
      cpf: user?.cpf || "",
    });
  };

  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) return false;
    
    return true;
  };

  const handleSaveEdit = async () => {
    // Validar CPF se estiver sendo preenchido
    if (editData.cpf && editData.cpf.trim() !== "") {
      const cpfNumbers = editData.cpf.replace(/\D/g, "");
      if (cpfNumbers.length !== 11) {
        showToast("CPF deve ter 11 dígitos", "error");
        return;
      }
      
      if (!validateCPF(editData.cpf)) {
        showToast("CPF inválido. Verifique os dígitos.", "error");
        return;
      }
    } else if (!user.cpf || user.cpf.trim() === "") {
      // Se CPF não existe e não está sendo preenchido, bloquear
      showToast("CPF é obrigatório. Preencha o CPF para continuar.", "error");
      return;
    }

    setSaving(true);
    try {
      await updateUser({
        telefone: editData.telefone,
        endereco: editData.endereco,
        cpf: editData.cpf,
        totalCompras: user?.totalCompras || 0, // Enviar totalCompras para validação no backend
      });
      showToast("Dados atualizados com sucesso!");
      setEditing(false);
    } catch (error: any) {
      // Exibir mensagem de erro específica do backend, se disponível
      const errorMessage = error?.message || "Erro ao salvar alterações. Tente novamente.";
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-8 mb-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={40} />
                </div>
                <div>
                  <h1 className="text-3xl font-black mb-1">{user.nome}</h1>
                  <p className="text-red-100">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black mb-1 flex items-center gap-2">
                  <Star className="text-yellow-300" size={32} />
                  {user.pontos.toLocaleString("pt-BR")}
                </div>
                <p className="text-red-100">Pontos acumulados</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Lateral */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-2">
                <Link
                  href="/minha-conta"
                  className="flex items-center gap-3 p-3 rounded-lg bg-red-50 text-red-700 font-medium"
                >
                  <User size={20} />
                  Meu Perfil
                </Link>
                <Link
                  href="/minha-conta/pedidos"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Package size={20} />
                  Meus Pedidos
                </Link>
                <Link
                  href="/minha-conta/pontos"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <Gift size={20} />
                  Meus Pontos
                </Link>
                <Link
                  href="/minha-conta/enderecos"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <MapPin size={20} />
                  Endereços
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left"
                >
                  <LogOut size={20} />
                  Sair
                </button>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações Pessoais */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <User size={24} />
                    Informações Pessoais
                  </h2>
                  {!editing ? (
                    <button
                      onClick={handleStartEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="Editar dados"
                    >
                      <Edit size={18} />
                      <span className="font-medium">Editar</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <X size={18} />
                        <span>Cancelar</span>
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Save size={18} />
                        <span>Salvar</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <p className="text-gray-900 font-medium">{user.nome}</p>
                    <p className="text-xs text-gray-500 mt-1">Nome não pode ser alterado</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF <span className="text-red-600 font-bold">*</span>
                    </label>
                    {!user.cpf || user.cpf.trim() === "" ? (
                      // CPF ausente - FORÇAR preenchimento
                      <div className="space-y-2">
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 mb-2">
                          <p className="text-sm text-red-800 font-medium">
                            ⚠️ Cadastro incompleto: CPF é obrigatório para finalizar compras.
                          </p>
                        </div>
                        <Link
                          href="/minha-conta/complete-cpf"
                          className="block w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-center"
                        >
                          Completar CPF Agora
                        </Link>
                      </div>
                    ) : editing ? (
                      <>
                        <input
                          type="text"
                          value={editData.cpf}
                          onChange={(e) => {
                            const formatted = formatCPF(e.target.value);
                            setEditData({ ...editData, cpf: formatted });
                          }}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          disabled={(user?.totalCompras || 0) > 0}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none ${
                            (user?.totalCompras || 0) > 0 ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                        {(user?.totalCompras || 0) > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            O CPF pode ser alterado até a primeira compra.
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {user.cpf && user.cpf.length === 11 
                          ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                          : user.cpf}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Mail size={16} />
                      E-mail
                    </label>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">E-mail não pode ser alterado</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Phone size={16} />
                      Telefone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={editData.telefone}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          setEditData({ ...editData, telefone: formatted });
                        }}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.telefone}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <MapPin size={16} />
                      Endereço
                    </label>
                    {editing ? (
                      <textarea
                        value={editData.endereco}
                        onChange={(e) => setEditData({ ...editData, endereco: e.target.value })}
                        placeholder="Rua, número, complemento, bairro, cidade - estado, CEP"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium whitespace-pre-line">{user.endereco}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Preferências de Notificação */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Bell size={24} />
                  Notificações e Ofertas
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Receber ofertas por E-mail</p>
                        <p className="text-sm text-gray-600">
                          Receba promoções exclusivas e novidades no seu e-mail
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoesEmail}
                        onChange={(e) => setNotificacoesEmail(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">Receber ofertas por SMS/WhatsApp</p>
                        <p className="text-sm text-gray-600">
                          Receba alertas de promoções e ofertas relâmpago no seu celular
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificacoesSMS}
                        onChange={(e) => setNotificacoesSMS(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Salvando..." : "Salvar Preferências"}
                  </button>
                </div>
              </div>

              {/* Resumo de Pontos */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-sm p-6 text-yellow-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Seus Pontos</h3>
                    <p className="text-yellow-800 text-sm">
                      Continue comprando para acumular mais pontos!
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black">{user.pontos.toLocaleString("pt-BR")}</div>
                    <p className="text-sm text-yellow-800">pontos disponíveis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

