"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricTickerProps {
  value: number;
  prevValue: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  animate?: boolean;
  color?: "emerald" | "rose" | "primary" | "blue" | "amber";
}

export function MetricTicker({
  value,
  prevValue,
  label,
  prefix = "",
  suffix = "",
  decimals = 0,
  animate = true,
  color = "primary",
}: MetricTickerProps) {
  const [displayValue, setDisplayValue] = useState(prevValue);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    let currentValue = displayValue;
    const increment = (value - currentValue) / 10;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      currentValue += increment;
      if (frame === 10) {
        currentValue = value;
        clearInterval(interval);
      }
      setDisplayValue(currentValue);
    }, 50);

    return () => clearInterval(interval);
  }, [value, animate]);

  const change = value - prevValue;
  const changePercent = prevValue !== 0 ? ((change / prevValue) * 100).toFixed(1) : "0";
  const isPositive = change >= 0;

  const colorClasses = {
    emerald: "text-emerald-500 bg-emerald-500/10",
    rose: "text-rose-500 bg-rose-500/10",
    primary: "text-primary bg-primary/10",
    blue: "text-blue-500 bg-blue-500/10",
    amber: "text-amber-500 bg-amber-500/10",
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-white">
          {prefix}
          {displayValue.toFixed(decimals).toLocaleString()}
          {suffix}
        </span>
        <div className={cn("px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1", colorClasses[color])}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{isPositive ? "+" : ""}{changePercent}%</span>
        </div>
      </div>
      <span className="text-xs text-zinc-500 font-medium">{label}</span>
    </div>
  );
}
