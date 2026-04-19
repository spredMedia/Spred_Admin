"use client";

import { useState } from "react";
import { Filter, Save, Trash2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedQuery {
  id: string;
  name: string;
  description: string;
  filters: FilterCondition[];
  resultCount: number;
  createdAt: Date;
  lastRun?: Date;
  runCount: number;
}

interface FilterCondition {
  field: string;
  operator: "=" | ">" | "<" | ">=" | "<=" | "contains" | "in" | "between";
  value: string | number | string[];
  logicOperator?: "AND" | "OR";
}

const mockSavedQueries: SavedQuery[] = [
  {
    id: "query_001",
    name: "High-Performance Devices",
    description: "Devices with >95% success rate AND >5.5 MB/s speed",
    filters: [
      { field: "successRate", operator: ">", value: 95 },
      { field: "avgSpeed", operator: ">", value: 5.5, logicOperator: "AND" },
    ],
    resultCount: 2847,
    createdAt: new Date(Date.now() - 30 * 86400000),
    lastRun: new Date(Date.now() - 3600000),
    runCount: 47,
  },
  {
    id: "query_002",
    name: "North America Revenue Leaders",
    description: "Top earners in North America with >$5K monthly earnings",
    filters: [
      { field: "region", operator: "=", value: "North America" },
      { field: "monthlyEarnings", operator: ">", value: 5000, logicOperator: "AND" },
    ],
    resultCount: 156,
    createdAt: new Date(Date.now() - 60 * 86400000),
    lastRun: new Date(Date.now() - 86400000),
    runCount: 23,
  },
  {
    id: "query_003",
    name: "Problem Devices",
    description: "Devices with low success rate (<85%) OR high latency (>25ms)",
    filters: [
      { field: "successRate", operator: "<", value: 85 },
      { field: "avgLatency", operator: ">", value: 25, logicOperator: "OR" },
    ],
    resultCount: 432,
    createdAt: new Date(Date.now() - 45 * 86400000),
    lastRun: new Date(Date.now() - 7200000),
    runCount: 112,
  },
];

const availableFields = [
  { name: "successRate", label: "Success Rate (%)", type: "number" },
  { name: "avgSpeed", label: "Avg Speed (MB/s)", type: "number" },
  { name: "avgLatency", label: "Avg Latency (ms)", type: "number" },
  { name: "bandwidth", label: "Bandwidth (Mbps)", type: "number" },
  { name: "deviceCount", label: "Device Count", type: "number" },
  { name: "region", label: "Region", type: "string" },
  { name: "osVersion", label: "OS Version", type: "string" },
  { name: "performanceTier", label: "Performance Tier", type: "string" },
  { name: "monthlyEarnings", label: "Monthly Earnings ($)", type: "number" },
  { name: "transferVolume", label: "Transfer Volume", type: "number" },
];

export function AdvancedQueryBuilder() {
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"saved" | "builder">("saved");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Advanced Query Builder</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Saved Queries</p>
          <p className="text-3xl font-black text-primary">{mockSavedQueries.length}</p>
          <p className="text-[10px] text-zinc-600">available</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Total Executions</p>
          <p className="text-3xl font-black text-blue-500">
            {mockSavedQueries.reduce((a, b) => a + b.runCount, 0).toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-600">all-time</p>
        </div>

        <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase">Avg Results</p>
          <p className="text-3xl font-black text-emerald-500">
            {Math.round(mockSavedQueries.reduce((a, b) => a + b.resultCount, 0) / mockSavedQueries.length).toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-600">per query</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        {["saved", "builder"].map((tab) => (
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
            {tab === "saved" ? "💾 Saved Queries" : "🔨 Query Builder"}
          </button>
        ))}
      </div>

      {/* Saved Queries */}
      {activeTab === "saved" && (
        <div className="space-y-3">
          {mockSavedQueries.map((query) => (
            <div key={query.id} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedQueryId(
                    expandedQueryId === query.id ? null : query.id
                  )
                }
                className="w-full glass-card rounded-xl border-white/10 p-4 transition-all hover:bg-white/[0.03] border-2"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">💾</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{query.name}</p>
                        <p className="text-xs text-zinc-600 mt-1">{query.description}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-primary text-white">
                      {query.resultCount.toLocaleString()} results
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-600">
                    <div>
                      <span className="text-zinc-400">Filters:</span> {query.filters.length}
                    </div>
                    <div>
                      <span className="text-zinc-400">Executions:</span> {query.runCount}
                    </div>
                    <div>
                      <span className="text-zinc-400">Last Run:</span>{" "}
                      {query.lastRun
                        ? Math.round((Date.now() - query.lastRun.getTime()) / 3600000) + "h ago"
                        : "Never"}
                    </div>
                  </div>
                </div>
              </button>

              {expandedQueryId === query.id && (
                <div className="pl-4 space-y-2">
                  <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                    {/* Filter Details */}
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">🔍 Query Conditions</p>
                      <div className="space-y-2 text-[10px]">
                        {query.filters.map((filter, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded">
                            <span className="font-bold text-zinc-400">{idx > 0 ? filter.logicOperator : ""}</span>
                            <span className="font-bold text-white">
                              {availableFields.find((f) => f.name === filter.field)?.label}
                            </span>
                            <span className="text-zinc-500">{filter.operator}</span>
                            <span className="font-bold text-blue-500">
                              {Array.isArray(filter.value) ? filter.value.join(", ") : filter.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2">📊 Usage Stats</p>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Total Executions:</span>
                          <span className="font-bold text-white">{query.runCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Results Per Run:</span>
                          <span className="font-bold text-blue-500">{query.resultCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Created:</span>
                          <span className="font-bold text-zinc-400">{query.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-600">Last Run:</span>
                          <span className="font-bold text-white">{query.lastRun?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-white/10 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-primary text-white hover:bg-primary/80 transition-all flex items-center justify-center gap-1">
                        <Play className="h-3 w-3" /> Run Query
                      </button>
                      <button className="flex-1 px-3 py-2 text-[10px] font-bold rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-all">
                        Export
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

          <button className="w-full px-4 py-3 text-sm font-bold rounded-xl bg-primary text-white hover:bg-primary/80 transition-all">
            + Create New Query
          </button>
        </div>
      )}

      {/* Query Builder */}
      {activeTab === "builder" && (
        <div className="space-y-4">
          <div className="glass-card rounded-xl border-white/10 p-6 space-y-4">
            <p className="text-sm font-bold text-white">🔨 Build Custom Query</p>

            {/* Query Name */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-600 uppercase">Query Name</p>
              <input
                type="text"
                placeholder="e.g., High-Performance Devices"
                className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filter Conditions */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-zinc-600 uppercase">Filter Conditions</p>

              {/* Sample Filter Row */}
              <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-600">Field</p>
                    <select className="w-full px-2 py-2 text-sm rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary">
                      <option value="">Select Field...</option>
                      {availableFields.map((field) => (
                        <option key={field.name} value={field.name}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-600">Operator</p>
                    <select className="w-full px-2 py-2 text-sm rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary">
                      <option value="=">=</option>
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                      <option value=">=">&gt;=</option>
                      <option value="<=">&lt;=</option>
                      <option value="contains">contains</option>
                      <option value="in">in</option>
                      <option value="between">between</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-600">Value</p>
                    <input
                      type="text"
                      placeholder="e.g., 95"
                      className="w-full px-2 py-2 text-sm rounded bg-white/10 border border-white/20 text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select className="px-2 py-1 text-[10px] rounded bg-white/10 border border-white/20 text-white focus:outline-none focus:border-primary">
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                  <button className="ml-auto px-3 py-1 text-[10px] font-bold rounded bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 transition-all">
                    Remove
                  </button>
                </div>
              </div>

              <button className="w-full px-3 py-2 text-[10px] font-bold rounded bg-white/10 text-zinc-300 hover:bg-white/20 transition-all">
                + Add Condition
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex gap-2">
              <button className="flex-1 px-4 py-2 text-sm font-bold rounded bg-primary text-white hover:bg-primary/80 transition-all flex items-center justify-center gap-2">
                <Play className="h-4 w-4" /> Run Query
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-bold rounded bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2">
                <Save className="h-4 w-4" /> Save Query
              </button>
            </div>
          </div>

          {/* Available Fields Reference */}
          <div className="glass-card rounded-xl border-white/10 p-4 space-y-2">
            <p className="text-[10px] font-bold text-zinc-600 uppercase">📋 Available Fields</p>
            <div className="grid grid-cols-2 gap-2">
              {availableFields.map((field) => (
                <div key={field.name} className="text-[10px] p-2 rounded bg-white/5 border border-white/10">
                  <p className="font-bold text-white">{field.label}</p>
                  <p className="text-zinc-500">{field.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">ℹ️ Query Features</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>🔍 Build complex queries with multiple conditions</li>
          <li>🧩 AND/OR logic for flexible filtering</li>
          <li>💾 Save frequently used queries for quick access</li>
          <li>📊 See result count before running</li>
          <li>📈 Track query execution history</li>
          <li>📥 Export query results in multiple formats</li>
        </ul>
      </div>
    </div>
  );
}
