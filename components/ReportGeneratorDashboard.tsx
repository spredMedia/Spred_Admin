"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledReport {
  id: string;
  name: string;
  type: "performance" | "economics" | "device_health" | "anomalies" | "custom";
  frequency: "daily" | "weekly" | "monthly";
  recipients: string[];
  format: "pdf" | "csv" | "json";
  enabled: boolean;
  createdAt: Date;
  nextRun: Date;
  lastRun?: Date;
  sections: string[];
}

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: Date;
  format: "pdf" | "csv" | "json";
  size: number;
  downloadUrl: string;
  expiresAt: Date;
}

const mockScheduledReports: ScheduledReport[] = [
  {
    id: "report_001",
    name: "Daily Operations Summary",
    type: "performance",
    frequency: "daily",
    recipients: ["admin@spred.cc", "ops-team@spred.cc"],
    format: "pdf",
    enabled: true,
    createdAt: new Date(Date.now() - 60 * 86400000),
    nextRun: new Date(Date.now() + 86400000),
    lastRun: new Date(Date.now() - 3600000),
    sections: ["Live Transfers", "Performance Metrics", "Top Issues", "Success Rates"],
  },
  {
    id: "report_002",
    name: "Weekly Revenue Report",
    type: "economics",
    frequency: "weekly",
    recipients: ["cfo@spred.cc", "admin@spred.cc"],
    format: "pdf",
    enabled: true,
    createdAt: new Date(Date.now() - 30 * 86400000),
    nextRun: new Date(Date.now() + 3 * 86400000),
    lastRun: new Date(Date.now() - 4 * 86400000),
    sections: ["Revenue Summary", "Top Earners", "Growth Trends", "Splits Analysis"],
  },
  {
    id: "report_003",
    name: "Device Health Dashboard",
    type: "device_health",
    frequency: "daily",
    recipients: ["ops-team@spred.cc"],
    format: "csv",
    enabled: true,
    createdAt: new Date(Date.now() - 45 * 86400000),
    nextRun: new Date(Date.now() + 86400000),
    lastRun: new Date(Date.now() - 7200000),
    sections: ["Device Trust Scores", "Connection Quality", "Offline Status", "Compatibility"],
  },
  {
    id: "report_004",
    name: "Monthly Executive Summary",
    type: "custom",
    frequency: "monthly",
    recipients: ["exec@spred.cc", "cfo@spred.cc", "cto@spred.cc"],
    format: "pdf",
    enabled: true,
    createdAt: new Date(Date.now() - 90 * 86400000),
    nextRun: new Date(Date.now() + 14 * 86400000),
    lastRun: new Date(Date.now() - 30 * 86400000),
    sections: ["Key Metrics", "Revenue Analysis", "Device Distribution", "Anomalies", "Forecasts"],
  },
];

const mockGeneratedReports: GeneratedReport[] = [
  {
    id: "gen_001",
    name: "Daily Operations Summary - Apr 19",
    type: "performance",
    generatedAt: new Date(Date.now() - 3600000),
    format: "pdf",
    size: 2.4,
    downloadUrl: "https://reports.spred.cc/daily-ops-2024-04-19.pdf",
    expiresAt: new Date(Date.now() + 30 * 86400000),
  },
  {
    id: "gen_002",
    name: "Device Health Dashboard - Apr 19",
    type: "device_health",
    generatedAt: new Date(Date.now() - 7200000),
    format: "csv",
    size: 0.8,
    downloadUrl: "https://reports.spred.cc/device-health-2024-04-19.csv",
    expiresAt: new Date(Date.now() + 30 * 86400000),
  },
  {
    id: "gen_003",
    name: "Weekly Revenue Report - Apr 14",
    type: "economics",
    generatedAt: new Date(Date.now() - 5 * 86400000),
    format: "pdf",
    size: 3.2,
    downloadUrl: "https://reports.spred.cc/weekly-revenue-2024-04-14.pdf",
    expiresAt: new Date(Date.now() + 30 * 86400000),
  },
];

