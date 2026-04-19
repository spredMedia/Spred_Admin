"use client";

import { useState } from "react";
import { Smartphone, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeviceCompatibility {
  deviceModel: string;
  osVersion: string;
  deviceCount: number;
  successRate: number;
  avgSpeed: number;
  encryptionSupport: boolean;
  p2pCapable: boolean;
  offlineSupport: boolean;
  lastUpdated: Date;
  commonIssues: string[];
}

interface CompatibilityMatrixProps {
  devices?: DeviceCompatibility[];
}

const mockDevices: DeviceCompatibility[] = [
  {
    deviceModel: "iPhone 14 Pro",
    osVersion: "iOS 17.2",
    deviceCount: 12,
    successRate: 98.5,
    avgSpeed: 6.8,
    encryptionSupport: true,
    p2pCapable: true,
    offlineSupport: true,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    commonIssues: [],
  },
  {
    deviceModel: "Samsung Galaxy S23",
    osVersion: "Android 14",
    deviceCount: 8,
    successRate: 96.2,
    avgSpeed: 6.1,
    encryptionSupport: true,
    p2pCapable: true,
    offlineSupport: true,
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
    commonIssues: [],
  },
  {
    deviceModel: "iPhone 13",
    osVersion: "iOS 16.7",
    deviceCount: 15,
    successRate: 94.8,
    avgSpeed: 5.9,
    encryptionSupport: true,
    p2pCapable: true,
    offlineSupport: true,
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
    commonIssues: ["Occasional timeout on large files"],
  },
  {
    deviceModel: "Google Pixel 7",
    osVersion: "Android 13",
    deviceCount: 5,
    successRate: 91.5,
    avgSpeed: 5.2,
    encryptionSupport: true,
    p2pCapable: true,
    offlineSupport: true,
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
    commonIssues: ["Higher latency in dense networks"],
  },
  {
    deviceModel: "iPhone 12",
    osVersion: "iOS 15.8",
    deviceCount: 7,
    successRate: 88.3,
    avgSpeed: 5.0,
    encryptionSupport: false,
    p2pCapable: true,
    offlineSupport: false,
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000),
    commonIssues: ["No AES-256 encryption", "Limited offline support"],
  },
  {
    deviceModel: "OnePlus 11",
    osVersion: "Android 12",
    deviceCount: 3,
    successRate: 85.0,
    avgSpeed: 4.3,
    encryptionSupport: true,
    p2pCapable: true,
    offlineSupport: false,
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
    commonIssues: ["Offline mode not functional", "Network stability issues"],
  },
];

const getCompatibilityScore = (device: DeviceCompatibility): number => {
  let score = device.successRate;
  if (device.encryptionSupport) score += 5;
  if (device.offlineSupport) score += 5;
  return Math.min(100, score);
};

const getStatusColor = (device: DeviceCompatibility) => {
  const score = getCompatibilityScore(device);
  if (score >= 95) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 85) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  if (score >= 75) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
};

