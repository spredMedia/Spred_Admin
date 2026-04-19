"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Users, 
  Eye, 
  Globe, 
  ShieldAlert, 
  ExternalLink,
  Search,
  CheckCircle2,
  Lock,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";

export default function LiveMonitoring() {
  const [streams, setStreams] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Triage State
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [triageHistory, setTriageHistory] = useState<any[]>([]);
  const [triageLoading, setTriageLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  async function loadData() {
    try {
      const [streamsRes, alertsRes] = await Promise.all([
        api.getActiveStreams(),
        api.getActiveStreamAlerts()
      ]);
      setStreams(Array.isArray(streamsRes.data) ? streamsRes.data : []);
      setAlerts(Array.isArray(alertsRes.data) ? alertsRes.data : []);
    } catch (err) {
      console.error("Live fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSync() {
    setIsSyncing(true);
    try {
      await api.triggerSystemSync();
      await loadData();
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }

  async function loadTriageDetails(streamId: string) {
    setTriageLoading(true);
    try {
      const res = await api.getStreamHealthHistory(streamId, 1); // Last hour
      setTriageHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Triage fetch error:", err);
    } finally {
      setTriageLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  // Triage Heartbeat (faster polling when triage is open)
  useEffect(() => {
    if (isTriageOpen && selectedStream) {
      const streamId = selectedStream._ID || selectedStream._id || selectedStream.StreamId;
      loadTriageDetails(streamId);
      const interval = setInterval(() => loadTriageDetails(streamId), 5000);
      return () => clearInterval(interval);
    }
  }, [isTriageOpen, selectedStream]);

  const handleResolveAlert = async (alertId: string) => {
    try {
      await api.resolveStreamAlert(alertId);
      loadData();
    } catch (err) {
      console.error("Failed to resolve alert", err);
    }
  };

  const handleTerminateStream = async () => {
    if (!selectedStream) return;
    setActionLoading(true);
    try {
      const streamId = selectedStream._ID || selectedStream._id;
      await api.terminateStream(streamId);
      setIsTerminateModalOpen(false);
      setIsTriageOpen(false);
      setSelectedStream(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to terminate stream");
    } finally {
      setActionLoading(false);
    }
  };

  // SVG Sparkline Helper
  const Sparkline = ({ data, color, property }: { data: any[], color: string, property: string }) => {
    if (data.length < 2) return <div className="h-full w-full flex items-center justify-center text-[8px] text-zinc-600 uppercase font-black">Insufficient Data</div>;
    
    const values = data.map(d => parseFloat(d[property])).reverse();
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const width = 200;
    const height = 40;
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <path
          d={`M ${points}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(244,83,3,0.3)]"
        />
        <circle cx={width} cy={height - ((values[values.length-1] - min) / range) * height} r="3" fill={color} />
      </svg>
    );
  };

  return (
    <div className="relative space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">Broadcaster <span className="text-primary">Registry</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight">Active heartbeat monitoring for Global Streams.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-6 py-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">Discovery Engine Ready</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Active Nodes", val: streams.length, icon: Wifi, color: "text-emerald-500" },
          { label: "Total Audience", val: streams.reduce((acc, s) => acc + (s.viewers || 0), 0).toLocaleString(), icon: Users, color: "text-primary" },
          { label: "Security Status", val: "Hardened", icon: Lock, color: "text-blue-500" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-4">
             <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                <stat.icon className="h-6 w-6" />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.val}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white leading-tight">Sync Registry</h3>
                <p className="text-xs text-zinc-500 mt-1 font-medium">Real-time broadcaster discovery heartbeat.</p>
             </div>
          </div>
          <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
             <input 
              type="text" 
              placeholder="Filter by Broadcaster ID or Title..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
             />
          </div>
        </div>

        <div className="p-8">
           {loading ? (
             <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)}
             </div>
           ) : streams.length > 0 ? (
             <div className="grid gap-6">
                {streams.map((stream, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                        setSelectedStream(stream);
                        setIsTriageOpen(true);
                    }}
                    className={cn(
                        "group relative glass-card p-6 rounded-[2rem] border-white/10 hover:border-primary/50 cursor-pointer transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden",
                        selectedStream?._id === stream._id && isTriageOpen && "border-primary bg-primary/[0.02]"
                    )}
                  >
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-24 w-24 text-primary" />
                     </div>
                     
                     <div className="flex items-center gap-6">
                        <div className="relative">
                           <div className="h-16 w-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10 overflow-hidden">
                              <Globe className="h-8 w-8 text-zinc-700" />
                              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </div>
                           <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-zinc-950 border-2 border-primary flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                           </div>
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <h4 className="text-lg font-black text-white group-hover:text-primary transition-colors">{stream.title}</h4>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">LIVE</span>
                           </div>
                           <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5">
                                 <Users className="h-3 w-3 text-zinc-500" />
                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">@{stream.broadcaster}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <Eye className="h-3 w-3 text-primary" />
                                 <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-widest">{(stream.viewers || 0).toLocaleString()} Viewing</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 relative z-10">
                         <div className="text-right hidden md:block mr-10">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1.5">Stability Pulse</p>
                            <div className="flex items-center gap-2 justify-end">
                               <div className="flex gap-0.5">
                                  {Array(5).fill(0).map((_, idx) => (
                                     <div key={idx} className={cn("h-3 w-1 rounded-sm", idx < 4 ? "bg-emerald-500" : "bg-emerald-500/20")} />
                                  ))}
                               </div>
                               <span className="text-xs font-bold text-zinc-200 uppercase tracking-tighter">Optimal</span>
                            </div>
                         </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStream(stream);
                                    setIsTerminateModalOpen(true);
                                }}
                                className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white p-4 rounded-2xl transition-all shadow-xl shadow-black/20 group-hover:-translate-y-1"
                            >
                                <ShieldAlert className="h-5 w-5" />
                            </button>
                            <button className="bg-white/5 hover:bg-primary text-zinc-400 hover:text-white p-4 rounded-2xl transition-all shadow-xl shadow-black/20 group-hover:-translate-y-1">
                                <ExternalLink className="h-5 w-5" />
                            </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-32 flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                <WifiOff className="h-16 w-16 text-zinc-800 mb-6" />
                <div className="text-center">
                   <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-sm">Silence in the Aether</p>
                   <p className="text-[10px] text-zinc-700 mt-2 font-medium">Monitoring Spred Registry for active broadcaster heartbeats...</p>
                </div>
                <button 
                    onClick={handleManualSync} 
                    disabled={isSyncing}
                    className={cn(
                        "mt-10 px-6 py-2 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest transition-all",
                        isSyncing ? "bg-primary/20 text-primary cursor-wait" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                    )}
                >
                   {isSyncing ? "SYNCING CLUSTERS..." : "Manual Re-Sync"}
                </button>
             </div>
           )}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="glass-card rounded-[2.5rem] border-rose-500/10 overflow-hidden">
          <div className="p-8 border-b border-rose-500/10 bg-rose-500/[0.02] flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-rose-500" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white leading-tight">Active Alert Hub</h3>
                <p className="text-xs text-rose-400 mt-1 font-medium">{alerts.length} unresolved system anomalies detected.</p>
             </div>
          </div>
          <div className="p-4">
            <div className="grid gap-3">
              {alerts.map((alert, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-start md:items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl",
                      alert.Severity === 'critical' ? "bg-rose-500/10 text-rose-500" :
                      alert.Severity === 'warning' ? "bg-amber-500/10 text-amber-500" :
                      "bg-blue-500/10 text-blue-500"
                    )}>
                      {alert.Severity === 'critical' ? <ShieldAlert className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white uppercase tracking-tight">{alert.AlertType.replace('_', ' ')}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                          alert.Severity === 'critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                          alert.Severity === 'warning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        )}>
                          {alert.Severity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        Stream Edge: <span className="text-zinc-300 font-mono">{alert.StreamId}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Trigger Value</p>
                      <span className="text-sm font-bold text-white">{alert.TriggerValue} <span className="text-xs text-zinc-500">/ Threshold: {alert.Threshold}</span></span>
                    </div>

                    <button 
                      onClick={() => {
                          const stream = streams.find(s => (s._ID || s._id) === alert.StreamId);
                          if (stream) {
                              setSelectedStream(stream);
                              setIsTriageOpen(true);
                          }
                      }}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:bg-primary hover:text-white hover:border-primary text-xs font-bold text-zinc-400 capitalize transition-all"
                    >
                      Deep Triage
                    </button>
                    <button 
                      onClick={() => handleResolveAlert(alert.Id)}
                      className="px-2 py-2 text-zinc-600 hover:text-emerald-500 transition-colors"
                      title="Mark as Resolved"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Triage Side Panel */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-full md:w-[450px] bg-zinc-950 border-l border-white/5 z-50 transform transition-transform duration-500 ease-in-out shadow-2xl",
        isTriageOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Activity className="h-7 w-7 text-primary animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Forensic Triage</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Real-time Stream Intelligence</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsTriageOpen(false)}
                    className="p-3 rounded-xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                >
                    <span className="text-xs font-black">CLOSE</span>
                </button>
            </div>

            {selectedStream && (
                <div className="space-y-8">
                    {/* Header Info */}
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">{selectedStream.title}</h3>
                        <p className="text-xs text-zinc-500 mt-1">Broadcaster: <span className="text-primary font-bold">@{selectedStream.broadcaster}</span></p>
                        
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Global Health</span>
                                <span className="text-2xl font-black text-emerald-500">98%</span>
                            </div>
                            <div className="h-10 w-px bg-white/5" />
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Resolution</span>
                                <span className="text-sm font-bold text-zinc-300">1080p @ 60fps</span>
                            </div>
                        </div>
                    </div>

                    {/* Bitrate Chart */}
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Bitrate Velocity</span>
                            <span className="text-2xl font-black text-white mt-1">
                                {triageHistory[0]?.BitrateKbps || '0'} <span className="text-xs text-zinc-500 uppercase">kbps</span>
                            </span>
                        </div>
                        <div className="h-24 p-4 rounded-3xl bg-primary/[0.03] border border-primary/10 relative overflow-hidden">
                            <Sparkline data={triageHistory} color="#F45303" property="BitrateKbps" />
                        </div>
                    </div>

                    {/* Latency Pulse */}
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Latency Pulse</span>
                            <span className="text-2xl font-black text-blue-500 mt-1">
                                {triageHistory[0]?.LatencyMs || '0'} <span className="text-xs text-zinc-500 uppercase">ms</span>
                            </span>
                        </div>
                        <div className="h-24 p-4 rounded-3xl bg-blue-500/[0.03] border border-blue-500/10 relative overflow-hidden">
                            <Sparkline data={triageHistory} color="#3B82F6" property="LatencyMs" />
                        </div>
                    </div>

                    {/* Forensic Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-3xl bg-white/[0.01] border border-white/5">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Frame Rate</p>
                            <p className="text-lg font-black text-white">{triageHistory[0]?.FrameRate || '60.0'}</p>
                        </div>
                        <div className="p-5 rounded-3xl bg-white/[0.01] border border-white/5">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Buffer Events</p>
                            <p className={cn(
                                "text-lg font-black",
                                (triageHistory[0]?.BufferPercentage || 0) > 10 ? "text-rose-500" : "text-emerald-500"
                            )}>
                                {triageHistory[0]?.BufferPercentage || '0'}%
                            </p>
                        </div>
                    </div>

                    {/* Administrative Actions */}
                    <div className="pt-6 border-t border-white/5 space-y-4">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Administrative Guard</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsTerminateModalOpen(true)}
                                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-rose-500/10 uppercase tracking-widest text-[10px]"
                            >
                                Terminate Stream
                            </button>
                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all border border-white/5 uppercase tracking-widest text-[10px]">
                                Notify Broadcaster
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      <ActionModal
        isOpen={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        title="Terminate Stream Node"
        description="This will execute a 'Soft-Kill' on the broadcaster's discovery entry. The stream will be disconnected from the active registry immediately."
        confirmLabel="Terminate Now"
        cancelLabel="Keep Live"
        onConfirm={handleTerminateStream}
        loading={actionLoading}
        variant="danger"
      >
        <div className="space-y-4 pt-4">
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Target Node Information</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-500">Stream Title:</span>
              <span className="text-xs font-bold text-white uppercase">{selectedStream?.title || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-zinc-500">Broadcaster:</span>
              <span className="text-xs font-bold text-white">@{selectedStream?.broadcaster || 'Unknown'}</span>
            </div>
          </div>
          
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <p className="text-[10px] text-white font-bold leading-tight">Administrative Protocol</p>
                <p className="text-[10px] text-zinc-700 mt-1 leading-relaxed">Termination causes immediate removal from the app discovery feed. This action is permanent for the current stream session and will be logged under your administrative ID.</p>
              </div>
            </div>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
