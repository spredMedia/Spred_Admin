"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Terminal,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Ban,
  Activity,
  CreditCard,
  Plus,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AuditHub() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAdmin, setFilterAdmin] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  async function loadLogs() {
    try {
      const res = await api.getAuditLogs();
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Audit fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'USER_STATUS_TOGGLE': return <Ban className="h-4 w-4" />;
      case 'CATEGORY_DELETE': return <Trash2 className="h-4 w-4" />;
      case 'CATEGORY_CREATE': return <Plus className="h-4 w-4" />;
      case 'PAYOUT_SETTLEMENT': return <CreditCard className="h-4 w-4" />;
      case 'STREAM_TERMINATION': return <Activity className="h-4 w-4" />;
      case 'SYSTEM_BROADCAST': return <Zap className="h-4 w-4" />;
      case 'MODERATION_RESOLVED': return <ShieldCheck className="h-4 w-4" />;
      default: return <Terminal className="h-4 w-4" />;
    }
  };

  const getActionColor = (type: string) => {
    if (type.includes('DELETE') || type.includes('TERMINATION') || type.includes('URGENT')) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    if (type.includes('CREATE') || type.includes('PAYOUT') || type.includes('RESOLVED')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (type.includes('BROADCAST')) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-primary bg-primary/10 border-primary/20';
  };

  const uniqueAdmins = Array.from(new Set(logs.map(l => l.AdminEmail)));
  const uniqueActions = Array.from(new Set(logs.map(l => l.ActionType)));

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.AdminEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.ActionType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.Details?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAdmin = filterAdmin === "all" || log.AdminEmail === filterAdmin;
    const matchesAction = filterAction === "all" || log.ActionType === filterAction;
    
    return matchesSearch && matchesAdmin && matchesAction;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight">Audit <span className="text-primary">Hub</span></h1>
          </div>
          <p className="text-zinc-500 font-medium tracking-tight">Immutable administrative activity registry.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Search details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
          <select
            value={filterAdmin}
            onChange={(e) => setFilterAdmin(e.target.value)}
            className="w-full md:w-auto bg-white/5 border border-white/10 text-zinc-300 text-sm rounded-2xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:bg-white/10 transition-all bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a1a1aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]"
          >
            <option value="all">All Administrators</option>
            {uniqueAdmins.map(admin => (
              <option key={admin as string} value={admin as string} className="bg-zinc-900">{admin as string}</option>
            ))}
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full md:w-auto bg-white/5 border border-white/10 text-zinc-300 text-sm rounded-2xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:bg-white/10 transition-all bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a1a1aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]"
          >
            <option value="all">All Protocols</option>
            {uniqueActions.map(action => (
              <option key={action as string} value={action as string} className="bg-zinc-900">{(action as string).replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
        <div className="p-10 border-b border-white/5 bg-white/[0.01]">
           <div className="flex items-center justify-between">
              <div>
                 <h2 className="text-xl font-bold text-white">Activity Ledger</h2>
                 <p className="text-xs text-zinc-500 mt-1">Unified history of system state changes.</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Governance
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Creation
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Security
                 </div>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    <th className="px-10 py-6">Timestamp</th>
                    <th className="px-6 py-6">Admin Entity</th>
                    <th className="px-6 py-6">Action Protocol</th>
                    <th className="px-6 py-6 font-mono">Details</th>
                    <th className="px-10 py-6 text-right">Origin IP</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {loading ? (
                    Array(8).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-10 py-8"><div className="h-4 bg-white/5 rounded w-full" /></td>
                      </tr>
                    ))
                 ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-6">
                           <div>
                              <p className="text-xs font-bold text-white tracking-widest">{new Date(log.CreatedAt || log.created_at).toLocaleDateString()}</p>
                              <div className="flex items-center gap-1.5 mt-1 text-[10px] font-medium text-zinc-500">
                                 <Clock className="h-3 w-3" />
                                 {new Date(log.CreatedAt || log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-primary">
                                 <User className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="text-xs font-black text-white">{log.AdminEmail.split('@')[0].toUpperCase()}</p>
                                 <p className="text-[10px] text-zinc-500 font-medium truncate max-w-[120px]">{log.AdminEmail}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className={cn(
                             "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest",
                             getActionColor(log.ActionType)
                           )}>
                              {getActionIcon(log.ActionType)}
                              {log.ActionType.replace(/_/g, ' ')}
                           </div>
                        </td>
                        <td className="px-6 py-6 max-w-md">
                           <p className="text-xs text-zinc-400 font-medium leading-relaxed group-hover:text-white transition-colors">{log.Details}</p>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <span className="text-[10px] font-mono font-bold text-zinc-600 bg-white/5 px-2 py-1 rounded border border-white/5">
                             {log.IpAddress || 'Internal'}
                           </span>
                        </td>
                      </tr>
                    ))
                 ) : (
                    <tr>
                       <td colSpan={5} className="py-40 text-center">
                          <AlertCircle className="h-12 w-12 text-zinc-700 mx-auto mb-4 opacity-20" />
                          <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-xs">Ledger Clear</p>
                          <p className="text-[10px] text-zinc-700 mt-2">No administrative activity matches your criteria.</p>
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
        
        <div className="p-8 bg-black/20 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
           <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500/50" />
              Immutable Persistence Active
           </div>
           <div>
              Showing {filteredLogs.length} entries
           </div>
        </div>
      </div>
    </div>
  );
}
