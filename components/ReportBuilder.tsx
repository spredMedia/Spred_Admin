"use client";

import { useState } from "react";
import { FileText, Mail, Clock, Download, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

interface Report {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  schedule?: "daily" | "weekly" | "monthly";
  recipients?: string[];
  lastRun?: Date;
}

interface ReportBuilderProps {
  onSave?: (report: Report) => void;
  existingReports?: Report[];
}

const availableMetrics = [
  { id: "dau", label: "Daily Active Users", category: "Growth" },
  { id: "mau", label: "Monthly Active Users", category: "Growth" },
  { id: "new_users", label: "New User Signups", category: "Growth" },
  { id: "retention_d1", label: "D1 Retention", category: "Engagement" },
  { id: "retention_d7", label: "D7 Retention", category: "Engagement" },
  { id: "retention_d30", label: "D30 Retention", category: "Engagement" },
  { id: "revenue", label: "Total Revenue", category: "Revenue" },
  { id: "arpu", label: "ARPU (Avg Revenue Per User)", category: "Revenue" },
  { id: "ltv", label: "Customer LTV", category: "Revenue" },
  { id: "churn", label: "Churn Rate", category: "Engagement" },
  { id: "content_uploads", label: "Content Uploads", category: "Content" },
  { id: "content_views", label: "Total Views", category: "Content" },
];

const reportTemplates = [
  {
    name: "Executive Summary",
    metrics: ["dau", "mau", "revenue", "retention_d7"],
  },
  {
    name: "Growth Report",
    metrics: ["new_users", "dau", "mau", "retention_d1", "retention_d7"],
  },
  {
    name: "Engagement Report",
    metrics: ["retention_d1", "retention_d7", "retention_d30", "churn"],
  },
  {
    name: "Revenue Report",
    metrics: ["revenue", "arpu", "ltv", "dau"],
  },
  {
    name: "Content Performance",
    metrics: ["content_uploads", "content_views", "dau", "mau"],
  },
];

export function ReportBuilder({
  onSave,
  existingReports = [],
}: ReportBuilderProps) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<"daily" | "weekly" | "monthly">(
    "weekly"
  );
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);

  const handleAddMetric = (metricId: string) => {
    if (!selectedMetrics.includes(metricId)) {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const handleRemoveMetric = (metricId: string) => {
    setSelectedMetrics(selectedMetrics.filter((m) => m !== metricId));
  };

  const handleAddRecipient = () => {
    if (recipientEmail && !recipients.includes(recipientEmail)) {
      setRecipients([...recipients, recipientEmail]);
      setRecipientEmail("");
    }
  };

  const handleSaveReport = () => {
    if (!reportName.trim()) {
      toast.error("Please enter a report name");
      return;
    }
    if (selectedMetrics.length === 0) {
      toast.error("Please select at least one metric");
      return;
    }

    const newReport: Report = {
      id: Date.now().toString(),
      name: reportName,
      description: reportDescription,
      metrics: selectedMetrics,
      schedule,
      recipients,
      lastRun: new Date(),
    };

    onSave?.(newReport);
    toast.success(`Report "${reportName}" created successfully`);

    // Reset form
    setReportName("");
    setReportDescription("");
    setSelectedMetrics([]);
    setRecipients([]);
    setShowBuilder(false);
  };

  const handleApplyTemplate = (template: (typeof reportTemplates)[0]) => {
    setSelectedMetrics(template.metrics);
  };

  const categorizedMetrics = Object.fromEntries(
    ["Growth", "Engagement", "Revenue", "Content"].map((cat) => [
      cat,
      availableMetrics.filter((m) => m.category === cat),
    ])
  );

  return (
    <div className="space-y-6">
      {/* Existing Reports */}
      {existingReports.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Saved Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingReports.map((report) => (
              <div
                key={report.id}
                className="glass-card rounded-xl border-white/10 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white">{report.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {report.description}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-primary opacity-50" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {report.metrics
                    .slice(0, 3)
                    .map((metricId) => {
                      const metric = availableMetrics.find(
                        (m) => m.id === metricId
                      );
                      return (
                        <span
                          key={metricId}
                          className="text-[10px] px-2 py-1 rounded-full bg-primary/20 text-primary font-medium"
                        >
                          {metric?.label}
                        </span>
                      );
                    })}
                  {report.metrics.length > 3 && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-700/50 text-zinc-400">
                      +{report.metrics.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {report.schedule}
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-medium">
                    <Download className="h-3 w-3" />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Builder */}
      <div>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          <Plus className="h-5 w-5" />
          Create Custom Report
        </button>
      </div>

      {showBuilder && (
        <div className="glass-card rounded-xl border-white/10 p-8 space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Report Name
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., Weekly Executive Summary"
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Description (Optional)
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="What this report covers..."
                rows={3}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Templates */}
          <div>
            <label className="block text-sm font-bold text-white mb-3">
              Quick Templates
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {reportTemplates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => handleApplyTemplate(template)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-bold text-white mb-4">
              Select Metrics
            </label>
            <div className="space-y-4">
              {Object.entries(categorizedMetrics).map(([category, metrics]) => (
                <div key={category}>
                  <h4 className="text-xs font-bold uppercase text-zinc-500 mb-3">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {metrics.map((metric) => (
                      <button
                        key={metric.id}
                        onClick={() =>
                          selectedMetrics.includes(metric.id)
                            ? handleRemoveMetric(metric.id)
                            : handleAddMetric(metric.id)
                        }
                        className={cn(
                          "px-3 py-2 rounded-lg border font-medium text-sm transition-all",
                          selectedMetrics.includes(metric.id)
                            ? "bg-primary border-primary text-white"
                            : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                        )}
                      >
                        {metric.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule & Recipients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Delivery Schedule
              </label>
              <select
                value={schedule}
                onChange={(e) =>
                  setSchedule(e.target.value as "daily" | "weekly" | "monthly")
                }
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-3">
                Email Recipients
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleAddRecipient}
                  className="px-4 py-2.5 rounded-lg bg-primary text-white font-bold hover:shadow-lg transition-all"
                >
                  Add
                </button>
              </div>
              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {recipients.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-medium"
                    >
                      <Mail className="h-3 w-3" />
                      {email}
                      <button
                        onClick={() =>
                          setRecipients(recipients.filter((e) => e !== email))
                        }
                        className="hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleSaveReport}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Save Report
            </button>
            <button
              onClick={() => setShowBuilder(false)}
              className="flex-1 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
