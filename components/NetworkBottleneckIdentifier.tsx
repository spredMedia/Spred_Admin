"use client";

import { useState } from "react";
import { AlertTriangle, TrendingDown, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkBottleneck {
  id: string;
  type: "bandwidth" | "latency" | "packet_loss" | "congestion" | "device_limitation";
  severity: "critical" | "warning" | "info";
  description: string;
  affectedDevices: number;
  estimatedImpact: number;
  detectedTime: Date;
  rootCause: string;
  recommendation: string;
  expectedResolution?: Date;
}

interface NetworkMetric {
  timestamp: Date;
  uploadSpeed: number;
  downloadSpeed: number;
  latency: number;
  packetLoss: number;
  activeConnections: number;
  saturation: number;
}

const mockBottlenecks: NetworkBottleneck[] = [
  {
    id: "b1",
    type: "congestion",
    severity: "critical",
    description: "High network congestion detected on 5GHz band",
    affectedDevices: 12,
    estimatedImpact: 45,
    detectedTime: new Date(Date.now() - 300000),
    rootCause: "Multiple simultaneous transfers (8 active) on same Wi-Fi group",
    recommendation: "Distribute transfers across time or use separate groups",
    expectedResolution: new Date(Date.now() + 900000),
  },
  {
    id: "b2",
    type: "latency",
    severity: "warning",
    description: "Elevated latency on peer connection",
    affectedDevices: 3,
    estimatedImpact: 28,
    detectedTime: new Date(Date.now() - 600000),
    rootCause: "Device moving away from access point, signal degradation",
    recommendation: "Move closer to access point or reduce transfer rate",
  },
  {
    id: "b3",
    type: "bandwidth",
    severity: "warning",
    description: "Bandwidth saturation at 85%",
    affectedDevices: 6,
    estimatedImpact: 35,
    detectedTime: new Date(Date.now() - 120000),
    rootCause: "Large file transfer (3.2GB) consuming most available bandwidth",
    recommendation: "Throttle large transfers or schedule during off-peak hours",
  },
  {
    id: "b4",
    type: "packet_loss",
    severity: "warning",
    description: "Packet loss rate elevated to 3.5%",
    affectedDevices: 2,
    estimatedImpact: 18,
    detectedTime: new Date(Date.now() - 1200000),
    rootCause: "Wi-Fi interference from neighboring networks on same channel",
    recommendation: "Switch to less congested Wi-Fi channel (6GHz if available)",
  },
  {
    id: "b5",
    type: "device_limitation",
    severity: "info",
    description: "Older device limiting group throughput",
    affectedDevices: 1,
    estimatedImpact: 12,
    detectedTime: new Date(Date.now() - 1800000),
    rootCause: "iPhone 11 with limited Wi-Fi 5 capability in mixed group",
    recommendation: "Create separate group for older devices or upgrade Wi-Fi capability",
  },
];

const mockNetworkTrend: NetworkMetric[] = [
  { timestamp: new Date(Date.now() - 3600000), uploadSpeed: 4.2, downloadSpeed: 5.1, latency: 8, packetLoss: 0.2, activeConnections: 3, saturation: 42 },
  { timestamp: new Date(Date.now() - 3000000), uploadSpeed: 4.5, downloadSpeed: 5.3, latency: 9, packetLoss: 0.2, activeConnections: 4, saturation: 48 },
  { timestamp: new Date(Date.now() - 2400000), uploadSpeed: 4.1, downloadSpeed: 5.0, latency: 11, packetLoss: 0.3, activeConnections: 5, saturation: 52 },
  { timestamp: new Date(Date.now() - 1800000), uploadSpeed: 3.8, downloadSpeed: 4.6, latency: 15, packetLoss: 0.5, activeConnections: 6, saturation: 58 },
  { timestamp: new Date(Date.now() - 1200000), uploadSpeed: 3.2, downloadSpeed: 3.9, latency: 22, packetLoss: 1.2, activeConnections: 8, saturation: 75 },
  { timestamp: new Date(Date.now() - 600000), uploadSpeed: 2.8, downloadSpeed: 3.4, latency: 28, packetLoss: 2.1, activeConnections: 8, saturation: 85 },
  { timestamp: new Date(Date.now()), uploadSpeed: 2.5, downloadSpeed: 3.1, latency: 32, packetLoss: 3.5, activeConnections: 8, saturation: 85 },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "warning":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "info":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    default:
      return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  }
};

const getBottleneckIcon = (type: string) => {
  switch (type) {
    case "congestion":
      return "🔴";
    case "latency":
      return "⏱️";
    case "bandwidth":
      return "📊";
    case "packet_loss":
      return "📉";
    case "device_limitation":
      return "📱";
    default:
      return "⚠️";
  }
};

