"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

type PushToast = (opts: string | { message: string; variant?: ToastVariant }) => string;

const ToastCtx = createContext<PushToast>(() => "");

export function useToast(): PushToast {
  return useContext(ToastCtx);
}

const ICONS: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS: Record<ToastVariant, string> = {
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
  info: "text-info",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push: PushToast = useCallback((opts) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast =
      typeof opts === "string"
        ? { id, message: opts, variant: "success" }
        : { id, variant: "success", ...opts };
    setToasts((t) => [...t, toast]);
    if (toast.variant === "success" || toast.variant === "info") {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
    }
    return id;
  }, []);

  const dismiss = (id: string) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.variant];
          return (
            <div
              key={t.id}
              className="bg-bg-card border border-bg-elevated rounded-[10px] px-4 py-3 shadow-md flex items-center gap-2.5 text-[13px] max-w-[380px] animate-toast-in"
            >
              <span className={`${COLORS[t.variant]} inline-flex shrink-0`}>
                <Icon size={18} />
              </span>
              <span className="flex-1">{t.message}</span>
              <button
                className="w-6 h-6 inline-flex items-center justify-center rounded-md hover:bg-bg-surface text-text-tertiary"
                onClick={() => dismiss(t.id)}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
