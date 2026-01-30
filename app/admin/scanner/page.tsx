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
  const lastGtinRef = useRef<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<InstanceType<typeof import("html5-qrcode").Html5Qrcode> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  /** Cria/desbloqueia o áudio no gesto do utilizador (ex: ao iniciar câmera) para o bip funcionar no celular */
  const unlockAudio = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new Ctx();
      }
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    } catch {
      // ignorar
    }
  }, []);

  /** Bip sonoro quando o código de barras é lido */
  const playBeep = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = audioContextRef.current || new Ctx();
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // ignorar se áudio não for permitido
    }
  }, []);

  useEffect(() => {

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
              playBeep();
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
    <div className="space-y-4 pb-6">
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
        Bipe o código de barras para conferir preço, estoque e ativar ou remover promoções.
      </p>

      {!cameraStarted ? (
        <button
          type="button"
          onClick={requestCamera}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
        >
          <Camera className="h-14 w-14 text-slate-500" />
          <span className="text-lg font-semibold">Iniciar câmera</span>
          <span className="text-sm text-slate-500">Toque para permitir a câmera (necessário no celular)</span>
        </button>
      ) : (
        <>
          {error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}

          <div ref={scannerRef} className="flex min-h-[240px] justify-center" />

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
        </>
      )}

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