export function DeviceCompatibilityMatrix({
  devices = mockDevices,
}: CompatibilityMatrixProps) {
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"success" | "speed" | "count">("success");

  const sortedDevices = [...devices].sort((a, b) => {
    switch (sortBy) {
      case "success":
        return b.successRate - a.successRate;
      case "speed":
        return b.avgSpeed - a.avgSpeed;
      case "count":
        return b.deviceCount - a.deviceCount;
      default:
        return 0;
    }
  });

  const totalDevices = devices.reduce((sum, d) => sum + d.deviceCount, 0);
  const avgSuccessRate =
    devices.reduce((sum, d) => sum + d.successRate * d.deviceCount, 0) /
    totalDevices;
  const avgSpeed =
    devices.reduce((sum, d) => sum + d.avgSpeed * d.deviceCount, 0) / totalDevices;

  const fullSupportCount = devices.filter(
    d => d.encryptionSupport && d.offlineSupport && d.p2pCapable
  ).length;
  const partialSupportCount = devices.filter(
    d =>
      (d.encryptionSupport || d.offlineSupport || d.p2pCapable) &&
      !(d.encryptionSupport && d.offlineSupport && d.p2pCapable)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Smartphone className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Device Compatibility Matrix</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total Devices</p>
          <p className="text-3xl font-black text-primary">{devices.length}</p>
          <p className="text-[10px] text-zinc-600">device models</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Installations</p>
          <p className="text-3xl font-black text-blue-500">{totalDevices}</p>
          <p className="text-[10px] text-zinc-600">total devices</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Success</p>
          <p className="text-3xl font-black text-emerald-500">
            {avgSuccessRate.toFixed(1)}%
          </p>
          <p className="text-[10px] text-zinc-600">all models</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Speed</p>
          <p className="text-3xl font-black text-amber-500">{avgSpeed.toFixed(1)}</p>
          <p className="text-[10px] text-zinc-600">MB/s</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Full Support</p>
          <p className="text-3xl font-black text-emerald-500">{fullSupportCount}</p>
          <p className="text-[10px] text-zinc-600">models</p>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy("success")}
          className={cn(
            "px-4 py-2 rounded-lg font-bold text-sm transition-all",
            sortBy === "success"
              ? "bg-primary text-white"
              : "bg-white/5 text-zinc-400 hover:bg-white/10"
          )}
        >
          Sort by Success Rate
        </button>
        <button
          onClick={() => setSortBy("speed")}
          className={cn(
            "px-4 py-2 rounded-lg font-bold text-sm transition-all",
            sortBy === "speed"
              ? "bg-primary text-white"
              : "bg-white/5 text-zinc-400 hover:bg-white/10"
          )}
        >
          Sort by Speed
        </button>
        <button
          onClick={() => setSortBy("count")}
          className={cn(
            "px-4 py-2 rounded-lg font-bold text-sm transition-all",
            sortBy === "count"
              ? "bg-primary text-white"
              : "bg-white/5 text-zinc-400 hover:bg-white/10"
          )}
        >
          Sort by Count
        </button>
      </div>

      {/* Device Matrix */}
      <div className="space-y-3">
        {sortedDevices.map((device) => {
          const compatibilityScore = getCompatibilityScore(device);

          return (
            <div key={device.deviceModel} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedModel(
                    expandedModel === device.deviceModel ? null : device.deviceModel
                  )
                }
                className={cn(
                  "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03] text-left",
                  getStatusColor(device)
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Device Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-white text-sm">
                        {device.deviceModel}
                      </h4>
                      <span className="text-[10px] text-zinc-500 bg-white/10 px-2 py-1 rounded">
                        {device.osVersion}
                      </span>
                    </div>

                    {/* Feature Support */}
                    <div className="flex items-center gap-2 mb-2">
                      {device.p2pCapable && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                          ✓ P2P
                        </span>
                      )}
                      {device.encryptionSupport ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-500 flex items-center gap-1">
                          🔐 Encrypted
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-500 flex items-center gap-1">
                          ⚠️ No Encryption
                        </span>
                      )}
                      {device.offlineSupport ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-500 flex items-center gap-1">
                          📱 Offline
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-500/20 text-zinc-500 flex items-center gap-1">
                          ✗ Online Only
                        </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="flex items-center gap-1 text-emerald-500">
                        <span className="font-bold">{device.successRate.toFixed(1)}%</span>
                        <span className="text-zinc-500">success</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="font-bold">{device.avgSpeed.toFixed(1)}</span>
                        <span className="text-zinc-500">MB/s</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <span className="font-bold">{device.deviceCount}</span>
                        <span className="text-zinc-500">devices</span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Score */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-2",
                        compatibilityScore >= 95
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
                          : compatibilityScore >= 85
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-500"
                            : compatibilityScore >= 75
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-500"
                              : "bg-rose-500/20 border-rose-500/50 text-rose-500"
                      )}
                    >
                      {compatibilityScore.toFixed(0)}
                    </div>
                    <p className="text-[10px] text-zinc-600">Score</p>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedModel === device.deviceModel && (
                <div className="pl-4 space-y-2">
                  <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
                    {/* Compatibility Details */}
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        Feature Support Matrix
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-zinc-400">P2P Capable:</span>
                          {device.p2pCapable ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-zinc-400">Encryption (AES-256):</span>
                          {device.encryptionSupport ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-zinc-400">Offline Support:</span>
                          {device.offlineSupport ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        Performance Metrics
                      </p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-zinc-400">Success Rate:</span>
                            <span className="text-sm font-bold text-emerald-500">
                              {device.successRate.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                              style={{ width: `${device.successRate}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-400">Avg Speed:</span>
                          <span className="font-bold text-amber-500">
                            {device.avgSpeed.toFixed(1)} MB/s
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-zinc-400">Devices in Field:</span>
                          <span className="font-bold text-primary">
                            {device.deviceCount} devices
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Common Issues */}
                    {device.commonIssues.length > 0 && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                          Known Issues
                        </p>
                        <ul className="text-[10px] text-amber-400 space-y-1 ml-4 list-disc">
                          {device.commonIssues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px]">
                      <p className="font-bold mb-1">📋 Recommendation</p>
                      {compatibilityScore >= 95 && (
                        <p>Full compatibility. No action needed. Prioritize for rollout.</p>
                      )}
                      {compatibilityScore >= 85 && compatibilityScore < 95 && (
                        <p>High compatibility. Monitor for issues. Safe for production.</p>
                      )}
                      {compatibilityScore >= 75 && compatibilityScore < 85 && (
                        <p>
                          Moderate compatibility. Test thoroughly. May need workarounds.
                        </p>
                      )}
                      {compatibilityScore < 75 && (
                        <p>Low compatibility. Requires updates or engineering effort.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compatibility Legend */}
      <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
        <p className="text-sm font-bold text-white">Compatibility Score Breakdown</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-zinc-400">
                <strong>95+:</strong> Full compatibility, all features supported
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-[10px] text-zinc-400">
                <strong>85-94:</strong> High compatibility, minor limitations
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500" />
              <span className="text-[10px] text-zinc-400">
                <strong>75-84:</strong> Moderate, needs testing/workarounds
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-rose-500" />
              <span className="text-[10px] text-zinc-400">
                <strong>&lt;75:</strong> Low, requires engineering effort
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">Compatibility Scoring</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Base score: Device success rate (how often transfers succeed)</li>
          <li>+5 points: AES-256 encryption support enabled</li>
          <li>+5 points: Offline mode capability (Wi-Fi Direct without internet)</li>
          <li>Speed: Average transfer speed compared to network peak</li>
          <li>Score capped at 100% (max) for easy comparison</li>
        </ul>
      </div>
    </div>
  );
}
