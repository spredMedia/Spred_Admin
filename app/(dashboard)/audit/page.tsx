"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuditLog } from "@/components/AuditLog";
import { SessionManager } from "@/components/SessionManager";
import { AdminSecurityPanel } from "@/components/AdminSecurityPanel";
import { ComplianceReports } from "@/components/ComplianceReports";
import { PermissionMatrix } from "@/components/PermissionMatrix";

export default function AuditHub() {
  const [activeTab, setActiveTab] = useState<
    "logs" | "sessions" | "security" | "compliance" | "permissions"
  >("logs");

  const tabs = [
    { id: "logs", label: "Activity Logs" },
    { id: "sessions", label: "Sessions" },
    { id: "security", label: "Security Settings" },
    { id: "compliance", label: "Compliance" },
    { id: "permissions", label: "Permissions" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Audit <span className="text-primary">Hub</span>
          </h1>
        </div>
        <p className="text-zinc-500 font-medium tracking-tight">
          Comprehensive security, compliance, and administrative management.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass-card rounded-2xl border-white/10 p-6">
        {activeTab === "logs" && <AuditLog />}
        {activeTab === "sessions" && <SessionManager />}
        {activeTab === "security" && <AdminSecurityPanel />}
        {activeTab === "compliance" && <ComplianceReports />}
        {activeTab === "permissions" && <PermissionMatrix />}
      </div>
    </div>
  );
}
