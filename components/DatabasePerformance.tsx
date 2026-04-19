"use client";

import {
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QueryMetric {
  query: string;
  avgTime: number;
  count: number;
  slowCount: number;
  status: "healthy" | "warning" | "critical";
}

interface DatabasePerformanceProps {
  queries?: QueryMetric[];
  connectionPoolStats?: {
    active: number;
    idle: number;
    max: number;
    utilization: number;
  };
  replicationLag?: number;
  backupStatus?: "healthy" | "warning" | "critical";
  lastBackup?: Date;
}

const defaultQueries: QueryMetric[] = [
  {
    query: "SELECT * FROM users WHERE id = ?",
    avgTime: 2.1,
    count: 12543,
    slowCount: 0,
    status: "healthy",
  },
  {
    query: "SELECT * FROM videos WHERE category = ?",
    avgTime: 45.3,
    count: 2847,
    slowCount: 142,
    status: "warning",
  },
  {
    query: "SELECT * FROM users JOIN profiles ON...",
    avgTime: 128.5,
    count: 1243,
    slowCount: 523,
    status: "critical",
  },
  {
    query: "SELECT COUNT(*) FROM transactions WHERE...",
    avgTime: 8.7,
    count: 5643,
    slowCount: 12,
    status: "healthy",
  },
  {
    query: "SELECT * FROM moderation_queue ORDER BY...",
    avgTime: 23.4,
    count: 847,
    slowCount: 34,
    status: "healthy",
  },
];

const defaultConnectionPool = {
  active: 24,
  idle: 6,
  max: 30,
  utilization: 80,
};

export function DatabasePerformance({
  queries = defaultQueries,
  connectionPoolStats = defaultConnectionPool,
  replicationLag = 0.2,
  backupStatus = "healthy",
  lastBackup = new Date(Date.now() - 3600000),
}: DatabasePerformanceProps) {
  const slowQueries = queries.filter((q) => q.status === "critical");
  const warningQueries = queries.filter((q) => q.status === "warning");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Database Performance</h3>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Connection Pool */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-600 uppercase">
            Connection Pool
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-white">
              {connectionPoolStats.active}/{connectionPoolStats.max}
            </p>
            <p className="text-[10px] text-zinc-600">active</p>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                connectionPoolStats.utilization > 90
                  ? "bg-rose-500"
                  : connectionPoolStats.utilization > 70
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              )}
              style={{
                width: `${connectionPoolStats.utilization}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-zinc-600">
            {connectionPoolStats.utilization}% utilized
          </p>
        </div>

        {/* Replication Lag */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-600 uppercase">
            Replication Lag
          </p>
          <p className="text-2xl font-black text-white">{replicationLag}ms</p>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold uppercase w-fit",
              replicationLag < 5
                ? "bg-emerald-500/10 text-emerald-500"
                : replicationLag < 50
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-rose-500/10 text-rose-500"
            )}
          >
            {replicationLag < 5 ? "Synced" : "Lagging"}
          </div>
        </div>

        {/* Backup Status */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-600 uppercase">
            Backup Status
          </p>
          <div
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg w-fit",
              backupStatus === "healthy"
                ? "bg-emerald-500/10 text-emerald-500"
                : backupStatus === "warning"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-rose-500/10 text-rose-500"
            )}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase">
              {backupStatus === "healthy"
                ? "Healthy"
                : backupStatus === "warning"
                  ? "Warning"
                  : "Critical"}
            </span>
          </div>
          <p className="text-[10px] text-zinc-600">
            Last: {lastBackup.toLocaleTimeString()}
          </p>
        </div>

        {/* Query Issues */}
        <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-600 uppercase">
            Problem Queries
          </p>
          <p className="text-2xl font-black text-rose-500">{slowQueries.length}</p>
          <p className="text-[10px] text-zinc-600">
            {warningQueries.length} warnings
          </p>
        </div>
      </div>

      {/* Slow Queries */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Slow Queries
        </h4>
        <div className="space-y-2">
          {queries
            .sort((a, b) => b.avgTime - a.avgTime)
            .slice(0, 5)
            .map((query, idx) => (
              <div
                key={idx}
                className={cn(
                  "glass-card rounded-xl border-2 p-4 space-y-2",
                  query.status === "healthy"
                    ? "border-emerald-500/20 bg-white/[0.02]"
                    : query.status === "warning"
                      ? "border-amber-500/20 bg-amber-500/[0.03]"
                      : "border-rose-500/20 bg-rose-500/[0.03]"
                )}
              >
                {/* Query Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-white truncate">
                      {query.query}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                      <span>{query.count.toLocaleString()} calls</span>
                      <span>•</span>
                      <span className="font-mono">{query.avgTime}ms avg</span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex-shrink-0",
                      query.status === "healthy"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : query.status === "warning"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-rose-500/10 text-rose-500"
                    )}
                  >
                    {query.slowCount > 0 && `${query.slowCount} slow`}
                  </div>
                </div>

                {/* Performance Bar */}
                {query.slowCount > 0 && (
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        query.status === "healthy"
                          ? "bg-emerald-500"
                          : query.status === "warning"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      )}
                      style={{
                        width: `${Math.min(
                          (query.slowCount / query.count) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Index Recommendations */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <Zap className="h-3 w-3" />
          Index Recommendations
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>
            Add composite index on (category, created_at) for video queries
          </li>
          <li>Create index on user_profiles.user_id for join optimization</li>
          <li>Add BTREE index on transactions.status for filtering</li>
          <li>Consider partitioning moderation_queue by created_date</li>
        </ul>
      </div>

      {/* Performance Tips */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
        <p className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2">
          <AlertTriangle className="h-3 w-3" />
          Performance Tips
        </p>
        <ul className="text-[10px] text-amber-400 space-y-1 ml-5 list-disc">
          <li>Use query result caching for frequently accessed data</li>
          <li>Implement pagination to avoid large result sets</li>
          <li>Monitor connection pool for contention issues</li>
          <li>Regular VACUUM/ANALYZE to maintain query planner accuracy</li>
        </ul>
      </div>
    </div>
  );
}
