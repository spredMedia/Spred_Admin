"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Calendar,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplianceStatus {
  framework: string;
  status: "compliant" | "warning" | "non-compliant";
  lastAudit: Date;
  nextAudit: Date;
  items: {
    requirement: string;
    status: "compliant" | "warning" | "non-compliant";
    description: string;
  }[];
}

interface DataRetention {
  dataType: string;
  retentionDays: number;
  lastPurge: Date;
  nextPurge: Date;
  recordsStored: number;
  recordsPurged: number;
}

interface ComplianceReportsProps {
  frameworks?: ComplianceStatus[];
  retention?: DataRetention[];
}

const mockFrameworks: ComplianceStatus[] = [
  {
    framework: "GDPR (EU)",
    status: "compliant",
    lastAudit: new Date(Date.now() - 2592000000),
    nextAudit: new Date(Date.now() + 7776000000),
    items: [
      {
        requirement: "Right to Access",
        status: "compliant",
        description: "Users can request and download their personal data",
      },
      {
        requirement: "Right to be Forgotten",
        status: "compliant",
        description: "User deletion system fully implemented and tested",
      },
      {
        requirement: "Data Processing Agreements",
        status: "compliant",
        description: "All third-party processors have signed DPAs",
      },
      {
        requirement: "Breach Notification",
        status: "compliant",
        description: "Notification system ready within 72 hours",
      },
    ],
  },
  {
    framework: "CCPA (California)",
    status: "compliant",
    lastAudit: new Date(Date.now() - 2592000000),
    nextAudit: new Date(Date.now() + 7776000000),
    items: [
      {
        requirement: "Consumer Rights",
        status: "compliant",
        description: "Know, delete, and opt-out mechanisms implemented",
      },
      {
        requirement: "Opt-Out Links",
        status: "compliant",
        description: "Third-party sharing opt-out available for all users",
      },
      {
        requirement: "Annual Attestation",
        status: "compliant",
        description: "Privacy policy updated and reviewed Q4 2025",
      },
    ],
  },
  {
    framework: "SOC 2 Type II",
    status: "warning",
    lastAudit: new Date(Date.now() - 5184000000),
    nextAudit: new Date(Date.now() + 2592000000),
    items: [
      {
        requirement: "Security Controls",
        status: "compliant",
        description: "Access controls and encryption verified",
      },
      {
        requirement: "Incident Response",
        status: "compliant",
        description: "IR plan tested and documented",
      },
      {
        requirement: "Audit Trails",
        status: "warning",
        description: "Audit retention needs improvement - plan for Q2 2026",
      },
    ],
  },
];

const mockRetention: DataRetention[] = [
  {
    dataType: "User Account Data",
    retentionDays: 90,
    lastPurge: new Date(Date.now() - 2592000000),
    nextPurge: new Date(Date.now() + 2678400000),
    recordsStored: 2847293,
    recordsPurged: 156234,
  },
  {
    dataType: "Activity Logs",
    retentionDays: 365,
    lastPurge: new Date(Date.now() - 7776000000),
    nextPurge: new Date(Date.now() + 6652800000),
    recordsStored: 12847293,
    recordsPurged: 2847293,
  },
  {
    dataType: "Transaction Records",
    retentionDays: 2555,
    lastPurge: new Date(Date.now() - 31536000000),
    nextPurge: new Date(Date.now() + 31536000000),
    recordsStored: 8947293,
    recordsPurged: 0,
  },
  {
    dataType: "IP Access Logs",
    retentionDays: 90,
    lastPurge: new Date(Date.now() - 7776000000),
    nextPurge: new Date(Date.now() + 2678400000),
    recordsStored: 4847293,
    recordsPurged: 3847293,
  },
  {
    dataType: "Payment Information",
    retentionDays: 180,
    lastPurge: new Date(Date.now() - 5184000000),
    nextPurge: new Date(Date.now() + 5184000000),
    recordsStored: 1247293,
    recordsPurged: 847293,
  },
];

