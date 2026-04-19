"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopEarner {
  rank: number;
  userId: string;
  userName: string;
  totalEarnings: number;
  transfers: number;
  avgCommission: number;
  monthlyGrowth: number;
}

interface RevenueSplit {
  label: string;
  percentage: number;
  amount: number;
  description: string;
}

interface EconomicsMetrics {
  totalRevenue: number;
  totalTransfers: number;
  avgTransferValue: number;
  creatorEarnings: number;
  platformEarnings: number;
  originatorEarnings: number;
  totalUsers: number;
  activeEarners: number;
  avgMonthlyEarnings: number;
}

const mockTopEarners: TopEarner[] = [
  { rank: 1, userId: "user_001", userName: "Sarah Chen", totalEarnings: 4850, transfers: 287, avgCommission: 16.90, monthlyGrowth: 12.5 },
  { rank: 2, userId: "user_002", userName: "James Rodriguez", totalEarnings: 4120, transfers: 256, avgCommission: 16.09, monthlyGrowth: 8.3 },
  { rank: 3, userId: "user_003", userName: "Maria Santos", totalEarnings: 3890, transfers: 234, avgCommission: 16.62, monthlyGrowth: -2.1 },
  { rank: 4, userId: "user_004", userName: "Alex Kim", totalEarnings: 3450, transfers: 201, avgCommission: 17.16, monthlyGrowth: 15.7 },
  { rank: 5, userId: "user_005", userName: "Emma Wilson", totalEarnings: 2980, transfers: 178, avgCommission: 16.74, monthlyGrowth: 6.2 },
];

const mockRevenueSplit: RevenueSplit[] = [
  { label: "Content Creator", percentage: 50, amount: 28450, description: "Original uploader (50%)" },
  { label: "Originator Share", percentage: 35, amount: 19915, description: "Re-sharer incentive (35%)" },
  { label: "Platform", percentage: 15, amount: 8535, description: "Infrastructure & ops (15%)" },
];

const mockMetrics: EconomicsMetrics = {
  totalRevenue: 56900,
  totalTransfers: 12847,
  avgTransferValue: 4.43,
  creatorEarnings: 28450,
  platformEarnings: 8535,
  originatorEarnings: 19915,
  totalUsers: 8247,
  activeEarners: 3156,
  avgMonthlyEarnings: 18.04,
};

