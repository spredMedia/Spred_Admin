"use client";

import { cn } from "@/lib/utils";

interface TouchFriendlyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function TouchFriendlyButton({
  variant = "primary",
  size = "md",
  children,
  icon,
  loading,
  className,
  disabled,
  ...props
}: TouchFriendlyButtonProps) {
  const baseClasses =
    "font-bold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950";

  const sizeClasses = {
    sm: "px-3 py-2 text-xs rounded-lg min-h-[40px]",
    md: "px-4 py-3 text-sm rounded-lg min-h-[48px]",
    lg: "px-6 py-4 text-base rounded-xl min-h-[56px]",
  };

  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus:ring-primary disabled:bg-primary/50 disabled:opacity-50",
    secondary:
      "bg-white/10 text-white hover:bg-white/20 focus:ring-white/50 disabled:opacity-50",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary disabled:opacity-50",
    ghost:
      "text-white hover:bg-white/10 focus:ring-white/50 disabled:opacity-50",
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        "flex items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
