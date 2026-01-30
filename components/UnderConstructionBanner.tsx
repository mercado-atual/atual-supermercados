"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

export default function UnderConstructionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-500 text-yellow-900 border-b-2 border-yellow-600 shadow-md relative z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <AlertCircle size={18} className="flex-shrink-0" />
            <p className="text-sm font-semibold">
              🚧 Site em construção - Algumas funcionalidades podem estar em desenvolvimento
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-900 hover:text-yellow-950 transition-colors p-1 rounded hover:bg-yellow-400 flex-shrink-0"
            aria-label="Fechar aviso"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