export function P2PEconomicsDashboard() {
  const [expandedEarnerId, setExpandedEarnerId] = useState<number | null>(null);
  const [timePeriod, setTimePeriod] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">P2P Economics Dashboard</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total P2P Revenue</p>
          <p className="text-3xl font-black text-emerald-500">${mockMetrics.totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-600">this month</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total Transfers</p>
          <p className="text-3xl font-black text-primary">{mockMetrics.totalTransfers.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-600">this month</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Transfer Value</p>
          <p className="text-3xl font-black text-blue-500">${mockMetrics.avgTransferValue.toFixed(2)}</p>
          <p className="text-[10px] text-zinc-600">per transfer</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Active Earners</p>
          <p className="text-3xl font-black text-amber-500">{mockMetrics.activeEarners.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-600">generating revenue</p>
        </div>
      </div>

      {/* Revenue Split Breakdown */}
      <div className="glass-card rounded-xl border-white/10 p-6 space-y-4">
        <p className="text-sm font-bold text-white">📊 Revenue Distribution Model (50/35/15)</p>

        <div className="space-y-3">
          {mockRevenueSplit.map((split) => (
            <div key={split.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{split.label}</p>
                  <p className="text-[10px] text-zinc-500">{split.description}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-2xl font-black", split.percentage === 50 ? "text-emerald-500" : split.percentage === 35 ? "text-blue-500" : "text-primary")}>
                    {split.percentage}%
                  </p>
                  <p className="text-[10px] text-zinc-600">${split.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    split.percentage === 50
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : split.percentage === 35
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                        : "bg-gradient-to-r from-primary to-amber-500"
                  )}
                  style={{ width: `${split.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white">Total Monthly Revenue</p>
            <p className="text-3xl font-black text-emerald-500">${mockMetrics.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Top Earners */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-white">👑 Top P2P Earners</p>

        {mockTopEarners.map((earner) => (
          <div key={earner.rank} className="space-y-2">
            <button
              onClick={() =>
                setExpandedEarnerId(
                  expandedEarnerId === earner.rank ? null : earner.rank
                )
              }
              className="w-full glass-card rounded-xl border-white/10 p-4 transition-all hover:bg-white/[0.03] border-2 border-white/10"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-bold text-white",
                        earner.rank === 1
                          ? "bg-gradient-to-br from-amber-400 to-amber-600"
                          : earner.rank === 2
                            ? "bg-gradient-to-br from-slate-300 to-slate-500"
                            : earner.rank === 3
                              ? "bg-gradient-to-br from-amber-700 to-amber-900"
                              : "bg-gradient-to-br from-blue-500 to-blue-700"
                      )}
                    >
                      #{earner.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{earner.userName}</p>
                      <p className="text-xs text-zinc-600 mt-1">{earner.userId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-500">${earner.totalEarnings.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-600">total earnings</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                  <div>
                    <span className="text-zinc-400">Transfers:</span> {earner.transfers}
                  </div>
                  <div>
                    <span className="text-zinc-400">Avg Commission:</span> ${earner.avgCommission.toFixed(2)}
                  </div>
                  <div className={cn("font-bold", earner.monthlyGrowth > 0 ? "text-emerald-500" : "text-rose-500")}>
                    {earner.monthlyGrowth > 0 ? "📈" : "📉"} {Math.abs(earner.monthlyGrowth)}%
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedEarnerId === earner.rank && (
              <div className="pl-4 space-y-2">
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  {/* Financial Summary */}
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">💰 Financial Summary</p>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Total Earnings:</span>
                        <span className="font-bold text-emerald-500">${earner.totalEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Transfers Count:</span>
                        <span className="font-bold text-white">{earner.transfers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Avg Per Transfer:</span>
                        <span className="font-bold text-blue-500">${earner.avgCommission.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Avg Per Transfer (Revenue):</span>
                        <span className="font-bold text-primary">
                          ${(earner.totalEarnings / earner.transfers).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Growth Metrics */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">📈 Growth & Trends</p>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Monthly Growth:</span>
                        <span
                          className={cn(
                            "font-bold",
                            earner.monthlyGrowth > 0 ? "text-emerald-500" : "text-rose-500"
                          )}
                        >
                          {earner.monthlyGrowth > 0 ? "+" : ""}{earner.monthlyGrowth}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Rank Position:</span>
                        <span className="font-bold text-white">#{earner.rank} of top earners</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Activity Status:</span>
                        <span className="font-bold text-emerald-500">🟢 Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Analysis */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">⚡ Performance</p>
                    <div className="space-y-1 text-[10px]">
                      <p className="text-zinc-300">
                        {earner.userName} is performing
                        {earner.monthlyGrowth > 10
                          ? " exceptionally well"
                          : earner.monthlyGrowth > 0
                            ? " above average"
                            : " below expectations"}{" "}
                        with {earner.monthlyGrowth > 0 ? "positive" : "negative"} month-over-month growth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Economics Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Creator Earnings</p>
          <p className="text-3xl font-black text-emerald-500">${(mockMetrics.creatorEarnings / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-zinc-600">(50% of revenue)</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Originator Earnings</p>
          <p className="text-3xl font-black text-blue-500">${(mockMetrics.originatorEarnings / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-zinc-600">(35% of revenue)</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Platform Revenue</p>
          <p className="text-3xl font-black text-primary">${(mockMetrics.platformEarnings / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-zinc-600">(15% of revenue)</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">ℹ️ P2P Economics Overview</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>💰 50/35/15 split incentivizes both original creators and content sharers</li>
          <li>📊 Top earners drive ecosystem revenue and engagement</li>
          <li>📈 Growth tracking shows user retention and increasing monetization</li>
          <li>🎯 Average transfer value indicates content quality and user demand</li>
          <li>👥 Active earner ratio shows ecosystem health and participation</li>
          <li>🚀 Revenue trends predict platform growth and sustainability</li>
        </ul>
      </div>
    </div>
  );
}
