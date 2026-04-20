"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, FileJson, File } from "lucide-react";
import {
  exportToCSV,
  exportToJSON,
  exportToPDF,
  formatAnalyticsForCSV,
} from "@/lib/analytics/exportUtils";

interface ExportModalProps {
  data: any;
  dataType: "growth" | "churn" | "segmentation" | "creator" | "cohort" | "all";
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = "csv" | "json" | "pdf";

export function ExportModal({
  data,
  dataType,
  isOpen,
  onClose,
}: ExportModalProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    setError(null);
    setSuccess(false);

    try {
      const filename = `analytics-${dataType}-${new Date().toISOString().split("T")[0]}`;

      switch (format) {
        case "csv": {
          const formatted = formatAnalyticsForCSV(
            Array.isArray(data) ? data : [data],
            dataType
          );
          exportToCSV(formatted.data, formatted.headers, { filename });
          break;
        }
        case "json": {
          exportToJSON(data, { filename });
          break;
        }
        case "pdf": {
          await exportToPDF(data, { filename });
          break;
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-card border border-white/20 w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Download className="h-5 w-5" />
            Export Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              ✓ Export completed successfully!
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-zinc-300 font-medium">Select format:</p>

            <button
              onClick={() => handleExport("csv")}
              disabled={exporting}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-5 w-5 text-blue-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-white">CSV Export</p>
                <p className="text-xs text-zinc-400">
                  Spreadsheet format for analysis
                </p>
              </div>
              {exporting && (
                <div className="ml-auto h-4 w-4 border-t-2 border-primary rounded-full animate-spin" />
              )}
            </button>

            <button
              onClick={() => handleExport("json")}
              disabled={exporting}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileJson className="h-5 w-5 text-emerald-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-white">JSON Export</p>
                <p className="text-xs text-zinc-400">
                  Structured data format
                </p>
              </div>
              {exporting && (
                <div className="ml-auto h-4 w-4 border-t-2 border-primary rounded-full animate-spin" />
              )}
            </button>

            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <File className="h-5 w-5 text-rose-400" />
              <div className="text-left">
                <p className="text-sm font-semibold text-white">PDF Report</p>
                <p className="text-xs text-zinc-400">Professional report</p>
              </div>
              {exporting && (
                <div className="ml-auto h-4 w-4 border-t-2 border-primary rounded-full animate-spin" />
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-sm font-medium transition-all"
          >
            Close
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
