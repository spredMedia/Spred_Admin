"use client";

import { useState } from "react";
import { AlertCircle, Bell, Trash2, Settings, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

interface Alert {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  metric: string;
  severity: "critical" | "warning" | "info";
  enabled: boolean;
  notificationChannels: ("email" | "webhook" | "sms")[];
  escalationPolicy?: string;
  createdAt: Date;
  lastTriggered?: Date;
}

interface AlertManagerProps {
  onAlertCreate?: (alert: Alert) => void;
  onAlertDelete?: (alertId: string) => void;
  onAlertToggle?: (alertId: string, enabled: boolean) => void;
  existingAlerts?: Alert[];
}

const severityConfig = {
  critical: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-500",
    label: "Critical",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-500",
    label: "Warning",
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    label: "Info",
  },
};

const metricOptions = [
  { id: "cpu", label: "CPU Usage (%)" },
  { id: "memory", label: "Memory Usage (%)" },
  { id: "error_rate", label: "Error Rate (%)" },
  { id: "response_time", label: "Response Time (ms)" },
  { id: "database_connections", label: "DB Connections" },
  { id: "api_calls", label: "API Calls/min" },
  { id: "uptime", label: "Uptime (%)" },
  { id: "cache_hit_rate", label: "Cache Hit Rate (%)" },
];

export function AlertManager({
  onAlertCreate,
  onAlertDelete,
  onAlertToggle,
  existingAlerts = [],
}: AlertManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [alertName, setAlertName] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("cpu");
  const [condition, setCondition] = useState(">");
  const [threshold, setThreshold] = useState(80);
  const [severity, setSeverity] = useState<"critical" | "warning" | "info">(
    "warning"
  );
  const [channels, setChannels] = useState<("email" | "webhook" | "sms")[]>([
    "email",
  ]);
  const [escalationPolicy, setEscalationPolicy] = useState("");

  const handleCreateAlert = () => {
    if (!alertName.trim()) {
      toast.error("Please enter alert name");
      return;
    }

    const newAlert: Alert = {
      id: Date.now().toString(),
      name: alertName,
      condition,
      threshold,
      metric: selectedMetric,
      severity,
      enabled: true,
      notificationChannels: channels,
      escalationPolicy: escalationPolicy || undefined,
      createdAt: new Date(),
    };

    onAlertCreate?.(newAlert);
    toast.success(`Alert "${alertName}" created`);

    // Reset form
    setAlertName("");
    setSelectedMetric("cpu");
    setCondition(">");
    setThreshold(80);
    setSeverity("warning");
    setChannels(["email"]);
    setEscalationPolicy("");
    setShowForm(false);
  };

  const handleChannelToggle = (channel: "email" | "webhook" | "sms") => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Active Alerts
              </p>
              <p className="text-2xl font-black text-white mt-2">
                {existingAlerts.filter((a) => a.enabled).length}
              </p>
            </div>
            <Bell className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Critical
              </p>
              <p className="text-2xl font-black text-rose-500 mt-2">
                {existingAlerts.filter((a) => a.severity === "critical")
                  .length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-rose-500 opacity-50" />
          </div>
        </div>
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Recently Triggered
              </p>
              <p className="text-2xl font-black text-blue-500 mt-2">
                {
                  existingAlerts.filter(
                    (a) =>
                      a.lastTriggered &&
                      Date.now() - a.lastTriggered.getTime() < 3600000
                  ).length
                }
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Create Alert Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
      >
        <AlertCircle className="h-5 w-5" />
        Create Alert
      </button>

      {/* Alert Form */}
      {showForm && (
        <div className="glass-card rounded-xl border-white/10 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Alert Name
              </label>
              <input
                type="text"
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                placeholder="e.g., High CPU Usage"
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              >
                {metricOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              >
                <option value=">">Greater than (&gt;)</option>
                <option value="<">Less than (&lt;)</option>
                <option value="==">Equals (==)</option>
                <option value="!=">Not equals (!=)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Threshold Value
              </label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value as "critical" | "warning" | "info")
                }
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              >
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Escalation Policy (Optional)
              </label>
              <select
                value={escalationPolicy}
                onChange={(e) => setEscalationPolicy(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              >
                <option value="">None</option>
                <option value="immediate">Immediate Escalation</option>
                <option value="15min">15 min then escalate</option>
                <option value="30min">30 min then escalate</option>
              </select>
            </div>
          </div>

          {/* Notification Channels */}
          <div>
            <label className="block text-sm font-bold text-white mb-4">
              Notification Channels
            </label>
            <div className="space-y-2">
              {(["email", "webhook", "sms"] as const).map((channel) => (
                <label
                  key={channel}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={channels.includes(channel)}
                    onChange={() => handleChannelToggle(channel)}
                    className="rounded accent-primary"
                  />
                  <span className="text-white font-medium capitalize">
                    {channel === "webhook" ? "Webhook" : channel}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleCreateAlert}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Create Alert
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing Alerts */}
      {existingAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Active Alerts</h3>
          <div className="space-y-3">
            {existingAlerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const metricLabel = metricOptions.find(
                (m) => m.id === alert.metric
              )?.label;

              return (
                <div
                  key={alert.id}
                  className={cn(
                    "glass-card rounded-xl border p-4 flex items-center justify-between group hover:bg-white/[0.03] transition-all",
                    config.bg,
                    config.border
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/10">
                      {alert.enabled ? (
                        <CheckCircle2 className={cn("h-6 w-6", config.text)} />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-zinc-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-white">{alert.name}</h4>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-bold",
                            config.bg,
                            config.text
                          )}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">
                        {metricLabel} {alert.condition} {alert.threshold}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                        <span>
                          Channels:{" "}
                          {alert.notificationChannels.join(", ").toUpperCase()}
                        </span>
                        {alert.lastTriggered && (
                          <span>
                            Last triggered:{" "}
                            {alert.lastTriggered.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() =>
                        onAlertToggle?.(alert.id, !alert.enabled)
                      }
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                        alert.enabled
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      )}
                    >
                      {alert.enabled ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => onAlertDelete?.(alert.id)}
                      className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
