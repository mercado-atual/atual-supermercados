"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function CompleteCPFContent() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/minha-conta";

  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Se já tem CPF, redirecionar
    if (user.cpf && user.cpf.trim() !== "") {
      router.push(redirectTo);
      return;
    }
  }, [user, router, redirectTo]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar CPF
    const cpfNumbers = cpf.replace(/\D/g, "");
    
    if (cpfNumbers.length !== 11) {
      setError("CPF deve ter 11 dígitos");
      return;
    }

    if (!validateCPF(cpfNumbers)) {
      setError("CPF inválido. Verifique os dígitos.");
      return;
    }

    setLoading(true);

    try {
      await updateUser({
        cpf: cpfNumbers, // Salvar apenas números
        totalCompras: user?.totalCompras || 0,
      });

      showToast("CPF cadastrado com sucesso!", "success");
      
      // Redirecionar após salvar
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    } catch (error: any) {
      const errorMessage = error?.message || "Erro ao salvar CPF. Tente novamente.";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <FileText className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                Complete seu Cadastro
              </h1>
              <p className="text-gray-600">
                CPF é obrigatório para finalizar compras
              </p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Cadastro incompleto
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Para finalizar compras e utilizar todos os serviços, é necessário informar seu CPF.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  CPF * <span className="text-red-600 font-bold">(Obrigatório)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="cpf"
                    value={cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setCpf(formatted);
                      setError(""); // Limpar erro ao digitar
                    }}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                      error ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    required
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Digite apenas os números ou cole com pontuação. O sistema aceita ambos os formatos.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !cpf.trim()}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Salvar CPF e Continuar
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/minha-conta"
                className="text-gray-600 hover:text-red-600 text-sm transition-colors"
              >
                Voltar para Minha Conta
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CompleteCPFPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-red-600" size={32} />
        </main>
        <Footer />
      </div>
    }>
      <CompleteCPFContent />
    </Suspense>
  );
}

