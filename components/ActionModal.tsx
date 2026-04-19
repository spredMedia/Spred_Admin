"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger" | "success";
  loading?: boolean;
}

export function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false
}: ActionModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) return null;

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    success: "bg-emerald-500 text-white hover:bg-emerald-600"
  };

  const icons = {
    primary: <Info className="h-6 w-6 text-primary" />,
    danger: <AlertCircle className="h-6 w-6 text-rose-500" />,
    success: <CheckCircle2 className="h-6 w-6 text-emerald-500" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Decor */}
        <div className={cn(
          "absolute top-0 inset-x-0 h-1",
          variant === "primary" ? "bg-primary" : variant === "danger" ? "bg-rose-500" : "bg-emerald-500"
        )} />

        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center",
                variant === "primary" ? "bg-primary/10" : variant === "danger" ? "bg-rose-500/10" : "bg-emerald-500/10"
              )}>
                {icons[variant]}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
                {description && <p className="text-sm text-zinc-500 font-medium mt-1">{description}</p>}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/5 text-zinc-600 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8">
            {children}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => onConfirm()}
              disabled={loading}
              className={cn(
                "flex-[2] px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
                variants[variant]
              )}
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
