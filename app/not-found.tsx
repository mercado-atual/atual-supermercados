import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="text-9xl mb-4">🛒</div>
      <h1 className="text-4xl font-black text-gray-900 mb-2">Ops! Página não encontrada</h1>
      <p className="text-gray-600 mb-8 max-w-md">Parece que o produto ou página que você está procurando não está nesta prateleira.</p>
      <Link href="/" className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg">Voltar para o Início</Link>
    </div>
  );
}


