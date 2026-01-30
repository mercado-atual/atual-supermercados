import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
          <p className="text-gray-600 mb-8">
            O post que você está procurando não existe ou foi removido.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Voltar para o blog
          </Link>
        </div>
      </div>
    </div>
  );
}
