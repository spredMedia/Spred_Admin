"use client";

import { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Flag, 
  MessageSquare, 
  User, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical,
  Clock,
  ExternalLink,
  ShieldCheck,
  Ban,
  Slash
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";

export default function ModerationHub() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState<string>("");

  // Modal State
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function loadModeration() {
    setLoading(true);
    try {
      const [reportsRes, statsRes] = await Promise.all([
        api.getModerationQueue({ priority: filterPriority || undefined }),
        api.getModerationStatus()
      ]);
      setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Moderation load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModeration();
  }, [filterPriority]);

  const handleUpdateStatus = async (reportId: string | number, status: any) => {
    try {
      await api.updateReportStatus(reportId, status);
      loadModeration();
    } catch (err) {
      alert("Status update failed");
    }
  };

  const handleResolve = async (resolution: string) => {
    if (!selectedReport) return;
    setActionLoading(true);
    try {
      await api.resolveModerationCase(selectedReport.Id, resolution, resolutionNote);
      setIsResolveModalOpen(false);
      setSelectedReport(null);
      setResolutionNote("");
      loadModeration();
    } catch (err: any) {
      alert(err.message || "Resolution failed");
    } finally {
      setActionLoading(false);
    }
  };

  const priorityColors: Record<string, string> = {
    urgent: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    high: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    normal: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    low: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-rose-500" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight">Trust & <span className="text-primary">Safety</span></h1>
          </div>
          <p className="text-zinc-500 font-medium tracking-tight">Proactive content governance and case orchestration.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              {['', 'urgent', 'high'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    filterPriority === p ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {p || 'All Nodes'}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Pending Flags", val: stats?.pending_count || 0, icon: Flag, color: "text-amber-500" },
          { label: "Urgent Incidents", val: stats?.urgent_count || 0, icon: AlertTriangle, color: "text-rose-500" },
          { label: "Resolved Cases", val: stats?.resolved_count || 0, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Global Coverage", val: "99.9%", icon: ShieldCheck, color: "text-blue-500" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border-white/5 flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.val}</p>
             </div>
             <stat.icon className={cn("h-8 w-8 opacity-20", stat.color)} />
          </div>
        ))}
      </div>

      {/* Report Queue */}
      <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
         <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-xl font-bold text-white">Priority Governance Queue</h2>
            <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
               <input 
                 type="text" 
                 placeholder="Search by Content ID or Reporter..." 
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                     <th className="px-8 py-6">Incident Node</th>
                     <th className="px-4 py-6">Protocol Violation</th>
                     <th className="px-4 py-6">Risk Priority</th>
                     <th className="px-4 py-6">State</th>
                     <th className="px-8 py-6 text-right">Intervention</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-white/5 rounded w-full" /></td>
                      </tr>
                    ))
                  ) : reports.length > 0 ? (
                    reports.map((report, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                                  {report.ContentType === 'video' ? <Play className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1">{report.ContentId}</p>
                                  <p className="text-[10px] text-zinc-500 font-medium mt-1">Reporter: <span className="text-zinc-400 font-mono">#{report.ReporterId?.slice(0, 8)}</span></p>
                               </div>
                            </div>
                         </td>
                         <td className="px-4 py-6">
                            <span className="text-xs font-bold text-zinc-300">{report.FlagReason}</span>
                         </td>
                         <td className="px-4 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all group-hover:scale-110",
                              priorityColors[report.Priority]
                            )}>
                               {report.Priority}
                            </span>
                         </td>
                         <td className="px-4 py-6">
                            <div className="flex items-center gap-2">
                               <div className={cn(
                                 "h-1.5 w-1.5 rounded-full animate-pulse",
                                 report.Status === 'pending' ? "bg-amber-500" : report.Status === 'investigating' ? "bg-blue-500" : "bg-emerald-500"
                               )} />
                               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{report.Status}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                               {report.Status !== 'resolved' && (
                                 <>
                                    <button 
                                      onClick={() => handleUpdateStatus(report.Id, 'investigating')}
                                      className="p-3 rounded-xl border border-white/5 hover:bg-blue-500/10 text-zinc-500 hover:text-blue-500 transition-all"
                                      title="Mark as Investigating"
                                    >
                                       <Search className="h-4 w-4" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedReport(report);
                                        setIsResolveModalOpen(true);
                                      }}
                                      className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                                    >
                                       Resolve
                                    </button>
                                 </>
                               )}
                               <button className="p-3 rounded-xl border border-white/5 hover:bg-white/10 text-zinc-600 hover:text-white transition-all">
                                  <MoreVertical className="h-4 w-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={5} className="py-40 text-center">
                          <CheckCircle2 className="h-16 w-16 text-emerald-500/20 mx-auto mb-6" />
                          <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-sm">Registry Clear</p>
                          <p className="text-[10px] text-zinc-700 mt-2 font-medium">All governance nodes are currently within safety parameters.</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <ActionModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title="Execute Governance Protocol"
        description="Verify the content violation and select the appropriate resolution path. This action is irreversible and will be logged globally."
        confirmLabel="Execute Disposition"
        onConfirm={() => handleResolve('resolved')} // Placeholder, using handleResolve with specific type below
        loading={actionLoading}
        variant="primary"
      >
        <div className="space-y-6 pt-4">
           {/* Case Evidence */}
           <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Violation Node</p>
              <div className="flex items-center justify-between">
                 <span className="text-xs text-white font-bold">{selectedReport?.ContentId}</span>
                 <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded-lg">
                    {selectedReport?.FlagReason}
                 </span>
              </div>
           </div>

           {/* Resolution Options */}
           <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'approved', label: 'Approve Content', icon: ShieldCheck, color: "hover:bg-emerald-500/10 hover:text-emerald-500" },
                { id: 'warned', label: 'Issue Warning', icon: Clock, color: "hover:bg-amber-500/10 hover:text-amber-500" },
                { id: 'removed', label: 'Remove Content', icon: Slash, color: "hover:bg-rose-500/10 hover:text-rose-500" },
                { id: 'suspended', label: 'Suspend Producer', icon: Ban, color: "hover:bg-rose-600/10 hover:text-rose-600 font-black" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleResolve(opt.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 transition-all active:scale-95 group",
                    opt.color
                  )}
                >
                   <opt.icon className="h-6 w-6 opacity-30 group-hover:opacity-100 transition-opacity" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                </button>
              ))}
           </div>

           {/* Governance Note */}
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Internal Rationale</label>
              <textarea 
                placeholder="Optionally document the reason for this disposition..."
                className="w-full bg-white/5 border border-white/5 rounded-3xl p-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
           </div>
        </div>
      </ActionModal>
    </div>
  );
}
