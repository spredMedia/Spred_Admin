"use client";

import { useState } from "react";
import { AlertTriangle, Zap, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Anomaly {
  id: string;
  type: "failure_spike" | "speed_degradation" | "latency_spike" | "device_behavior" | "pattern_change";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  detectedTime: Date;
  confidence: number;
  affectedCount: number;
  recommendation: string;
  status: "active" | "resolved" | "investigating";
}

interface AnomalyStats {
  totalAnomalies: number;
  activeAnomalies: number;
  resolvedToday: number;
  avgConfidence: number;
  falsePositiveRate: number;
}

const mockAnomalies: Anomaly[] = [
  {
    id: "a1",
    type: "failure_spike",
    severity: "critical",
    title: "Transfer Failure Rate Spike",
    description: "Failure rate jumped from 6% to 18% in the last 2 hours",
    detectedTime: new Date(Date.now() - 120000),
    confidence: 0.97,
    affectedCount: 47,
    recommendation: "Check network health, investigate device compatibility issues",
    status: "investigating",
  },
  {
    id: "a2",
    type: "speed_degradation",
    severity: "warning",
    title: "Speed Degradation Detected",
    description: "Average transfer speed dropped 22% below baseline (5.9 → 4.6 MB/s)",
    detectedTime: new Date(Date.now() - 600000),
    confidence: 0.84,
    affectedCount: 34,
    recommendation: "Monitor bandwidth saturation, check for network congestion",
    status: "active",
  },
  {
    id: "a3",
    type: "latency_spike",
    severity: "warning",
    title: "Latency Spike on Wi-Fi Direct",
    description: "Latency increased by 150% in peer connections (avg 9ms → 22ms)",
    detectedTime: new Date(Date.now() - 1200000),
    confidence: 0.91,
    affectedCount: 12,
    recommendation: "Check for Wi-Fi interference, verify signal strength",
    status: "investigating",
  },
  {
    id: "a4",
    type: "device_behavior",
    severity: "info",
    title: "Unusual Device Activity Pattern",
    description: "Samsung Galaxy S23 showing abnormal transfer patterns (100+ transfers in 1 hour)",
    detectedTime: new Date(Date.now() - 1800000),
    confidence: 0.72,
    affectedCount: 1,
    recommendation: "Review device activity logs, check for automated transfers",
    status: "active",
  },
  {
    id: "a5",
    type: "pattern_change",
    severity: "info",
    title: "Shift in Peak Transfer Hours",
    description: "Peak transfer window shifted 2 hours earlier than historical pattern",
    detectedTime: new Date(Date.now() - 3600000),
    confidence: 0.68,
    affectedCount: 156,
    recommendation: "Update capacity planning for new peak hours",
    status: "resolved",
  },
];

const mockStats: AnomalyStats = {
  totalAnomalies: 5,
  activeAnomalies: 3,
  resolvedToday: 2,
  avgConfidence: 0.82,
  falsePositiveRate: 0.08,
};

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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return "🔴 Active";
    case "investigating":
      return "🟡 Investigating";
    case "resolved":
      return "🟢 Resolved";
    default:
      return "⚪ Unknown";
  }
};

const getAnomalyIcon = (type: string) => {
  switch (type) {
    case "failure_spike":
      return "📊";
    case "speed_degradation":
      return "⚡";
    case "latency_spike":
      return "⏱️";
    case "device_behavior":
      return "📱";
    case "pattern_change":
      return "📈";
    default:
      return "⚠️";
  }
};

