"use client";

import {
  Activity,
  Zap,
  TrendingDown,
  Clock,
  Gauge,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: "healthy" | "warning" | "critical";
}

interface PerformanceMonitorProps {
  metrics?: PerformanceMetric[];
}

const defaultMetrics: PerformanceMetric[] = [
  {
    name: "First Contentful Paint",
    value: 1.2,
    unit: "s",
    threshold: 1.8,
    status: "healthy",
  },
  {
    name: "Largest Contentful Paint",
    value: 2.4,
    unit: "s",
    threshold: 2.5,
    status: "healthy",
  },
  {
    name: "Cumulative Layout Shift",
    value: 0.08,
    unit: "",
    threshold: 0.1,
    status: "healthy",
  },
  {
    name: "Time to Interactive",
    value: 3.5,
    unit: "s",
    threshold: 3.8,
    status: "healthy",
  },
  {
    name: "Total Blocking Time",
    value: 150,
    unit: "ms",
    threshold: 300,
    status: "healthy",
  },
  {
    name: "First Input Delay",
    value: 45,
    unit: "ms",
    threshold: 100,
    status: "healthy",
  },
  {
    name: "Memory Usage",
    value: 245,
    unit: "MB",
    threshold: 500,
    status: "warning",
  },
  {
    name: "API Response Time",
    value: 145,
    unit: "ms",
    threshold: 200,
    status: "healthy",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "healthy":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "warning":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "critical":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "healthy":
      return CheckCircle2;
    case "warning":
      return AlertTriangle;
    case "critical":
      return AlertTriangle;
    default:
      return Activity;
  }
}

export function PerformanceMonitor({
  metrics = defaultMetrics,
}: PerformanceMonitorProps) {
  const healthyCount = metrics.filter((m) => m.status === "healthy").length;
  const warningCount = metrics.filter((m) => m.status === "warning").length;
  const criticalCount = metrics.filter((m) => m.status === "critical").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Gauge className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Performance Monitor</h3>
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Healthy",
            count: healthyCount,
            color: "text-emerald-500 bg-emerald-500/10",
            icon: CheckCircle2,
          },
          {
            label: "Warnings",
            count: warningCount,
            color: "text-amber-500 bg-amber-500/10",
            icon: AlertTriangle,
          },
          {
            label: "Critical",
            count: criticalCount,
            color: "text-rose-500 bg-rose-500/10",
            icon: AlertTriangle,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl border-white/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">
                  {stat.label}
                </p>
                <p className={cn("text-2xl font-black mt-2", stat.color)}>
                  {stat.count}
                </p>
              </div>
              <stat.icon className={cn("h-8 w-8 opacity-50", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const StatusIcon = getStatusIcon(metric.status);
          const isHealthy = metric.value <= metric.threshold;
          const percentage = (metric.value / metric.threshold) * 100;

          return (
            <div
              key={metric.name}
              className={cn(
                "glass-card rounded-xl border-2 p-4 space-y-3",
                getStatusColor(metric.status)
              )}
            >
              {/* Metric Header */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-white line-clamp-2">
                  {metric.name}
                </p>
                <StatusIcon className="h-4 w-4 flex-shrink-0" />
              </div>

              {/* Metric Value */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-white">
                    {metric.value}
                  </p>
                  <p className="text-[10px] text-zinc-400">{metric.unit}</p>
                </div>
                <p className="text-[10px] text-zinc-600">
                  Threshold: {metric.threshold}
                  {metric.unit}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      metric.status === "healthy"
                        ? "bg-emerald-500"
                        : metric.status === "warning"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    )}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-[9px] font-black uppercase tracking-wider text-zinc-600">
                {isHealthy ? "✓ Within threshold" : "⚠ Exceeds threshold"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optimization Tips */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <Zap className="h-3 w-3" />
          Optimization Tips
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Lazy load routes to reduce initial bundle size</li>
          <li>Implement image optimization with Next.js Image component</li>
          <li>Enable API response caching with SWR or React Query</li>
          <li>Monitor database query performance for N+1 issues</li>
        </ul>
      </div>
    </div>
  );
}
