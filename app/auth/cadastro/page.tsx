"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { UserPlus, Mail, Lock, Phone, MapPin, FileText, Bell, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";

interface Address {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    cpf: "", // CPF como PRIMEIRO campo obrigatório
    nome: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    notificacoesEmail: true,
    notificacoesSMS: true,
    aceiteTermos: false, // Aceite obrigatório dos Termos de Uso
  });
  const [address, setAddress] = useState<Address>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "RS", // Estado fixo: Rio Grande do Sul
  });
  const [loading, setLoading] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, "");
    
    // Verificar se tem 11 dígitos
    if (numbers.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    let remainder;
    
    // Validar primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) return false;
    
    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) return false;
    
    return true;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{0,3})/, "$1-$2").replace(/-$/, "");
  };

  const validatePhone = (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, "");
    return numbers.length >= 10 && numbers.length <= 11;
  };

  const fetchCEP = async (cep: string) => {
    const numbers = cep.replace(/\D/g, "");
    if (numbers.length !== 8) return;
    
    setLoadingCEP(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        showToast("CEP não encontrado", "error");
        setLoadingCEP(false);
        return;
      }
      
      // Mapear corretamente os campos da API ViaCEP
      const logradouro = data.logradouro || "";
      const bairro = data.bairro || "";
      const localidade = data.localidade || "";
      const uf = data.uf || "";
      
      if (!logradouro) {
        showToast("CEP válido, mas logradouro não encontrado. Preencha manualmente.", "error");
        setLoadingCEP(false);
        return;
      }
      
      setAddress(prev => ({
        ...prev,
        rua: logradouro, // logradouro → Rua (sempre preenchido automaticamente)
        bairro: bairro, // bairro → Bairro
        cidade: localidade, // localidade → Cidade
        estado: "RS", // Estado fixo: Rio Grande do Sul
      }));
      
      showToast("Endereço preenchido automaticamente!", "success");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      showToast("Erro ao buscar CEP. Tente novamente.", "error");
    } finally {
      setLoadingCEP(false);
    }
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setAddress(prev => ({ ...prev, cep: formatted }));
    
    // Buscar CEP quando tiver 8 dígitos
    const numbers = formatted.replace(/\D/g, "");
    if (numbers.length === 8) {
      fetchCEP(formatted);
    }
  };

  const sendVerificationCode = async () => {
    // Validar CPF PRIMEIRO (campo obrigatório)
    if (!formData.cpf.trim()) {
      showToast("Preencha o CPF", "error");
      return;
    }
    
    const cpfNumbers = formData.cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      showToast("CPF deve ter 11 dígitos", "error");
      return;
    }
    
    if (!validateCPF(formData.cpf)) {
      showToast("CPF inválido. Verifique os dígitos.", "error");
      return;
    }
    
    // Validar campos básicos antes de enviar código
    if (!formData.nome.trim()) {
      showToast("Preencha o nome completo", "error");
      return;
    }
    
    if (!formData.telefone || !validatePhone(formData.telefone)) {
      showToast("Telefone inválido. Use o formato (XX) XXXXX-XXXX", "error");
      return;
    }
    
    if (!formData.email.trim()) {
      showToast("Preencha o e-mail", "error");
      return;
    }
    
    if (!address.cep || address.cep.replace(/\D/g, "").length !== 8) {
      showToast("CEP inválido", "error");
      return;
    }
    
    if (!address.rua.trim()) {
      showToast("Rua não pode ficar vazia. Verifique o CEP.", "error");
      return;
    }
    
    if (!address.numero.trim()) {
      showToast("Preencha o número do endereço", "error");
      return;
    }
    
    if (!address.bairro.trim()) {
      showToast("Bairro não pode ficar vazio. Verifique o CEP.", "error");
      return;
    }
    
    if (!address.cidade.trim()) {
      showToast("Cidade não pode ficar vazia. Verifique o CEP.", "error");
      return;
    }
    
    if (!address.estado.trim()) {
      showToast("Estado não pode ficar vazio. Verifique o CEP.", "error");
      return;
    }

    // Simular envio de código (em produção, integrar com SMS/WhatsApp)
    setCodeSent(true);
    setShowVerification(true);
    showToast("Código de confirmação enviado para seu WhatsApp!", "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se ainda não mostrou verificação, enviar código primeiro
    if (!showVerification) {
      sendVerificationCode();
      return;
    }

    // Validar código de confirmação
    if (!verificationCode || verificationCode.length !== 6) {
      showToast("Digite o código de confirmação de 6 dígitos", "error");
      return;
    }

    // Em produção, validar código real via API
    // Por enquanto, aceitar qualquer código de 6 dígitos para facilitar testes
    // TODO: Integrar com serviço de SMS/WhatsApp real

    if (formData.password !== formData.confirmPassword) {
      showToast("As senhas não coincidem!", "error");
      return;
    }

    if (formData.password.length < 6) {
      showToast("A senha deve ter pelo menos 6 caracteres!", "error");
      return;
    }

    if (!formData.aceiteTermos) {
      showToast("Você deve aceitar os Termos de Uso para continuar", "error");
      return;
    }

    setLoading(true);

    // Validar CPF antes de enviar
    if (!formData.cpf.trim()) {
      showToast("CPF é obrigatório", "error");
      setLoading(false);
      return;
    }
    
    if (!validateCPF(formData.cpf)) {
      showToast("CPF inválido. Verifique os dígitos.", "error");
      setLoading(false);
      return;
    }

    // Formatar endereço completo
    const enderecoCompleto = `${address.rua}, ${address.numero}${address.complemento ? ` - ${address.complemento}` : ""}, ${address.bairro}, ${address.cidade} - ${address.estado}${address.cep ? `, CEP: ${address.cep}` : ""}`;

    // Sanitizar CPF para enviar apenas números
    const cpfNumbers = formData.cpf.replace(/\D/g, "");

    const { confirmPassword, ...registerData } = {
      ...formData,
      cpf: cpfNumbers, // Enviar CPF apenas com números
      endereco: enderecoCompleto,
    };
    
    const success = await register(registerData);

    if (success) {
      showToast("Cadastro confirmado com sucesso! Bem-vindo ao Clube de Vantagens!", "success");
      router.push("/minha-conta");
    } else {
      showToast("Erro ao realizar cadastro. Tente novamente.", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <UserPlus className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                Cadastre-se no Clube de Vantagens
              </h1>
              <p className="text-gray-600">
                Ganhe pontos, descontos exclusivos e muito mais!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CPF como PRIMEIRO campo obrigatório */}
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  CPF * <span className="text-red-600 font-bold">(Obrigatório)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setFormData({ ...formData, cpf: formatted });
                    }}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">CPF é obrigatório para finalizar compras</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone/WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        setFormData({ ...formData, telefone: formatted });
                      }}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço Completo */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} />
                  Endereço Completo *
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cep"
                        value={address.cep}
                        onChange={handleCEPChange}
                        placeholder="00000-000"
                        maxLength={9}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        required
                      />
                      {loadingCEP && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400" size={18} />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Endereço será preenchido automaticamente</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-2">
                      Rua / Logradouro *
                    </label>
                    <input
                      type="text"
                      id="rua"
                      value={address.rua}
                      onChange={(e) => {
                        // Permitir edição apenas se rua estiver vazia (CEP não encontrou)
                        if (!address.rua || !loadingCEP) {
                          setAddress(prev => ({ ...prev, rua: e.target.value }));
                        }
                      }}
                      placeholder="Rua, Avenida, etc."
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                        address.rua && !loadingCEP ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                      required
                      readOnly={!!address.rua && !loadingCEP}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      id="numero"
                      value={address.numero}
                      onChange={(e) => setAddress(prev => ({ ...prev, numero: e.target.value }))}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      id="complemento"
                      value={address.complemento}
                      onChange={(e) => setAddress(prev => ({ ...prev, complemento: e.target.value }))}
                      placeholder="Apto, Bloco, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      id="bairro"
                      value={address.bairro}
                      onChange={(e) => setAddress(prev => ({ ...prev, bairro: e.target.value }))}
                      placeholder="Bairro"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                      readOnly={!!address.bairro && !loadingCEP}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      id="cidade"
                      value={address.cidade}
                      onChange={(e) => setAddress(prev => ({ ...prev, cidade: e.target.value }))}
                      placeholder="Cidade"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      required
                      readOnly={!!address.cidade && !loadingCEP}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    id="estado"
                    value="Rio Grande do Sul"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                  <input type="hidden" value="RS" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Bell size={20} />
                  Preferências de Notificação
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="notificacoesEmail"
                      checked={formData.notificacoesEmail}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Receber ofertas e novidades por e-mail
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="notificacoesSMS"
                      checked={formData.notificacoesSMS}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Receber ofertas e novidades por SMS/WhatsApp
                    </span>
                  </label>
                </div>
              </div>

              {/* Aceite de Termos de Uso */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="aceiteTermos"
                    checked={formData.aceiteTermos}
                    onChange={handleChange}
                    className="mt-1 rounded"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    Eu aceito os{" "}
                    <Link href="/termos-de-uso" target="_blank" className="text-red-600 hover:text-red-700 font-bold underline">
                      Termos de Uso
                    </Link>
                    {" "}e a{" "}
                    <Link href="/politica-privacidade" target="_blank" className="text-red-600 hover:text-red-700 font-bold underline">
                      Política de Privacidade
                    </Link>
                    {" "}do Atual Supermercados, baseados no{" "}
                    <Link href="/cdc" target="_blank" className="text-red-600 hover:text-red-700 font-bold underline">
                      Código de Defesa do Consumidor (CDC)
                    </Link>
                    . *
                  </span>
                </label>
              </div>

              {/* Confirmação de Código */}
              {showVerification && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-blue-600" size={20} />
                    <h3 className="font-bold text-blue-900">Confirmação de Cadastro</h3>
                  </div>
                  <p className="text-sm text-blue-800">
                    Enviamos um código de confirmação para <strong>{formData.telefone}</strong>.
                    Digite o código recebido para confirmar seu cadastro.
                  </p>
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-blue-900 mb-2">
                      Código de Confirmação (6 dígitos) *
                    </label>
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl font-bold tracking-widest"
                      required
                    />
                    <p className="text-xs text-blue-600 mt-2">
                      💡 Para teste, use o código: <strong>123456</strong>
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || loadingCEP}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {showVerification ? "Confirmando cadastro..." : "Enviando código..."}
                  </>
                ) : showVerification ? (
                  "Confirmar Cadastro"
                ) : (
                  "Enviar Código de Confirmação"
                )}
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

