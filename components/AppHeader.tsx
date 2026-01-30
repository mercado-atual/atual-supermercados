"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, User, Search, Menu, LogOut, ScanBarcode } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-config";
import { DEPARTAMENTOS_SUPERMERCADO, BARRA_LINKS_RAPIDOS } from "@/lib/departamentos-nav";

export default function AppHeader() {
  const { getTotal, getItemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDepartamentosDropdown, setShowDepartamentosDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const departamentosRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
      if (departamentosRef.current && !departamentosRef.current.contains(event.target as Node)) {
        setShowDepartamentosDropdown(false);
      }
    };

    if (showUserMenu || showMobileMenu || showDepartamentosDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu, showMobileMenu, showDepartamentosDropdown]);

  const formatCurrency = (value: number): string => {
    return value.toFixed(2).replace(".", ",");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="w-full bg-white flex flex-col z-50 sticky top-0 shadow-sm">
      {/* BARRA 1 — MERCADO | Nossas Lojas | Atendimento | Libras | Clube Atual | Cartão */}
      <div className="bg-red-700 py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-white font-medium">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="bg-white text-red-700 font-bold px-3 py-1 rounded">MERCADO</span>
            <Link href="/nossas-lojas" className="hover:text-red-200 transition-colors">
              Nossas Lojas
            </Link>
            <Link href="/contato" className="hover:text-red-200 transition-colors">
              Atendimento
            </Link>
            <Link href="/contato#libras" className="hover:text-red-200 transition-colors">
              Atendimento em Libras
            </Link>
            <Link href="/clube-vantagens" className="hover:text-red-200 transition-colors">
              Clube Atual
            </Link>
          </div>
          <Link
            href="/cdc"
            className="bg-red-800 hover:bg-red-900 text-white font-bold px-4 py-1.5 rounded flex items-center gap-2 transition-colors border border-white/30"
          >
            <span>Faça seu Cartão Atual Supermercado</span>
          </Link>
        </div>
      </div>

      {/* BARRA 2 — Logo | Busca bem longa | Acesse sua conta ou Cadastre-se | Carrinho */}
      <div className="border-b border-gray-100 py-3 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {CATALOG_MODE && (
            <div className="mb-2 text-center">
              <p className="text-xs sm:text-sm text-gray-600 font-medium bg-blue-50 border border-blue-200 rounded-lg py-1.5 px-4 inline-block">
                <span className="text-blue-700">ℹ️</span>{" "}
                <span className="text-blue-800">
                  Compras online em breve. Catálogo de ofertas do Atual Supermercados.
                </span>
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 md:gap-6">
            {/* LOGO */}
            <Link href="/" className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
              <h1 className="text-2xl font-black text-red-700 tracking-tighter leading-none animate-flag-wave inline-block">ATUAL</h1>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase animate-flag-wave inline-block" style={{ animationDelay: "0.15s" }}>Supermercados</span>
            </Link>

            {/* BUSCA BEM LONGA (centro) */}
            <form onSubmit={handleSearch} className="flex-1 max-w-4xl hidden md:flex relative mx-4 lg:mx-8">
              <input
                type="text"
                placeholder="Busque por produtos ou marcas no Atual"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Acesse sua conta ou Cadastre-se + Carrinho */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {isAuthenticated && user ? (
                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm"
                  >
                    <User size={20} />
                    <span className="hidden lg:inline">Acesse sua conta</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-bold text-gray-900">{user.nome}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/minha-conta"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Minha Conta
                      </Link>
                      <Link
                        href="/clube-vantagens"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Clube de Vantagens
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          router.push("/");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm"
                >
                  <User size={20} />
                  <span className="max-w-[140px]">Acesse sua conta ou Cadastre-se</span>
                </Link>
              )}

              <Link
                href="/carrinho"
                className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-md hover:bg-red-700 transition-all active:scale-95 relative"
              >
                <div className="relative">
                  <ShoppingCart size={18} fill="currentColor" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {getItemCount()}
                    </span>
                  )}
                </div>
                <span className="font-bold text-sm hidden sm:inline">R$ {formatCurrency(getTotal())}</span>
              </Link>

            {/* MENU MOBILE */}
            <div className="md:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Menu size={24} />
              </button>
              
              {/* Menu Mobile Dropdown — mesmos departamentos (só supermercado) */}
              {showMobileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {DEPARTAMENTOS_SUPERMERCADO.map((item, i) => {
                    const primeiroInstitucional = item.tipo === "institucional" && DEPARTAMENTOS_SUPERMERCADO.findIndex((d) => d.tipo === "institucional") === i;
                    const labelMobile = item.label.split(" ").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
                    return (
                      <span key={item.href}>
                        {primeiroInstitucional && <div className="border-t border-gray-200 my-2" />}
                        <Link
                          href={item.href}
                          className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          {item.emoji ? `${item.emoji} ` : ""}{labelMobile}
                        </Link>
                      </span>
                    );
                  })}
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/admin/scanner"
                    className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 font-semibold transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <ScanBarcode size={20} />
                    Consultar Preço (Scanner)
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  {isAuthenticated && user ? (
                    <>
                      <Link
                        href="/minha-conta"
                        className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Minha Conta
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowMobileMenu(false);
                          router.push("/");
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Entrar / Cadastrar
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* BUSCA MOBILE */}
        <form onSubmit={handleSearch} className="md:hidden px-4 mt-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </form>
      </div>

      {/* BARRA 3 — Hamburger Departamentos (dropdown) | Ofertas | Feira | Bebidas | Churrasco | Limpeza | Padaria */}
      <div className="bg-white border-b border-gray-200 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-4 py-2.5">
            {/* Hamburger + Departamentos (dropdown) */}
            <div className="relative flex-shrink-0" ref={departamentosRef}>
              <button
                type="button"
                onClick={() => setShowDepartamentosDropdown(!showDepartamentosDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors"
              >
                <Menu size={20} />
                <span>Departamentos</span>
              </button>
              {showDepartamentosDropdown && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {DEPARTAMENTOS_SUPERMERCADO.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-medium"
                      onClick={() => setShowDepartamentosDropdown(false)}
                    >
                      {item.emoji ? `${item.emoji} ` : ""}{item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Links rápidos: Ofertas, Feira, Bebidas, Churrasco, Limpeza, Padaria + Scanner (direita) */}
            <div className="flex items-center gap-4 overflow-x-auto text-sm font-medium text-gray-700">
              {BARRA_LINKS_RAPIDOS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap hover:text-red-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/admin/scanner"
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700 transition-colors"
              >
                <ScanBarcode size={18} />
                Consultar Preço (Scanner)
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
