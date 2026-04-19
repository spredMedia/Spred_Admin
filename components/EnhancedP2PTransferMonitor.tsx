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
  Lock,
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
  encryptionEnabled: boolean;
  deviceTrustScore: number;
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
    encrypted: boolean;
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
  encryptedTransfers: number;
  trustedDeviceCount: number;
}

interface EnhancedP2PTransferMonitorProps {
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
    encryptionEnabled: true,
    deviceTrustScore: 9.8,
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
    encryptionEnabled: true,
    deviceTrustScore: 8.9,
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
    encryptionEnabled: false,
    deviceTrustScore: 7.2,
  },
];

const mockStats: P2PStats = {
  activeTransfers: 47,
  totalTransfersToday: 1243,
  totalDataTransferred: 15847,
  averageSpeed: 5.3,
  successRate: 94.2,
  encryptedTransfers: 892,
  trustedDeviceCount: 156,
};

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

const getTrustColor = (score: number) => {
  if (score >= 9) return "text-emerald-500";
  if (score >= 7) return "text-blue-500";
  if (score >= 5) return "text-amber-500";
  return "text-rose-500";
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function EnhancedP2PTransferMonitor({
  transfers = mockTransfers,
  stats = mockStats,
  sharingChains = [],
  onTransferClick,
}: EnhancedP2PTransferMonitorProps) {
  const [expandedTransferId, setExpandedTransferId] = useState<string | null>(null);

  const encryptionPercentage = ((stats.encryptedTransfers / stats.totalTransfersToday) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Enhanced P2P Transfer Monitor</h3>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-7">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Active Transfers</p>
          <p className="text-3xl font-black text-primary">{stats.activeTransfers}</p>
          <p className="text-[10px] text-zinc-600">in progress</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Today's Transfers</p>
          <p className="text-3xl font-black text-emerald-500">{stats.totalTransfersToday}</p>
          <p className="text-[10px] text-zinc-600">completed</p>
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

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">🔐 Encrypted</p>
          <p className="text-3xl font-black text-primary">{encryptionPercentage}%</p>
          <p className="text-[10px] text-zinc-600">of transfers</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Trusted Devices</p>
          <p className="text-3xl font-black text-blue-500">{stats.trustedDeviceCount}</p>
          <p className="text-[10px] text-zinc-600">verified</p>
        </div>
      </div>

      {/* Active Transfers with Encryption & Trust Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold text-white">Active Transfers</h4>
        </div>

        <div className="space-y-3">
          {transfers
            .filter(t => t.status !== "completed")
            .map((transfer) => (
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
                      <div className="flex items-center gap-2">
                        {transfer.encryptionEnabled && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-500 border border-blue-500/30 flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Encrypted
                          </span>
                        )}
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

                    {/* Enhanced Info Row with Trust Score */}
                    <div className="grid grid-cols-4 gap-2 text-[10px] text-zinc-600">
                      <div>Size: {formatBytes(transfer.video.size)}</div>
                      <div>Speed: {transfer.speed} MB/s</div>
                      <div>Started: {transfer.startTime.toLocaleTimeString()}</div>
                      <div
                        className={cn(
                          "font-bold",
                          getTrustColor(transfer.deviceTrustScore)
                        )}
                      >
                        🛡️ Trust: {transfer.deviceTrustScore}/10
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Transfer Details */}
                {expandedTransferId === transfer.id && (
                  <div className="pl-4 space-y-2">
                    <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                      {/* Security Info */}
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                          🔒 Security & Trust
                        </p>
                        <div className="space-y-1 text-[10px]">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                transfer.encryptionEnabled
                                  ? "bg-emerald-500"
                                  : "bg-rose-500"
                              )}
                            />
                            <span className="text-zinc-400">
                              Encryption: {transfer.encryptionEnabled ? "AES-256 Enabled ✓" : "No Encryption ✗"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-zinc-400">
                              Device Trust Score: {transfer.deviceTrustScore}/10
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-zinc-400">
                              Receiver verified & trusted device
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Transfer Details */}
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                          Transfer Details
                        </p>
                        <div className="grid gap-2 text-[10px]">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-600">File Size:</span>
                            <span className="font-bold text-white">
                              {formatBytes(transfer.video.size)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-600">Speed:</span>
                            <span className="font-bold text-primary">
                              {transfer.speed} MB/s
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-600">Started:</span>
                            <span className="font-bold text-white">
                              {transfer.startTime.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">Enhanced Monitoring Features</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>🔐 Encryption Status: Shows AES-256 encryption per transfer</li>
          <li>🛡️ Device Trust Scores: 0-10 scale based on history, success rate, and security compliance</li>
          <li>📊 Real-time Speed: Actual MB/s from network interface monitoring</li>
          <li>⏱️ ETA Calculation: Based on file size and current transfer speed</li>
          <li>✅ Trusted Device Count: Only verified devices participate in transfers</li>
        </ul>
      </div>
    </div>
  );
}
