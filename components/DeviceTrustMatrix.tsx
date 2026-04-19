"use client";

import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustedDevice {
  id: string;
  deviceName: string;
  deviceAddress: string;
  firstSeen: Date;
  lastSeen: Date;
  transferCount: number;
  successRate: number;
  encryptionEnabled: boolean;
  verificationStatus: "verified" | "pending" | "suspicious";
  trustScore: number;
  riskLevel: "low" | "medium" | "high";
}

interface DeviceTrustMatrixProps {
  devices?: TrustedDevice[];
}

const mockDevices: TrustedDevice[] = [
  {
    id: "d1",
    deviceName: "Sarah's iPhone",
    deviceAddress: "AA:BB:CC:DD:EE:01",
    firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    transferCount: 47,
    successRate: 98.9,
    encryptionEnabled: true,
    verificationStatus: "verified",
    trustScore: 9.8,
    riskLevel: "low",
  },
  {
    id: "d2",
    deviceName: "James' Android",
    deviceAddress: "AA:BB:CC:DD:EE:02",
    firstSeen: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    transferCount: 23,
    successRate: 95.7,
    encryptionEnabled: true,
    verificationStatus: "verified",
    trustScore: 9.2,
    riskLevel: "low",
  },
  {
    id: "d3",
    deviceName: "Unknown Device",
    deviceAddress: "AA:BB:CC:DD:EE:03",
    firstSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    transferCount: 2,
    successRate: 50.0,
    encryptionEnabled: false,
    verificationStatus: "suspicious",
    trustScore: 3.2,
    riskLevel: "high",
  },
  {
    id: "d4",
    deviceName: "Maria's Device",
    deviceAddress: "AA:BB:CC:DD:EE:04",
    firstSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000),
    transferCount: 12,
    successRate: 83.3,
    encryptionEnabled: true,
    verificationStatus: "pending",
    trustScore: 6.5,
    riskLevel: "medium",
  },
];

const getTrustBadgeColor = (status: string) => {
  switch (status) {
    case "verified":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "pending":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "suspicious":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  }
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case "low":
      return "text-emerald-500";
    case "medium":
      return "text-amber-500";
    case "high":
      return "text-rose-500";
    default:
      return "text-zinc-500";
  }
};

const getTrustScoreColor = (score: number) => {
  if (score >= 8) return "text-emerald-500";
  if (score >= 6) return "text-amber-500";
  return "text-rose-500";
};

export function DeviceTrustMatrix({
  devices = mockDevices,
}: DeviceTrustMatrixProps) {
  const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Device Trust Matrix</h3>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total Devices</p>
          <p className="text-3xl font-black text-primary">{devices.length}</p>
          <p className="text-[10px] text-zinc-600">trusted & monitored</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Verified</p>
          <p className="text-3xl font-black text-emerald-500">
            {devices.filter(d => d.verificationStatus === "verified").length}
          </p>
          <p className="text-[10px] text-zinc-600">trusted devices</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Pending</p>
          <p className="text-3xl font-black text-amber-500">
            {devices.filter(d => d.verificationStatus === "pending").length}
          </p>
          <p className="text-[10px] text-zinc-600">awaiting verification</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Suspicious</p>
          <p className="text-3xl font-black text-rose-500">
            {devices.filter(d => d.verificationStatus === "suspicious").length}
          </p>
          <p className="text-[10px] text-zinc-600">flagged for review</p>
        </div>
      </div>

      {/* Device List */}
      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.id} className="space-y-2">
            <button
              onClick={() =>
                setExpandedDeviceId(
                  expandedDeviceId === device.id ? null : device.id
                )
              }
              className="w-full glass-card rounded-xl border-white/10 p-4 hover:bg-white/[0.03] transition-all text-left"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Device Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm">
                      {device.deviceName}
                    </h4>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full border",
                        getTrustBadgeColor(device.verificationStatus)
                      )}
                    >
                      {device.verificationStatus === "verified" && "✓ Verified"}
                      {device.verificationStatus === "pending" && "⏳ Pending"}
                      {device.verificationStatus === "suspicious" && "⚠️ Suspicious"}
                    </span>
                    {device.encryptionEnabled && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500">
                        🔐 Encrypted
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 font-mono mb-2">
                    {device.deviceAddress}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="font-bold">{device.transferCount}</span>
                      <span className="text-zinc-500">transfers</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500">
                      <span className="font-bold">{device.successRate.toFixed(1)}%</span>
                      <span className="text-zinc-500">success rate</span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        getRiskLevelColor(device.riskLevel)
                      )}
                    >
                      <span className="font-bold uppercase">
                        {device.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center font-black text-lg",
                      device.trustScore >= 8
                        ? "bg-emerald-500/20 text-emerald-500"
                        : device.trustScore >= 6
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-rose-500/20 text-rose-500"
                    )}
                  >
                    {device.trustScore.toFixed(1)}
                  </div>
                  <p className="text-[10px] text-zinc-600">Trust Score</p>
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedDeviceId === device.id && (
              <div className="pl-4 space-y-2">
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  {/* Timeline */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                        First Seen
                      </p>
                      <p className="text-sm text-white flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {device.firstSeen.toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                        Last Seen
                      </p>
                      <p className="text-sm text-white flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {formatDate(device.lastSeen)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                        Total Transfers
                      </p>
                      <p className="text-sm font-bold text-emerald-500">
                        {device.transferCount} transfers
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                        Success Rate
                      </p>
                      <p className="text-sm font-bold text-emerald-500">
                        {device.successRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div
                    className={cn(
                      "p-3 rounded-lg border-2",
                      device.riskLevel === "low"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : device.riskLevel === "medium"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                    )}
                  >
                    <p className="text-xs font-bold uppercase flex items-center gap-2">
                      {device.riskLevel === "low" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      {device.riskLevel.toUpperCase()} RISK - Trust Score {device.trustScore.toFixed(1)}/10
                    </p>
                  </div>

                  {/* Security Summary */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-primary uppercase">Security Status</p>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            device.encryptionEnabled
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          )}
                        />
                        <span className="text-zinc-400">
                          Encryption: {device.encryptionEnabled ? "Enabled ✓" : "Disabled ✗"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            device.verificationStatus === "verified"
                              ? "bg-emerald-500"
                              : device.verificationStatus === "pending"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          )}
                        />
                        <span className="text-zinc-400">
                          Verification: {device.verificationStatus.charAt(0).toUpperCase() + device.verificationStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {device.verificationStatus === "pending" && (
                    <button className="w-full px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-500/90 transition-all text-sm font-bold text-white">
                      Verify Device
                    </button>
                  )}

                  {device.verificationStatus === "suspicious" && (
                    <button className="w-full px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-500/90 transition-all text-sm font-bold text-white">
                      Block Device
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">Trust Score Calculation</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Transfer count: More transfers = higher trust</li>
          <li>Success rate: Failed transfers reduce score</li>
          <li>Encryption enabled: +1.5 points</li>
          <li>Days since first seen: Longer history = more trust</li>
          <li>Recent activity: Active devices score higher</li>
          <li>Risk assessment: Anomalies automatically flagged</li>
        </ul>
      </div>
    </div>
  );
}
