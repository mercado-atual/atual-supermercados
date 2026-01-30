import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <section className="bg-white border-b border-gray-200 py-16 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Dicas & Receitas Atual</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Inspire-se na cozinha e aprenda a economizar no dia a dia.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-3 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row hover:shadow-lg transition-all cursor-pointer group">
            <div className="md:w-1/2 bg-red-100 min-h-[300px] flex items-center justify-center text-6xl group-hover:bg-red-200 transition-colors">🥘</div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-red-600 font-bold uppercase text-xs tracking-wider mb-2">Receita da Semana</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-red-700 transition-colors">Feijoada Completa: O segredo para o caldo grosso</h2>
              <p className="text-gray-600 mb-6">Descubra os ingredientes certos e o tempo de cozimento ideal.</p>
              <span className="font-bold text-gray-900 underline decoration-red-500 underline-offset-4">Ler matéria completa</span>
            </div>
          </div>
          {['Saúde', 'Bebidas', 'Economia'].map((topic, i) => (
             <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                <div className={`h-48 flex items-center justify-center text-5xl transition-colors ${i===0?'bg-green-100 group-hover:bg-green-200':i===1?'bg-yellow-100 group-hover:bg-yellow-200':'bg-blue-100 group-hover:bg-blue-200'}`}>
                   {i===0?'🥬':i===1?'🍷':'🧼'}
                </div>
                <div className="p-6">
                   <span className={`font-bold text-xs uppercase mb-2 block ${i===0?'text-green-600':i===1?'text-yellow-600':'text-blue-600'}`}>{topic}</span>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Título da Matéria Exemplo {i+1}</h3>
                   <p className="text-gray-500 text-sm">Uma breve descrição sobre o conteúdo desta matéria incrível.</p>
                </div>
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
