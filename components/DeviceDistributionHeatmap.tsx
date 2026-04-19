"use client";

import { useState } from "react";
import { Map, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegionData {
  region: string;
  deviceCount: number;
  avgSuccessRate: number;
  avgSpeed: number;
  transferVolume: number;
  revenue: number;
  healthScore: number;
}

interface OSDistribution {
  os: string;
  version: string;
  deviceCount: number;
  avgSuccessRate: number;
  avgSpeed: number;
  marketShare: number;
  healthScore: number;
}

interface PerformanceTier {
  tier: string;
  description: string;
  deviceCount: number;
  minSpeed: number;
  maxSpeed: number;
  avgSuccessRate: number;
  transferVolume: number;
}

const mockRegionalData: RegionData[] = [
  { region: "North America", deviceCount: 2847, avgSuccessRate: 95.2, avgSpeed: 6.1, transferVolume: 45230, revenue: 18920, healthScore: 94 },
  { region: "Europe", deviceCount: 2156, avgSuccessRate: 94.8, avgSpeed: 5.9, transferVolume: 38450, revenue: 16240, healthScore: 93 },
  { region: "Asia Pacific", deviceCount: 1923, avgSuccessRate: 92.1, avgSpeed: 5.2, transferVolume: 32100, revenue: 13560, healthScore: 89 },
  { region: "Latin America", deviceCount: 856, avgSuccessRate: 91.3, avgSpeed: 4.8, transferVolume: 14320, revenue: 5980, healthScore: 86 },
  { region: "Africa/Middle East", deviceCount: 445, avgSuccessRate: 88.7, avgSpeed: 4.2, transferVolume: 7120, revenue: 2980, healthScore: 81 },
];

const mockOSData: OSDistribution[] = [
  { os: "iOS", version: "17.x", deviceCount: 3145, avgSuccessRate: 96.2, avgSpeed: 6.3, marketShare: 38, healthScore: 96 },
  { os: "Android", version: "14.x", deviceCount: 2876, avgSuccessRate: 93.8, avgSpeed: 5.7, marketShare: 35, healthScore: 92 },
  { os: "iOS", version: "16.x", deviceCount: 1240, avgSuccessRate: 94.5, avgSpeed: 6.0, marketShare: 15, healthScore: 94 },
  { os: "Android", version: "13.x", deviceCount: 966, avgSuccessRate: 91.2, avgSpeed: 5.3, marketShare: 12, healthScore: 88 },
];

const mockPerformanceTiers: PerformanceTier[] = [
  { tier: "Flagship", description: "Latest premium devices", deviceCount: 2847, minSpeed: 5.8, maxSpeed: 7.2, avgSuccessRate: 96.1, transferVolume: 48920 },
  { tier: "Mid-range", description: "2-3 year old devices", deviceCount: 3156, minSpeed: 4.5, maxSpeed: 5.8, avgSuccessRate: 93.4, transferVolume: 42340 },
  { tier: "Budget", description: "Older or budget devices", deviceCount: 1792, minSpeed: 3.2, maxSpeed: 4.5, avgSuccessRate: 89.2, transferVolume: 18340 },
  { tier: "Legacy", description: "Devices >4 years old", deviceCount: 432, minSpeed: 2.0, maxSpeed: 3.2, avgSuccessRate: 82.1, transferVolume: 4120 },
];

const getHealthColor = (score: number) => {
  if (score >= 92) return "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
  if (score >= 85) return "bg-amber-500/20 border-amber-500/30 text-amber-400";
  return "bg-rose-500/20 border-rose-500/30 text-rose-400";
};

const getHealthTextColor = (score: number) => {
  if (score >= 92) return "text-emerald-500";
  if (score >= 85) return "text-amber-500";
  return "text-rose-500";
};

export function DeviceDistributionHeatmap() {
  const [view, setView] = useState<"regions" | "os" | "tiers">("regions");

  const totalDevices = mockRegionalData.reduce((a, b) => a + b.deviceCount, 0);
  const totalRevenue = mockRegionalData.reduce((a, b) => a + b.revenue, 0);
  const avgHealthScore = Math.round(mockRegionalData.reduce((a, b) => a + b.healthScore, 0) / mockRegionalData.length);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Map className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Device Distribution Heatmap</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total Devices</p>
          <p className="text-3xl font-black text-primary">{totalDevices.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-600">across all regions</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">P2P Revenue</p>
          <p className="text-3xl font-black text-emerald-500">${(totalRevenue / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-zinc-600">monthly</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Health</p>
          <p className={cn("text-3xl font-black", getHealthTextColor(avgHealthScore))}>{avgHealthScore}</p>
          <p className="text-[10px] text-zinc-600">ecosystem score</p>
        </div>
      </div>

      {/* View Selection */}
      <div className="flex gap-2">
        {["regions", "os", "tiers"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as any)}
            className={cn(
              "px-4 py-2 text-sm font-bold rounded transition-all",
              view === v ? "bg-primary text-white" : "bg-white/10 text-zinc-400 hover:bg-white/20"
            )}
          >
            {v === "regions" ? "🌍 Geographic" : v === "os" ? "📱 Operating System" : "⚡ Performance Tier"}
          </button>
        ))}
      </div>

      {/* Geographic View */}
      {view === "regions" && (
        <div className="space-y-3">
          {mockRegionalData.map((region) => {
            const healthPercentage = region.healthScore;
            return (
              <div key={region.region} className={cn("glass-card rounded-xl border p-4 space-y-3", getHealthColor(region.healthScore))}>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{region.region}</p>
                    <p className="text-xs text-zinc-500 mt-1">{region.deviceCount.toLocaleString()} devices</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-bold text-2xl", getHealthTextColor(region.healthScore))}>
                      {region.healthScore}
                    </p>
                    <p className="text-[10px] text-zinc-500">health</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div>
                    <p className="text-zinc-500 mb-1">Success Rate</p>
                    <p className="font-bold text-white">{region.avgSuccessRate}%</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Avg Speed</p>
                    <p className="font-bold text-blue-500">{region.avgSpeed} MB/s</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Transfers</p>
                    <p className="font-bold text-primary">{(region.transferVolume / 1000).toFixed(1)}K</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Revenue</p>
                    <p className="font-bold text-emerald-500">${region.revenue.toLocaleString()}</p>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        region.healthScore >= 92
                          ? "bg-emerald-500"
                          : region.healthScore >= 85
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      )}
                      style={{ width: `${healthPercentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600">Ecosystem Health Score</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OS Distribution View */}
      {view === "os" && (
        <div className="space-y-3">
          {mockOSData.map((os) => (
            <div key={`${os.os}-${os.version}`} className={cn("glass-card rounded-xl border p-4 space-y-3", getHealthColor(os.healthScore))}>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">
                    {os.os} {os.version}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{os.deviceCount.toLocaleString()} devices ({os.marketShare}% share)</p>
                </div>
                <div className="text-right">
                  <p className={cn("font-bold text-2xl", getHealthTextColor(os.healthScore))}>
                    {os.healthScore}
                  </p>
                  <p className="text-[10px] text-zinc-500">health</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <p className="text-zinc-500 mb-1">Success Rate</p>
                  <p className="font-bold text-white">{os.avgSuccessRate}%</p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Avg Speed</p>
                  <p className="font-bold text-blue-500">{os.avgSpeed} MB/s</p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Health Score</p>
                  <p className={cn("font-bold", getHealthTextColor(os.healthScore))}>{os.healthScore}</p>
                </div>
              </div>

              {/* Market Share Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${os.marketShare}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-600">Market Share</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance Tier View */}
      {view === "tiers" && (
        <div className="space-y-3">
          {mockPerformanceTiers.map((tier) => {
            const speedRange = tier.maxSpeed - tier.minSpeed;
            const speedPercentage = ((tier.avgSpeed - tier.minSpeed) / speedRange) * 100;
            return (
              <div key={tier.tier} className="glass-card rounded-xl border border-white/10 p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">{tier.tier}</p>
                    <p className="text-xs text-zinc-500 mt-1">{tier.description}</p>
                    <p className="text-xs text-zinc-600 mt-2">{tier.deviceCount.toLocaleString()} devices</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-primary">{tier.avgSuccessRate}%</p>
                    <p className="text-[10px] text-zinc-500">success</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <p className="text-zinc-500 mb-1">Speed Range</p>
                    <p className="font-bold text-white">
                      {tier.minSpeed}-{tier.maxSpeed} MB/s
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Avg Speed</p>
                    <p className="font-bold text-blue-500">{tier.avgSpeed} MB/s</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Volume</p>
                    <p className="font-bold text-primary">{(tier.transferVolume / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {/* Speed Positioning Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 flex">
                      <div className="flex-1" />
                      <div className="w-1 bg-white/50" style={{ left: `${speedPercentage}%` }} />
                    </div>
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${(speedPercentage / 100) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span>Min: {tier.minSpeed}</span>
                    <span>Avg: {tier.avgSpeed}</span>
                    <span>Max: {tier.maxSpeed}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">ℹ️ Distribution Analytics</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>🌍 Geographic distribution shows regional P2P adoption and performance</li>
          <li>📱 OS-specific analysis identifies platform-specific issues</li>
          <li>⚡ Performance tier grouping reveals device capability patterns</li>
          <li>💰 Revenue tracking by region and device tier</li>
          <li>🏥 Health scores indicate ecosystem stability in each segment</li>
          <li>📊 Market share data tracks OS adoption trends</li>
        </ul>
      </div>
    </div>
  );
}