export function AnomalyDetectionPanel() {
  const [expandedAnomalyId, setExpandedAnomalyId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "investigating" | "resolved">("all");

  const filteredAnomalies = mockAnomalies.filter(
    (anomaly) => filterStatus === "all" || anomaly.status === filterStatus
  );

  const criticalCount = mockAnomalies.filter((a) => a.severity === "critical" && a.status !== "resolved").length;
  const warningCount = mockAnomalies.filter((a) => a.severity === "warning" && a.status !== "resolved").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Anomaly Detection & Analysis</h3>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Active Anomalies</p>
          <p className="text-3xl font-black text-rose-500">{mockStats.activeAnomalies}</p>
          <p className="text-[10px] text-zinc-600">requiring attention</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Critical Issues</p>
          <p className="text-3xl font-black text-rose-500">{criticalCount}</p>
          <p className="text-[10px] text-zinc-600">high severity</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Warnings</p>
          <p className="text-3xl font-black text-amber-500">{warningCount}</p>
          <p className="text-[10px] text-zinc-600">monitoring</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Confidence</p>
          <p className="text-3xl font-black text-blue-500">{(mockStats.avgConfidence * 100).toFixed(0)}%</p>
          <p className="text-[10px] text-zinc-600">detection accuracy</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Resolved Today</p>
          <p className="text-3xl font-black text-emerald-500">{mockStats.resolvedToday}</p>
          <p className="text-[10px] text-zinc-600">closed anomalies</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["all", "active", "investigating", "resolved"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded transition-all",
              filterStatus === status
                ? "bg-primary text-white"
                : "bg-white/10 text-zinc-400 hover:bg-white/20"
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Anomaly List */}
      <div className="space-y-3">
        {filteredAnomalies.map((anomaly) => (
          <div key={anomaly.id} className="space-y-2">
            <button
              onClick={() =>
                setExpandedAnomalyId(
                  expandedAnomalyId === anomaly.id ? null : anomaly.id
                )
              }
              className={cn(
                "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                getSeverityColor(anomaly.severity)
              )}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{getAnomalyIcon(anomaly.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{anomaly.title}</p>
                      <p className="text-xs text-zinc-600 mt-1">{anomaly.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded",
                        anomaly.status === "active"
                          ? "bg-rose-500/20 text-rose-500"
                          : anomaly.status === "investigating"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-emerald-500/20 text-emerald-500"
                      )}
                    >
                      {getStatusBadge(anomaly.status)}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                  <div>
                    <span className="text-zinc-400">Confidence:</span> {(anomaly.confidence * 100).toFixed(0)}%
                  </div>
                  <div>
                    <span className="text-zinc-400">Affected:</span> {anomaly.affectedCount} {anomaly.affectedCount === 1 ? "device" : "devices"}
                  </div>
                  <div>
                    <span className="text-zinc-400">Detected:</span> {anomaly.detectedTime.toLocaleTimeString()}
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        anomaly.confidence >= 0.9
                          ? "bg-emerald-500"
                          : anomaly.confidence >= 0.75
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      )}
                      style={{ width: `${anomaly.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">Detection confidence</p>
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedAnomalyId === anomaly.id && (
              <div className="pl-4 space-y-2">
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  {/* Analysis */}
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      🔬 Detailed Analysis
                    </p>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Type:</span>
                        <span className="font-bold text-white capitalize">{anomaly.type.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Severity:</span>
                        <span
                          className={cn(
                            "font-bold uppercase",
                            anomaly.severity === "critical"
                              ? "text-rose-500"
                              : anomaly.severity === "warning"
                                ? "text-amber-500"
                                : "text-blue-500"
                          )}
                        >
                          {anomaly.severity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Status:</span>
                        <span
                          className={cn(
                            "font-bold uppercase",
                            anomaly.status === "active"
                              ? "text-rose-500"
                              : anomaly.status === "investigating"
                                ? "text-amber-500"
                                : "text-emerald-500"
                          )}
                        >
                          {anomaly.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Confidence:</span>
                        <span className="font-bold text-blue-500">{(anomaly.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Affected Entities:</span>
                        <span className="font-bold text-white">{anomaly.affectedCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      💡 Recommended Action
                    </p>
                    <p className="text-[10px] text-zinc-300 leading-relaxed">
                      {anomaly.recommendation}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      ⏰ Timeline
                    </p>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Detected:</span>
                        <span className="font-bold text-white">
                          {anomaly.detectedTime.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Duration:</span>
                        <span className="font-bold text-amber-500">
                          {Math.round((Date.now() - anomaly.detectedTime.getTime()) / 60000)} minutes ago
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Impact Summary */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      📊 Impact Summary
                    </p>
                    <p className="text-[10px] text-zinc-300">
                      {anomaly.affectedCount} {anomaly.affectedCount === 1 ? "device" : "devices"} showing
                      {anomaly.type === "failure_spike"
                        ? " elevated failure rates"
                        : anomaly.type === "speed_degradation"
                          ? " reduced transfer speeds"
                          : anomaly.type === "latency_spike"
                            ? " high latency"
                            : anomaly.type === "device_behavior"
                              ? " unusual activity"
                              : " pattern changes"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-white/10 flex gap-2">
                    <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-primary text-white hover:bg-primary/80 transition-all">
                      Acknowledge
                    </button>
                    {anomaly.status !== "resolved" && (
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-white/10 text-zinc-300 hover:bg-white/20 transition-all">
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">
          ℹ️ Anomaly Detection Features
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>🔍 ML-based detection identifies statistical deviations from baseline</li>
          <li>📊 Failure spike detection catches sudden increases in transfer errors</li>
          <li>⚡ Speed degradation alerts when throughput drops below threshold</li>
          <li>⏱️ Latency analysis identifies network interference and congestion</li>
          <li>📱 Device behavior tracking spots unusual activity patterns</li>
          <li>🎯 Confidence scores indicate reliability of each anomaly detection</li>
        </ul>
      </div>
    </div>
  );
}
