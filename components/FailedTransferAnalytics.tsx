"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, Zap, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FailedTransfer {
  id: string;
  fromDevice: string;
  toDevice: string;
  fileName: string;
  fileSize: number;
  failureReason: string;
  failureCode: string;
  failureTime: Date;
  attemptCount: number;
  maxAttempts: number;
  lastErrorMessage: string;
  estimatedCause: string;
}

interface FailedTransferAnalyticsProps {
  transfers?: FailedTransfer[];
}

const mockFailedTransfers: FailedTransfer[] = [
  {
    id: "f1",
    fromDevice: "Sarah's iPhone",
    toDevice: "Unknown Device",
    fileName: "vacation_video.mp4",
    fileSize: 145 * 1024 * 1024,
    failureReason: "Connection Timeout",
    failureCode: "CONN_TIMEOUT",
    failureTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    attemptCount: 3,
    maxAttempts: 3,
    lastErrorMessage: "No response from peer after 30 seconds",
    estimatedCause: "Device out of range or offline",
  },
  {
    id: "f2",
    fromDevice: "James' Android",
    toDevice: "Maria's Device",
    fileName: "presentation.mp4",
    fileSize: 256 * 1024 * 1024,
    failureReason: "Insufficient Storage",
    failureCode: "STORAGE_FULL",
    failureTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    attemptCount: 1,
    maxAttempts: 3,
    lastErrorMessage: "Receiver device has only 500MB free, file is 256MB",
    estimatedCause: "Receiver storage nearly full",
  },
  {
    id: "f3",
    fromDevice: "Unknown Device",
    toDevice: "Sarah's iPhone",
    fileName: "music.mp4",
    fileSize: 89 * 1024 * 1024,
    failureReason: "Network Error",
    failureCode: "NET_ERROR",
    failureTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    attemptCount: 2,
    maxAttempts: 3,
    lastErrorMessage: "Socket error: Connection reset by peer",
    estimatedCause: "Wi-Fi interference or device movement",
  },
  {
    id: "f4",
    fromDevice: "Maria's Device",
    toDevice: "James' Android",
    fileName: "game_update.mp4",
    fileSize: 512 * 1024 * 1024,
    failureReason: "File Type Unsupported",
    failureCode: "FILE_TYPE_ERROR",
    failureTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    attemptCount: 1,
    maxAttempts: 3,
    lastErrorMessage: "File extension .mkv not supported",
    estimatedCause: "Receiver device codec incompatibility",
  },
  {
    id: "f5",
    fromDevice: "Test Device",
    toDevice: "Sarah's iPhone",
    fileName: "large_file.mp4",
    fileSize: 1.2 * 1024 * 1024 * 1024,
    failureReason: "File Too Large",
    failureCode: "FILE_TOO_LARGE",
    failureTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
    attemptCount: 1,
    maxAttempts: 1,
    lastErrorMessage: "File exceeds maximum transfer size of 1GB",
    estimatedCause: "File size limitation on P2P protocol",
  },
];

