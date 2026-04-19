"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      toastOptions={{
        classNames: {
          toast: "glass-card border-white/10",
          title: "text-white font-semibold",
          description: "text-zinc-400 text-sm",
          actionButton: "bg-primary text-white hover:bg-primary/90",
          cancelButton: "bg-white/10 text-white hover:bg-white/20",
          closeButton: "bg-white/10 text-white hover:bg-white/20",
          success: "bg-emerald-500/10 border-emerald-500/20",
          error: "bg-rose-500/10 border-rose-500/20",
          info: "bg-blue-500/10 border-blue-500/20",
          warning: "bg-amber-500/10 border-amber-500/20",
          loading: "bg-primary/10 border-primary/20",
        },
      }}
    />
  );
}