export function NetworkBottleneckIdentifier() {
  const [expandedBottleneckId, setExpandedBottleneckId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "warning" | "info">("all");

  const filteredBottlenecks = mockBottlenecks.filter(
    (bottleneck) => filterSeverity === "all" || bottleneck.severity === filterSeverity
  );

  const criticalCount = mockBottlenecks.filter((b) => b.severity === "critical").length;
  const warningCount = mockBottlenecks.filter((b) => b.severity === "warning").length;
  const totalAffectedDevices = new Set(mockBottlenecks.map((b) => b.affectedDevices)).size;
  const avgSaturation = Math.round(mockNetworkTrend.reduce((a, b) => a + b.saturation, 0) / mockNetworkTrend.length);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Network Bottleneck Identifier</h3>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Critical Issues</p>
          <p className="text-3xl font-black text-rose-500">{criticalCount}</p>
          <p className="text-[10px] text-zinc-600">requiring immediate action</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Warnings</p>
          <p className="text-3xl font-black text-amber-500">{warningCount}</p>
          <p className="text-[10px] text-zinc-600">monitoring recommended</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Network Saturation</p>
          <p className={cn("text-3xl font-black", avgSaturation > 80 ? "text-rose-500" : avgSaturation > 60 ? "text-amber-500" : "text-emerald-500")}>
            {avgSaturation}%
          </p>
          <p className="text-[10px] text-zinc-600">current usage</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Affected Devices</p>
          <p className="text-3xl font-black text-blue-500">{totalAffectedDevices}</p>
          <p className="text-[10px] text-zinc-600">experiencing impact</p>
        </div>
      </div>

      {/* Network Trend Chart (Sparkline) */}
      <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
        <p className="text-xs font-bold text-zinc-600 uppercase">📈 Network Trend (Last Hour)</p>
        <div className="space-y-2">
          {/* Saturation Trend */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-400">Network Saturation</span>
              <span className="font-bold text-zinc-300">{avgSaturation}% avg</span>
            </div>
            <div className="h-8 bg-white/5 rounded flex items-end justify-between px-1 gap-0.5">
              {mockNetworkTrend.map((metric, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex-1 rounded-t transition-all",
                    metric.saturation > 80
                      ? "bg-rose-500"
                      : metric.saturation > 60
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  )}
                  style={{ height: `${(metric.saturation / 100) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Speed Trend */}
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-400">Download Speed</span>
              <span className="font-bold text-blue-500">{mockNetworkTrend[mockNetworkTrend.length - 1].downloadSpeed} Mbps (current)</span>
            </div>
            <div className="h-8 bg-white/5 rounded flex items-end justify-between px-1 gap-0.5">
              {mockNetworkTrend.map((metric, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-t bg-blue-500 transition-all"
                  style={{ height: `${(metric.downloadSpeed / 6) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Latency Trend */}
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-400">Latency</span>
              <span className="font-bold text-amber-500">{mockNetworkTrend[mockNetworkTrend.length - 1].latency}ms (current)</span>
            </div>
            <div className="h-8 bg-white/5 rounded flex items-end justify-between px-1 gap-0.5">
              {mockNetworkTrend.map((metric, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-t bg-amber-500 transition-all"
                  style={{ height: `${(metric.latency / 35) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["all", "critical", "warning", "info"].map((severity) => (
          <button
            key={severity}
            onClick={() => setFilterSeverity(severity as any)}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded transition-all",
              filterSeverity === severity
                ? "bg-primary text-white"
                : "bg-white/10 text-zinc-400 hover:bg-white/20"
            )}
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </button>
        ))}
      </div>

      {/* Bottleneck List */}
      <div className="space-y-3">
        {filteredBottlenecks.map((bottleneck) => (
          <div key={bottleneck.id} className="space-y-2">
            <button
              onClick={() =>
                setExpandedBottleneckId(
                  expandedBottleneckId === bottleneck.id ? null : bottleneck.id
                )
              }
              className={cn(
                "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                getSeverityColor(bottleneck.severity)
              )}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{getBottleneckIcon(bottleneck.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{bottleneck.description}</p>
                      <p className="text-xs text-zinc-600 mt-1 capitalize">{bottleneck.type.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase px-2 py-1 rounded",
                      bottleneck.severity === "critical"
                        ? "bg-rose-500/20 text-rose-500"
                        : bottleneck.severity === "warning"
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-blue-500/20 text-blue-500"
                    )}
                  >
                    {bottleneck.severity}
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                  <div>
                    <span className="text-zinc-400">Affected:</span> {bottleneck.affectedDevices} devices
                  </div>
                  <div>
                    <span className="text-zinc-400">Impact:</span> {bottleneck.estimatedImpact}%
                  </div>
                  <div>
                    <span className="text-zinc-400">Detected:</span> {bottleneck.detectedTime.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedBottleneckId === bottleneck.id && (
              <div className="pl-4 space-y-2">
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  {/* Root Cause */}
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      🔍 Root Cause Analysis
                    </p>
                    <p className="text-[10px] text-zinc-300 leading-relaxed">
                      {bottleneck.rootCause}
                    </p>
                  </div>

                  {/* Impact Analysis */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      📊 Impact Analysis
                    </p>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Estimated Impact:</span>
                        <span className="font-bold text-white">{bottleneck.estimatedImpact}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            bottleneck.estimatedImpact > 40
                              ? "bg-rose-500"
                              : bottleneck.estimatedImpact > 20
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          )}
                          style={{ width: `${bottleneck.estimatedImpact}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-600">
                        <span>Affected Devices: {bottleneck.affectedDevices}</span>
                        <span>Detected: {bottleneck.detectedTime.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      💡 Recommended Action
                    </p>
                    <p className="text-[10px] text-zinc-300 leading-relaxed">
                      {bottleneck.recommendation}
                    </p>
                  </div>

                  {/* Expected Resolution */}
                  {bottleneck.expectedResolution && (
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        ⏱️ Expected Resolution
                      </p>
                      <p className="text-[10px] text-emerald-400">
                        Expected to resolve by {bottleneck.expectedResolution.toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">
          ℹ️ Network Optimization Tips
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>🔴 Critical issues require immediate action to maintain transfer quality</li>
          <li>⏱️ High latency often indicates device movement or signal degradation</li>
          <li>📊 Network saturation >80% significantly impacts transfer speeds</li>
          <li>📉 Packet loss usually indicates Wi-Fi interference or poor signal quality</li>
          <li>📱 Older devices may limit group-wide transfer performance</li>
          <li>💡 Distribute transfers across time to reduce network congestion</li>
        </ul>
      </div>
    </div>
  );
}
