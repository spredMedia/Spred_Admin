"use client";

import { useState } from "react";
import { Wifi, WifiOff, Radio, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineDevice {
  deviceId: string;
  deviceName: string;
  deviceAddress: string;
  wifiDirectCapable: boolean;
  bluetoothCapable: boolean;
  lastOnlineTime: Date;
  offlineStatus: "online" | "offline" | "unreachable";
  offlineTransfersQueued: number;
  estimatedReachability: number;
  batteryLevel: number;
  signalQuality: number;
  offlineDataAvailable: number;
  lastSyncTime: Date;
}

interface OfflineStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  unreachableDevices: number;
  pendingOfflineTransfers: number;
  wifiDirectCapableCount: number;
  bluetoothCapableCount: number;
  averageReachability: number;
}

const mockDevices: OfflineDevice[] = [
  {
    deviceId: "d1",
    deviceName: "iPhone 14 Pro",
    deviceAddress: "00:1A:2B:3C:4D:5E",
    wifiDirectCapable: true,
    bluetoothCapable: true,
    lastOnlineTime: new Date(Date.now() - 120000),
    offlineStatus: "online",
    offlineTransfersQueued: 0,
    estimatedReachability: 98,
    batteryLevel: 85,
    signalQuality: 92,
    offlineDataAvailable: 0,
    lastSyncTime: new Date(Date.now() - 60000),
  },
  {
    deviceId: "d2",
    deviceName: "Samsung Galaxy S23",
    deviceAddress: "00:2C:3D:4E:5F:6G",
    wifiDirectCapable: true,
    bluetoothCapable: true,
    lastOnlineTime: new Date(Date.now() - 900000),
    offlineStatus: "offline",
    offlineTransfersQueued: 3,
    estimatedReachability: 42,
    batteryLevel: 15,
    signalQuality: 0,
    offlineDataAvailable: 2847,
    lastSyncTime: new Date(Date.now() - 900000),
  },
  {
    deviceId: "d3",
    deviceName: "Google Pixel 8",
    deviceAddress: "00:3D:4E:5F:6G:7H",
    wifiDirectCapable: true,
    bluetoothCapable: true,
    lastOnlineTime: new Date(Date.now() - 300000),
    offlineStatus: "online",
    offlineTransfersQueued: 1,
    estimatedReachability: 89,
    batteryLevel: 62,
    signalQuality: 78,
    offlineDataAvailable: 0,
    lastSyncTime: new Date(Date.now() - 180000),
  },
  {
    deviceId: "d4",
    deviceName: "iPad Air",
    deviceAddress: "00:4E:5F:6G:7H:8I",
    wifiDirectCapable: false,
    bluetoothCapable: true,
    lastOnlineTime: new Date(Date.now() - 2700000),
    offlineStatus: "unreachable",
    offlineTransfersQueued: 5,
    estimatedReachability: 8,
    batteryLevel: 5,
    signalQuality: 0,
    offlineDataAvailable: 5694,
    lastSyncTime: new Date(Date.now() - 2700000),
  },
];

const mockStats: OfflineStats = {
  totalDevices: 4,
  onlineDevices: 2,
  offlineDevices: 1,
  unreachableDevices: 1,
  pendingOfflineTransfers: 9,
  wifiDirectCapableCount: 3,
  bluetoothCapableCount: 4,
  averageReachability: 59,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "offline":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "unreachable":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  }
};

