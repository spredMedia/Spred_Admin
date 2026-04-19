"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntegrationManager } from "@/components/IntegrationManager";
import { ExportImportManager } from "@/components/ExportImportManager";
import { APIDocumentation } from "@/components/APIDocumentation";

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<
    "integrations" | "export-import" | "api-docs"
  >("integrations");

  const tabs = [
    { id: "integrations", label: "Integrations" },
    { id: "export-import", label: "Export & Import" },
    { id: "api-docs", label: "API Documentation" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Integrations & <span className="text-primary">Extensions</span>
          </h1>
        </div>
        <p className="text-zinc-500 font-medium tracking-tight">
          Connect external services, import/export data, and integrate with
          third-party platforms.
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
        {activeTab === "integrations" && <IntegrationManager />}
        {activeTab === "export-import" && <ExportImportManager />}
        {activeTab === "api-docs" && <APIDocumentation />}
      </div>
    </div>
  );
}
