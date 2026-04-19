"use client";

import { useState } from "react";
import {
  Download,
  Upload,
  FileJson,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportJob {
  id: string;
  name: string;
  format: "csv" | "json";
  status: "pending" | "completed" | "scheduled" | "error";
  size?: number;
  createdAt: Date;
  scheduledFor?: Date;
  frequency?: "once" | "daily" | "weekly" | "monthly";
  recipients?: string[];
}

interface ImportJob {
  id: string;
  filename: string;
  status: "pending" | "processing" | "completed" | "error";
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  createdAt: Date;
  errors?: string[];
}

interface ExportImportManagerProps {
  exports?: ExportJob[];
  imports?: ImportJob[];
  onCreateExport?: (format: "csv" | "json") => void;
  onDeleteExport?: (id: string) => void;
  onImport?: (file: File) => void;
}

const mockExports: ExportJob[] = [
  {
    id: "exp_1",
    name: "User Database Export",
    format: "csv",
    status: "completed",
    size: 2847293,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "exp_2",
    name: "Daily Analytics Export",
    format: "json",
    status: "scheduled",
    frequency: "daily",
    scheduledFor: new Date(Date.now() + 86400000),
    recipients: ["analytics@spred.com"],
  },
  {
    id: "exp_3",
    name: "Weekly Report",
    format: "csv",
    status: "scheduled",
    frequency: "weekly",
    scheduledFor: new Date(Date.now() + 604800000),
    recipients: ["leadership@spred.com", "finance@spred.com"],
  },
];

const mockImports: ImportJob[] = [
  {
    id: "imp_1",
    filename: "users_batch_2024.csv",
    status: "completed",
    recordsProcessed: 1547,
    recordsSuccessful: 1543,
    recordsFailed: 4,
    createdAt: new Date(Date.now() - 86400000),
    errors: ["Row 234: Invalid email format", "Row 512: Duplicate user ID"],
  },
  {
    id: "imp_2",
    filename: "categories_update.json",
    status: "processing",
    recordsProcessed: 234,
    recordsSuccessful: 234,
    recordsFailed: 0,
    createdAt: new Date(Date.now() - 1800000),
  },
];

export function ExportImportManager({
  exports = mockExports,
  imports = mockImports,
  onCreateExport,
  onDeleteExport,
  onImport,
}: ExportImportManagerProps) {
  const [expandedExport, setExpandedExport] = useState<string | null>(null);
  const [expandedImport, setExpandedImport] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "pending":
      case "processing":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "scheduled":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "error":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Export Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Exports</h3>
        </div>

        {/* New Export Buttons */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => onCreateExport?.("csv")}
            className="px-4 py-3 rounded-lg bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20 transition-all font-bold flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export as CSV
          </button>
          <button
            onClick={() => onCreateExport?.("json")}
            className="px-4 py-3 rounded-lg bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20 transition-all font-bold flex items-center justify-center gap-2"
          >
            <FileJson className="h-4 w-4" />
            Export as JSON
          </button>
        </div>

        {/* Exports List */}
        <div className="space-y-3">
          {exports.map((exp) => (
            <div key={exp.id} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedExport(
                    expandedExport === exp.id ? null : exp.id
                  )
                }
                className={cn(
                  "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                  getStatusColor(exp.status)
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 text-left">
                    <p className="font-bold text-white">{exp.name}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      {exp.format === "csv" ? (
                        <FileText className="h-3 w-3" />
                      ) : (
                        <FileJson className="h-3 w-3" />
                      )}
                      <span className="uppercase font-bold">{exp.format}</span>
                      {exp.size && (
                        <>
                          <span>•</span>
                          <span>{formatBytes(exp.size)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold uppercase">
                      {exp.status === "completed"
                        ? "Ready"
                        : exp.status === "scheduled"
                          ? "Scheduled"
                          : exp.status}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {exp.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedExport === exp.id && (
                <div className="pl-4 space-y-2">
                  <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                    {exp.scheduledFor && (
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase mb-1">
                          Scheduled For
                        </p>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <Calendar className="h-4 w-4 text-primary" />
                          {exp.scheduledFor.toLocaleString()}
                        </div>
                      </div>
                    )}

                    {exp.frequency && (
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase mb-1">
                          Frequency
                        </p>
                        <p className="text-sm text-white capitalize">
                          {exp.frequency === "once"
                            ? "One-time"
                            : `Every ${exp.frequency}`}
                        </p>
                      </div>
                    )}

                    {exp.recipients && exp.recipients.length > 0 && (
                      <div>
                        <p className="text-[10px] text-zinc-600 uppercase mb-2">
                          Recipients
                        </p>
                        <div className="space-y-1">
                          {exp.recipients.map((email) => (
                            <p key={email} className="text-xs text-white font-mono">
                              {email}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {exp.status === "completed" && (
                      <button className="w-full px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                  </div>

                  {exp.status !== "completed" && (
                    <button
                      onClick={() => onDeleteExport?.(exp.id)}
                      className="w-full px-3 py-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all text-sm font-bold"
                    >
                      Cancel Export
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Import Section */}
      <div className="space-y-6 border-t border-white/10 pt-8">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Imports</h3>
        </div>

        {/* Drag & Drop Upload */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && (file.name.endsWith(".csv") || file.name.endsWith(".json"))) {
              onImport?.(file);
            }
          }}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-white/10 hover:border-primary/50 hover:bg-white/[0.01]"
          )}
        >
          <Upload className="h-8 w-8 mx-auto mb-3 text-primary opacity-50" />
          <p className="text-sm font-bold text-white mb-1">
            Drop CSV or JSON files here
          </p>
          <p className="text-xs text-zinc-500">
            or click to browse
          </p>
        </div>

        {/* Imports List */}
        <div className="space-y-3">
          {imports.map((imp) => {
            const successRate =
              imp.recordsProcessed > 0
                ? (imp.recordsSuccessful / imp.recordsProcessed) * 100
                : 0;

            return (
              <div key={imp.id} className="space-y-2">
                <button
                  onClick={() =>
                    setExpandedImport(
                      expandedImport === imp.id ? null : imp.id
                    )
                  }
                  className={cn(
                    "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                    getStatusColor(imp.status)
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 text-left">
                      <p className="font-bold text-white">{imp.filename}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="uppercase font-bold">
                          {imp.recordsSuccessful} / {imp.recordsProcessed}{" "}
                          records
                        </span>
                        {imp.recordsFailed > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-rose-500">
                              {imp.recordsFailed} failed
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold uppercase">
                        {successRate.toFixed(0)}% success
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-1">
                        {imp.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {imp.status === "processing" && (
                    <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${(imp.recordsProcessed / imp.recordsProcessed) * 100}%` }}
                      />
                    </div>
                  )}
                </button>

                {/* Expanded Details */}
                {expandedImport === imp.id && (
                  <div className="pl-4 space-y-2">
                    <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[10px] text-zinc-600 uppercase mb-1">
                            Successful
                          </p>
                          <p className="text-sm font-bold text-emerald-500">
                            {imp.recordsSuccessful.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-600 uppercase mb-1">
                            Failed
                          </p>
                          <p className="text-sm font-bold text-rose-500">
                            {imp.recordsFailed.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {imp.errors && imp.errors.length > 0 && (
                        <div>
                          <p className="text-[10px] text-zinc-600 uppercase mb-2">
                            Errors ({imp.errors.length})
                          </p>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {imp.errors.map((error, idx) => (
                              <p
                                key={idx}
                                className="text-[10px] text-rose-400 font-mono"
                              >
                                • {error}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          Export & Import Tips
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>
            CSV format is best for spreadsheet tools (Excel, Google Sheets)
          </li>
          <li>
            JSON format is best for data backups and API integrations
          </li>
          <li>
            Schedule recurring exports to stay current with data backups
          </li>
          <li>
            Import validates data before processing to prevent errors
          </li>
          <li>
            Failed imports show detailed errors for manual correction
          </li>
        </ul>
      </div>
    </div>
  );
}
