"use client";

import { useState } from "react";
import { Activity, TrendingDown, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BandwidthMetric {
  timestamp: Date;
  uploadSpeed: number;
  downloadSpeed: number;
  utilizationPercent: number;
  activeConnections: number;
  packetsTx: number;
  packetsRx: number;
}

interface BandwidthDataPoint {
  time: string;
  upload: number;
  download: number;
  utilization: number;
}

interface BandwidthUtilizationMonitorProps {
  metrics?: BandwidthMetric[];
  historicalData?: BandwidthDataPoint[];
}

const mockHistoricalData: BandwidthDataPoint[] = [
  { time: "00:00", upload: 2.1, download: 1.8, utilization: 15 },
  { time: "01:00", upload: 1.5, download: 1.2, utilization: 12 },
  { time: "02:00", upload: 0.8, download: 0.9, utilization: 8 },
  { time: "03:00", upload: 0.6, download: 0.7, utilization: 6 },
  { time: "04:00", upload: 0.5, download: 0.6, utilization: 5 },
  { time: "05:00", upload: 1.2, download: 1.0, utilization: 10 },
  { time: "06:00", upload: 3.4, download: 3.1, utilization: 28 },
  { time: "07:00", upload: 5.8, download: 5.2, utilization: 42 },
  { time: "08:00", upload: 7.2, download: 6.8, utilization: 56 },
  { time: "09:00", upload: 8.5, download: 7.9, utilization: 68 },
  { time: "10:00", upload: 9.1, download: 8.6, utilization: 74 },
  { time: "11:00", upload: 8.3, download: 7.5, utilization: 65 },
  { time: "12:00", upload: 6.9, download: 6.2, utilization: 52 },
];

const mockCurrentMetrics: BandwidthMetric = {
  timestamp: new Date(),
  uploadSpeed: 9.4,
  downloadSpeed: 8.7,
  utilizationPercent: 76,
  activeConnections: 47,
  packetsTx: 45230,
  packetsRx: 38940,
};

const getUtilizationColor = (percent: number) => {
  if (percent < 30) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (percent < 60) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  if (percent < 80) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
};

const getUtilizationLabel = (percent: number) => {
  if (percent < 30) return "Low Usage";
  if (percent < 60) return "Moderate Usage";
  if (percent < 80) return "High Usage";
  return "Critical Usage";
};

export function BandwidthUtilizationMonitor({
  metrics = [mockCurrentMetrics],
  historicalData = mockHistoricalData,
}: BandwidthUtilizationMonitorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  const currentMetric = metrics[metrics.length - 1] || mockCurrentMetrics;
  const avgUpload =
    historicalData.reduce((sum, d) => sum + d.upload, 0) / historicalData.length;
  const avgDownload =
    historicalData.reduce((sum, d) => sum + d.download, 0) / historicalData.length;
  const peakUtilization = Math.max(...historicalData.map(d => d.utilization));
  const avgUtilization =
    historicalData.reduce((sum, d) => sum + d.utilization, 0) / historicalData.length;

  const maxBandwidth = 100; // Mbps

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Bandwidth Utilization Monitor</h3>
      </div>

      {/* Current Status Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Upload Speed</p>
          <p className="text-3xl font-black text-blue-500">
            {currentMetric.uploadSpeed.toFixed(1)}
          </p>
          <p className="text-[10px] text-zinc-600">Mbps current</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Download Speed</p>
          <p className="text-3xl font-black text-emerald-500">
            {currentMetric.downloadSpeed.toFixed(1)}
          </p>
          <p className="text-[10px] text-zinc-600">Mbps current</p>
        </div>

        <div
          className={cn(
            "glass-card rounded-xl border-2 p-4 space-y-2",
            getUtilizationColor(currentMetric.utilizationPercent)
          )}
        >
          <p className="text-xs font-bold uppercase">Utilization</p>
          <p className="text-3xl font-black">{currentMetric.utilizationPercent}%</p>
          <p className="text-[10px]">{getUtilizationLabel(currentMetric.utilizationPercent)}</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Active Connections</p>
          <p className="text-3xl font-black text-primary">
            {currentMetric.activeConnections}
          </p>
          <p className="text-[10px] text-zinc-600">concurrent transfers</p>
        </div>
      </div>

      {/* Bandwidth History Chart */}
      <div className="space-y-4">
        <button
          onClick={() =>
            setExpandedSection(expandedSection === "history" ? null : "history")
          }
          className="w-full glass-card rounded-xl border-white/10 p-4 hover:bg-white/[0.03] transition-all text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white">24-Hour Bandwidth History</h4>
            <span className="text-[10px] text-zinc-500">
              {expandedSection === "history" ? "▼" : "▶"}
            </span>
          </div>

          {/* ASCII Sparkline */}
          <div className="space-y-2">
            {/* Upload sparkline */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600">Upload (Mbps)</span>
                <span className="text-[10px] font-bold text-blue-500">
                  Peak: {Math.max(...historicalData.map(d => d.upload)).toFixed(1)} Mbps
                </span>
              </div>
              <div className="h-8 bg-white/5 rounded overflow-hidden">
                <div className="flex items-end justify-between h-full gap-0.5 p-1">
                  {historicalData.map((d, i) => (
                    <div
                      key={`upload-${i}`}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:opacity-75"
                      style={{
                        height: `${(d.upload / 10) * 100}%`,
                        minHeight: "2px",
                      }}
                      title={`${d.time}: ${d.upload.toFixed(1)} Mbps`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Download sparkline */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600">Download (Mbps)</span>
                <span className="text-[10px] font-bold text-emerald-500">
                  Peak: {Math.max(...historicalData.map(d => d.download)).toFixed(1)} Mbps
                </span>
              </div>
              <div className="h-8 bg-white/5 rounded overflow-hidden">
                <div className="flex items-end justify-between h-full gap-0.5 p-1">
                  {historicalData.map((d, i) => (
                    <div
                      key={`download-${i}`}
                      className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t transition-all hover:opacity-75"
                      style={{
                        height: `${(d.download / 10) * 100}%`,
                        minHeight: "2px",
                      }}
                      title={`${d.time}: ${d.download.toFixed(1)} Mbps`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Utilization sparkline */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600">Utilization (%)</span>
                <span className="text-[10px] font-bold text-primary">
                  Peak: {peakUtilization}% | Avg: {avgUtilization.toFixed(0)}%
                </span>
              </div>
              <div className="h-8 bg-white/5 rounded overflow-hidden">
                <div className="flex items-end justify-between h-full gap-0.5 p-1">
                  {historicalData.map((d, i) => (
                    <div
                      key={`util-${i}`}
                      className={cn(
                        "flex-1 rounded-t transition-all hover:opacity-75",
                        d.utilization < 30
                          ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                          : d.utilization < 60
                            ? "bg-gradient-to-t from-blue-500 to-blue-400"
                            : d.utilization < 80
                              ? "bg-gradient-to-t from-amber-500 to-amber-400"
                              : "bg-gradient-to-t from-rose-500 to-rose-400"
                      )}
                      style={{
                        height: `${(d.utilization / 100) * 100}%`,
                        minHeight: "2px",
                      }}
                      title={`${d.time}: ${d.utilization}%`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Expanded History Details */}
        {expandedSection === "history" && (
          <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                  Upload Statistics
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Current:</span>
                    <span className="font-bold text-blue-500">
                      {currentMetric.uploadSpeed.toFixed(1)} Mbps
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Average:</span>
                    <span className="font-bold text-blue-400">
                      {avgUpload.toFixed(1)} Mbps
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Peak:</span>
                    <span className="font-bold text-blue-300">
                      {Math.max(...historicalData.map(d => d.upload)).toFixed(1)} Mbps
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                  Download Statistics
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Current:</span>
                    <span className="font-bold text-emerald-500">
                      {currentMetric.downloadSpeed.toFixed(1)} Mbps
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Average:</span>
                    <span className="font-bold text-emerald-400">
                      {avgDownload.toFixed(1)} Mbps
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Peak:</span>
                    <span className="font-bold text-emerald-300">
                      {Math.max(...historicalData.map(d => d.download)).toFixed(1)} Mbps
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                  Utilization Statistics
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Current:</span>
                    <span className="font-bold text-primary">
                      {currentMetric.utilizationPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Average:</span>
                    <span className="font-bold text-primary">
                      {avgUtilization.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Peak:</span>
                    <span className="font-bold text-primary">{peakUtilization}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Network Packet Statistics */}
      <div className="space-y-4">
        <button
          onClick={() =>
            setExpandedSection(expandedSection === "packets" ? null : "packets")
          }
          className="w-full glass-card rounded-xl border-white/10 p-4 hover:bg-white/[0.03] transition-all text-left"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white">Packet Statistics</h4>
            <span className="text-[10px] text-zinc-500">
              {expandedSection === "packets" ? "▼" : "▶"}
            </span>
          </div>
        </button>

        {expandedSection === "packets" && (
          <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                  Packets Transmitted (TX)
                </p>
                <p className="text-2xl font-black text-blue-500 mb-2">
                  {(currentMetric.packetsTx / 1000).toFixed(1)}K
                </p>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Rate:</span>
                    <span className="font-bold text-zinc-300">~450 pps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Lost:</span>
                    <span className="font-bold text-emerald-500">0 (0%)</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                  Packets Received (RX)
                </p>
                <p className="text-2xl font-black text-emerald-500 mb-2">
                  {(currentMetric.packetsRx / 1000).toFixed(1)}K
                </p>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Rate:</span>
                    <span className="font-bold text-zinc-300">~389 pps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Errors:</span>
                    <span className="font-bold text-emerald-500">0 (0%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Capacity Planning */}
      <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-primary" />
          <h4 className="font-bold text-white">Capacity Planning</h4>
        </div>

        <div className="space-y-3">
          {[
            {
              label: "Current Usage",
              value: currentMetric.utilizationPercent,
              color: "from-blue-500 to-blue-400",
              status: "Active",
            },
            {
              label: "Available Capacity",
              value: 100 - currentMetric.utilizationPercent,
              color: "from-emerald-500 to-emerald-400",
              status: "Available",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">{item.label}</span>
                <span className="text-sm font-bold text-primary">{item.value}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Utilization Warning */}
        {currentMetric.utilizationPercent > 80 && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="text-[10px]">
              <p className="font-bold mb-1">High Bandwidth Utilization</p>
              <p>
                Network at {currentMetric.utilizationPercent}% capacity. Consider spreading
                transfers across time windows or upgrading network capacity.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">Bandwidth Metrics</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Upload: Data transferred FROM P2P devices (sending files)</li>
          <li>Download: Data transferred TO P2P devices (receiving files)</li>
          <li>Utilization: Percentage of max Wi-Fi capacity being used (0-100%)</li>
          <li>Healthy Range: &lt;60% utilization for optimal performance</li>
          <li>Warning Threshold: &gt;80% utilization indicates capacity concerns</li>
          <li>Packet Stats: Monitor for transmission errors and packet loss</li>
        </ul>
      </div>
    </div>
  );
}
