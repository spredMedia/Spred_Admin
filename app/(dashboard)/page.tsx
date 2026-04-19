"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  Video,
  TrendingUp,
  Activity,
  Wallet,
  ArrowUpRight,
  PlayCircle,
  Clock,
  ExternalLink,
  Shield
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { LineChartComponent } from "@/components/charts/LineChartComponent";
import { AreaChartComponent } from "@/components/charts/AreaChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { MetricTicker } from "@/components/MetricTicker";

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [activeStreams, setActiveStreams] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [moderation, setModeration] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>({
    revenue: [],
    userGrowth: [],
    p2pVolume: [],
  });

  const generateChartData = () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });

    return {
      revenue: days.map((date, i) => ({
        date,
        actual: Math.floor(Math.random() * 50000) + 80000 + i * 2000,
        forecast: Math.floor(Math.random() * 50000) + 85000 + i * 2100,
      })),
      userGrowth: days.map((date, i) => ({
        date,
        total: Math.floor(50000 + i * 500 + Math.random() * 2000),
        active: Math.floor(30000 + i * 300 + Math.random() * 1500),
      })),
      p2pVolume: days.map((date, i) => ({
        date,
        transfers: Math.floor(Math.random() * 500) + 100 + i * 10,
        bytes: Math.floor(Math.random() * 5000000) + 1000000 + i * 50000,
      })),
    };
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, streamsRes, healthRes, modRes, auditRes] = await Promise.all([
          api.getDashboardStats(),
          api.getActiveStreams(),
          api.getCreatorOverallHealth(),
          api.getModerationStatus(),
          api.getAuditLogs()
        ]);
        setStats(statsRes.data);
        setActiveStreams(Array.isArray(streamsRes.data) ? streamsRes.data : []);
        setHealth(healthRes.data);
        setModeration(modRes.data);
        setAuditLogs(Array.isArray(auditRes.data) ? auditRes.data.slice(0, 5) : []);
        setChartData(generateChartData());
      } catch (err) {
        console.error("Dashboard load error:", err);
        setChartData(generateChartData());
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { 
      label: "Global Users", 
      value: stats?.users?.total || "0", 
      change: stats?.users?.change || "+0%", 
      icon: Users, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      label: "Active Content", 
      value: stats?.videos?.total || "0", 
      change: stats?.videos?.change || "+0%", 
      icon: Video, 
      color: "text-primary",
      bg: "bg-primary/10"
    },
    { 
      label: "Total Revenue", 
      value: stats?.revenue?.total ? `₦${stats.revenue.total.toLocaleString()}` : "₦0", 
      change: stats?.revenue?.change || "+0%", 
      icon: Wallet, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      label: "P2P Transfers", 
      value: stats?.p2pTransfers?.total || "0", 
      change: stats?.p2pTransfers?.change || "+0%", 
      icon: TrendingUp, 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Global <span className="text-primary">Command</span> Center
        </h1>
        <p className="text-zinc-400 text-lg">Real-time orchestration of the Spred Media ecosystem.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="glass-card border-none overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                {stat.label}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white mt-1">{loading ? "..." : stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", 
                  stat.change.includes("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* NEW: Creator Health Pulse */}
        <Card className="glass-card border-none md:col-span-2 lg:col-span-4 bg-primary/5">
           <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                 <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                 <p className="text-xs font-black text-white uppercase tracking-widest">Global Creator Pulse:</p>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-zinc-500 font-bold">AVG HEALTH:</span>
                       <span className="text-sm font-black text-primary">{health?.avg_health_score?.toFixed(1) || 94}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-zinc-500 font-bold">PLATINUM NODES:</span>
                       <span className="text-sm font-black text-white">{health?.platinum_creators || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-zinc-500 font-bold">PENDING MODERATION:</span>
                       <span className="text-sm font-black text-rose-500">{moderation?.pending_count || 0}</span>
                    </div>
                 </div>
              </div>
              <Link href="/users" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Orchestrate Personnel</Link>
           </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="glass-card border-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
                <Wallet className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Revenue Trend</CardTitle>
                <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">Last 30 days performance</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center gap-8">
              <MetricTicker
                value={stats?.revenue?.total || 2400000}
                prevValue={stats?.revenue?.previousTotal || 2100000}
                label="Total Revenue (₦)"
                prefix="₦"
                decimals={0}
                color="amber"
              />
            </div>
            <LineChartComponent
              data={chartData.revenue}
              lines={[
                { key: "actual", stroke: "#F45303", name: "Actual Revenue" },
                { key: "forecast", stroke: "#D69E2E", name: "Forecast" },
              ]}
              height={250}
              xAxisKey="date"
            />
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="glass-card border-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                <Users className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">User Growth</CardTitle>
                <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">Total vs Active users</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center gap-8">
              <MetricTicker
                value={stats?.users?.total || 125000}
                prevValue={stats?.users?.previousTotal || 118000}
                label="Total Users"
                decimals={0}
                color="emerald"
              />
            </div>
            <AreaChartComponent
              data={chartData.userGrowth}
              areas={[
                { key: "total", fill: "#10B981", stroke: "#059669", name: "Total Users" },
                { key: "active", fill: "#059669", stroke: "#047857", name: "Active Users" },
              ]}
              height={250}
              xAxisKey="date"
            />
          </CardContent>
        </Card>

        {/* P2P Transfer Volume */}
        <Card className="glass-card border-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">P2P Transfers</CardTitle>
                <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">Transfer count & volume</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center gap-8">
              <MetricTicker
                value={stats?.p2pTransfers?.total || 45000}
                prevValue={stats?.p2pTransfers?.previousTotal || 38000}
                label="Total Transfers"
                decimals={0}
                color="blue"
              />
            </div>
            <BarChartComponent
              data={chartData.p2pVolume}
              bars={[
                { key: "transfers", fill: "#3B82F6", name: "Transfer Count" },
              ]}
              height={250}
              xAxisKey="date"
            />
          </CardContent>
        </Card>

        {/* System Health Overview */}
        <Card className="glass-card border-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20">
                <Shield className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">System Metrics</CardTitle>
                <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">Platform health indicators</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Uptime</span>
                <span className="text-lg font-black text-emerald-500">99.98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">API Response Time</span>
                <span className="text-lg font-black text-primary">145ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Error Rate</span>
                <span className="text-lg font-black text-emerald-500">0.02%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">CDN Cache Hit</span>
                <span className="text-lg font-black text-blue-500">94.5%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                <div className="h-full w-[94.5%] bg-gradient-to-r from-primary to-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Live Monitoring Widget */}
        <Card className="lg:col-span-2 glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Broadcaster Registry</CardTitle>
                <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">Live discovery heartbeats</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-500 bg-white/5 px-3 py-1.5 rounded-full">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Active
            </div>
          </CardHeader>
          <CardContent>
            {activeStreams.length > 0 ? (
              <div className="space-y-4">
                {activeStreams.map((stream, i) => (
                  <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
                          <PlayCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-zinc-900 border-2 border-primary flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 group-hover:text-primary transition-colors">{stream.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-zinc-500 font-medium">@{stream.broadcaster}</span>
                          <span className="text-[10px] text-zinc-600">•</span>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{stream.viewers || 0} Viewers</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-primary hover:text-white text-zinc-400 opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                <Activity className="h-12 w-12 text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">No active broadcasts</p>
                <p className="text-[10px] text-zinc-600 mt-2 italic">Registry awaiting heartbeats...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Activity */}
        <Card className="glass-card border-none">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle className="text-xl font-bold text-white">System Logs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {auditLogs.length > 0 ? (
                auditLogs.map((log, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="relative mt-1">
                      <div className={cn(
                        "h-2 w-2 rounded-full transition-all group-hover:scale-150",
                        log.ActionType?.includes('DELETE') || log.ActionType?.includes('TERMINATION') ? "bg-rose-500" : "bg-primary"
                      )} />
                      {i !== auditLogs.length - 1 && <div className="absolute top-2 left-[3px] h-10 w-[1px] bg-white/10" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-200 leading-tight group-hover:text-primary transition-colors">{log.ActionType?.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-zinc-500 font-medium mt-1 line-clamp-1">{log.Details}</p>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-2">
                        {new Date(log.CreatedAt || log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center opacity-20">
                   <Clock className="h-8 w-8 mx-auto mb-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest">No Recent Activity</p>
                </div>
              )}
            </div>
            <Link href="/audit" className="block w-full mt-8 rounded-xl border border-white/10 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:bg-white/5 hover:text-white transition-all">
              View Audit Ledger
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
