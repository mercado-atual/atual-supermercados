"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ScanBarcode,
  Flashlight,
  Zap,
  Loader2,
  ArrowLeft,
  Camera,
  Tag,
  Search,
} from "lucide-react";
import Link from "next/link";

type ProductInfo = {
  codigo: string;
  descricao: string;
  gtin: string;
  preco: number;
  precoSysmo: number;
  estoque: number;
  badge?: string | null;
};

export default function AdminScannerPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [product, setProduct] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [nameResults, setNameResults] = useState<ProductInfo[] | null>(null);
  const [loadingName, setLoadingName] = useState(false);
  const lastGtinRef = useRef<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<InstanceType<typeof import("html5-qrcode").Html5Qrcode> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  /** Bip sonoro quando o código de barras é lido (usa Web Audio; no celular precisa ter sido desbloqueado em unlockAudio) */
  const playBeep = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = audioContextRef.current || new Ctx();
      if (!audioContextRef.current) audioContextRef.current = ctx;
      const play = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 1200;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      };
      if (ctx.state === "suspended") {
        ctx.resume().then(play).catch(() => {});
      } else {
        play();
      }
    } catch {
      // ignorar se áudio não for permitido
    }
  }, []);

  /** Cria/desbloqueia o áudio no gesto do utilizador (ao iniciar câmera) e toca um bip de teste para o celular liberar o som */
  const unlockAudio = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new Ctx();
      }
      const ctx = audioContextRef.current;
      const playAfterUnlock = () => {
        setTimeout(() => playBeep(), 150);
      };
      if (ctx.state === "suspended") {
        ctx.resume().then(playAfterUnlock).catch(() => {});
      } else {
        playAfterUnlock();
      }
    } catch {
      // ignorar
    }
  }, [playBeep]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setMounted(true);
  }, [router]);

  const fetchProduct = useCallback(
    async (gtin: string) => {
      const token = localStorage.getItem("admin_token");
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/products/by-barcode?gtin=${encodeURIComponent(gtin)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          lastGtinRef.current = gtin;
        } else {
          setProduct(null);
          setError("Produto não encontrado no cadastro.");
        }
      } catch {
        setError("Erro ao buscar produto. Verifique a conexão.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchByName = useCallback(async () => {
    const q = searchName.trim();
    if (!q) return;
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setLoadingName(true);
    setNameResults(null);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/products/by-name?q=${encodeURIComponent(q)}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        const list: ProductInfo[] = data.products.map((p: { codigo: string; descricao: string; gtin: string; preco: number; estoque: number }) => ({
          codigo: p.codigo,
          descricao: p.descricao,
          gtin: p.gtin,
          preco: p.preco,
          precoSysmo: p.preco,
          estoque: p.estoque,
        }));
        setNameResults(list);
      } else {
        setNameResults([]);
        setError(data.message || "Nenhum produto encontrado com esse nome.");
      }
    } catch {
      setError("Erro ao buscar. Verifique a conexão.");
      setNameResults(null);
    } finally {
      setLoadingName(false);
    }
  }, [searchName]);

  const requestCamera = useCallback(() => {
    setError(null);
    unlockAudio();
    setCameraStarted(true);
  }, [unlockAudio]);

  useEffect(() => {
    if (!cameraStarted || !mounted || !scannerRef.current) return;

    let html5Qr: InstanceType<typeof import("html5-qrcode").Html5Qrcode> | null = null;
    const id = "admin-barcode-reader";

    const run = async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!document.getElementById(id) && scannerRef.current) {
        const div = document.createElement("div");
        div.id = id;
        div.className = "w-full max-w-md mx-auto rounded-xl overflow-hidden border-2 border-slate-300 bg-black min-h-[240px]";
        scannerRef.current.appendChild(div);
      }

      html5Qr = new Html5Qrcode(id);
      html5QrRef.current = html5Qr;

      const config = { fps: 10, qrbox: { width: 250, height: 100 } };

      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          setError("Nenhuma câmera encontrada. Use o site em HTTPS (ex: atual-supermercados.vercel.app).");
          return;
        }
        const backCamera = cameras.find(
          (c) => c.label.toLowerCase().includes("back") || c.label.toLowerCase().includes("traseira") || c.label.toLowerCase().includes("environment")
        );
        const cameraId = backCamera?.id || cameras[0]?.id;
        await html5Qr.start(
          cameraId,
          config,
          (decodedText) => {
            if (!decodedText) return;
            const gtin = decodedText.replace(/\D/g, "").slice(-13) || decodedText;
            if (gtin.length >= 8 && gtin !== lastGtinRef.current) {
              lastGtinRef.current = gtin;
              setTimeout(() => playBeep(), 0);
              fetchProduct(gtin);
            }
          },
          () => {}
        );
        setScanning(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("NotAllowedError") || msg.includes("Permission")) {
          setError("Câmera bloqueada. Permita o uso da câmera nas configurações do navegador e tente de novo.");
        } else if (msg.includes("secure") || msg.includes("HTTPS")) {
          setError("Use o site em HTTPS (ex: https://atual-supermercados.vercel.app) para a câmera funcionar.");
        } else {
          setError("Não foi possível iniciar a câmera. " + (msg || "Tente de novo."));
        }
      }
    };

    run();
    return () => {
      if (html5Qr?.isScanning) {
        html5Qr.stop().catch(() => {});
      }
      html5QrRef.current = null;
      const el = document.getElementById(id);
      if (el?.parentNode) el.parentNode.removeChild(el);
    };
  }, [cameraStarted, mounted, fetchProduct, playBeep]);

  const toggleTorch = async () => {
    const html5Qr = html5QrRef.current;
    if (!html5Qr) return;
    try {
      await (html5Qr as any).applyVideoConstraints?.({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch {
      setError("Lanterna não disponível neste aparelho.");
    }
  };

  const setOferta = async (badge: string) => {
    if (!product) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/products/oferta-relampago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ codigo: product.codigo, badge }),
      });
      const data = await res.json();
      if (data.success) {
        setProduct((p) => (p ? { ...p, badge: badge || undefined } : null));
      } else {
        setError(data.error || "Não foi possível alterar a promoção.");
      }
    } catch {
      setError("Erro ao alterar promoção.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6 px-1 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Scanner de preços
        </h1>
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>
      </div>

      <p className="text-sm text-slate-600">
        Busque pelo nome ou bipe o código de barras para conferir preço, estoque e promoções.
      </p>

      {/* Visor da câmera no topo (quando ativa) — visual profissional com mira e overlay */}
      {cameraStarted && (
        <div className="relative w-full overflow-hidden rounded-xl bg-black">
          <div ref={scannerRef} className="relative z-0 flex min-h-[280px] w-full justify-center" />
          {/* Overlay: bordas escurecidas, centro claro (faixa de leitura) */}
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-xl"
            style={{
              background:
                "radial-gradient(ellipse 85% 35% at 50% 50%, transparent 0%, transparent 40%, rgba(0,0,0,0.7) 100%)",
            }}
          />
          {/* Linha vermelha central — mira tipo leitor de código de barras / laser */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 z-20 h-0 -translate-y-1/2 border-t-2 border-red-500"
            style={{
              boxShadow: "0 0 16px 3px rgba(255,0,0,0.85), 0 0 40px 6px rgba(255,0,0,0.4)",
            }}
          />
        </div>
      )}

      {cameraStarted && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleTorch}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700"
          >
            <Flashlight size={20} className={torchOn ? "text-amber-300" : ""} />
            {torchOn ? "Desligar lanterna" : "Ativar lanterna"}
          </button>
        </div>
      )}

      {/* Buscar por nome — SEMPRE VISÍVEL (no celular aparece primeiro, sem precisar da câmera) */}
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/80 p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
          <Search size={20} />
          Procurar pelo nome do produto
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchByName()}
            placeholder="Ex: Supino, Abacaxi, Barra..."
            className="min-w-0 flex-1 rounded-lg border border-emerald-300 bg-white px-3 py-3 text-base text-slate-900 placeholder:text-slate-500"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={searchByName}
            disabled={loadingName || !searchName.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-base font-medium text-white hover:bg-emerald-700 disabled:opacity-50 touch-manipulation"
          >
            {loadingName ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search size={20} />}
            Buscar
          </button>
        </div>
        {nameResults && nameResults.length > 0 && (
          <ul className="mt-3 max-h-56 space-y-2 overflow-y-auto">
            {nameResults.map((p) => (
              <li key={p.codigo}>
                <button
                  type="button"
                  onClick={() => {
                    setProduct(p);
                    setNameResults(null);
                    setSearchName("");
                    setError(null);
                  }}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-3 text-left text-sm text-slate-800 shadow-sm hover:bg-emerald-100 active:bg-emerald-200 touch-manipulation"
                >
                  <span className="font-medium">{p.descricao}</span>
                  <span className="mt-1 block text-slate-500">R$ {p.preco.toFixed(2).replace(".", ",")} · Cód. {p.codigo}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {nameResults && nameResults.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">Nenhum produto encontrado. Digite outra parte do nome.</p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {!cameraStarted ? (
        <button
          type="button"
          onClick={requestCamera}
          className="flex w-full min-h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 text-slate-700 transition active:bg-slate-100 hover:border-slate-400 hover:bg-slate-100 touch-manipulation select-none"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <Camera className="h-12 w-12 text-slate-500" />
          <span className="text-lg font-semibold">Ou bipar código de barras (câmera)</span>
          <span className="text-sm text-slate-500 text-center px-4">Toque para iniciar a câmera</span>
        </button>
      ) : null}

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
          <span className="text-sm text-slate-600">Buscando produto...</span>
        </div>
      )}

      {product && !loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
          <div className="mb-3 flex items-center gap-2 text-slate-500">
            <ScanBarcode size={20} />
            <span className="text-sm font-medium">Produto bipado</span>
            {product.badge && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Em oferta
              </span>
            )}
          </div>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {product.descricao}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-100 p-4 sm:col-span-2">
              <p className="text-xs font-medium uppercase text-emerald-700">Preço atual</p>
              <p className="text-2xl font-bold text-slate-900">
                R$ {product.preco.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Preço Sysmo</p>
              <p className="text-xl font-bold text-slate-900">
                R$ {product.precoSysmo.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Estoque</p>
              <p className={`text-xl font-bold ${product.estoque < 5 ? "text-red-600" : "text-slate-900"}`}>
                {product.estoque} un
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOferta("Oferta")}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
            >
              <Zap size={20} />
              Ativar oferta relâmpago
            </button>
            <button
              type="button"
              onClick={() => setOferta("")}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50"
            >
              <Tag size={20} />
              Remover oferta
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Código: {product.codigo} · GTIN: {product.gtin}
          </p>
        </div>
      )}
    </div>
  );
}
