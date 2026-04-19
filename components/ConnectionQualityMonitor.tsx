"use client";

import { useState } from "react";
import { Wifi, Signal, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionQuality {
  deviceAddress: string;
  deviceName: string;
  signalStrength: number;
  latency: number;
  packetLoss: number;
  bandwidth: number;
  connectionStability: number;
  lastMeasurement: Date;
}

interface ConnectionQualityMonitorProps {
  connections?: ConnectionQuality[];
}

const mockConnections: ConnectionQuality[] = [
  {
    deviceAddress: "AA:BB:CC:DD:EE:01",
    deviceName: "Sarah's iPhone",
    signalStrength: -42,
    latency: 8,
    packetLoss: 0.2,
    bandwidth: 54,
    connectionStability: 98.5,
    lastMeasurement: new Date(Date.now() - 30000),
  },
  {
    deviceAddress: "AA:BB:CC:DD:EE:02",
    deviceName: "James' Android",
    signalStrength: -58,
    latency: 12,
    packetLoss: 0.5,
    bandwidth: 45,
    connectionStability: 94.2,
    lastMeasurement: new Date(Date.now() - 15000),
  },
  {
    deviceAddress: "AA:BB:CC:DD:EE:03",
    deviceName: "Unknown Device",
    signalStrength: -75,
    latency: 45,
    packetLoss: 2.1,
    bandwidth: 20,
    connectionStability: 67.8,
    lastMeasurement: new Date(Date.now() - 60000),
  },
  {
    deviceAddress: "AA:BB:CC:DD:EE:04",
    deviceName: "Maria's Device",
    signalStrength: -52,
    latency: 15,
    packetLoss: 0.8,
    bandwidth: 48,
    connectionStability: 91.3,
    lastMeasurement: new Date(Date.now() - 45000),
  },
];

const getSignalQuality = (dbm: number) => {
  if (dbm > -50) return { label: "Excellent", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
  if (dbm > -60) return { label: "Good", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
  if (dbm > -70) return { label: "Fair", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
  return { label: "Poor", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
};

const getLatencyQuality = (ms: number) => {
  if (ms < 10) return { label: "Excellent", color: "text-emerald-500" };
  if (ms < 20) return { label: "Good", color: "text-blue-500" };
  if (ms < 50) return { label: "Fair", color: "text-amber-500" };
  return { label: "Poor", color: "text-rose-500" };
};

const getStabilityColor = (stability: number) => {
  if (stability > 95) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (stability > 85) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  if (stability > 70) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
};

export function ConnectionQualityMonitor({
  connections = mockConnections,
}: ConnectionQualityMonitorProps) {
  const [expandedAddress, setExpandedAddress] = useState<string | null>(null);

  const avgSignalStrength =
    connections.reduce((sum, c) => sum + c.signalStrength, 0) / connections.length;
  const avgLatency =
    connections.reduce((sum, c) => sum + c.latency, 0) / connections.length;
  const avgStability =
    connections.reduce((sum, c) => sum + c.connectionStability, 0) /
    connections.length;

  const getSignalBars = (dbm: number) => {
    if (dbm > -50) return 4;
    if (dbm > -60) return 3;
    if (dbm > -70) return 2;
    return 1;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Wifi className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Connection Quality Monitor</h3>
      </div>

      {/* Network Health Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Signal</p>
          <p className="text-3xl font-black text-blue-500">{avgSignalStrength.toFixed(0)} dBm</p>
          <p className="text-[10px] text-zinc-600">
            {getSignalQuality(avgSignalStrength).label}
          </p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Latency</p>
          <p className="text-3xl font-black text-amber-500">{avgLatency.toFixed(0)} ms</p>
          <p className="text-[10px] text-zinc-600">
            {getLatencyQuality(avgLatency).label}
          </p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Stability</p>
          <p className="text-3xl font-black text-emerald-500">
            {avgStability.toFixed(1)}%
          </p>
          <p className="text-[10px] text-zinc-600">connection uptime</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Active Devices</p>
          <p className="text-3xl font-black text-primary">{connections.length}</p>
          <p className="text-[10px] text-zinc-600">connected peers</p>
        </div>
      </div>

      {/* Connection Heatmap */}
      <div className="space-y-3">
        {connections
          .sort((a, b) => b.connectionStability - a.connectionStability)
          .map((conn) => {
            const signalQuality = getSignalQuality(conn.signalStrength);
            const latencyQuality = getLatencyQuality(conn.latency);
            const signalBars = getSignalBars(conn.signalStrength);

            return (
              <div key={conn.deviceAddress} className="space-y-2">
                <button
                  onClick={() =>
                    setExpandedAddress(
                      expandedAddress === conn.deviceAddress
                        ? null
                        : conn.deviceAddress
                    )
                  }
                  className="w-full glass-card rounded-xl border-white/10 p-4 hover:bg-white/[0.03] transition-all text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Device Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-white text-sm">
                          {conn.deviceName}
                        </h4>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-full border",
                            signalQuality.color
                          )}
                        >
                          {signalQuality.label}
                        </span>
                      </div>

                      {/* Signal Bars */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((bar) => (
                            <div
                              key={bar}
                              className={cn(
                                "h-3 rounded-sm transition-colors",
                                signalBars >= bar
                                  ? "bg-emerald-500"
                                  : "bg-zinc-700"
                              )}
                              style={{ width: `${bar * 3}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-zinc-500">
                          {conn.signalStrength} dBm
                        </span>
                      </div>

                      {/* Quick Metrics */}
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            getLatencyQuality(conn.latency).color
                          )}
                        >
                          <Activity className="h-3 w-3" />
                          <span className="font-bold">{conn.latency} ms</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="font-bold">{conn.packetLoss.toFixed(2)}%</span>
                          <span className="text-zinc-500">loss</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-500">
                          <span className="font-bold">{conn.bandwidth} Mbps</span>
                        </div>
                      </div>
                    </div>

                    {/* Stability Score */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-2",
                          getStabilityColor(conn.connectionStability)
                        )}
                      >
                        {conn.connectionStability.toFixed(0)}%
                      </div>
                      <p className="text-[10px] text-zinc-600">Stability</p>
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedAddress === conn.deviceAddress && (
                  <div className="pl-4 space-y-2">
                    <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
                      {/* Signal Strength Analysis */}
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                          Signal Strength Analysis
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">Signal: {conn.signalStrength} dBm</span>
                            <span className="text-xs font-bold text-blue-500">
                              {signalQuality.label}
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-rose-500 to-emerald-500"
                              style={{
                                width: `${Math.max(20, Math.min(100, (conn.signalStrength + 100) * 1.2))}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-zinc-600">
                            Range: -30 (Best) to -90 (Worst) dBm
                          </p>
                        </div>
                      </div>

                      {/* Latency Analysis */}
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                          Latency Analysis
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">
                              Latency: {conn.latency} ms
                            </span>
                            <span
                              className={cn(
                                "text-xs font-bold",
                                getLatencyQuality(conn.latency).color
                              )}
                            >
                              {getLatencyQuality(conn.latency).label}
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-rose-500"
                              style={{
                                width: `${Math.min(100, (conn.latency / 100) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-zinc-600">
                            Optimal: &lt;10ms | Good: 10-20ms | Fair: 20-50ms
                          </p>
                        </div>
                      </div>

                      {/* Packet Loss Analysis */}
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                          Packet Loss
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-primary">
                            {conn.packetLoss.toFixed(2)}%
                          </span>
                          <span className="text-[10px] text-zinc-600">
                            {conn.packetLoss < 1
                              ? "Excellent"
                              : conn.packetLoss < 3
                                ? "Good"
                                : "Poor"}
                          </span>
                        </div>
                      </div>

                      {/* Bandwidth Analysis */}
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                          Bandwidth Capacity
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-blue-500">
                            {conn.bandwidth} Mbps
                          </span>
                          <span className="text-[10px] text-zinc-600">Wi-Fi 6 Capable</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-primary"
                            style={{ width: `${(conn.bandwidth / 80) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Last Measurement */}
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-[10px] text-zinc-600">
                          Last measured:{" "}
                          {conn.lastMeasurement.toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Connection Quality Assessment */}
                      <div
                        className={cn(
                          "p-3 rounded-lg border-2",
                          conn.connectionStability > 95
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : conn.connectionStability > 85
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                              : conn.connectionStability > 70
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                        )}
                      >
                        <p className="text-xs font-bold uppercase">
                          Connection Quality: {conn.connectionStability.toFixed(1)}% Stable
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">Signal Quality Legend</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li><strong>Signal Strength:</strong> -30 to -50 dBm (Excellent) → -50 to -70 dBm (Fair) → -70+ dBm (Poor)</li>
          <li><strong>Latency:</strong> &lt;10ms (Excellent) → 10-50ms (Fair) → 50+ms (Poor)</li>
          <li><strong>Packet Loss:</strong> &lt;1% (Excellent) → 1-3% (Good) → 3%+ (Poor)</li>
          <li><strong>Stability:</strong> Higher % = fewer disconnections and more reliable transfers</li>
          <li><strong>Bandwidth:</strong> Actual throughput capacity for the connection</li>
        </ul>
      </div>
    </div>
  );
}
