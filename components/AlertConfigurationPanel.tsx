"use client";

import { useState } from "react";
import { Bell, Settings, AlertCircle, Toggle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertRule {
  id: string;
  name: string;
  type: "failure_rate" | "speed_degradation" | "latency" | "device_health" | "revenue_drop" | "offline_spike";
  threshold: number;
  operator: ">" | "<" | "=";
  enabled: boolean;
  actions: Array<"email" | "webhook" | "in_app" | "sms">;
  recipients: string[];
  webhookUrl?: string;
  severity: "critical" | "warning" | "info";
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

const mockAlertRules: AlertRule[] = [
  {
    id: "alert_001",
    name: "High Transfer Failure Rate",
    type: "failure_rate",
    threshold: 10,
    operator: ">",
    enabled: true,
    actions: ["email", "webhook", "in_app"],
    recipients: ["admin@spred.cc", "ops-team@spred.cc"],
    webhookUrl: "https://hooks.spred.cc/alerts/failure-rate",
    severity: "critical",
    createdAt: new Date(Date.now() - 30 * 86400000),
    lastTriggered: new Date(Date.now() - 3600000),
    triggerCount: 4,
  },
  {
    id: "alert_002",
    name: "Speed Degradation Warning",
    type: "speed_degradation",
    threshold: 20,
    operator: ">",
    enabled: true,
    actions: ["email", "in_app"],
    recipients: ["ops-team@spred.cc"],
    severity: "warning",
    createdAt: new Date(Date.now() - 14 * 86400000),
    lastTriggered: new Date(Date.now() - 7200000),
    triggerCount: 7,
  },
  {
    id: "alert_003",
    name: "Elevated Latency",
    type: "latency",
    threshold: 30,
    operator: ">",
    enabled: true,
    actions: ["webhook"],
    recipients: [],
    webhookUrl: "https://hooks.spred.cc/alerts/latency",
    severity: "warning",
    createdAt: new Date(Date.now() - 21 * 86400000),
    triggerCount: 12,
  },
  {
    id: "alert_004",
    name: "Device Health Score Drop",
    type: "device_health",
    threshold: 85,
    operator: "<",
    enabled: false,
    actions: ["email"],
    recipients: ["admin@spred.cc"],
    severity: "info",
    createdAt: new Date(Date.now() - 7 * 86400000),
    triggerCount: 0,
  },
  {
    id: "alert_005",
    name: "Critical Revenue Drop",
    type: "revenue_drop",
    threshold: 15,
    operator: ">",
    enabled: true,
    actions: ["email", "sms"],
    recipients: ["cfo@spred.cc", "admin@spred.cc"],
    severity: "critical",
    createdAt: new Date(Date.now() - 60 * 86400000),
    lastTriggered: new Date(Date.now() - 86400000),
    triggerCount: 2,
  },
];

export function AlertConfigurationPanel() {
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "warning" | "info">("all");

  const filteredRules = mockAlertRules.filter(
    (rule) => filterSeverity === "all" || rule.severity === filterSeverity
  );

  const enabledCount = mockAlertRules.filter((r) => r.enabled).length;
  const totalTriggered = mockAlertRules.reduce((a, b) => a + b.triggerCount, 0);
  const recentlyTriggered = mockAlertRules.filter((r) => r.lastTriggered && Date.now() - r.lastTriggered.getTime() < 86400000).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "warning":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "info":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Alert Configuration</h3>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Active Rules</p>
          <p className="text-3xl font-black text-emerald-500">{enabledCount}</p>
          <p className="text-[10px] text-zinc-600">monitoring</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total Rules</p>
          <p className="text-3xl font-black text-primary">{mockAlertRules.length}</p>
          <p className="text-[10px] text-zinc-600">configured</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">All-Time Triggers</p>
          <p className="text-3xl font-black text-amber-500">{totalTriggered}</p>
          <p className="text-[10px] text-zinc-600">activations</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Last 24h</p>
          <p className="text-3xl font-black text-blue-500">{recentlyTriggered}</p>
          <p className="text-[10px] text-zinc-600">triggered</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["all", "critical", "warning", "info"].map((severity) => (
          <button
            key={severity}
            onClick={() => setFilterSeverity(severity as any)}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded transition-all",
              filterSeverity === severity
                ? "bg-primary text-white"
                : "bg-white/10 text-zinc-400 hover:bg-white/20"
            )}
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert Rules List */}
      <div className="space-y-3">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="space-y-2">
            <button
              onClick={() =>
                setExpandedRuleId(
                  expandedRuleId === rule.id ? null : rule.id
                )
              }
              className={cn(
                "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                getSeverityColor(rule.severity)
              )}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{rule.enabled ? "🔔" : "🔕"}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{rule.name}</p>
                      <p className="text-xs text-zinc-600 mt-1 capitalize">{rule.type.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded",
                        rule.enabled
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-zinc-500/20 text-zinc-500"
                      )}
                    >
                      {rule.enabled ? "✓ Active" : "⊘ Inactive"}
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                  <div>
                    <span className="text-zinc-400">Threshold:</span> {rule.threshold}
                    {rule.operator === ">" ? "%" : rule.operator === "<" ? "%" : ""}
                  </div>
                  <div>
                    <span className="text-zinc-400">Triggers:</span> {rule.triggerCount}
                  </div>
                  <div>
                    {rule.lastTriggered ? (
                      <>
                        <span className="text-zinc-400">Last:</span> {Math.round((Date.now() - rule.lastTriggered.getTime()) / 3600000)}h ago
                      </>
                    ) : (
                      <span className="text-zinc-500">Never triggered</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-wrap">
                  {rule.actions.map((action) => (
                    <span
                      key={action}
                      className="text-[10px] font-bold px-2 py-1 rounded bg-white/10 text-zinc-300"
                    >
                      {action === "email"
                        ? "📧 Email"
                        : action === "webhook"
                          ? "🪝 Webhook"
                          : action === "in_app"
                            ? "🔔 In-App"
                            : "📱 SMS"}
                    </span>
                  ))}
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedRuleId === rule.id && (
              <div className="pl-4 space-y-2">
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  {/* Rule Configuration */}
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      ⚙️ Rule Configuration
                    </p>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Type:</span>
                        <span className="font-bold text-white capitalize">{rule.type.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Threshold:</span>
                        <span className="font-bold text-white">
                          {rule.operator} {rule.threshold}
                          {rule.type === "failure_rate" || rule.type === "speed_degradation"
                            ? "%"
                            : rule.type === "latency"
                              ? "ms"
                              : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Status:</span>
                        <span className={cn("font-bold", rule.enabled ? "text-emerald-500" : "text-zinc-500")}>
                          {rule.enabled ? "✓ Enabled" : "✗ Disabled"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Severity:</span>
                        <span
                          className={cn(
                            "font-bold uppercase",
                            rule.severity === "critical"
                              ? "text-rose-500"
                              : rule.severity === "warning"
                                ? "text-amber-500"
                                : "text-blue-500"
                          )}
                        >
                          {rule.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notification Actions */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      📬 Notification Actions
                    </p>
                    <div className="space-y-1 text-[10px]">
                      {rule.actions.includes("email") && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-600">📧 Email to:</span>
                          <span className="font-bold text-blue-500">{rule.recipients.join(", ")}</span>
                        </div>
                      )}
                      {rule.actions.includes("webhook") && rule.webhookUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-600">🪝 Webhook:</span>
                          <span className="font-bold text-blue-500 truncate">{rule.webhookUrl}</span>
                        </div>
                      )}
                      {rule.actions.includes("in_app") && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-600">🔔 In-app notification</span>
                          <span className="font-bold text-emerald-500">Enabled</span>
                        </div>
                      )}
                      {rule.actions.includes("sms") && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-600">📱 SMS to:</span>
                          <span className="font-bold text-blue-500">{rule.recipients.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trigger History */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                      📊 Trigger History
                    </p>
                    <div className="space-y-1 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Total Triggers:</span>
                        <span className="font-bold text-white">{rule.triggerCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Last Triggered:</span>
                        <span className="font-bold text-white">
                          {rule.lastTriggered
                            ? rule.lastTriggered.toLocaleString()
                            : "Never"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-600">Created:</span>
                        <span className="font-bold text-zinc-400">
                          {rule.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-white/10 flex gap-2">
                    <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-primary text-white hover:bg-primary/80 transition-all">
                      Edit Rule
                    </button>
                    <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-white/10 text-zinc-300 hover:bg-white/20 transition-all">
                      Test Alert
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
      </div>

      {/* Create New Alert Button */}
      <button className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/80 transition-all flex items-center justify-center gap-2">
        <span>+ Create New Alert Rule</span>
      </button>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">ℹ️ Alert System Features</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>🔔 Configurable thresholds for all P2P metrics</li>
          <li>📧 Multi-channel notifications (email, webhook, in-app, SMS)</li>
          <li>⚡ Real-time alert triggering with detailed context</li>
          <li>📊 Trigger history and frequency tracking</li>
          <li>🧪 Test alert capability before deployment</li>
          <li>🔌 Webhook integration for external systems</li>
        </ul>
      </div>
    </div>
  );
}
