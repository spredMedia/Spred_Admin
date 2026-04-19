"use client";

import { useState } from "react";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendData {
  timestamp: Date;
  successRate: number;
  avgSpeed: number;
  avgLatency: number;
  bandwidth: number;
  transferCount: number;
  failureCount: number;
}

interface TimerangeTrends {
  period: "7d" | "30d" | "90d";
  data: TrendData[];
  avgSuccess: number;
  avgSpeed: number;
  avgLatency: number;
  trend: "improving" | "stable" | "declining";
}

const mock7dTrends: TrendData[] = [
  { timestamp: new Date(Date.now() - 6 * 86400000), successRate: 92.1, avgSpeed: 5.4, avgLatency: 12, bandwidth: 45, transferCount: 187, failureCount: 16 },
  { timestamp: new Date(Date.now() - 5 * 86400000), successRate: 93.2, avgSpeed: 5.6, avgLatency: 11, bandwidth: 48, transferCount: 201, failureCount: 14 },
  { timestamp: new Date(Date.now() - 4 * 86400000), successRate: 91.8, avgSpeed: 5.2, avgLatency: 14, bandwidth: 44, transferCount: 178, failureCount: 15 },
  { timestamp: new Date(Date.now() - 3 * 86400000), successRate: 94.5, avgSpeed: 5.8, avgLatency: 10, bandwidth: 51, transferCount: 223, failureCount: 13 },
  { timestamp: new Date(Date.now() - 2 * 86400000), successRate: 93.7, avgSpeed: 5.5, avgLatency: 11, bandwidth: 47, transferCount: 210, failureCount: 13 },
  { timestamp: new Date(Date.now() - 1 * 86400000), successRate: 94.2, avgSpeed: 5.7, avgLatency: 10, bandwidth: 50, transferCount: 218, failureCount: 13 },
  { timestamp: new Date(Date.now()), successRate: 94.6, avgSpeed: 5.9, avgLatency: 9, bandwidth: 52, transferCount: 225, failureCount: 12 },
];

const mock30dTrends: TrendData[] = Array.from({ length: 30 }, (_, i) => {
  const daysAgo = 29 - i;
  const baseSuccess = 92 + Math.sin(i / 5) * 3;
  const baseSpeed = 5.3 + Math.sin(i / 7) * 0.6;
  return {
    timestamp: new Date(Date.now() - daysAgo * 86400000),
    successRate: Math.max(85, Math.min(98, baseSuccess + Math.random() * 2)),
    avgSpeed: Math.max(4.5, Math.min(6.5, baseSpeed + Math.random() * 0.3)),
    avgLatency: Math.max(8, Math.min(25, 12 + Math.sin(i / 10) * 5 + Math.random() * 2)),
    bandwidth: Math.max(40, Math.min(65, 48 + Math.sin(i / 8) * 8 + Math.random() * 3)),
    transferCount: Math.floor(180 + Math.sin(i / 6) * 40 + Math.random() * 20),
    failureCount: Math.floor(15 + Math.random() * 8),
  };
});

const mock90dTrends: TrendData[] = Array.from({ length: 90 }, (_, i) => {
  const daysAgo = 89 - i;
  const baseSuccess = 91 + Math.sin(i / 15) * 4;
  const baseSpeed = 5.2 + Math.sin(i / 20) * 0.8;
  return {
    timestamp: new Date(Date.now() - daysAgo * 86400000),
    successRate: Math.max(82, Math.min(99, baseSuccess + Math.random() * 2)),
    avgSpeed: Math.max(4.2, Math.min(7, baseSpeed + Math.random() * 0.4)),
    avgLatency: Math.max(7, Math.min(30, 13 + Math.sin(i / 20) * 8 + Math.random() * 3)),
    bandwidth: Math.max(38, Math.min(70, 47 + Math.sin(i / 25) * 12 + Math.random() * 4)),
    transferCount: Math.floor(170 + Math.sin(i / 15) * 60 + Math.random() * 30),
    failureCount: Math.floor(14 + Math.random() * 10),
  };
});

