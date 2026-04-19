"use client";

import { AlertCircle, CheckCircle2, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertEvent {
  id: string;
  alertName: string;
  severity: "critical" | "warning" | "info";
  message: string;
  status: "triggered" | "acknowledged" | "resolved";
  timestamp: Date;
  resolvedAt?: Date;
  acknowledgedBy?: string;
}

interface AlertHistoryProps {
  events: AlertEvent[];
  title?: string;
  maxItems?: number;
}

const severityColors = {
  critical: "text-rose-500 bg-rose-500/10",
  warning: "text-amber-500 bg-amber-500/10",
  info: "text-blue-500 bg-blue-500/10",
};

const statusIcons = {
  triggered: <AlertCircle className="h-4 w-4" />,
  acknowledged: <Clock className="h-4 w-4" />,
  resolved: <CheckCircle2 className="h-4 w-4" />,
};

const statusColors = {
  triggered: "text-rose-500",
  acknowledged: "text-amber-500",
  resolved: "text-emerald-500",
};

export function AlertHistory({
  events,
  title = "Alert History",
  maxItems = 20,
}: AlertHistoryProps) {
  const displayedEvents = events.slice(0, maxItems);
  const duration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const ms = endTime.getTime() - start.getTime();
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    if (mins === 0) return `${secs}s`;
    if (mins < 60) return `${mins}m ${secs}s`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 font-medium text-sm transition-all">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {displayedEvents.length === 0 ? (
        <div className="glass-card rounded-xl border-white/10 p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500/50 mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">No alerts triggered recently</p>
          <p className="text-xs text-zinc-600 mt-2">Your system is running smoothly</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className="glass-card rounded-xl border-white/10 p-4 group hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div
                  className={cn(
                    "p-2 rounded-lg mt-1",
                    severityColors[event.severity]
                  )}
                >
                  {statusIcons[event.status]}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white">{event.alertName}</h4>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold",
                        severityColors[event.severity]
                      )}
                    >
                      {event.severity.toUpperCase()}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold bg-white/5",
                        statusColors[event.status]
                      )}
                    >
                      {event.status === "triggered"
                        ? "Triggered"
                        : event.status === "acknowledged"
                          ? "Acknowledged"
                          : "Resolved"}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300 mb-3">{event.message}</p>

                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>
                      {event.timestamp.toLocaleString()}
                    </span>
                    {event.status === "resolved" && event.resolvedAt && (
                      <span>
                        Duration: {duration(event.timestamp, event.resolvedAt)}
                      </span>
                    )}
                    {event.status === "triggered" && (
                      <span>
                        Active for: {duration(event.timestamp)}
                      </span>
                    )}
                    {event.acknowledgedBy && (
                      <span>Ack by: {event.acknowledgedBy}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {event.status === "triggered" && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-medium text-xs transition-all">
                      Acknowledge
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-medium text-xs transition-all">
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Mock alert events for demo
export function generateMockAlertEvents(): AlertEvent[] {
  return [
    {
      id: "1",
      alertName: "High CPU Usage",
      severity: "critical",
      message: "CPU usage exceeded 95% threshold for 5 minutes",
      status: "resolved",
      timestamp: new Date(Date.now() - 3600000),
      resolvedAt: new Date(Date.now() - 3300000),
    },
    {
      id: "2",
      alertName: "Database Connection Pool Low",
      severity: "warning",
      message: "Available connections dropped below 10%",
      status: "acknowledged",
      timestamp: new Date(Date.now() - 1800000),
      acknowledgedBy: "admin@spred.cc",
    },
    {
      id: "3",
      alertName: "High Error Rate",
      severity: "critical",
      message: "API error rate reached 8.5% in last 10 minutes",
      status: "triggered",
      timestamp: new Date(Date.now() - 900000),
    },
    {
      id: "4",
      alertName: "Memory Usage High",
      severity: "warning",
      message: "Memory utilization at 78%",
      status: "resolved",
      timestamp: new Date(Date.now() - 7200000),
      resolvedAt: new Date(Date.now() - 6300000),
    },
    {
      id: "5",
      alertName: "API Response Time Degradation",
      severity: "info",
      message: "Average response time increased to 850ms",
      status: "resolved",
      timestamp: new Date(Date.now() - 10800000),
      resolvedAt: new Date(Date.now() - 9900000),
    },
  ];
}
