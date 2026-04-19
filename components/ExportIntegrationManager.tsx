"use client";

import { useState } from "react";
import { Download, Key, Webhook, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportJob {
  id: string;
  name: string;
  dataType: "transfers" | "devices" | "metrics" | "economics" | "anomalies" | "reports";
  format: "csv" | "json" | "parquet";
  schedule: "once" | "daily" | "weekly" | "monthly";
  status: "completed" | "pending" | "failed" | "running";
  lastRun?: Date;
  nextRun?: Date;
  recordCount: number;
  fileSize: number;
  createdAt: Date;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  status: "active" | "revoked" | "expired";
  permissions: string[];
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  status: "active" | "disabled" | "failed";
  createdAt: Date;
  lastTriggered?: Date;
  deliveryCount: number;
  failureCount: number;
}

const mockExportJobs: ExportJob[] = [
  {
    id: "export_001",
    name: "Daily P2P Transfers",
    dataType: "transfers",
    format: "csv",
    schedule: "daily",
    status: "completed",
    lastRun: new Date(Date.now() - 3600000),
    nextRun: new Date(Date.now() + 82800000),
    recordCount: 12847,
    fileSize: 4.2,
    createdAt: new Date(Date.now() - 30 * 86400000),
  },
  {
    id: "export_002",
    name: "Weekly Economics Summary",
    dataType: "economics",
    format: "json",
    schedule: "weekly",
    status: "completed",
    lastRun: new Date(Date.now() - 86400000),
    nextRun: new Date(Date.now() + 604800000),
    recordCount: 3256,
    fileSize: 2.8,
    createdAt: new Date(Date.now() - 60 * 86400000),
  },
  {
    id: "export_003",
    name: "Device Health Monthly",
    dataType: "devices",
    format: "csv",
    schedule: "monthly",
    status: "running",
    lastRun: new Date(Date.now() - 1800000),
    nextRun: new Date(Date.now() + 2592000000),
    recordCount: 8247,
    fileSize: 1.6,
    createdAt: new Date(Date.now() - 90 * 86400000),
  },
];

const mockAPIKeys: APIKey[] = [
  {
    id: "key_001",
    name: "Production API Key",
    key: "spred_pk_live_abc123def456ghi789jkl012",
    status: "active",
    permissions: ["read:transfers", "read:devices", "read:metrics", "read:economics"],
    createdAt: new Date(Date.now() - 180 * 86400000),
    lastUsed: new Date(Date.now() - 3600000),
    usageCount: 15847,
  },
  {
    id: "key_002",
    name: "Analytics Integration",
    key: "spred_pk_live_xyz789abc456def123ghi456",
    status: "active",
    permissions: ["read:metrics", "read:economics"],
    createdAt: new Date(Date.now() - 90 * 86400000),
    lastUsed: new Date(Date.now() - 7200000),
    usageCount: 4256,
  },
  {
    id: "key_003",
    name: "Deprecated Key",
    key: "spred_pk_live_old123old456old789old012",
    status: "revoked",
    permissions: ["read:transfers"],
    createdAt: new Date(Date.now() - 365 * 86400000),
    usageCount: 0,
  },
];

const mockWebhooks: WebhookSubscription[] = [
  {
    id: "webhook_001",
    url: "https://analytics.company.com/spred/transfers",
    events: ["transfer.completed", "transfer.failed"],
    status: "active",
    createdAt: new Date(Date.now() - 60 * 86400000),
    lastTriggered: new Date(Date.now() - 300000),
    deliveryCount: 12847,
    failureCount: 23,
  },
  {
    id: "webhook_002",
    url: "https://crm.company.com/spred/economics",
    events: ["revenue.updated", "earner.milestone"],
    status: "active",
    createdAt: new Date(Date.now() - 30 * 86400000),
    lastTriggered: new Date(Date.now() - 3600000),
    deliveryCount: 156,
    failureCount: 2,
  },
];

export function ExportIntegrationManager() {
  const [activeTab, setActiveTab] = useState<"exports" | "api" | "webhooks">("exports");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const successRate = (deliveries: number, failures: number) => {
    if (deliveries === 0) return 100;
    return Math.round(((deliveries - failures) / deliveries) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Export & Integration Manager</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Export Jobs</p>
          <p className="text-3xl font-black text-primary">{mockExportJobs.length}</p>
          <p className="text-[10px] text-zinc-600">configured</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">API Keys</p>
          <p className="text-3xl font-black text-blue-500">{mockAPIKeys.filter((k) => k.status === "active").length}</p>
          <p className="text-[10px] text-zinc-600">active</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Webhooks</p>
          <p className="text-3xl font-black text-emerald-500">{mockWebhooks.length}</p>
          <p className="text-[10px] text-zinc-600">subscriptions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        {["exports", "api", "webhooks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-4 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-white"
            )}
          >
            {tab === "exports"
              ? "📥 Exports"
              : tab === "api"
                ? "🔑 API Keys"
                : "🪝 Webhooks"}
          </button>
        ))}
      </div>

      {/* Export Jobs */}
      {activeTab === "exports" && (
        <div className="space-y-3">
          {mockExportJobs.map((job) => (
            <div key={job.id} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedItemId(
                    expandedItemId === job.id ? null : job.id
                  )
                }
                className={cn(
                  "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                  job.status === "completed"
                    ? "border-emerald-500/30 text-emerald-400"
                    : job.status === "running"
                      ? "border-amber-500/30 text-amber-400"
                      : "border-rose-500/30 text-rose-400"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">📥</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{job.name}</p>
                        <p className="text-xs text-zinc-600 mt-1">
                          {job.format.toUpperCase()} • {job.dataType.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded uppercase",
                        job.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : job.status === "running"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-rose-500/20 text-rose-500"
                      )}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                    <div>
                      <span className="text-zinc-400">Records:</span> {job.recordCount.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-zinc-400">Size:</span> {job.fileSize} MB
                    </div>
                    <div>
                      <span className="text-zinc-400">Schedule:</span> {job.schedule}
                    </div>
                  </div>
                </div>
              </button>

              {expandedItemId === job.id && (
                <div className="pl-4 space-y-2">
                  <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">📊 Export Details</p>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Format:</span>
                          <span className="font-bold text-white uppercase">{job.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Schedule:</span>
                          <span className="font-bold text-white capitalize">{job.schedule}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Records:</span>
                          <span className="font-bold text-blue-500">{job.recordCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">File Size:</span>
                          <span className="font-bold text-white">{job.fileSize} MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Last Run:</span>
                          <span className="font-bold text-white">{job.lastRun?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Next Run:</span>
                          <span className="font-bold text-primary">{job.nextRun?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-primary text-white hover:bg-primary/80 transition-all">
                        Download
                      </button>
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-all">
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 transition-all">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/80 transition-all">
            + Create Export Job
          </button>
        </div>
      )}

      {/* API Keys */}
      {activeTab === "api" && (
        <div className="space-y-3">
          {mockAPIKeys.map((key) => (
            <div key={key.id} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedItemId(
                    expandedItemId === key.id ? null : key.id
                  )
                }
                className={cn(
                  "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                  key.status === "active"
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-zinc-500/30 text-zinc-400"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">🔑</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{key.name}</p>
                        <p className="text-xs text-zinc-600 mt-1 font-mono truncate">{key.key}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded uppercase",
                        key.status === "active"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : key.status === "revoked"
                            ? "bg-rose-500/20 text-rose-500"
                            : "bg-amber-500/20 text-amber-500"
                      )}
                    >
                      {key.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-600">
                    <div>
                      <span className="text-zinc-400">Created:</span> {key.createdAt.toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-zinc-400">Usage:</span> {key.usageCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </button>

              {expandedItemId === key.id && (
                <div className="pl-4 space-y-2">
                  <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">🔐 Permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {key.permissions.map((perm) => (
                          <span key={perm} className="text-[10px] font-bold px-2 py-1 rounded bg-white/10 text-zinc-300">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">📊 Usage</p>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Total Calls:</span>
                          <span className="font-bold text-blue-500">{key.usageCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Last Used:</span>
                          <span className="font-bold text-white">{key.lastUsed?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-all">
                        Rotate
                      </button>
                      {key.status === "active" && (
                        <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 transition-all">
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/80 transition-all">
            + Generate New API Key
          </button>
        </div>
      )}

      {/* Webhooks */}
      {activeTab === "webhooks" && (
        <div className="space-y-3">
          {mockWebhooks.map((webhook) => {
            const sr = successRate(webhook.deliveryCount, webhook.failureCount);
            return (
              <div key={webhook.id} className="space-y-2">
                <button
                  onClick={() =>
                    setExpandedItemId(
                      expandedItemId === webhook.id ? null : webhook.id
                    )
                  }
                  className={cn(
                    "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                    webhook.status === "active"
                      ? "border-emerald-500/30 text-emerald-400"
                      : webhook.status === "failed"
                        ? "border-rose-500/30 text-rose-400"
                        : "border-zinc-500/30 text-zinc-400"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">🪝</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate">{webhook.url}</p>
                          <p className="text-xs text-zinc-600 mt-1">{webhook.events.length} events</p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded uppercase",
                          webhook.status === "active"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : webhook.status === "disabled"
                              ? "bg-zinc-500/20 text-zinc-500"
                              : "bg-rose-500/20 text-rose-500"
                        )}
                      >
                        {webhook.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                      <div>
                        <span className="text-zinc-400">Delivered:</span> {webhook.deliveryCount.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-zinc-400">Failed:</span> {webhook.failureCount}
                      </div>
                      <div>
                        <span className={cn("font-bold", sr > 99 ? "text-emerald-500" : sr > 95 ? "text-amber-500" : "text-rose-500")}>
                          {sr}% success
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {expandedItemId === webhook.id && (
                  <div className="pl-4 space-y-2">
                    <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">📨 Subscribed Events</p>
                        <div className="flex flex-wrap gap-2">
                          {webhook.events.map((event) => (
                            <span key={event} className="text-[10px] font-bold px-2 py-1 rounded bg-white/10 text-zinc-300">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">📊 Delivery Stats</p>
                        <div className="space-y-1 text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-zinc-600">Success Rate:</span>
                            <span className={cn("font-bold", sr > 99 ? "text-emerald-500" : sr > 95 ? "text-amber-500" : "text-rose-500")}>
                              {sr}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600">Total Delivered:</span>
                            <span className="font-bold text-blue-500">{webhook.deliveryCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600">Failed:</span>
                            <span className="font-bold text-rose-500">{webhook.failureCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600">Last Triggered:</span>
                            <span className="font-bold text-white">{webhook.lastTriggered?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex gap-2">
                        <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-primary text-white hover:bg-primary/80 transition-all">
                          Edit
                        </button>
                        <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-all">
                          Test
                        </button>
                        <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 transition-all">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/80 transition-all">
            + Add Webhook
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">ℹ️ Integration Features</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>📥 Scheduled exports (daily, weekly, monthly) in CSV/JSON format</li>
          <li>🔑 API key management with granular permissions</li>
          <li>🪝 Webhook subscriptions for real-time event delivery</li>
          <li>📊 Export job status tracking and download management</li>
          <li>🔐 API usage tracking and analytics</li>
          <li>✅ Webhook delivery success rate monitoring</li>
        </ul>
      </div>
    </div>
  );
}
