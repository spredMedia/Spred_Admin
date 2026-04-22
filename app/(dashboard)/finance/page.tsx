"use client";

import { useEffect, useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Search,
  Download,
  MoreVertical,
  CheckCircle2,
  CircleDashed,
  AlertCircle,
  Clock,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

import { ActionModal } from "@/components/ActionModal";

export default function FinanceHub() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pendingSettlements, setPendingSettlements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function loadFinance() {
    setLoading(true);
    try {
      const [transRes, statsRes, forecastRes, settlementRes] = await Promise.all([
        api.getAllTransactions(),
        api.getWalletStats(),
        api.getRevenueForecast(),
        api.getPendingSettlements()
      ]);
      setTransactions(Array.isArray(transRes.data) ? transRes.data : []);
      setStats(statsRes.data);
      setForecast(forecastRes.data);
      setPendingSettlements(Array.isArray(settlementRes.settlements) ? settlementRes.settlements : []);
    } catch (err) {
      console.error("Finance load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFinance();
  }, []);

  const handleProcessPayout = async (action: 'approve' | 'reject') => {
    if (!selectedTx) return;
    setActionLoading(true);
    try {
      // Use adjudicateSettlement which handles the atomic WithdrawalAudits + WalletTransactions flow
      await api.adjudicateSettlement(selectedTx.RequestId || selectedTx.Id, action);
      setIsPayoutModalOpen(false);
      setSelectedTx(null);
      loadFinance();
    } catch (err: any) {
      alert(err.message || "Failed to process payout");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">Financial <span className="text-primary">Ledger</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight">Orchestrating the Spred Media global economy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
            <Download className="h-5 w-5" />
            Export Audit
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { 
            label: "Circulating Supply", 
            val: stats?.totalRevenue ? `₦${stats.totalRevenue.toLocaleString()}` : "₦0", 
            change: "+12.4%", 
            icon: Wallet, 
            color: "text-primary",
            bg: "bg-primary/10"
          },
          { 
            label: "Pending Payouts", 
            val: stats?.pendingPayouts ? `₦${stats.pendingPayouts.toLocaleString()}` : "₦0", 
            change: "-8.4%", 
            icon: Clock, 
            color: "text-amber-500",
            bg: "bg-amber-500/10"
          },
          { 
            label: "Global Transactions", 
            val: stats?.totalTransfers ? stats.totalTransfers.toLocaleString() : "0", 
            change: "+24.8%", 
            icon: TrendingUp, 
            color: "text-blue-500",
            bg: "bg-blue-500/10"
          },
          { 
            label: "Platform Revenue", 
            val: stats?.platformEarnings ? `₦${stats.platformEarnings.toLocaleString()}` : "₦0", 
            change: "+18.2%", 
            icon: Zap, 
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
          },
          { 
            label: "Projected MRR", 
            val: forecast?.projectedMRR ? `₦${forecast.projectedMRR.toLocaleString()}` : "₦0", 
            change: forecast?.growthDrift || "+0%", 
            icon: DollarSign, 
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
          },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] relative overflow-hidden group border-white/5">
             <div className={cn("absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-10 transition-transform group-hover:scale-110", stat.bg)} />
             <stat.icon className={cn("h-8 w-8 mb-4", stat.color)} />
             <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</p>
             <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-black text-white tracking-tighter">{stat.val}</p>
                <span className={cn("text-[10px] font-black", stat.change.includes("+") ? "text-emerald-500" : "text-rose-500")}>
                  {stat.change}
                </span>
             </div>
          </div>
        ))}
      </div>

      {/* Settlement Adjudication Queue */}
      {pendingSettlements.length > 0 && (
        <div className="glass-card p-8 rounded-[2.5rem] border-primary/20 bg-primary/5 animate-in slide-in-from-top duration-700">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Clock className="h-6 w-6 text-white" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-white">Settlement Queue</h2>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Institutional Payout Governance Required</p>
                 </div>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                 <p className="text-xs font-black text-primary uppercase tracking-widest">{pendingSettlements.length} Pending</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingSettlements.map((s, i) => (
                <div key={i} className="p-6 rounded-3xl bg-zinc-900 shadow-xl border border-white/5 hover:border-primary/30 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Net Payout</p>
                         <p className="text-2xl font-black text-white mt-1 tracking-tighter">₦{parseFloat(s.NetPayout).toLocaleString()}</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                   </div>
                   <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-[10px]">
                         <span className="text-zinc-600 uppercase font-black tracking-widest">Creator</span>
                         <span className="text-zinc-400 font-bold uppercase">{s.FirstName} {s.LastName}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                         <span className="text-zinc-600 uppercase font-black tracking-widest">Verification</span>
                         <span className="text-emerald-500 font-black uppercase tracking-widest">{s.VerificationTier}</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => {
                       setSelectedTx(s);
                       setIsPayoutModalOpen(true);
                     }}
                     className="w-full py-3 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all shadow-lg"
                   >
                     Adjudicate
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Revenue Intelligence Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                     <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Revenue Momentum</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Algorithmic MRR Projection</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right">
                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Confidence</p>
                     <p className="text-xs font-black text-emerald-500">{(forecast?.confidenceScore * 100).toFixed(0)}% Accuracy</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {forecast?.historicalTrend?.map((m: any, i: number) => (
                   <div key={i} className="space-y-4">
                      <div className="flex items-end gap-1 h-32">
                         <div className="w-full bg-white/5 rounded-t-xl relative group">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                            <div 
                               className="absolute bottom-0 left-0 right-0 bg-primary/40 rounded-t-xl transition-all duration-1000" 
                               style={{ height: `${(m.value / forecast.projectedMRR) * 100}%` }}
                            />
                         </div>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] font-black text-white uppercase">{m.month}</p>
                         <p className="text-[10px] text-zinc-500 font-bold">₦{m.value.toLocaleString()}</p>
                      </div>
                   </div>
                ))}
            </div>
         </div>

         <div className="space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-rose-500/5">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                     <AlertCircle className="h-6 w-6 text-rose-500" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Churn Sentinel</h4>
               </div>
               <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                 Estimated at-risk revenue based on declining creator activity and transaction velocity.
               </p>
               <div className="mt-4">
                  <p className="text-3xl font-black text-white tracking-tighter">₦{forecast?.atRiskRevenue?.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                     <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">High Priority Risk</span>
                  </div>
               </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Year-End Forecast</p>
                <p className="text-2xl font-black text-white tracking-tighter">₦{forecast?.yearEndARR?.toLocaleString()}</p>
                <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                   <p className="text-zinc-600 text-[10px] font-medium leading-snug">
                     Compound Annual Run Rate projected from current 12.4% drift velocity.
                   </p>
                </div>
            </div>
         </div>
      </div>

      <div className="glass-card rounded-[3rem] border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white/[0.01]">
          <div>
             <h2 className="text-xl font-bold text-white">Transaction Audit</h2>
             <p className="text-xs text-zinc-500 mt-1">Unified ledger of all wallet activities.</p>
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Search reference or user..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    <th className="px-8 py-6">Reference ID</th>
                    <th className="px-4 py-6">Entity Involved</th>
                    <th className="px-4 py-6">Amount (NGN)</th>
                    <th className="px-4 py-6">Status</th>
                    <th className="px-4 py-6">Execution Date</th>
                    <th className="px-8 py-6 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="px-8 py-8"><div className="h-4 bg-white/5 rounded w-full" /></td>
                      </tr>
                    ))
                 ) : transactions.length > 0 ? (
                    transactions.map((t, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-all group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center border",
                                t.Status === "Successful" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                              )}>
                                 {t.Status === "Successful" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                              </div>
                              <span className="text-xs font-mono font-bold text-zinc-400">
                                {t.UserId === 'SPRED_PLATFORM' ? 'REV' : 'TX'}-{t.Id?.split('-').pop()}
                              </span>
                           </div>
                        </td>
                        <td className="px-4 py-6">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-zinc-700/50 border border-white/10 flex items-center justify-center text-[8px] font-black text-zinc-500">
                                {t.UserId === 'SPRED_PLATFORM' ? 'SP' : (t.FirstName?.[0] || 'U')}{(t.LastName?.[0] || '')}
                              </div>
                              <span className="text-xs font-bold text-white uppercase tracking-tight truncate max-w-[150px]">
                                {t.UserId === 'SPRED_PLATFORM' ? 'SPRED PLATFORM' : `${t.FirstName} ${t.LastName}`}
                              </span>
                           </div>
                        </td>
                        <td className="px-4 py-6">
                           <span className="text-lg font-black font-mono text-white tracking-tighter">
                              ₦{(parseFloat(t.Amount) || 0).toLocaleString()}
                           </span>
                        </td>
                        <td className="px-4 py-6">
                           <div className="flex items-center gap-2">
                              {t.Status === "Successful" ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : t.Status === "Pending" ? (
                                <CircleDashed className="h-4 w-4 text-amber-500 animate-spin" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-rose-500" />
                              )}
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                t.Status === "Successful" ? "text-emerald-500" : t.Status === "Pending" ? "text-amber-500" : "text-rose-500"
                              )}>
                                {t.Status}
                              </span>
                           </div>
                        </td>
                        <td className="px-4 py-6">
                           <p className="text-xs font-bold text-zinc-400">{new Date(t.CreatedAt || t.created_at).toLocaleDateString()}</p>
                           <p className="text-[10px] text-zinc-600 font-medium uppercase mt-1">{new Date(t.CreatedAt || t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                           {t.Status === "Pending" && (
                              <button 
                                onClick={() => {
                                  setSelectedTx(t);
                                  setIsPayoutModalOpen(true);
                                }}
                                className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                              >
                                Settle
                              </button>
                           )}
                        </td>
                      </tr>
                    ))
                 ) : (
                    <tr>
                      <td colSpan={6} className="py-40 text-center">
                        <AlertCircle className="h-12 w-12 text-zinc-700 mx-auto mb-4 opacity-20" />
                        <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-xs">Ledger Clear</p>
                      </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      <ActionModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Process Settlement"
        description="Verify this transaction before releasing funds. This action will be logged in the administrative audit trail."
        confirmLabel="Approve Payout"
        cancelLabel="Reject Request"
        onConfirm={() => handleProcessPayout('approve')}
        loading={actionLoading}
        variant="primary"
      >
        <div className="space-y-4 pt-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Transaction Details</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Reference:</span>
              <span className="text-xs font-mono font-bold text-white">#{selectedTx?.RequestId || selectedTx?.Id?.slice(0, 16)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-zinc-400">Recipient:</span>
              <span className="text-xs font-bold text-white uppercase">{selectedTx?.FirstName} {selectedTx?.LastName}</span>
            </div>
            <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
              <span className="text-xs font-bold text-white">Amount:</span>
              <span className="text-xl font-black text-primary tracking-tighter">₦{(parseFloat(selectedTx?.Amount || selectedTx?.NetPayout) || 0).toLocaleString()}</span>
            </div>
          </div>

          {selectedTx?.AccountDetails && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Fulfillment Destination</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Bank Code</p>
                   <p className="text-xs font-black text-white">{(typeof selectedTx.AccountDetails === 'string' ? JSON.parse(selectedTx.AccountDetails) : selectedTx.AccountDetails).account_bank || '---'}</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Account Number</p>
                   <p className="text-xs font-black text-white">{(typeof selectedTx.AccountDetails === 'string' ? JSON.parse(selectedTx.AccountDetails) : selectedTx.AccountDetails).account_number || '---'}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] text-primary font-black uppercase tracking-widest">⚠️ Compliance Verification</p>
            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">By approving, you confirm that this creator has met all content quality guidelines and the settlement details are verified against their KYC records.</p>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}
