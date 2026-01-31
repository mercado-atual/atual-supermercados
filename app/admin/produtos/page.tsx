"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, Package, LogOut, CheckCircle, XCircle, AlertCircle, ScanBarcode } from "lucide-react";

interface ImportResult {
  success: boolean;
  message: string;
  summary?: {
    totalProcessed: number;
    imported: number;
    updated: number;
    errors: number;
    errorDetails: Array<{ row: number; error: string }>;
  };
}

export default function AdminProdutosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [clearBeforeImport, setClearBeforeImport] = useState(true);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    checkAuth();
    loadProductCount();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch("/api/admin/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    } catch (error) {
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    }
  };

  const loadProductCount = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/products/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProductCount(data.count || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar contagem:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setImportResult(null);
      } else {
        alert('Por favor, selecione um arquivo CSV');
        e.target.value = '';
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Por favor, selecione um arquivo CSV');
      return;
    }

    setLoading(true);
    setImportResult(null);

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clear', clearBeforeImport.toString());

      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImportResult({
          success: true,
          message: data.message,
          summary: data.summary,
        });
        loadProductCount();
      } else {
        setImportResult({
          success: false,
          message: data.error || "Erro ao importar produtos",
        });
      }
    } catch (error: any) {
      setImportResult({
        success: false,
        message: error.message || "Erro ao processar importação",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Gerenciar Produtos
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Importação de produtos via CSV - ATUAL Supermercados
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/scanner"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                <ScanBarcode className="w-5 h-5" />
                Scanner
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scanner — acesso rápido */}
        <Link
          href="/admin/scanner"
          className="mb-6 flex items-center justify-between rounded-xl border-2 border-red-200 bg-red-50 p-4 transition-colors hover:border-red-400 hover:bg-red-100"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-600 p-3">
              <ScanBarcode className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Consultar preço (Scanner)</p>
              <p className="text-sm text-gray-600">Bipar código de barras ou buscar por nome</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-red-600">Abrir →</span>
        </Link>

        {/* Estatísticas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 rounded-full p-3">
              <Package className="w-8 h-8 text-red-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Produtos Cadastrados</p>
              <p className="text-3xl font-black text-gray-900">{productCount}</p>
            </div>
          </div>
        </div>

        {/* Formulário de Importação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-4">Importar Produtos (CSV)</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Arquivo CSV
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Arquivo selecionado: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="clear"
                checked={clearBeforeImport}
                onChange={(e) => setClearBeforeImport(e.target.checked)}
                className="w-4 h-4 text-red-700 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="clear" className="text-sm text-gray-700">
                Limpar produtos existentes antes de importar
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Formato esperado do CSV:</strong><br />
                <code className="text-xs">codigo,descricao,gtin,preco,estoque</code>
              </p>
            </div>

            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Importar Produtos
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resultado da Importação */}
        {importResult && (
          <div
            className={`rounded-xl shadow-sm border p-6 ${
              importResult.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {importResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3
                  className={`font-bold mb-2 ${
                    importResult.success ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {importResult.success ? "Importação Concluída!" : "Erro na Importação"}
                </h3>
                <p
                  className={`text-sm mb-3 ${
                    importResult.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {importResult.message}
                </p>

                {importResult.summary && (
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Total Processado</p>
                        <p className="text-lg font-bold text-gray-900">
                          {importResult.summary.totalProcessed}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Importados</p>
                        <p className="text-lg font-bold text-green-700">
                          {importResult.summary.imported}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Atualizados</p>
                        <p className="text-lg font-bold text-blue-700">
                          {importResult.summary.updated}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Erros</p>
                        <p className="text-lg font-bold text-red-700">
                          {importResult.summary.errors}
                        </p>
                      </div>
                    </div>

                    {importResult.summary.errors > 0 && (
                      <div className="mt-4 bg-white rounded-lg p-4 border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-700" />
                          <p className="font-bold text-red-900">Detalhes dos Erros:</p>
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {importResult.summary.errorDetails.map((error, index) => (
                            <p key={index} className="text-xs text-red-800">
                              Linha {error.row}: {error.error}
                            </p>
                          ))}
                          {importResult.summary.errors > 10 && (
                            <p className="text-xs text-gray-500 italic">
                              ... e mais {importResult.summary.errors - 10} erro(s)
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
