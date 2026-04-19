"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  trendLabel?: string;
  color?: "primary" | "emerald" | "amber" | "rose";
  layout?: "vertical" | "horizontal";
}

export function ResponsiveMetricCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  trendLabel,
  color = "primary",
  layout = "vertical",
}: ResponsiveMetricCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <div
      className={cn(
        "glass-card rounded-xl border-2 p-4 md:p-6",
        colorClasses[color],
        layout === "horizontal" && "flex items-center justify-between gap-4"
      )}
    >
      {/* Icon and Label */}
      <div className={cn("space-y-2", layout === "horizontal" && "flex-1")}>
        <div className="flex items-center gap-2">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <p className="text-xs md:text-sm font-bold uppercase opacity-75">
            {label}
          </p>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <p className="text-2xl md:text-3xl font-black">{value}</p>
          {unit && <p className="text-xs md:text-sm opacity-60">{unit}</p>}
        </div>
      </div>

      {/* Trend */}
      {trend && trendValue !== undefined && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs md:text-sm font-bold",
            layout === "horizontal" && "flex-shrink-0"
          )}
        >
          {trend === "up" && (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          )}
          {trend === "down" && (
            <TrendingDown className="h-4 w-4 text-rose-500" />
          )}
          <span>
            {trend === "up" ? "+" : ""}
            {trendValue}%
          </span>
          {trendLabel && <span className="text-[10px] opacity-60 hidden md:inline">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
