"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  pontos: number;
  totalCompras: number; // Número total de compras realizadas
  notificacoesEmail: boolean;
  notificacoesSMS: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  updateNotificationPreferences: (email: boolean, sms: boolean) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface RegisterData {
  cpf: string; // CPF OBRIGATÓRIO
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  password: string;
  notificacoesEmail?: boolean;
  notificacoesSMS?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("atual_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("atual_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulação de login - em produção, fazer chamada à API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem("atual_user", JSON.stringify(userData.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem("atual_user", JSON.stringify(userData.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("atual_user");
  };

  const updateUser = async (data: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar dados");
      }

      const result = await response.json();
      if (result.success && result.user) {
        const updatedUser = { ...user, ...result.user };
        setUser(updatedUser);
        localStorage.setItem("atual_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error; // Re-throw para que o componente possa tratar o erro
    }
  };

  const updateNotificationPreferences = async (
    email: boolean,
    sms: boolean
  ): Promise<void> => {
    await updateUser({
      notificacoesEmail: email,
      notificacoesSMS: sms,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        updateNotificationPreferences,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