const calculateStats = (data: TrendData[]) => {
  const avgSuccess = (data.reduce((a, b) => a + b.successRate, 0) / data.length).toFixed(1);
  const avgSpeed = (data.reduce((a, b) => a + b.avgSpeed, 0) / data.length).toFixed(1);
  const avgLatency = Math.round(data.reduce((a, b) => a + b.avgLatency, 0) / data.length);
  const totalTransfers = data.reduce((a, b) => a + b.transferCount, 0);
  const totalFailures = data.reduce((a, b) => a + b.failureCount, 0);

  const trend = data[data.length - 1].successRate > data[0].successRate ? "improving" :
                data[data.length - 1].successRate < data[0].successRate - 1 ? "declining" : "stable";

  return { avgSuccess, avgSpeed, avgLatency, totalTransfers, totalFailures, trend };
};

export function P2PPerformanceTrends() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const [selectedMetric, setSelectedMetric] = useState<"successRate" | "avgSpeed" | "avgLatency" | "bandwidth">("successRate");

  const dataMap = { "7d": mock7dTrends, "30d": mock30dTrends, "90d": mock90dTrends };
  const currentData = dataMap[period];
  const stats = calculateStats(currentData);

  const maxValue = Math.max(...currentData.map(d => {
    switch (selectedMetric) {
      case "successRate":
        return d.successRate;
      case "avgSpeed":
        return d.avgSpeed * 10;
      case "avgLatency":
        return d.avgLatency;
      case "bandwidth":
        return d.bandwidth;
    }
  }));

  const getMetricValue = (data: TrendData) => {
    switch (selectedMetric) {
      case "successRate":
        return data.successRate;
      case "avgSpeed":
        return data.avgSpeed * 10;
      case "avgLatency":
        return data.avgLatency;
      case "bandwidth":
        return data.bandwidth;
    }
  };

  const getMetricColor = (value: number) => {
    switch (selectedMetric) {
      case "successRate":
        return value >= 93 ? "bg-emerald-500" : value >= 90 ? "bg-amber-500" : "bg-rose-500";
      case "avgSpeed":
        return value >= 55 ? "bg-emerald-500" : value >= 45 ? "bg-amber-500" : "bg-rose-500";
      case "avgLatency":
        return value <= 12 ? "bg-emerald-500" : value <= 18 ? "bg-amber-500" : "bg-rose-500";
      case "bandwidth":
        return value >= 48 ? "bg-emerald-500" : value >= 42 ? "bg-amber-500" : "bg-rose-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">P2P Performance Trends</h3>
      </div>

      {/* Period & Metric Selection */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Time Period</p>
          <div className="flex gap-2">
            {["7d", "30d", "90d"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as any)}
                className={cn(
                  "px-3 py-2 text-xs font-bold rounded transition-all",
                  period === p ? "bg-primary text-white" : "bg-white/10 text-zinc-400 hover:bg-white/20"
                )}
              >
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Metric</p>
          <div className="flex gap-2">
            {["successRate", "avgSpeed", "avgLatency", "bandwidth"].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m as any)}
                className={cn(
                  "px-2 py-2 text-[10px] font-bold rounded transition-all",
                  selectedMetric === m ? "bg-primary text-white" : "bg-white/10 text-zinc-400 hover:bg-white/20"
                )}
              >
                {m === "successRate" ? "Success %" : m === "avgSpeed" ? "Speed" : m === "avgLatency" ? "Latency" : "Bandwidth"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Success Rate</p>
          <p className={cn("text-3xl font-black", stats.avgSuccess >= 93 ? "text-emerald-500" : stats.avgSuccess >= 90 ? "text-amber-500" : "text-rose-500")}>
            {stats.avgSuccess}%
          </p>
          <p className="text-[10px] text-zinc-600">{period}</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Speed</p>
          <p className="text-3xl font-black text-blue-500">{stats.avgSpeed}</p>
          <p className="text-[10px] text-zinc-600">MB/s</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Latency</p>
          <p className="text-3xl font-black text-amber-500">{stats.avgLatency}</p>
          <p className="text-[10px] text-zinc-600">ms</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total Transfers</p>
          <p className="text-3xl font-black text-primary">{stats.totalTransfers.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-600">{period}</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Trend</p>
          <p className={cn("text-3xl font-black", stats.trend === "improving" ? "text-emerald-500" : stats.trend === "stable" ? "text-blue-500" : "text-rose-500")}>
            {stats.trend === "improving" ? "📈" : stats.trend === "stable" ? "➡️" : "📉"}
          </p>
          <p className="text-[10px] text-zinc-600 capitalize">{stats.trend}</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="glass-card rounded-xl border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-zinc-600 uppercase">
            {selectedMetric === "successRate" ? "Success Rate %" : selectedMetric === "avgSpeed" ? "Speed (MB/s)" : selectedMetric === "avgLatency" ? "Latency (ms)" : "Bandwidth (Mbps)"}
          </p>
          <p className="text-[10px] text-zinc-500">{currentData.length} data points</p>
        </div>

        {/* Bar Chart */}
        <div className="h-40 flex items-end justify-between gap-1 px-2">
          {currentData.map((data, idx) => {
            const value = getMetricValue(data);
            const height = (value / maxValue) * 100;
            return (
              <div
                key={idx}
                className={cn("flex-1 rounded-t transition-all hover:opacity-80 group relative")}
                style={{
                  height: `${height}%`,
                  minHeight: "4px",
                }}
              >
                <div className={cn("w-full h-full rounded-t", getMetricColor(value))} />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <p className="text-[10px] font-bold text-white bg-black/50 rounded px-2 py-1">
                    {selectedMetric === "successRate" ? `${value.toFixed(1)}%` : selectedMetric === "avgLatency" ? `${Math.round(value)}ms` : `${value.toFixed(1)}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis Labels */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 px-2">
          <span>{currentData[0].timestamp.toLocaleDateString()}</span>
          <span>{currentData[Math.floor(currentData.length / 2)].timestamp.toLocaleDateString()}</span>
          <span>{currentData[currentData.length - 1].timestamp.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Peak & Low Analysis */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold text-emerald-500 uppercase">📈 Peak Performance</p>
          {(() => {
            const maxData = currentData.reduce((max, curr) => {
              const currVal = getMetricValue(curr);
              const maxVal = getMetricValue(max);
              return selectedMetric === "avgLatency" ? (currVal < maxVal ? curr : max) : (currVal > maxVal ? curr : max);
            });
            return (
              <div className="text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date:</span>
                  <span className="font-bold text-white">{maxData.timestamp.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">
                    {selectedMetric === "successRate" ? "Success:" : selectedMetric === "avgSpeed" ? "Speed:" : selectedMetric === "avgLatency" ? "Latency:" : "Bandwidth:"}
                  </span>
                  <span className="font-bold text-emerald-500">
                    {selectedMetric === "successRate" ? `${maxData.successRate.toFixed(1)}%` : selectedMetric === "avgSpeed" ? `${maxData.avgSpeed} MB/s` : selectedMetric === "avgLatency" ? `${maxData.avgLatency}ms` : `${maxData.bandwidth}Mbps`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Transfers:</span>
                  <span className="font-bold text-blue-500">{maxData.transferCount}</span>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold text-rose-500 uppercase">📉 Lowest Performance</p>
          {(() => {
            const minData = currentData.reduce((min, curr) => {
              const currVal = getMetricValue(curr);
              const minVal = getMetricValue(min);
              return selectedMetric === "avgLatency" ? (currVal > minVal ? curr : min) : (currVal < minVal ? curr : min);
            });
            return (
              <div className="text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date:</span>
                  <span className="font-bold text-white">{minData.timestamp.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">
                    {selectedMetric === "successRate" ? "Success:" : selectedMetric === "avgSpeed" ? "Speed:" : selectedMetric === "avgLatency" ? "Latency:" : "Bandwidth:"}
                  </span>
                  <span className="font-bold text-rose-500">
                    {selectedMetric === "successRate" ? `${minData.successRate.toFixed(1)}%` : selectedMetric === "avgSpeed" ? `${minData.avgSpeed} MB/s` : selectedMetric === "avgLatency" ? `${minData.avgLatency}ms` : `${minData.bandwidth}Mbps`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Failures:</span>
                  <span className="font-bold text-rose-500">{minData.failureCount}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">ℹ️ Performance Insights</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>📊 Track transfer success rates and identify problematic periods</li>
          <li>⚡ Monitor speed trends to detect network degradation</li>
          <li>⏱️ Latency analysis helps identify interference or congestion patterns</li>
          <li>📈 Trend direction (improving/stable/declining) shows network trajectory</li>
          <li>📅 Compare periods to understand seasonal or recurring patterns</li>
        </ul>
      </div>
    </div>
  );
}
