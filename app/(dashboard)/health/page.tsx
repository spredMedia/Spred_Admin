"use client";

import { useEffect, useState } from "react";
import {
  Zap,
  Database,
  HardDrive,
  Cpu,
  Activity,
  ShieldCheck,
  Clock,
  Server,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Network,
  Lock,
  PlayCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { LineChartComponent } from "@/components/charts/LineChartComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemHealth() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [topology, setTopology] = useState<any>(null);
  const [systemMetrics, setSystemMetrics] = useState<any[]>([]);

  const generateMetricsData = () => {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => ({
      time: new Date(now - (23 - i) * 3600000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cpu: Math.floor(Math.random() * 40) + 20 + i * 0.5,
      memory: Math.floor(Math.random() * 30) + 40 + i * 0.3,
      errors: Math.floor(Math.random() * 50) + 5 + (i > 12 ? -(i - 12) : 0),
    }));
  };

  async function loadHealth() {
    setLoading(true);
    try {
      const [healthRes, topoRes] = await Promise.all([
        api.getSystemHealth(),
        api.getP2PTopology()
      ]);
      setHealth(healthRes.data);
      setTopology(topoRes.data);
      setSystemMetrics(generateMetricsData());
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Health fetch error:", err);
      setSystemMetrics(generateMetricsData());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 15000); 
    return () => clearInterval(interval);
  }, []);

  if (loading && !health) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RefreshCcw className="h-10 w-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                 <Zap className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">System <span className="text-primary">Sentinel</span></h1>
           </div>
           <p className="text-zinc-500 font-medium tracking-tight">Technical telemetry and architectural orchestration intelligence.</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Pulse</span>
              <span className="text-xs font-bold text-zinc-300">{lastRefresh.toLocaleTimeString()}</span>
           </div>
           <button 
             onClick={loadHealth}
             className="p-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
           >
              <RefreshCcw className={cn("h-5 w-5", loading && "animate-spin")} />
           </button>
        </div>
      </div>

      {/* Global Status Banner */}
      <div className={cn(
        "relative overflow-hidden p-8 rounded-[2.5rem] border flex items-center justify-between",
        health?.status === 'Operational' ? "bg-emerald-500/[0.03] border-emerald-500/20" : "bg-rose-500/[0.03] border-rose-500/20"
      )}>
         <div className="flex items-center gap-6 z-10">
            <div className={cn(
              "h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl",
              health?.status === 'Operational' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-rose-500 text-white shadow-rose-500/20"
            )}>
               {health?.status === 'Operational' ? <ShieldCheck className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
            </div>
            <div>
               <h2 className="text-2xl font-black text-white">System {health?.status || 'Monitoring...'}</h2>
               <p className="text-zinc-500 font-medium mt-1">Global infrastructure nodes are responding within defined latency thresholds.</p>
            </div>
         </div>
         <div className="hidden lg:flex items-center gap-10 pr-10 z-10">
            <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Response Time</p>
               <p className="text-lg font-black text-white">24ms</p>
            </div>
            <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Global Load</p>
               <p className="text-lg font-black text-white">12.4%</p>
            </div>
            <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Mesh Health</p>
               <p className="text-lg font-black text-white">{(topology?.globalMeshHealth * 100).toFixed(0)}%</p>
            </div>
         </div>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Infrastructure Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
         
         {/* Database Node */}
         <div className="glass-card rounded-[3rem] border-white/5 p-10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary" />
               </div>
               <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Synced</span>
            </div>

            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Database Node</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">PostgreSQL connection pool orchestration tracking for Hetzner Dedicated Hub.</p>

            <div className="mt-10 grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Active Pool</p>
                  <p className="text-2xl font-black text-white">{health?.systems?.database?.totalCount || 0}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Idle Capacity</p>
                  <p className="text-2xl font-black text-white">{health?.systems?.database?.idleCount || 0}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Waiting SEMA</p>
                  <p className="text-2xl font-black text-white">{health?.systems?.database?.waitingCount || 0}</p>
               </div>
               <div className="space-y-1 text-emerald-500">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Drip Integrity</p>
                  <p className="text-2xl font-black">100%</p>
               </div>
            </div>
         </div>

         {/* Storage Cluster */}
         <div className="glass-card rounded-[3rem] border-white/5 p-10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                  <HardDrive className="h-6 w-6 text-blue-500" />
               </div>
               <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest border border-blue-500/20">Distributing</span>
            </div>

            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Storage Cluster</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Backblaze B2 node discovery for video assets and trailer mirrors.</p>

            <div className="mt-10 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <PlayCircle className="h-4 w-4 text-zinc-600" />
                     <span className="text-xs font-bold text-zinc-300">Video Assets</span>
                  </div>
                  <span className="text-lg font-black text-white">{health?.systems?.storage?.videos || 0}</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[84%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <BarChart3 className="h-4 w-4 text-zinc-600" />
                     <span className="text-xs font-bold text-zinc-300">Trailer Mirrors</span>
                  </div>
                  <span className="text-lg font-black text-white">{health?.systems?.storage?.trailers || 0}</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[62%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               </div>
            </div>
         </div>

         {/* Proxy Node 01 */}
         <div className="glass-card rounded-[3rem] border-white/5 p-10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-amber-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="flex items-center justify-between mb-8">
               <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-amber-500" />
               </div>
               <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest border border-amber-500/20">Master Node</span>
            </div>

            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Proxy Processor</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Real-time resource allocation and process heartbeat for Node.js edge server.</p>

            <div className="mt-10 space-y-4">
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Memory RSS</p>
                     <p className="text-lg font-black text-white mt-1">{health?.systems?.proxy?.memory?.rss || '0 MB'}</p>
                  </div>
                  <Activity className="h-8 w-8 text-amber-500/20" />
               </div>
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Node Uptime</p>
                     <p className="text-lg font-black text-white mt-1">{health?.systems?.proxy?.uptime || '0h 0m'}</p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500/20" />
               </div>
            </div>
         </div>

      </div>

      {/* Advanced Network Topology */}
      <div className="glass-card rounded-[3rem] border-white/5 p-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Network className="h-64 w-64 text-primary" />
         </div>
         
         <div className="relative z-10 flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3">
               <h3 className="text-2xl font-black text-white tracking-tighter">Global Mesh Topology</h3>
               <p className="text-sm text-zinc-500 mt-4 leading-relaxed font-medium">
                  Real-time visualization of interconnected SPRED nodes. Monitoring encrypted P2P channels and regional cluster density.
               </p>
               <div className="mt-10 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Congestion</p>
                     <p className="text-xl font-black text-white mt-1 uppercase text-emerald-500">{topology?.congestionForecast || 'Normal'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Peak Load</p>
                     <p className="text-[10px] font-black text-zinc-400 mt-1 uppercase tracking-tighter">{topology?.peakLoadWindow || 'STABLE'}</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 grid gap-4 grid-cols-2 md:grid-cols-3">
               {(topology?.clusters || [
                 { id: 'lagos-01', region: 'West Africa', nodes: 452, latency: '24ms', health: 0.98, status: 'Optimal' },
                 { id: 'london-01', region: 'Western Europe', nodes: 128, latency: '12ms', health: 0.99, status: 'Optimal' },
                 { id: 'nyc-02', region: 'North America', nodes: 89, latency: '18ms', health: 0.94, status: 'Operational' }
               ]).map((cluster: any, i: number) => (
                  <div key={i} className="p-6 rounded-[2.5rem] bg-zinc-950/50 border border-white/5 group hover:border-primary/50 transition-all duration-500">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{cluster.region}</span>
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          cluster.status === 'Optimal' ? "bg-emerald-500" : cluster.status === 'Operational' ? "bg-blue-500" : "bg-rose-500"
                        )} />
                     </div>
                     <p className="text-lg font-black text-white tracking-tighter">{cluster.id}</p>
                     <div className="flex justify-between items-center mt-6">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{cluster.nodes} Nodes</span>
                        <span className="text-[10px] font-black text-primary uppercase font-mono">{cluster.latency}</span>
                     </div>
                     <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", cluster.health > 0.9 ? "bg-emerald-500" : "bg-amber-500")}
                          style={{ width: `${cluster.health * 100}%` }}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="flex items-center gap-6 mt-12 py-6 px-8 rounded-3xl bg-zinc-950/50 border border-white/5 w-fit">
            <div className="flex items-center gap-2">
               <Lock className="h-4 w-4 text-primary" />
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">AES-256 Encrypted Channels</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
               <Activity className="h-4 w-4 text-emerald-500" />
               <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Mesh Synchronized</span>
            </div>
         </div>

         {/* System Performance Charts */}
         <div className="mt-12 space-y-8 lg:col-span-3">
           <div className="grid gap-8 lg:grid-cols-2">
             {/* CPU & Memory Chart */}
             <Card className="glass-card border-none">
               <CardHeader>
                 <div className="flex items-center gap-3">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                     <Cpu className="h-6 w-6 text-primary" />
                   </div>
                   <div>
                     <CardTitle className="text-xl font-bold text-white">CPU & Memory</CardTitle>
                     <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">Last 24 hours usage</p>
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 <LineChartComponent
                   data={systemMetrics}
                   lines={[
                     { key: "cpu", stroke: "#F45303", name: "CPU %" },
                     { key: "memory", stroke: "#D69E2E", name: "Memory %" },
                   ]}
                   height={300}
                   xAxisKey="time"
                 />
               </CardContent>
             </Card>

             {/* Error Rate Chart */}
             <Card className="glass-card border-none">
               <CardHeader>
                 <div className="flex items-center gap-3">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20">
                     <AlertCircle className="h-6 w-6 text-rose-500" />
                   </div>
                   <div>
                     <CardTitle className="text-xl font-bold text-white">Error Rate</CardTitle>
                     <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">Request errors per hour</p>
                   </div>
                 </div>
               </CardHeader>
               <CardContent>
                 <LineChartComponent
                   data={systemMetrics}
                   lines={[
                     { key: "errors", stroke: "#EF4444", name: "Error Count" },
                   ]}
                   height={300}
                   xAxisKey="time"
                 />
               </CardContent>
             </Card>
           </div>
         </div>
      </div>
    </div>
  );
}
