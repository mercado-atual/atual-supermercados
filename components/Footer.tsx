import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GRID DE COLUNAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold uppercase tracking-wider">Sobre o Atual</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Há mais de 20 anos levando qualidade e economia para a mesa da sua família. O supermercado que entende você.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Ícones Sociais Simples */}
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">IG</div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">FB</div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">WA</div>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-4">Departamentos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hortifruti" className="hover:text-red-500 transition-colors">Hortifruti</Link></li>
              <li><Link href="/acougue" className="hover:text-red-500 transition-colors">Açougue e Peixaria</Link></li>
              <li><Link href="/padaria" className="hover:text-red-500 transition-colors">Padaria e Confeitaria</Link></li>
              <li><Link href="/bebidas" className="hover:text-red-500 transition-colors">Bebidas e Adega</Link></li>
              <li><Link href="/ofertas" className="hover:text-red-500 transition-colors">Ofertas</Link></li>
              <li><Link href="/blog" className="hover:text-red-500 transition-colors">Dicas & Receitas</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Institucional */}
          <div>
            <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-4">Ajuda</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ajuda" className="hover:text-red-500 transition-colors">Ajuda</Link></li>
              <li><Link href="/trabalhe-conosco" className="hover:text-red-500 transition-colors">Trabalhe Conosco</Link></li>
              <li><Link href="/nossas-lojas" className="hover:text-red-500 transition-colors">Nossas Lojas</Link></li>
              <li><Link href="/clube-vantagens" className="hover:text-red-500 transition-colors">Clube de Vantagens</Link></li>
              <li><Link href="/sobre" className="hover:text-red-500 transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contato" className="hover:text-red-500 transition-colors">Fale Conosco</Link></li>
              <li><Link href="/rastrear-pedido" className="hover:text-red-500 transition-colors">Rastrear Pedido</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Pagamento e Segurança */}
          <div>
            <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-4">Formas de Pagamento</h3>
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="h-8 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-500">VISA</div>
              <div className="h-8 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-500">MC</div>
              <div className="h-8 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-500">ELO</div>
              <div className="h-8 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-500">PIX</div>
              <div className="h-8 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-500">ALE</div>
              <div className="h-8 bg-gray-800 rounded flex items-center justify-center text-xs font-bold text-gray-500">VR</div>
            </div>
            
            <h3 className="text-white text-lg font-bold uppercase tracking-wider mb-4">Site Seguro</h3>
            <div className="flex items-center gap-2">
               <span className="text-green-500 text-2xl">🔒</span>
               <span className="text-sm text-gray-400">Ambiente criptografado<br/>e protegido.</span>
            </div>
          </div>

        </div>

        {/* BARRA INFERIOR (COPYRIGHT) */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2024 Atual Supermercados. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <p>Desenvolvido com tecnologia de ponta.</p>
            <Link href="/admin" className="text-gray-500 hover:text-gray-300 transition-colors">
              Área Interna
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}