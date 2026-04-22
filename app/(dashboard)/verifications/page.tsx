"use client";

import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  UserCheck, 
  UserX, 
  Clock, 
  ExternalLink, 
  Mail, 
  Phone,
  Banknote,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";

export default function VerificationCenter() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function loadApplications() {
    setLoading(true);
    try {
      const res = await api.getPendingVerifications();
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Verification load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const handleJudge = async (action: 'approve' | 'reject') => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const res = await api.judgeVerification(selectedApp.UserId, action, adminNotes);
      if (res.succeeded) {
        setIsReviewModalOpen(false);
        setSelectedApp(null);
        setAdminNotes("");
        loadApplications();
      } else {
        alert(res.message || "Action failed");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
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
             <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight">Creator <span className="text-primary">Verification</span></h1>
          </div>
          <p className="text-zinc-500 font-medium tracking-tight">Onboard verified producers and establish system trust bounds.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Pending Review", val: applications.length, icon: Clock, color: "text-amber-500" },
          { label: "Verified Tier", val: "Silver", icon: UserCheck, color: "text-emerald-500" },
          { label: "KYC Compliance", val: "Tier 1", icon: ShieldCheck, color: "text-blue-500" },
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

      {/* Applications Table */}
      <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
         <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-xl font-bold text-white">Application Queue</h2>
            <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
               <input 
                 type="text" 
                 placeholder="Search by Creator Name or ID..." 
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                     <th className="px-8 py-6">Creator Info</th>
                     <th className="px-4 py-6">Bank Institution</th>
                     <th className="px-4 py-6">Submission Date</th>
                     <th className="px-8 py-6 text-right">Verification</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-8"><div className="h-4 bg-white/5 rounded w-full" /></td>
                      </tr>
                    ))
                  ) : applications.length > 0 ? (
                    applications.map((app, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                  {app.FirstName?.[0]}{app.LastName?.[0]}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-white leading-none">{app.FirstName} {app.LastName}</p>
                                  <p className="text-[10px] text-zinc-500 font-medium mt-1">@{app.UserName}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-4 py-6">
                            <div className="flex items-center gap-2">
                               <Banknote className="h-3 w-3 text-zinc-600" />
                               <span className="text-xs font-bold text-zinc-300">{app.BankName}</span>
                            </div>
                         </td>
                         <td className="px-4 py-6">
                            <span className="text-[10px] font-medium text-zinc-500">
                               {new Date(app.CreatedAt).toLocaleDateString()}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => {
                                setSelectedApp(app);
                                setIsReviewModalOpen(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-white transition-all"
                            >
                               Review KYC
                            </button>
                         </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={4} className="py-24 text-center">
                          <ShieldCheck className="h-12 w-12 text-emerald-500/10 mx-auto mb-4" />
                          <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-xs">No Pending Requests</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Review Modal */}
      <ActionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Creator Verification Audit"
        description="Verify the provided KYC details against internal risk parameters before authorizing creator privileges."
        confirmLabel="Approve Creator"
        onConfirm={() => handleJudge('approve')}
        loading={actionLoading}
        variant="primary"
      >
        <div className="space-y-6 pt-4">
           {/* Primary Identity */}
           <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-xl">
                    {selectedApp?.FirstName?.[0]}{selectedApp?.LastName?.[0]}
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-white">{selectedApp?.FirstName} {selectedApp?.LastName}</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">@{selectedApp?.UserName}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-zinc-600" />
                    <span className="text-xs text-zinc-300">{selectedApp?.EmailAddress}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-zinc-600" />
                    <span className="text-xs text-zinc-300">{selectedApp?.PhoneNumber}</span>
                 </div>
              </div>
           </div>

           {/* Financial Node (KYC) */}
           <div className="p-6 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Banknote className="h-20 w-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Financial Ledger Data</p>
              
              <div className="space-y-4">
                 <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-tighter mb-1">Account Holder</p>
                    <p className="text-sm font-bold text-white">{selectedApp?.AccountName}</p>
                 </div>
                 <div className="flex justify-between">
                    <div>
                       <p className="text-[10px] text-zinc-600 uppercase tracking-tighter mb-1">Bank Institution</p>
                       <p className="text-sm font-bold text-white">{selectedApp?.BankName}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-zinc-600 uppercase tracking-tighter mb-1">Institution Code</p>
                       <p className="text-sm font-mono text-zinc-400">{selectedApp?.BankCode}</p>
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-tighter mb-1">Settlement Account</p>
                    <p className="text-sm font-mono font-bold text-primary tracking-widest">{selectedApp?.AccountNumber}</p>
                 </div>
              </div>
           </div>

           {/* Rejection Rationale */}
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Administrative Notes</label>
              <textarea 
                placeholder="Optionally document the reason for rejection or special approval notes..."
                className="w-full bg-white/5 border border-white/5 rounded-3xl p-4 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
           </div>

           {/* Actions */}
           <div className="flex gap-3">
              <button
                onClick={() => handleJudge('reject')}
                disabled={actionLoading}
                className="flex-1 px-6 py-4 rounded-2xl bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
              >
                 Reject Request
              </button>
           </div>
        </div>
      </ActionModal>
    </div>
  );
}
