import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white flex flex-col z-50 sticky top-0">
      
      {/* 1. BARRA DE TOPO (Institucional / App) - Vermelho Escuro */}
      <div className="bg-red-700 py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-white font-medium">
          <div className="flex gap-4">
            {/* LINK CORRIGIDO: Agora leva para a página de Contato */}
            <Link href="/contato" className="hover:text-red-200 transition-colors flex items-center gap-1">
              📍 Nossas Lojas
            </Link>
            <span className="cursor-pointer hover:text-red-200">📱 Baixe o App</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="cursor-pointer hover:text-red-200">Trabalhe Conosco</span>
            <div className="flex items-center gap-2">
              {/* LINK CORRIGIDO: Leva para Contato */}
              <Link href="/contato" className="hover:text-red-200 transition-colors">
                Atendimento
              </Link>
              <Link
                href="/admin"
                className="text-[11px] px-2 py-0.5 rounded-full border border-white/40 hover:text-red-200 hover:border-white/70 transition-colors"
              >
                🔒 Acesso Restrito
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ÁREA PRINCIPAL (Logo + Busca + Ações) */}
      <div className="border-b border-gray-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          
          {/* LOGO (Link para Home) */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-bold text-yellow-400">
              ATUAL
            </div>
          </Link>

          {/* BARRA DE PESQUISA */}
          <div className="flex-1 max-w-2xl hidden md:flex relative">
            <input 
              type="text" 
              placeholder="O que você está procurando hoje?" 
              className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
            />
            <button className="absolute right-2 top-1.5 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>

          {/* ÁREA DO USUÁRIO */}
          <div className="flex items-center gap-6 text-gray-700">
            <div className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <div className="hidden lg:block leading-tight text-sm">
                <span className="block font-bold">Minha Conta</span>
                <span className="text-xs text-gray-500">Entrar ou Cadastrar</span>
              </div>
            </div>

            <div className="relative cursor-pointer hover:text-red-600 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MENU DE DEPARTAMENTOS (A navegação real) */}
      <div className="bg-red-600 text-white shadow-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 text-sm font-bold py-3 overflow-x-auto">
            {/* LINK CORRIGIDO: Leva para Ofertas */}
            <Link href="/ofertas" className="flex items-center gap-2 hover:bg-red-700 px-3 py-1 rounded-md transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              TODOS OS DEPARTAMENTOS
            </Link>
            
            {/* LINKS REAIS AGORA */}
            <Link href="/ofertas" className="hover:text-red-200 py-1 transition-colors whitespace-nowrap">OFERTAS DA SEMANA</Link>
            
            {/* Adicionei o BLOG aqui para ficar fácil de achar */}
            <Link href="/blog" className="hover:text-red-200 py-1 transition-colors whitespace-nowrap bg-red-800 px-3 rounded text-yellow-300">Dicas & Receitas</Link>
            
            <Link href="/ofertas" className="hover:text-red-200 py-1 transition-colors whitespace-nowrap">Hortifruti</Link>
            <Link href="/ofertas" className="hover:text-red-200 py-1 transition-colors whitespace-nowrap">Açougue</Link>
            <Link href="/ofertas" className="hover:text-red-200 py-1 transition-colors whitespace-nowrap">Padaria</Link>
            <Link href="/ofertas" className="hover:text-red-200 py-1 transition-colors whitespace-nowrap">Bebidas</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}