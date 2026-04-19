"use client";

import { useEffect, useState } from "react";
import { 
  Bell, 
  Send, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Clock, 
  MessageSquare, 
  Users, 
  Globe, 
  Zap, 
  ChevronRight,
  MoreVertical,
  Target,
  History,
  Radio,
  Filter
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";

export default function DispatchHub() {
  const [activeTab, setActiveTab] = useState<'emergency' | 'broadcast'>('emergency');
  const [emergencyFeed, setEmergencyFeed] = useState<any[]>([]);
  const [broadcastHistory, setBroadcastHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Broadcast Form State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [targetAudience, setTargetAudience] = useState("all");
  const [priority, setPriority] = useState("normal");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [emergencyRes, historyRes] = await Promise.all([
        api.getEmergencyFeed(),
        api.getBroadcastHistory()
      ]);
      setEmergencyFeed(Array.isArray(emergencyRes.data) ? emergencyRes.data : []);
      setBroadcastHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
    } catch (err) {
      console.error("Dispatch load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  const handleSendBroadcast = async () => {
    if (!title || !message) return;
    setActionLoading(true);
    try {
      await api.sendBroadcast({ title, message, targetAudience, priority });
      setIsBroadcastModalOpen(false);
      setTitle("");
      setMessage("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Broadcast failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                 <Radio className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">System <span className="text-primary">Dispatch</span></h1>
           </div>
           <p className="text-zinc-500 font-medium tracking-tight">Global communication and high-priority triage orchestration.</p>
        </div>

        <button 
          onClick={() => setIsBroadcastModalOpen(true)}
          className="group relative flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-[0_0_30px_rgba(244,83,3,0.3)] transition-all active:scale-95"
        >
          <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          Dispatch Broadcast
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
        {[
          { id: 'emergency', label: 'Emergency Feed', icon: ShieldAlert },
          { id: 'broadcast', label: 'Broadcast History', icon: History }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white/10 text-white shadow-xl" 
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-primary" : "text-zinc-600")} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'emergency' ? (
        <div className="space-y-6">
           {loading && emergencyFeed.length === 0 ? (
             Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-[2.5rem] animate-pulse" />)
           ) : emergencyFeed.length > 0 ? (
             <div className="grid gap-6">
                {emergencyFeed.map((alert, i) => (
                  <div key={i} className={cn(
                    "group relative glass-card p-8 rounded-[2.5rem] border transition-all hover:border-white/20",
                    alert.Priority === 'urgent' || alert.Priority === 'critical' ? "border-rose-500/20 bg-rose-500/[0.02]" : "border-white/5"
                  )}>
                     <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                           <div className={cn(
                             "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0",
                             alert.type === 'stream_alert' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                           )}>
                              {alert.type === 'stream_alert' ? <Zap className="h-7 w-7" /> : <ShieldAlert className="h-7 w-7" />}
                           </div>
                           <div>
                              <div className="flex items-center gap-3">
                                 <h3 className="text-lg font-black text-white">{alert.title}</h3>
                                 <span className={cn(
                                   "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                   alert.Priority === 'urgent' || alert.Priority === 'critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                 )}>
                                    {alert.Priority}
                                 </span>
                              </div>
                              <p className="text-sm text-zinc-500 mt-1 font-medium italic">
                                 {alert.type === 'stream_alert' ? `Streaming anomaly: ${alert.description.replace('_', ' ')}` : `Protocol violation: ${alert.description}`}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                           <div className="flex items-center gap-2 text-zinc-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                           </div>
                           <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
                              <ChevronRight className="h-5 w-5" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-40 text-center glass-card rounded-[3rem] border-white/5">
                <CheckCircle2 className="h-16 w-16 text-emerald-500/20 mx-auto mb-6" />
                <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-sm">Clear Horizons</p>
                <p className="text-[10px] text-zinc-700 mt-2 font-medium">No critical system anomalies or urgent reports pending.</p>
             </div>
           )}
        </div>
      ) : (
        <div className="space-y-6">
           {broadcastHistory.length > 0 ? (
              <div className="grid gap-4">
                 {broadcastHistory.map((bc, i) => (
                   <div key={i} className="glass-card p-6 rounded-3xl border-white/5 hover:bg-white/[0.02] transition-all">
                      <div className="flex items-start justify-between">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-primary">
                               <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-white">{bc.Title}</h4>
                               <p className="text-[10px] text-zinc-500 font-medium mt-0.5">Dispatched to: <span className="text-primary capitalize">{bc.TargetAudience}</span></p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            {new Date(bc.CreatedAt).toLocaleDateString()}
                         </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 gap-4">
                         <p className="text-xs text-zinc-400 leading-relaxed font-medium flex-1">{bc.Message}</p>
                         <div className="flex flex-col items-end">
                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Delivery Pulse</div>
                            <div className="flex items-center gap-2">
                               <span className={cn(
                                  "text-sm font-black transition-colors",
                                  (bc.ReachCount || 0) > 0 ? "text-emerald-500" : "text-zinc-600"
                                )}>
                                  {bc.ReachCount || '0'} 
                                  <span className="text-[10px] text-zinc-500 font-bold ml-1">NODES</span>
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           ) : (
              <div className="py-40 text-center glass-card rounded-[3rem] border-white/5">
                 <Radio className="h-16 w-16 text-zinc-800 mx-auto mb-6" />
                 <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-sm">Silent Registry</p>
                 <p className="text-[10px] text-zinc-700 mt-2 font-medium">No system-wide broadcasts have been dispatched in this epoch.</p>
              </div>
           )}
        </div>
      )}

      {/* Broadcast Composer Modal */}
      <ActionModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onConfirm={handleSendBroadcast}
        title="Execute Global Dispatch"
        description="This will send a global announcement to the designated SPRED audience. This action is immutable and logged globally."
        confirmLabel="Execute Dispatch"
        loading={actionLoading}
        variant="primary"
      >
        <div className="space-y-6 pt-4">
           {/* Audience & Priority */}
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Target Audience</label>
                 <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <select 
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs text-white appearance-none cursor-pointer"
                    >
                       <option value="all">All SPRED Nodes</option>
                       <option value="creators">Verified Creators Only</option>
                       <option value="premium">Premium Subscribers</option>
                    </select>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Dispatch Priority</label>
                 <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs text-white appearance-none cursor-pointer"
                    >
                       <option value="normal">Normal Frequency</option>
                       <option value="high">High Pulse</option>
                       <option value="urgent">System Urgent (Emergency)</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Content */}
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Dispatch Title</label>
              <input 
                type="text" 
                placeholder="e.g. Schedule Maintenance Notice"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Broadcast Message</label>
              <textarea 
                placeholder="Type the message to be dispatched to thousands of nodes..."
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[160px] resize-none leading-relaxed font-medium"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
           </div>

           {/* Security Warning */}
           <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                 Dispatching a message will trigger push notification sequences for all users in the selected audience. Ensure compliance with Spred communication protocols.
              </p>
           </div>
        </div>
      </ActionModal>
    </div>
  );
}
