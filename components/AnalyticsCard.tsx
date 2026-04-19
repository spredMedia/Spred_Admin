"use client";

import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  target?: number;
  icon: React.ReactNode;
  color: "primary" | "emerald" | "blue" | "rose" | "amber";
  comparison?: string;
  trend?: "up" | "down" | "flat";
}

const colorClasses = {
  primary: "bg-primary/10 border-primary/20 text-primary",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  rose: "bg-rose-500/10 border-rose-500/20 text-rose-500",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-500",
};

export function AnalyticsCard({
  label,
  value,
  unit,
  change,
  target,
  icon,
  color,
  comparison,
  trend,
}: AnalyticsCardProps) {
  const isPositive = trend === "up";
  const showTarget = target !== undefined;

  return (
    <div className={cn("rounded-xl border p-6 glass-card", colorClasses[color])}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider opacity-75">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-black">
              {value}
              {unit && <span className="text-lg ml-1">{unit}</span>}
            </p>
          </div>
        </div>
        <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center opacity-80">
          {icon}
        </div>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        {change !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">vs Previous</span>
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                isPositive
                  ? "bg-emerald-500/20 text-emerald-500"
                  : "bg-rose-500/20 text-rose-500"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? "+" : ""}{change}%
            </div>
          </div>
        )}

        {showTarget && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Goal Progress</span>
              <span className="text-xs font-bold">
                {Math.round(((Number(value) || 0) / target) * 100)}%
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-amber-500"
                style={{ width: `${Math.min(100, ((Number(value) || 0) / target) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {comparison && (
          <p className="text-xs text-white/60">{comparison}</p>
        )}
      </div>
    </div>
  );
}
