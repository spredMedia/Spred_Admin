"use client";

import { useState } from "react";
import {
  Share2,
  TrendingUp,
  Users,
  Video,
  Clock,
  Zap,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface P2PTransfer {
  id: string;
  fromUser: { id: string; name: string; avatar: string };
  toUser: { id: string; name: string; avatar: string };
  video: { id: string; title: string; size: number };
  status: "in-progress" | "completed" | "failed";
  progress: number;
  speed: number;
  startTime: Date;
  estimatedTime?: number;
}

interface SharingChain {
  videoId: string;
  videoTitle: string;
  originCreator: string;
  totalShares: number;
  chain: Array<{
    step: number;
    from: string;
    to: string;
    timestamp: Date;
  }>;
  depth: number;
  viralScore: number;
}

interface P2PStats {
  activeTransfers: number;
  totalTransfersToday: number;
  totalDataTransferred: number;
  averageSpeed: number;
  successRate: number;
}

interface P2PTransferMonitorProps {
  transfers?: P2PTransfer[];
  stats?: P2PStats;
  sharingChains?: SharingChain[];
  onTransferClick?: (transferId: string) => void;
}

const mockTransfers: P2PTransfer[] = [
  {
    id: "t1",
    fromUser: { id: "u1", name: "Sarah Chen", avatar: "SC" },
    toUser: { id: "u2", name: "James Rodriguez", avatar: "JR" },
    video: { id: "v1", title: "Tech Tutorial 2024", size: 2847 },
    status: "in-progress",
    progress: 65,
    speed: 5.2,
    startTime: new Date(Date.now() - 300000),
    estimatedTime: 180,
  },
  {
    id: "t2",
    fromUser: { id: "u2", name: "James Rodriguez", avatar: "JR" },
    toUser: { id: "u3", name: "Maria Santos", avatar: "MS" },
    video: { id: "v1", title: "Tech Tutorial 2024", size: 2847 },
    status: "in-progress",
    progress: 32,
    speed: 4.8,
    startTime: new Date(Date.now() - 150000),
  },
  {
    id: "t3",
    fromUser: { id: "u4", name: "Alex Kim", avatar: "AK" },
    toUser: { id: "u5", name: "Emma Wilson", avatar: "EW" },
    video: { id: "v2", title: "Music Festival Highlights", size: 3456 },
    status: "completed",
    progress: 100,
    speed: 6.1,
    startTime: new Date(Date.now() - 600000),
  },
  {
    id: "t4",
    fromUser: { id: "u3", name: "Maria Santos", avatar: "MS" },
    toUser: { id: "u6", name: "David Park", avatar: "DP" },
    video: { id: "v3", title: "Gaming Livestream VOD", size: 4123 },
    status: "completed",
    progress: 100,
    speed: 5.5,
    startTime: new Date(Date.now() - 900000),
  },
];

const mockChains: SharingChain[] = [
  {
    videoId: "v1",
    videoTitle: "Tech Tutorial 2024",
    originCreator: "Original Creator",
    totalShares: 12,
    chain: [
      { step: 1, from: "Original", to: "User A", timestamp: new Date(Date.now() - 3600000) },
      { step: 2, from: "User A", to: "User B", timestamp: new Date(Date.now() - 3300000) },
      { step: 3, from: "User B", to: "User C", timestamp: new Date(Date.now() - 3000000) },
      { step: 4, from: "User C", to: "User D", timestamp: new Date(Date.now() - 2700000) },
    ],
    depth: 4,
    viralScore: 8.5,
  },
];

const mockStats: P2PStats = {
  activeTransfers: 47,
  totalTransfersToday: 1243,
  totalDataTransferred: 15847,
  averageSpeed: 5.3,
  successRate: 94.2,
};

export function P2PTransferMonitor({
  transfers = mockTransfers,
  stats = mockStats,
  sharingChains = mockChains,
  onTransferClick,
}: P2PTransferMonitorProps) {
  const [expandedTransferId, setExpandedTransferId] = useState<string | null>(null);
  const [expandedChainId, setExpandedChainId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "completed":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "failed":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">P2P Transfer Monitor</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Active Transfers</p>
          <p className="text-3xl font-black text-primary">{stats.activeTransfers}</p>
          <p className="text-[10px] text-zinc-600">in progress</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Today's Transfers</p>
          <p className="text-3xl font-black text-emerald-500">{stats.totalTransfersToday}</p>
          <p className="text-[10px] text-zinc-600">total completed</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Data Transferred</p>
          <p className="text-3xl font-black text-blue-500">{formatBytes(stats.totalDataTransferred * 1024 * 1024)}</p>
          <p className="text-[10px] text-zinc-600">today</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Speed</p>
          <p className="text-3xl font-black text-amber-500">{stats.averageSpeed}</p>
          <p className="text-[10px] text-zinc-600">MB/s</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Success Rate</p>
          <p className="text-3xl font-black text-emerald-500">{stats.successRate}%</p>
          <p className="text-[10px] text-zinc-600">transfers</p>
        </div>
      </div>

      {/* Active Transfers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold text-white">Active Transfers</h4>
        </div>

        <div className="space-y-3">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="space-y-2">
              <button
                onClick={() => {
                  setExpandedTransferId(
                    expandedTransferId === transfer.id ? null : transfer.id
                  );
                  onTransferClick?.(transfer.id);
                }}
                className={cn(
                  "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                  getStatusColor(transfer.status)
                )}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">👤</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">
                          {transfer.fromUser.name} → {transfer.toUser.name}
                        </p>
                        <p className="text-xs text-zinc-600 mt-1">
                          {transfer.video.title}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-1 rounded",
                        transfer.status === "in-progress"
                          ? "bg-amber-500/20 text-amber-500"
                          : transfer.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-rose-500/20 text-rose-500"
                      )}
                    >
                      {transfer.status === "in-progress"
                        ? `${transfer.progress}%`
                        : transfer.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {transfer.status === "in-progress" && (
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all"
                          style={{ width: `${transfer.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-600">
                        <span>{transfer.speed} MB/s</span>
                        {transfer.estimatedTime && (
                          <span>{Math.round(transfer.estimatedTime / 60)}m remaining</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Info Row */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                    <div>Size: {formatBytes(transfer.video.size)}</div>
                    <div>Speed: {transfer.speed} MB/s</div>
                    <div>Started: {transfer.startTime.toLocaleTimeString()}</div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sharing Chains */}
      <div className="space-y-4 border-t border-white/10 pt-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold text-white">Viral Sharing Chains</h4>
        </div>

        <div className="space-y-3">
          {sharingChains.map((chain) => (
            <div key={chain.videoId} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedChainId(
                    expandedChainId === chain.videoId ? null : chain.videoId
                  )
                }
                className="w-full glass-card rounded-xl border-white/10 p-4 hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-white mb-1">{chain.videoTitle}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {chain.totalShares} shares
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Depth: {chain.depth}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        Viral: {chain.viralScore}/10
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                      {chain.depth}
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Chain */}
              {expandedChainId === chain.videoId && (
                <div className="pl-4 space-y-2">
                  <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                    {chain.chain.map((link) => (
                      <div key={link.step} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded">
                            Step {link.step}
                          </div>
                          <p className="text-xs text-white">
                            {link.from} → {link.to}
                          </p>
                          <p className="text-[10px] text-zinc-600 ml-auto">
                            {link.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {link.step < chain.chain.length && (
                          <div className="h-4 border-l-2 border-primary/30 ml-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">P2P Network Health</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Monitor real-time P2P video distribution across your network</li>
          <li>Track viral sharing chains to identify popular content</li>
          <li>Measure P2P bandwidth utilization and transfer speeds</li>
          <li>Identify bottlenecks and optimize network performance</li>
        </ul>
      </div>
    </div>
  );
}
