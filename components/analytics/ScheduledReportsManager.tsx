"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trash2, Plus, Mail } from "lucide-react";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  recipient: string;
  metrics: string[];
  lastRun?: Date;
  nextRun?: Date;
  enabled: boolean;
}

interface ScheduledReportsManagerProps {
  onReportCreate?: (report: Omit<ScheduledReport, "id">) => void;
}

export function ScheduledReportsManager({
  onReportCreate,
}: ScheduledReportsManagerProps) {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    frequency: "weekly" as const,
    recipient: "",
    metrics: ["dau", "mau", "churn", "engagement"] as string[],
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    // Load from localStorage for demo
    const saved = localStorage.getItem("scheduled_reports");
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load reports:", err);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: ScheduledReport = {
      id: `report_${Date.now()}`,
      ...formData,
      enabled: true,
      lastRun: undefined,
      nextRun: calculateNextRun(formData.frequency),
    };

    const updated = [...reports, newReport];
    setReports(updated);
    localStorage.setItem("scheduled_reports", JSON.stringify(updated));

    if (onReportCreate) {
      onReportCreate({
        name: formData.name,
        frequency: formData.frequency,
        recipient: formData.recipient,
        metrics: formData.metrics,
        enabled: true,
      });
    }

    setFormData({
      name: "",
      frequency: "weekly",
      recipient: "",
      metrics: ["dau", "mau", "churn", "engagement"],
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("scheduled_reports", JSON.stringify(updated));
  };

  const handleToggle = (id: string) => {
    const updated = reports.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setReports(updated);
    localStorage.setItem("scheduled_reports", JSON.stringify(updated));
  };

  const calculateNextRun = (frequency: string): Date => {
    const now = new Date();
    const next = new Date(now);

    switch (frequency) {
      case "daily":
        next.setDate(next.getDate() + 1);
        next.setHours(9, 0, 0, 0);
        break;
      case "weekly":
        next.setDate(next.getDate() + (1 + 7 - next.getDay()) % 7 || 7);
        next.setHours(9, 0, 0, 0);
        break;
      case "monthly":
        next.setMonth(next.getMonth() + 1);
        next.setDate(1);
        next.setHours(9, 0, 0, 0);
        break;
    }

    return next;
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Scheduled Reports
              </CardTitle>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Automated analytics delivery
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Report
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-white">
                Report Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Weekly Executive Report"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frequency: e.target.value as "daily" | "weekly" | "monthly",
                    })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:border-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-white">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={formData.recipient}
                  onChange={(e) =>
                    setFormData({ ...formData, recipient: e.target.value })
                  }
                  placeholder="admin@example.com"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-colors"
              >
                Create Report
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {reports.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No scheduled reports yet</p>
            <p className="text-sm mt-1">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {report.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                      <Mail className="h-3 w-3" />
                      {report.recipient}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(report.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      report.enabled
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-zinc-800/50 text-zinc-400"
                    }`}
                  >
                    {report.enabled ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                  <div>
                    <p className="text-zinc-500">Frequency</p>
                    <p className="text-white font-medium capitalize">
                      {report.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Last Run</p>
                    <p className="text-white font-medium">
                      {formatDate(report.lastRun)}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Next Run</p>
                    <p className="text-white font-medium">
                      {formatDate(report.nextRun)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(report.id)}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