export function ComplianceReports({
  frameworks = mockFrameworks,
  retention = mockRetention,
}: ComplianceReportsProps) {
  const [expandedFramework, setExpandedFramework] = useState<string | null>(
    null
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "non-compliant":
        return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "warning":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "non-compliant":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const compliantCount = frameworks.filter(
    (f) => f.status === "compliant"
  ).length;
  const warningCount = frameworks.filter(
    (f) => f.status === "warning"
  ).length;

  return (
    <div className="space-y-8">
      {/* Compliance Frameworks */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-white">
            Compliance Frameworks
          </h3>
        </div>

        {/* Status Summary */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-xl border-white/10 p-4">
            <p className="text-xs font-bold text-zinc-600 uppercase mb-2">
              Compliant
            </p>
            <p className="text-3xl font-black text-emerald-500">
              {compliantCount}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              of {frameworks.length} frameworks
            </p>
          </div>
          <div className="glass-card rounded-xl border-white/10 p-4">
            <p className="text-xs font-bold text-zinc-600 uppercase mb-2">
              Warnings
            </p>
            <p className="text-3xl font-black text-amber-500">
              {warningCount}
            </p>
            <p className="text-xs text-zinc-500 mt-1">requiring attention</p>
          </div>
        </div>

        {/* Framework Cards */}
        <div className="space-y-3">
          {frameworks.map((framework) => (
            <div key={framework.framework} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedFramework(
                    expandedFramework === framework.framework
                      ? null
                      : framework.framework
                  )
                }
                className={cn(
                  "w-full glass-card rounded-xl border-2 p-4 transition-all",
                  getStatusColor(framework.status)
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(framework.status)}
                    <div className="text-left">
                      <p className="font-bold text-white">
                        {framework.framework}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Last audit:{" "}
                        {framework.lastAudit.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase">
                    {framework.status === "compliant"
                      ? "Compliant"
                      : framework.status === "warning"
                        ? "Warning"
                        : "Non-Compliant"}
                  </span>
                </div>
              </button>

              {/* Expanded Items */}
              {expandedFramework === framework.framework && (
                <div className="space-y-2 pl-4">
                  {framework.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="glass-card rounded-xl border-white/10 p-3 space-y-1"
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">
                            {item.requirement}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Audit Schedule */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-600 uppercase">
            Upcoming Audits
          </p>
          <div className="space-y-2">
            {frameworks.slice(0, 2).map((framework) => (
              <div key={framework.framework} className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">
                    {framework.framework}
                  </p>
                  <p className="text-[10px] text-zinc-600">
                    {framework.nextAudit.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Data Retention Policy</h3>
        </div>

        <div className="space-y-3">
          {retention.map((policy) => {
            const daysUntilPurge = Math.ceil(
              (policy.nextPurge.getTime() - new Date().getTime()) / 86400000
            );
            const isOverdue = daysUntilPurge < 0;

            return (
              <div
                key={policy.dataType}
                className="glass-card rounded-xl border-white/10 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">
                      {policy.dataType}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                      <span>Retention: {policy.retentionDays} days</span>
                      <span>•</span>
                      <span>{policy.recordsStored.toLocaleString()} records</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase w-fit ml-auto",
                        isOverdue
                          ? "bg-rose-500/10 text-rose-500"
                          : daysUntilPurge < 30
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-emerald-500/10 text-emerald-500"
                      )}
                    >
                      {isOverdue
                        ? "Overdue"
                        : daysUntilPurge === 0
                          ? "Today"
                          : `${daysUntilPurge}d`}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          (policy.recordsPurged / policy.recordsStored) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600">
                    {policy.recordsPurged.toLocaleString()} /{" "}
                    {policy.recordsStored.toLocaleString()} purged (
                    {(
                      (policy.recordsPurged / policy.recordsStored) *
                      100
                    ).toFixed(1)}
                    %)
                  </p>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-4 text-[10px] text-zinc-600">
                  <div>
                    <p className="text-zinc-500">Last Purge</p>
                    <p className="font-mono">
                      {policy.lastPurge.toLocaleDateString()}
                    </p>
                  </div>
                  <span>→</span>
                  <div>
                    <p className="text-zinc-500">Next Purge</p>
                    <p className="font-mono">
                      {policy.nextPurge.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Reports */}
      <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
        <p className="text-sm font-bold text-white">Generate Compliance Report</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            GDPR Report
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Compliance Summary
          </button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <AlertTriangle className="h-3 w-3" />
          Compliance Tips
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Regular audits ensure compliance with evolving regulations</li>
          <li>Keep audit logs for at least 1 year per most regulations</li>
          <li>Document all data processing activities in your ROPA</li>
          <li>
            Test breach notification procedures at least annually for readiness
          </li>
          <li>Schedule compliance audits well in advance of deadlines</li>
        </ul>
      </div>
    </div>
  );
}