export function ReportGeneratorDashboard() {
  const [activeTab, setActiveTab] = useState<"scheduled" | "generated">("scheduled");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const enabledCount = mockScheduledReports.filter((r) => r.enabled).length;
  const totalGenerated = mockGeneratedReports.length;

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "daily":
        return "📅 Daily";
      case "weekly":
        return "📆 Weekly";
      case "monthly":
        return "📊 Monthly";
      default:
        return freq;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Report Generator & Scheduler</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Scheduled Reports</p>
          <p className="text-3xl font-black text-primary">{mockScheduledReports.length}</p>
          <p className="text-[10px] text-zinc-600">{enabledCount} active</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Generated Reports</p>
          <p className="text-3xl font-black text-blue-500">{totalGenerated}</p>
          <p className="text-[10px] text-zinc-600">this month</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Storage Used</p>
          <p className="text-3xl font-black text-emerald-500">
            {(mockGeneratedReports.reduce((a, b) => a + b.size, 0)).toFixed(1)}
          </p>
          <p className="text-[10px] text-zinc-600">MB</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        {["scheduled", "generated"].map((tab) => (
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
            {tab === "scheduled" ? "📋 Scheduled" : "📥 Generated"}
          </button>
        ))}
      </div>

      {/* Scheduled Reports */}
      {activeTab === "scheduled" && (
        <div className="space-y-3">
          {mockScheduledReports.map((report) => (
            <div key={report.id} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedReportId(
                    expandedReportId === report.id ? null : report.id
                  )
                }
                className="w-full glass-card rounded-xl border-white/10 p-4 transition-all hover:bg-white/[0.03] border-2"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">📋</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{report.name}</p>
                        <p className="text-xs text-zinc-600 mt-1">
                          {getFrequencyLabel(report.frequency)} • {report.format.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded",
                        report.enabled
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-zinc-500/20 text-zinc-500"
                      )}
                    >
                      {report.enabled ? "✓ Active" : "⊘ Inactive"}
                    </span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                    <div>
                      <span className="text-zinc-400">Recipients:</span> {report.recipients.length}
                    </div>
                    <div>
                      <span className="text-zinc-400">Sections:</span> {report.sections.length}
                    </div>
                    <div>
                      <span className="text-zinc-400">Next Run:</span>{" "}
                      {Math.round((report.nextRun.getTime() - Date.now()) / 86400000)} days
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedReportId === report.id && (
                <div className="pl-4 space-y-2">
                  <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                    {/* Configuration */}
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        ⚙️ Configuration
                      </p>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Type:</span>
                          <span className="font-bold text-white capitalize">{report.type.replace(/_/g, " ")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Frequency:</span>
                          <span className="font-bold text-white capitalize">{report.frequency}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Format:</span>
                          <span className="font-bold text-blue-500 uppercase">{report.format}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Status:</span>
                          <span className={cn("font-bold", report.enabled ? "text-emerald-500" : "text-zinc-500")}>
                            {report.enabled ? "✓ Enabled" : "✗ Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recipients */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        📧 Recipients
                      </p>
                      <div className="space-y-1 text-[10px]">
                        {report.recipients.map((recipient) => (
                          <div key={recipient} className="flex items-center gap-2">
                            <span className="text-zinc-600">→</span>
                            <span className="font-bold text-blue-500">{recipient}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Report Sections */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        📄 Report Sections
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {report.sections.map((section) => (
                          <span
                            key={section}
                            className="text-[10px] font-bold px-2 py-1 rounded bg-white/10 text-zinc-300"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">
                        📅 Schedule
                      </p>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Created:</span>
                          <span className="font-bold text-white">{report.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Last Run:</span>
                          <span className="font-bold text-white">
                            {report.lastRun ? report.lastRun.toLocaleString() : "Never"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-600">Next Run:</span>
                          <span className="font-bold text-blue-500">{report.nextRun.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-white/10 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-primary text-white hover:bg-primary/80 transition-all">
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-all flex items-center justify-center gap-1">
                        <Send className="h-3 w-3" /> Run Now
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

          {/* Create New Report Button */}
          <button className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/80 transition-all flex items-center justify-center gap-2">
            <span>+ Create New Report Schedule</span>
          </button>
        </div>
      )}

      {/* Generated Reports */}
      {activeTab === "generated" && (
        <div className="space-y-3">
          {mockGeneratedReports.map((report) => (
            <div key={report.id} className="glass-card rounded-xl border-white/10 p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">📥</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm">{report.name}</p>
                    <p className="text-xs text-zinc-600 mt-1">
                      {report.format.toUpperCase()} • {report.size} MB
                    </p>
                  </div>
                </div>
                <button className="px-3 py-2 text-[10px] font-bold rounded bg-primary text-white hover:bg-primary/80 transition-all flex items-center gap-1">
                  <Download className="h-3 w-3" /> Download
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                <div>
                  <span className="text-zinc-400">Generated:</span> {report.generatedAt.toLocaleString()}
                </div>
                <div>
                  <span className="text-zinc-400">Expires:</span> {report.expiresAt.toLocaleDateString()}
                </div>
                <div>
                  <span className="text-zinc-400">Size:</span> {report.size} MB
                </div>
              </div>
            </div>
          ))}

          {/* Generate New Report Button */}
          <button className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/80 transition-all flex items-center justify-center gap-2">
            <span>+ Generate New Report</span>
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">ℹ️ Report Features</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>📅 Automated scheduling (daily, weekly, monthly)</li>
          <li>📧 Email delivery to multiple recipients</li>
          <li>📊 Multiple formats (PDF, CSV, JSON)</li>
          <li>📄 Customizable report sections</li>
          <li>⚡ On-demand report generation</li>
          <li>💾 30-day report archive and download</li>
        </ul>
      </div>
    </div>
  );
}
