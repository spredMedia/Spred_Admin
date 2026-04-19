"use client";

import { useState } from "react";
import { 
  X, 
  Megaphone, 
  Zap, 
  Globe, 
  Send,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    header: "",
    body: "",
    actionUrl: "",
    type: "Emergency"
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.sendGlobalBroadcast(formData);
      if (res.succeeded) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(res.message || "Broadcast failed.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-3xl bg-zinc-950/80 animate-in fade-in duration-500">
      <div className="glass-card w-full max-w-2xl rounded-[3rem] border-white/10 shadow-[0_0_150px_rgba(244,83,3,0.2)] overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-primary/5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
              <Megaphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter leading-none">Global Broadcast</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Orchestrating system-wide announcements</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:rotate-90 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Announcement Header</label>
                 <input 
                   required
                   value={formData.header}
                   onChange={(e) => setFormData({...formData, header: e.target.value})}
                   placeholder="e.g. Critical Infrastructure Migration"
                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Dispatch Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-zinc-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Emergency">Emergency Alert</option>
                      <option value="Maintenance">Maintenance Window</option>
                      <option value="Feature">Platform Feature</option>
                      <option value="Global">Global Announcement</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Action URL (Optional)</label>
                    <input 
                      value={formData.actionUrl}
                      onChange={(e) => setFormData({...formData, actionUrl: e.target.value})}
                      placeholder="https://spred.cc/alerts..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Broadcast Payload</label>
                 <textarea 
                   required
                   rows={4}
                   value={formData.body}
                   onChange={(e) => setFormData({...formData, body: e.target.value})}
                   placeholder="Enter the message for all SPRED users..."
                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                 />
              </div>
           </div>

           <div className="p-6 rounded-[2rem] bg-zinc-950/40 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                    <h4 className="text-white text-[10px] font-black uppercase tracking-widest transition-all">Mesh Propagation</h4>
                    <p className="text-zinc-600 text-[9px] font-medium mt-0.5">Lagos London NYC Singapore Mumbai</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                 ))}
              </div>
           </div>

           {error && (
             <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
               <AlertTriangle className="h-4 w-4" />
               {error}
             </div>
           )}

           {success && (
             <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
               <CheckCircle2 className="h-4 w-4" />
               Pulse Dispatched. All nodes synchronized.
             </div>
           )}

           <div className="flex gap-4">
              <button 
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-4 rounded-2xl border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Abort Pulse
              </button>
              <button 
                type="submit"
                disabled={loading || success}
                className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:-translate-y-1 hover:shadow-primary/50 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "TRANSMITTING..." : "DISPATCH BROADCAST"}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