const getReachabilityColor = (score: number) => {
  if (score >= 80) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-rose-500";
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function OfflineCapabilityTracker() {
  const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "offline" | "unreachable">("all");

  const filteredDevices = mockDevices.filter(
    (device) => filterStatus === "all" || device.offlineStatus === filterStatus
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Wifi className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Offline Capability Tracker</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Online Devices</p>
          <p className="text-3xl font-black text-emerald-500">{mockStats.onlineDevices}</p>
          <p className="text-[10px] text-zinc-600">available now</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Offline Devices</p>
          <p className="text-3xl font-black text-amber-500">{mockStats.offlineDevices}</p>
          <p className="text-[10px] text-zinc-600">can reach soon</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Unreachable</p>
          <p className="text-3xl font-black text-rose-500">{mockStats.unreachableDevices}</p>
          <p className="text-[10px] text-zinc-600">out of range</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Pending Transfers</p>
          <p className="text-3xl font-black text-blue-500">{mockStats.pendingOfflineTransfers}</p>
          <p className="text-[10px] text-zinc-600">queued</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["all", "online", "offline", "unreachable"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded transition-all",
              filterStatus === status
                ? "bg-primary text-white"
                : "bg-white/10 text-zinc-400 hover:bg-white/20"
            )}
          >
            {status === "all" ? "All Devices" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Device List */}
      <div className="space-y-3">
        {filteredDevices.map((device) => (
          <div key={device.deviceId} className="space-y-2">
            <button
              onClick={() =>
                setExpandedDeviceId(
                  expandedDeviceId === device.deviceId ? null : device.deviceId
                )
              }
              className={cn(
                "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                getStatusColor(device.offlineStatus)
              )}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">📱</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{device.deviceName}</p>
                      <p className="text-xs text-zinc-600 mt-1">{device.deviceAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-1 rounded",
                        device.offlineStatus === "online"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : device.offlineStatus === "offline"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-rose-500/20 text-rose-500"
                      )}
                    >
                      {device.offlineStatus === "online" ? "🟢 Online" : device.offlineStatus === "offline" ? "🟠 Offline" : "🔴 Unreachable"}
                    </span>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-4 gap-2 text-[10px] text-zinc-600">
                  <div>
                    <span className="text-zinc-400">Battery:</span> {device.batteryLevel}%
                  </div>
                  <div>
                    <span className="text-zinc-400">Signal:</span> {device.signalQuality}%
                  </div>
                  <div>
                    <span className={cn("font-bold", getReachabilityColor(device.estimatedReachability))}>
                      Reach: {device.estimatedReachability}%
                    </span>
                  </div>
                  <div>
                    {device.offlineTransfersQueued > 0 && (
                      <span className="text-amber-500 font-bold">{device.offlineTransfersQueued} queued</span>
                    )}
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedDeviceId === device.deviceId && (
              <div className="pl-4 space-y-2">
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  {/* Capabilities */}
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      🔌 Offline Capabilities
                    </p>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            device.wifiDirectCapable ? "bg-emerald-500" : "bg-rose-500"
                          )}
                        />
                        <span className="text-zinc-400">
                          Wi-Fi Direct: {device.wifiDirectCapable ? "✓ Supported" : "✗ Not Supported"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            device.bluetoothCapable ? "bg-emerald-500" : "bg-rose-500"
                          )}
                        />
                        <span className="text-zinc-400">
                          Bluetooth: {device.bluetoothCapable ? "✓ Supported" : "✗ Not Supported"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reachability Analysis */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      🎯 Reachability Analysis
                    </p>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Estimated Reachability:</span>
                        <span className={cn("font-bold", getReachabilityColor(device.estimatedReachability))}>
                          {device.estimatedReachability}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            device.estimatedReachability >= 80
                              ? "bg-emerald-500"
                              : device.estimatedReachability >= 50
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          )}
                          style={{ width: `${device.estimatedReachability}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-600 mt-2">
                        <span>Last Online: {device.lastOnlineTime.toLocaleTimeString()}</span>
                        <span>Last Sync: {device.lastSyncTime.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Offline Transfer Queue */}
                  {device.offlineTransfersQueued > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        📤 Offline Transfer Queue
                      </p>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Pending Transfers:</span>
                          <span className="font-bold text-amber-500">{device.offlineTransfersQueued}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Offline Data:</span>
                          <span className="font-bold text-blue-500">
                            {formatBytes(device.offlineDataAvailable)}
                          </span>
                        </div>
                        <p className="text-zinc-500 mt-2">
                          Transfers will resume when device comes online
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Device Status */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      📊 Device Status
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Battery:</span>
                        <span className="font-bold text-white">{device.batteryLevel}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Signal:</span>
                        <span className="font-bold text-white">{device.signalQuality}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">
          ℹ️ Offline Capability Insights
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>📱 Devices can transfer files via Wi-Fi Direct without internet connection</li>
          <li>📤 Offline transfers queue automatically when devices reconnect</li>
          <li>🎯 Reachability score predicts likelihood of device coming online within 1 hour</li>
          <li>🔌 Battery level and signal strength affect offline capability</li>
          <li>⚡ Bluetooth capability provides fallback offline connectivity option</li>
        </ul>
      </div>
    </div>
  );
}
