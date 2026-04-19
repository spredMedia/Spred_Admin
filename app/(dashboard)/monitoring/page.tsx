"use client";

import { useState, useEffect } from "react";
import { Bell, AlertCircle, TrendingDown, Activity } from "lucide-react";
import { AlertManager } from "@/components/AlertManager";
import { AlertHistory, generateMockAlertEvents } from "@/components/AlertHistory";

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

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    critical: 0,
    recentlyTriggered: 0,
  });

  useEffect(() => {
    // Initialize with some default alerts
    const defaultAlerts: Alert[] = [
      {
        id: "1",
        name: "High CPU Usage",
        condition: ">",
        threshold: 85,
        metric: "cpu",
        severity: "critical",
        enabled: true,
        notificationChannels: ["email", "webhook"],
        escalationPolicy: "immediate",
        createdAt: new Date(Date.now() - 86400000 * 7),
      },
      {
        id: "2",
        name: "Memory Pressure",
        condition: ">",
        threshold: 80,
        metric: "memory",
        severity: "warning",
        enabled: true,
        notificationChannels: ["email"],
        escalationPolicy: "15min",
        createdAt: new Date(Date.now() - 86400000 * 3),
      },
      {
        id: "3",
        name: "High Error Rate",
        condition: ">",
        threshold: 5,
        metric: "error_rate",
        severity: "critical",
        enabled: true,
        notificationChannels: ["email", "webhook", "sms"],
        escalationPolicy: "immediate",
        createdAt: new Date(Date.now() - 86400000),
        lastTriggered: new Date(Date.now() - 3600000),
      },
    ];

    setAlerts(defaultAlerts);
    setAlertEvents(generateMockAlertEvents());
    updateStats(defaultAlerts);
  }, []);

  const updateStats = (currentAlerts: Alert[]) => {
    const now = Date.now();
    setStats({
      total: currentAlerts.length,
      active: currentAlerts.filter((a) => a.enabled).length,
      critical: currentAlerts.filter((a) => a.severity === "critical").length,
      recentlyTriggered: currentAlerts.filter(
        (a) =>
          a.lastTriggered &&
          now - a.lastTriggered.getTime() < 3600000
      ).length,
    });
  };

  const handleAlertCreate = (alert: Alert) => {
    const newAlerts = [...alerts, alert];
    setAlerts(newAlerts);
    updateStats(newAlerts);
  };

  const handleAlertDelete = (alertId: string) => {
    const newAlerts = alerts.filter((a) => a.id !== alertId);
    setAlerts(newAlerts);
    updateStats(newAlerts);
  };

  const handleAlertToggle = (alertId: string, enabled: boolean) => {
    const newAlerts = alerts.map((a) =>
      a.id === alertId ? { ...a, enabled } : a
    );
    setAlerts(newAlerts);
    updateStats(newAlerts);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Alert <span className="text-primary">Monitoring</span>
        </h1>
        <p className="text-zinc-400 text-lg">
          Configure and manage system alerts with real-time event tracking.
        </p>
      </div>

      {/* Monitoring Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Total Alerts
              </p>
              <p className="text-2xl font-black text-white mt-2">
                {stats.total}
              </p>
            </div>
            <Bell className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Active Alerts
              </p>
              <p className="text-2xl font-black text-emerald-500 mt-2">
                {stats.active}
              </p>
            </div>
            <Activity className="h-8 w-8 text-emerald-500 opacity-50" />
          </div>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Critical
              </p>
              <p className="text-2xl font-black text-rose-500 mt-2">
                {stats.critical}
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
                {stats.recentlyTriggered}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Alert Manager Section */}
      <div className="space-y-4">
        <AlertManager
          onAlertCreate={handleAlertCreate}
          onAlertDelete={handleAlertDelete}
          onAlertToggle={handleAlertToggle}
          existingAlerts={alerts}
        />
      </div>

      {/* Alert History Section */}
      <div className="space-y-4">
        <AlertHistory
          events={alertEvents}
          title="Alert History"
          maxItems={20}
        />
      </div>
    </div>
  );
}
