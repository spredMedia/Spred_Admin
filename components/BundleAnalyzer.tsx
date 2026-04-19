"use client";

import { Package, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BundlePackage {
  name: string;
  size: number;
  gzip: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

interface BundleAnalyzerProps {
  packages?: BundlePackage[];
  totalSize?: number;
  totalGzip?: number;
  target?: number;
}

const defaultPackages: BundlePackage[] = [
  {
    name: "react",
    size: 42.3,
    gzip: 13.2,
    percentage: 12.1,
    trend: "stable",
  },
  {
    name: "next",
    size: 38.5,
    gzip: 11.8,
    percentage: 11.0,
    trend: "down",
  },
  {
    name: "recharts",
    size: 35.2,
    gzip: 9.4,
    percentage: 10.1,
    trend: "up",
  },
  {
    name: "@tanstack/react-table",
    size: 28.1,
    gzip: 7.2,
    percentage: 8.0,
    trend: "stable",
  },
  {
    name: "lucide-react",
    size: 18.3,
    gzip: 4.2,
    percentage: 5.2,
    trend: "stable",
  },
  {
    name: "sonner",
    size: 12.4,
    gzip: 3.1,
    percentage: 3.5,
    trend: "down",
  },
  {
    name: "other-dependencies",
    size: 174.2,
    gzip: 42.1,
    percentage: 49.8,
    trend: "stable",
  },
];

export function BundleAnalyzer({
  packages = defaultPackages,
  totalSize = 349.0,
  totalGzip = 91.0,
  target = 200,
}: BundleAnalyzerProps) {
  const percentageOfTarget = (totalSize / target) * 100;
  const status =
    totalSize < target
      ? "healthy"
      : totalSize < target * 1.25
        ? "warning"
        : "critical";

  const largestPackages = [...packages].sort((a, b) => b.size - a.size);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Bundle Analysis</h3>
      </div>

      {/* Bundle Size Summary */}
      <div className="glass-card rounded-xl border-white/10 p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Total Size */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-white">Total Bundle Size</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-white">{totalSize}KB</p>
              <p className="text-sm text-zinc-500">
                ({totalGzip}KB gzipped)
              </p>
            </div>
            <p className="text-xs text-zinc-600">
              Target: {target}KB
            </p>
          </div>

          {/* Status */}
          <div className="flex flex-col justify-between">
            <p className="text-sm font-bold text-white mb-3">Status</p>
            <div
              className={cn(
                "p-3 rounded-lg border text-center",
                status === "healthy"
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : status === "warning"
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-rose-500/10 border-rose-500/20"
              )}
            >
              <p
                className={cn(
                  "text-sm font-black uppercase",
                  status === "healthy"
                    ? "text-emerald-500"
                    : status === "warning"
                      ? "text-amber-500"
                      : "text-rose-500"
                )}
              >
                {percentageOfTarget.toFixed(0)}% of target
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                status === "healthy"
                  ? "bg-emerald-500"
                  : status === "warning"
                    ? "bg-amber-500"
                    : "bg-rose-500"
              )}
              style={{ width: `${Math.min(percentageOfTarget, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <span>0KB</span>
            <span>{target}KB</span>
          </div>
        </div>
      </div>

      {/* Top Dependencies */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white">Largest Dependencies</h4>
        <div className="space-y-3">
          {largestPackages.slice(0, 7).map((pkg) => (
            <div
              key={pkg.name}
              className="glass-card rounded-xl border-white/10 p-4 space-y-2 hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white">{pkg.name}</p>
                  {pkg.trend === "down" && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingDown className="h-3 w-3 text-emerald-500" />
                      <span className="text-[9px] font-bold text-emerald-500 uppercase">
                        Reduced
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {pkg.size}KB
                  </p>
                  <p className="text-[10px] text-zinc-600">
                    {pkg.gzip}KB gzip
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full"
                    style={{ width: `${pkg.percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-600">
                  {pkg.percentage}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
        <p className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          Optimization Recommendations
        </p>
        <ul className="text-[10px] text-amber-400 space-y-1 ml-5 list-disc">
          <li>Consider lazy loading recharts (36KB) on data-heavy pages only</li>
          <li>Code split dashboard sections to reduce initial load</li>
          <li>Tree-shake unused charting library components</li>
          <li>Replace large dependencies with lighter alternatives</li>
          <li>Use dynamic imports for route-based code splitting</li>
        </ul>
      </div>

      {/* Bundle Breakdown */}
      <div className="glass-card rounded-xl border-white/10 p-4">
        <h4 className="text-sm font-bold text-white mb-4">Bundle Breakdown</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">
              JavaScript (uncompressed)
            </span>
            <span className="font-bold text-white">{totalSize}KB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">JavaScript (gzipped)</span>
            <span className="font-bold text-white">{totalGzip}KB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Compression ratio</span>
            <span className="font-bold text-emerald-500">
              {((totalGzip / totalSize) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Overhead vs target</span>
            <span
              className={cn(
                "font-bold",
                totalSize > target
                  ? "text-rose-500"
                  : "text-emerald-500"
              )}
            >
              {((totalSize - target) / target * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
