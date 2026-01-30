"use client";

import { useEffect } from "react";
import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type = "success", isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="text-red-500" size={24} />;
      case "info":
        return <Info className="text-blue-500" size={24} />;
      default:
        return <CheckCircle2 className="text-green-500" size={24} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "error":
        return "border-red-200";
      case "info":
        return "border-blue-200";
      default:
        return "border-green-200";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`bg-white rounded-lg shadow-2xl border ${getBorderColor()} p-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <p className="flex-1 text-gray-800 font-medium text-sm">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

