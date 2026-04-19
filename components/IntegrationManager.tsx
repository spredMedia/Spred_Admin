"use client";

import { useState } from "react";
import {
  Zap,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  type: "slack" | "webhook" | "zapier" | "custom";
  status: "connected" | "disconnected" | "error";
  icon: string;
  description: string;
  config: {
    url?: string;
    token?: string;
    channel?: string;
    events?: string[];
  };
  lastTriggered?: Date;
  testSuccessful?: boolean;
}

interface IntegrationManagerProps {
  integrations?: Integration[];
  onAdd?: () => void;
  onDelete?: (id: string) => void;
  onTest?: (id: string) => void;
}

const mockIntegrations: Integration[] = [
  {
    id: "int_slack_1",
    name: "Slack - Alerts Channel",
    type: "slack",
    status: "connected",
    icon: "🔔",
    description: "Send critical alerts to #admin-alerts",
    config: {
      channel: "#admin-alerts",
      events: ["alert_critical", "user_ban", "content_removed"],
    },
    lastTriggered: new Date(Date.now() - 600000),
    testSuccessful: true,
  },
  {
    id: "int_webhook_1",
    name: "Custom Webhook - Analytics",
    type: "webhook",
    status: "connected",
    icon: "🔗",
    description: "Send analytics data to external service",
    config: {
      url: "https://analytics.example.com/webhook",
      events: ["user_created", "content_uploaded", "payment_processed"],
    },
    lastTriggered: new Date(Date.now() - 1800000),
    testSuccessful: true,
  },
  {
    id: "int_zapier_1",
    name: "Zapier - Workflow Automation",
    type: "zapier",
    status: "connected",
    icon: "⚡",
    description: "Trigger Zapier workflows on platform events",
    config: {
      events: ["moderate_action", "payment_received"],
    },
    lastTriggered: new Date(Date.now() - 3600000),
    testSuccessful: true,
  },
  {
    id: "int_webhook_2",
    name: "Legacy Integration",
    type: "webhook",
    status: "error",
    icon: "⚠️",
    description: "Old webhook endpoint (inactive)",
    config: {
      url: "https://old-api.example.com/hook",
    },
    lastTriggered: new Date(Date.now() - 604800000),
    testSuccessful: false,
  },
];

export function IntegrationManager({
  integrations = mockIntegrations,
  onAdd,
  onDelete,
  onTest,
}: IntegrationManagerProps) {
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "disconnected":
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
      case "error":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "slack":
        return "Slack";
      case "webhook":
        return "Webhook";
      case "zapier":
        return "Zapier";
      case "custom":
        return "Custom";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Integrations</h3>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Integration
        </button>
      </div>

      {/* Integration Cards */}
      <div className="space-y-3">
        {integrations.map((integration) => (
          <div key={integration.id} className="space-y-2">
            <button
              onClick={() =>
                setExpandedId(
                  expandedId === integration.id ? null : integration.id
                )
              }
              className={cn(
                "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                getStatusColor(integration.status)
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{integration.icon}</span>
                  <div className="text-left flex-1">
                    <p className="font-bold text-white">{integration.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold uppercase">
                        {getTypeLabel(integration.type)}
                      </span>
                      {integration.lastTriggered && (
                        <span className="text-[10px] text-zinc-600">
                          Last triggered:{" "}
                          {integration.lastTriggered.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {integration.testSuccessful ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-rose-500" />
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === integration.id && (
              <div className="pl-4 space-y-2">
                {/* Configuration */}
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  <p className="text-xs font-bold text-zinc-600 uppercase">
                    Configuration
                  </p>

                  {integration.config.url && (
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase mb-1">
                        URL
                      </p>
                      <p className="text-xs font-mono text-white break-all">
                        {integration.config.url}
                      </p>
                    </div>
                  )}

                  {integration.config.token && (
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase mb-1">
                        Token
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono text-white bg-white/5 px-2 py-1 rounded">
                          {showSecret === integration.id
                            ? integration.config.token
                            : "••••••••••••••••"}
                        </code>
                        <button
                          onClick={() =>
                            setShowSecret(
                              showSecret === integration.id
                                ? null
                                : integration.id
                            )
                          }
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                        >
                          {showSecret === integration.id ? (
                            <EyeOff className="h-4 w-4 text-zinc-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-zinc-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {integration.config.channel && (
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase mb-1">
                        Channel
                      </p>
                      <p className="text-xs text-white">{integration.config.channel}</p>
                    </div>
                  )}

                  {integration.config.events && (
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase mb-2">
                        Subscribed Events
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {integration.config.events.map((event) => (
                          <span
                            key={event}
                            className="px-2 py-1 rounded-full bg-white/10 text-[10px] text-white font-bold"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onTest?.(integration.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all text-sm font-bold"
                  >
                    Test Connection
                  </button>
                  <button
                    onClick={() => onDelete?.(integration.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          Integration Guide
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>
            Slack: Use app webhook URL from Slack App configuration
          </li>
          <li>
            Webhook: Full URL must be publicly accessible
          </li>
          <li>
            Zapier: Authenticate via OAuth in Zapier interface
          </li>
          <li>
            All integrations require test connection before activation
          </li>
          <li>
            Custom events can be created for application-specific triggers
          </li>
        </ul>
      </div>
    </div>
  );
}