const getFailureColor = (code: string) => {
  switch (code) {
    case "CONN_TIMEOUT":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "STORAGE_FULL":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "NET_ERROR":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "FILE_TYPE_ERROR":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "FILE_TOO_LARGE":
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

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export function FailedTransferAnalytics({
  transfers = mockFailedTransfers,
}: FailedTransferAnalyticsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCode, setFilterCode] = useState<string | null>(null);

  const failureStats = {
    totalFailed: transfers.length,
    connectionIssues: transfers.filter(t => t.failureCode.includes("TIMEOUT") || t.failureCode.includes("NET_ERROR")).length,
    storageIssues: transfers.filter(t => t.failureCode.includes("STORAGE")).length,
    fileIssues: transfers.filter(t => t.failureCode.includes("FILE")).length,
  };

  const filteredTransfers = filterCode
    ? transfers.filter(t => t.failureCode === filterCode)
    : transfers;

  const retryableCount = transfers.filter(
    t => t.attemptCount < t.maxAttempts
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-rose-500" />
        <h3 className="text-lg font-bold text-white">Failed Transfer Diagnostics</h3>
      </div>

      {/* Failure Statistics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total Failed</p>
          <p className="text-3xl font-black text-rose-500">{failureStats.totalFailed}</p>
          <p className="text-[10px] text-zinc-600">transfers</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Connection Issues</p>
          <p className="text-3xl font-black text-amber-500">
            {failureStats.connectionIssues}
          </p>
          <p className="text-[10px] text-zinc-600">timeouts & network errors</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Storage Issues</p>
          <p className="text-3xl font-black text-rose-500">
            {failureStats.storageIssues}
          </p>
          <p className="text-[10px] text-zinc-600">device storage full</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Retryable</p>
          <p className="text-3xl font-black text-blue-500">{retryableCount}</p>
          <p className="text-[10px] text-zinc-600">can retry</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCode(null)}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap font-bold transition-all text-sm",
            filterCode === null
              ? "bg-primary text-white"
              : "bg-white/5 text-zinc-400 hover:bg-white/10"
          )}
        >
          All ({transfers.length})
        </button>
        <button
          onClick={() => setFilterCode("CONN_TIMEOUT")}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap font-bold transition-all text-sm",
            filterCode === "CONN_TIMEOUT"
              ? "bg-amber-500/30 text-amber-500 border border-amber-500/50"
              : "bg-white/5 text-zinc-400 hover:bg-white/10"
          )}
        >
          Timeout
        </button>
        <button
          onClick={() => setFilterCode("STORAGE_FULL")}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap font-bold transition-all text-sm",
            filterCode === "STORAGE_FULL"
              ? "bg-rose-500/30 text-rose-500 border border-rose-500/50"
              : "bg-white/5 text-zinc-400 hover:bg-white/10"
          )}
        >
          Storage
        </button>
        <button
          onClick={() => setFilterCode("NET_ERROR")}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap font-bold transition-all text-sm",
            filterCode === "NET_ERROR"
              ? "bg-amber-500/30 text-amber-500 border border-amber-500/50"
              : "bg-white/5 text-zinc-400 hover:bg-white/10"
          )}
        >
          Network
        </button>
      </div>

      {/* Failed Transfers List */}
      <div className="space-y-3">
        {filteredTransfers.length > 0 ? (
          filteredTransfers.map((transfer) => (
            <div key={transfer.id} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedId(expandedId === transfer.id ? null : transfer.id)
                }
                className="w-full glass-card rounded-xl border-white/10 p-4 hover:bg-white/[0.03] transition-all text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Transfer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-white text-sm">
                        {transfer.fileName}
                      </h4>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full border",
                          getFailureColor(transfer.failureCode)
                        )}
                      >
                        {transfer.failureReason}
                      </span>
                      {transfer.attemptCount < transfer.maxAttempts && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500">
                          🔄 Retryable
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-600 mb-2">
                      {transfer.fromDevice} → {transfer.toDevice}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="flex items-center gap-1 text-primary">
                        <span className="font-bold">{formatBytes(transfer.fileSize)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <RefreshCw className="h-3 w-3" />
                        <span className="font-bold">
                          {transfer.attemptCount}/{transfer.maxAttempts} attempts
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <span className="text-[9px]">{formatTime(transfer.failureTime)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attempt Counter */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg bg-rose-500/20 border-2 border-rose-500/50">
                      {transfer.attemptCount}
                    </div>
                    <p className="text-[10px] text-zinc-600">attempts</p>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === transfer.id && (
                <div className="pl-4 space-y-2">
                  <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
                    {/* Failure Details */}
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        Failure Details
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-600 min-w-fit">Code:</span>
                          <span className="font-mono text-primary">
                            {transfer.failureCode}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-600 min-w-fit">Reason:</span>
                          <span className="text-white">{transfer.failureReason}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-zinc-600 min-w-fit">Message:</span>
                          <span className="text-zinc-400 text-xs">
                            "{transfer.lastErrorMessage}"
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Root Cause Analysis */}
                    <div
                      className={cn(
                        "p-3 rounded-lg border-2",
                        transfer.failureCode.includes("TIMEOUT")
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : transfer.failureCode.includes("STORAGE")
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                      )}
                    >
                      <p className="text-xs font-bold uppercase mb-1">Root Cause</p>
                      <p className="text-[10px]">{transfer.estimatedCause}</p>
                    </div>

                    {/* Retry Analysis */}
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        Retry Status
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">
                            Attempts: {transfer.attemptCount}/{transfer.maxAttempts}
                          </span>
                          <span className="text-xs font-bold text-primary">
                            {transfer.maxAttempts - transfer.attemptCount} remaining
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-amber-500"
                            style={{
                              width: `${(transfer.attemptCount / transfer.maxAttempts) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        Recommendations
                      </p>
                      <ul className="text-[10px] text-blue-400 space-y-1 ml-4 list-disc">
                        {transfer.failureCode.includes("TIMEOUT") && (
                          <>
                            <li>Ensure both devices are within Wi-Fi Direct range</li>
                            <li>Check if receiver device is still online and discoverable</li>
                            <li>Retry the transfer - transient connectivity issues are common</li>
                          </>
                        )}
                        {transfer.failureCode.includes("STORAGE") && (
                          <>
                            <li>Free up storage space on receiver device</li>
                            <li>Delete old videos or unused files</li>
                            <li>Retry after clearing space</li>
                          </>
                        )}
                        {transfer.failureCode.includes("FILE_TOO_LARGE") && (
                          <>
                            <li>File exceeds P2P transfer limit (1GB)</li>
                            <li>Split large video into smaller chunks</li>
                            <li>Use cloud transfer service for very large files</li>
                          </>
                        )}
                        {transfer.failureCode.includes("FILE_TYPE") && (
                          <>
                            <li>Receiver device does not support this video format</li>
                            <li>Convert video to compatible format (MP4, MOV, M4V)</li>
                            <li>Check receiver device codec capabilities</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    {transfer.attemptCount < transfer.maxAttempts && (
                      <button className="w-full px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-500/90 transition-all text-sm font-bold text-white flex items-center justify-center gap-2">
                        <Zap className="h-4 w-4" />
                        Retry Transfer
                      </button>
                    )}

                    {transfer.attemptCount >= transfer.maxAttempts && (
                      <button className="w-full px-3 py-2 rounded-lg bg-rose-500 hover:bg-rose-500/90 transition-all text-sm font-bold text-white flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Max Retries Reached
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-500">No failed transfers in this category</p>
          </div>
        )}
      </div>

      {/* Failure Breakdown Chart */}
      <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
        <p className="text-sm font-bold text-white">Failure Breakdown by Type</p>
        <div className="space-y-3">
          {[
            { label: "Connection Issues", count: failureStats.connectionIssues, color: "bg-amber-500" },
            { label: "Storage Issues", count: failureStats.storageIssues, color: "bg-rose-500" },
            { label: "File Issues", count: failureStats.fileIssues, color: "bg-blue-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-400">{item.label}</span>
                <span className="text-xs font-bold text-primary">
                  {item.count} ({((item.count / failureStats.totalFailed) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={item.color}
                  style={{
                    width: `${(item.count / failureStats.totalFailed) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">Diagnostics Overview</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li><strong>Timeout Issues:</strong> Device disconnection or out of range - usually retryable</li>
          <li><strong>Storage Issues:</strong> Receiver storage full - user action required</li>
          <li><strong>Network Errors:</strong> Transient connectivity problems - often resolves on retry</li>
          <li><strong>File Issues:</strong> Format/size incompatibility - requires file conversion</li>
          <li><strong>Retry Logic:</strong> System automatically retries transient errors 3 times with backoff</li>
        </ul>
      </div>
    </div>
  );
}
