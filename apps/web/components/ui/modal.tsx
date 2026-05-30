"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
  danger?: boolean;
}

export function Modal({ title, children, onClose, actions, danger }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-[rgba(26,26,26,0.4)] backdrop-blur-[4px] z-50 flex items-center justify-center animate-[fadeIn_200ms_ease]"
      onClick={onClose}
    >
      <div
        className="bg-bg-card rounded-xl p-8 w-[min(440px,90vw)] shadow-lg animate-modal-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-2.5 mb-2">
          {danger && (
            <span className="text-error inline-flex">
              <AlertTriangle size={20} />
            </span>
          )}
          <h2 className="text-lg font-semibold leading-6 m-0">{title}</h2>
        </div>
        <div className="text-sm text-text-secondary">{children}</div>
        {actions && (
          <div className="flex justify-end gap-3 mt-6">{actions}</div>
        )}
      </div>
    </div>
  );
}
