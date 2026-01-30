"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    
    if (success) {
      showToast("Login realizado com sucesso! Bem-vindo de volta!");
      // Verificar se há redirect
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      router.push(redirect || "/minha-conta");
    } else {
      showToast("Email ou senha incorretos. Tente novamente.", "error");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <LogIn className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                Entrar na Minha Conta
              </h1>
              <p className="text-gray-600">
                Acesse sua conta do Clube de Vantagens
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">Lembrar-me</span>
                </label>
                <Link href="/auth/recuperar-senha" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Entrando..."
                ) : (
                  <>
                    Entrar <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Ainda não tem uma conta?{" "}
                <Link href="/auth/cadastro" className="text-red-600 hover:text-red-700 font-bold">
                  Cadastre-se gratuitamente
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

