"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { P2PTransferMonitor } from "@/components/P2PTransferMonitor";
import { TrendingP2PVideos } from "@/components/TrendingP2PVideos";
import { EnhancedP2PTransferMonitor } from "@/components/EnhancedP2PTransferMonitor";
import { DeviceTrustMatrix } from "@/components/DeviceTrustMatrix";
import { ConnectionQualityMonitor } from "@/components/ConnectionQualityMonitor";
import { FailedTransferAnalytics } from "@/components/FailedTransferAnalytics";
import { BandwidthUtilizationMonitor } from "@/components/BandwidthUtilizationMonitor";
import { DeviceCompatibilityMatrix } from "@/components/DeviceCompatibilityMatrix";
import { OfflineCapabilityTracker } from "@/components/OfflineCapabilityTracker";
import { NetworkBottleneckIdentifier } from "@/components/NetworkBottleneckIdentifier";
import { P2PPerformanceTrends } from "@/components/P2PPerformanceTrends";
import { AnomalyDetectionPanel } from "@/components/AnomalyDetectionPanel";
import { DeviceDistributionHeatmap } from "@/components/DeviceDistributionHeatmap";
import { P2PEconomicsDashboard } from "@/components/P2PEconomicsDashboard";
import { AlertConfigurationPanel } from "@/components/AlertConfigurationPanel";
import { ReportGeneratorDashboard } from "@/components/ReportGeneratorDashboard";
import { ExportIntegrationManager } from "@/components/ExportIntegrationManager";
import { AdvancedQueryBuilder } from "@/components/AdvancedQueryBuilder";

export default function P2PMonitorPage() {
  const [activeTab, setActiveTab] = useState<"transfers" | "trending" | "devices" | "quality" | "failed" | "bandwidth" | "compatibility" | "offline" | "bottlenecks" | "trends" | "anomalies" | "distribution" | "economics" | "alerts" | "reports" | "exports" | "queries">(
    "transfers"
  );

  const tabs = [
    { id: "transfers", label: "Live Transfers & Chains" },
    { id: "trending", label: "Trending Videos" },
    { id: "devices", label: "Device Trust Matrix" },
    { id: "quality", label: "Connection Quality" },
    { id: "failed", label: "Failed Transfers" },
    { id: "bandwidth", label: "Bandwidth Utilization" },
    { id: "compatibility", label: "Device Compatibility" },
    { id: "offline", label: "Offline Capability" },
    { id: "bottlenecks", label: "Network Bottlenecks" },
    { id: "trends", label: "Performance Trends" },
    { id: "anomalies", label: "Anomaly Detection" },
    { id: "distribution", label: "Device Distribution" },
    { id: "economics", label: "P2P Economics" },
    { id: "alerts", label: "Alert Configuration" },
    { id: "reports", label: "Report Generator" },
    { id: "exports", label: "Export & Integration" },
    { id: "queries", label: "Query Builder" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            P2P Network <span className="text-primary">Monitor</span>
          </h1>
        </div>
        <p className="text-zinc-500 font-medium tracking-tight">
          Real-time monitoring of peer-to-peer video transfers, viral chains,
          and trending content across the SPRED network.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass-card rounded-2xl border-white/10 p-6">
        {activeTab === "transfers" && <EnhancedP2PTransferMonitor />}
        {activeTab === "trending" && <TrendingP2PVideos />}
        {activeTab === "devices" && <DeviceTrustMatrix />}
        {activeTab === "quality" && <ConnectionQualityMonitor />}
        {activeTab === "failed" && <FailedTransferAnalytics />}
        {activeTab === "bandwidth" && <BandwidthUtilizationMonitor />}
        {activeTab === "compatibility" && <DeviceCompatibilityMatrix />}
        {activeTab === "offline" && <OfflineCapabilityTracker />}
        {activeTab === "bottlenecks" && <NetworkBottleneckIdentifier />}
        {activeTab === "trends" && <P2PPerformanceTrends />}
        {activeTab === "anomalies" && <AnomalyDetectionPanel />}
        {activeTab === "distribution" && <DeviceDistributionHeatmap />}
        {activeTab === "economics" && <P2PEconomicsDashboard />}
        {activeTab === "alerts" && <AlertConfigurationPanel />}
        {activeTab === "reports" && <ReportGeneratorDashboard />}
        {activeTab === "exports" && <ExportIntegrationManager />}
        {activeTab === "queries" && <AdvancedQueryBuilder />}
      </div>

      {/* Feature Highlights */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-card rounded-xl border-white/10 p-4">
          <p className="text-sm font-bold text-primary mb-2">📊 Live Transfers</p>
          <p className="text-xs text-zinc-500">
            Monitor active P2P transfers with real-time progress, speed, and
            estimated completion times
          </p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4">
          <p className="text-sm font-bold text-primary mb-2">🔗 Sharing Chains</p>
          <p className="text-xs text-zinc-500">
            Track viral sharing chains to understand how content spreads across
            your network
          </p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4">
          <p className="text-sm font-bold text-primary mb-2">🔥 Trending Videos</p>
          <p className="text-xs text-zinc-500">
            Identify trending content based on P2P shares, downloads, and viral
            momentum
          </p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4">
          <p className="text-sm font-bold text-primary mb-2">⚡ Network Health</p>
          <p className="text-xs text-zinc-500">
            Monitor P2P bandwidth utilization, transfer speeds, and success
            rates
          </p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4">
          <p className="text-sm font-bold text-primary mb-2">📈 Analytics</p>
          <p className="text-xs text-zinc-500">
            Get insights into P2P distribution patterns and user behavior across
            your platform
          </p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4">
          <p className="text-sm font-bold text-primary mb-2">🎯 Optimization</p>
          <p className="text-xs text-zinc-500">
            Identify bottlenecks and optimize your P2P network for better
            performance
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">
          ℹ️ P2P Network Overview
        </p>
        <p className="text-[10px] text-blue-400">
          The P2P Transfer Monitor provides real-time visibility into your
          peer-to-peer video distribution network. Track transfers between
          users, monitor viral content chains, and identify trending videos
          based on actual P2P sharing metrics. This allows you to understand
          user behavior, optimize network performance, and identify which
          content resonates most with your community. The sharing chain feature
          shows the path content takes as it spreads virally from user to user,
          helping you understand organic content distribution.
        </p>
      </div>
    </div>
  );
}
