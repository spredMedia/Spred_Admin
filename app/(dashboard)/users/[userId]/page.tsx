"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Eye, 
  Clock, 
  ArrowLeft, 
  ShieldCheck, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tv,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  CreditCard,
  Ban,
  ArrowRight,
  Shield
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";

export default function CreatorDeepDive() {
  const { userId } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [retention, setRetention] = useState<any[]>([]);
  const [geo, setGeo] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<any>(null);

  // Governance Modal State
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("");

  async function loadData() {
    setLoading(true);
    try {
      const [metricsRes, retentionRes, geoRes, onboardingRes] = await Promise.all([
        api.getCreatorMetrics(userId as string),
        api.getCreatorRetention(userId as string),
        api.getCreatorGeographic(userId as string),
        api.getCreatorOnboarding(userId as string)
      ]);

      setMetrics(metricsRes.data);
      setRetention(Array.isArray(retentionRes.data) ? retentionRes.data : []);
      setGeo(geoRes.data);
      setOnboarding(onboardingRes.data);
    } catch (err) {
      console.error("Failed to load creator data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleUpdateTier = async () => {
    if (!selectedTier) return;
    setActionLoading(true);
    try {
      await api.updateCreatorTier(userId as string, selectedTier as any);
      setIsTierModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to update tier");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdvanceStage = async () => {
    setActionLoading(true);
    try {
      await api.advanceOnboarding(userId as string);
      setIsStageModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to advance stage");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Aggregating Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4">
          <Link href="/users" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Back to Ecosystem
          </Link>
          <div className="flex items-center gap-6">
             <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center border-4 border-white/5 text-3xl font-black text-white shadow-2xl shadow-primary/20">
                {metrics?.FirstName?.[0] || 'U'}
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <h1 className="text-4xl font-black text-white tracking-tighter">{metrics?.FirstName} {metrics?.LastName}</h1>
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                     metrics?.VerificationTier === 'platinum' ? "bg-primary/20 text-primary border-primary/20" : 
                     metrics?.VerificationTier === 'gold' ? "bg-amber-500/20 text-amber-500 border-amber-500/20" : 
                     "bg-zinc-500/20 text-zinc-500 border-white/10"
                   )}>
                      {metrics?.VerificationTier || 'Silver'}
                   </span>
                </div>
                <p className="text-zinc-500 font-medium mt-1">Creator ID: <span className="text-zinc-300 font-mono">#{userId?.slice(0, 12)}</span></p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsTierModalOpen(true)}
             className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
           >
              <ShieldCheck className="h-4 w-4" />
              Manage Tier
           </button>
           <button className="px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Restrict Node
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         {[
           { label: "Total Reach", val: (metrics?.TotalViews || 0).toLocaleString(), icon: Eye, color: "text-primary" },
           { label: "Community", val: (metrics?.Subscribers || 0).toLocaleString(), icon: Users, color: "text-blue-500" },
           { label: "Watch Velocity", val: `${(metrics?.TotalWatchTimeHours || 0).toFixed(1)}H`, icon: Clock, color: "text-emerald-500" },
           { label: "Health Score", val: `${metrics?.AccountHealthScore || 98}%`, icon: Activity, color: "text-amber-500" },
         ].map((stat, i) => (
           <div key={i} className="glass-card p-6 rounded-3xl border-white/5 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <stat.icon className={cn("h-8 w-8 mb-4", stat.color)} />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-black text-white mt-1">{stat.val}</p>
           </div>
         ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         {/* Retention Analytics */}
         <div className="lg:col-span-2 glass-card rounded-[3rem] border-white/5 p-10">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-bold text-white">Viewer Retention</h3>
                  <p className="text-xs text-zinc-500 mt-1">Average drop-off across content nodes.</p>
               </div>
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /> Active</div>
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-zinc-800" /> Threshold</div>
               </div>
            </div>

            {/* Dynamic Forensic Retention Chart */}
            <div className="relative h-64 w-full group/chart">
               {(() => {
                  const latest = retention[0] || { Retention5Min: 78, Retention10Min: 45, Retention25Min: 22, Retention60Min: 18 };
                  const dataPoints = [
                    { x: 0, y: 100 },
                    { x: 250, y: parseFloat(latest.Retention5Min || latest.retention5Min || 78) },
                    { x: 500, y: parseFloat(latest.Retention10Min || latest.retention10Min || 45) },
                    { x: 750, y: parseFloat(latest.Retention25Min || latest.retention25Min || 22) },
                    { x: 1000, y: parseFloat(latest.Retention60Min || latest.retention60Min || 18) }
                  ];

                  // Calculate SVG coordinates (y is inverted, max height 260 to leave room for labels)
                  const height = 260;
                  const getSVGParams = (p: any) => ({
                    x: p.x,
                    y: height - (p.y / 100) * height + 20
                  });

                  const pts = dataPoints.map(getSVGParams);
                  const d = `M ${pts[0].x} ${pts[0].y} ` + 
                            `C 125 ${pts[0].y}, 125 ${pts[1].y}, ${pts[1].x} ${pts[1].y} ` +
                            `S 375 ${pts[2].y}, ${pts[2].x} ${pts[2].y} ` +
                            `S 625 ${pts[3].y}, ${pts[3].x} ${pts[3].y} ` +
                            `S 875 ${pts[4].y}, ${pts[4].x} ${pts[4].y}`;

                  return (
                    <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="retentionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F45303" />
                          <stop offset="100%" stopColor="#D69E2E" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Grid Lines */}
                      {[0.25, 0.5, 0.75, 1].map(v => (
                        <line key={v} x1={v * 1000} y1="0" x2={v * 1000} y2="300" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="4 4" />
                      ))}
                      {[50, 150, 250].map(v => (
                        <line key={v} x1="0" y1={v} x2="1000" y2={v} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                      ))}

                      {/* The Forensic Curve */}
                      <path 
                        d={d} 
                        fill="none" 
                        stroke="url(#retentionGradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_15px_rgba(244,83,3,0.3)] transition-all duration-1000"
                      />

                      {/* Interaction Points */}
                      {pts.map((p, i) => (
                        <g key={i} className="cursor-pointer group/point">
                           <circle 
                             cx={p.x} 
                             cy={p.y} 
                             r="6" 
                             fill="#F45303" 
                             className="hover:r-8 transition-all duration-300" 
                           />
                           <circle 
                             cx={p.x} 
                             cy={p.y} 
                             r="12" 
                             fill="#F45303" 
                             fillOpacity="0.1"
                             className="group-hover/point:fill-opacity-30" 
                           />
                        </g>
                      ))}
                    </svg>
                  );
               })()}
               
               <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 pt-6 border-t border-white/5 text-[10px] font-black uppercase tracking-tighter text-zinc-600 mt-4">
                  <span>Start (100%)</span>
                  <span>5 Min ({retention[0]?.Retention5Min || 78}%)</span>
                  <span>10 Min ({retention[0]?.Retention10Min || 45}%)</span>
                  <span>25 Min ({retention[0]?.Retention25Min || 22}%)</span>
                  <span>60 Min ({retention[0]?.Retention60Min || 18}%)</span>
               </div>
            </div>
         </div>

         {/* Geographic Distribution */}
         <div className="glass-card rounded-[3rem] border-white/5 p-10">
            <h3 className="text-xl font-bold text-white mb-8">Geographic Reach</h3>
            <div className="space-y-6">
               {[
                 { country: geo?.TopCountry || "Nigeria", pct: geo?.TopCountryPercentage || 64, flag: "🇳🇬" },
                 { country: geo?.SecondCountry || "United Kingdom", pct: geo?.SecondCountryPercentage || 18, flag: "🇬🇧" },
                 { country: "United States", pct: 12, flag: "🇺🇸" },
                 { country: "Others", pct: 6, flag: "🌍" },
               ].map((c, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                       <span className="font-bold text-white">{c.flag} {c.country}</span>
                       <span className="text-zinc-500">{c.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-primary rounded-full" 
                         style={{ width: `${c.pct}%` }} 
                       />
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
               {[
                 { label: "Mobile", val: `${geo?.DeviceMobilePercentage || 82}%`, icon: Smartphone },
                 { label: "Web", val: `${geo?.DeviceWebPercentage || 12}%`, icon: Monitor },
                 { label: "TV", val: `${geo?.DeviceTvPercentage || 6}%`, icon: Tv },
               ].map((d, i) => (
                 <div key={i} className="text-center">
                    <d.icon className="h-4 w-4 mx-auto text-zinc-600 mb-2" />
                    <p className="text-[10px] font-black text-white">{d.val}</p>
                    <p className="text-[8px] uppercase tracking-widest text-zinc-600 mt-1">{d.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         {/* Verification Progress */}
         <div className="glass-card rounded-[3rem] border-white/5 p-10">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-bold text-white">Governance Onboarding</h3>
                  <p className="text-xs text-zinc-500 mt-1">Status of verification nodes and KYC.</p>
               </div>
               <button 
                 onClick={() => setIsStageModalOpen(true)}
                 className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all"
               >
                  Advance Stage
               </button>
            </div>

            <div className="relative space-y-8 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                {[
                  { stage: 1, label: "Identity Verification", status: onboarding?.CurrentStage >= 1 ? "completed" : "pending" },
                  { stage: 2, label: "Address Confirmation", status: onboarding?.CurrentStage >= 2 ? "completed" : onboarding?.CurrentStage === 1 ? "active" : "pending" },
                  { stage: 3, label: "Financial Node Sync", status: onboarding?.CurrentStage >= 3 ? "completed" : onboarding?.CurrentStage === 2 ? "active" : "pending" },
                  { stage: 4, label: "Content Compliance Audit", status: onboarding?.CurrentStage >= 4 ? "completed" : onboarding?.CurrentStage === 3 ? "active" : "pending" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-6 relative">
                     <div className={cn(
                       "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10",
                       s.status === "completed" ? "bg-emerald-500 border-emerald-500 text-white" : 
                       s.status === "active" ? "bg-primary/20 border-primary text-primary animate-pulse" : 
                       "bg-zinc-900 border-white/5 text-zinc-700"
                     )}>
                        {s.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-black">{s.stage}</span>}
                     </div>
                     <div>
                        <p className={cn("text-sm font-bold", s.status === "pending" ? "text-zinc-600" : "text-white")}>{s.label}</p>
                        <p className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mt-1">
                           {s.status === "completed" ? "Verified" : s.status === "active" ? "In Progress" : "Awaiting Data"}
                        </p>
                     </div>
                  </div>
                ))}
            </div>
         </div>

         {/* Financial Command */}
         <div className="glass-card rounded-[3rem] border-white/5 p-10 flex flex-col justify-between">
            <div>
               <h3 className="text-xl font-bold text-white mb-2">Financial Nexus</h3>
               <p className="text-xs text-zinc-500">Real-time wallet and settlement coordination.</p>
               
               <div className="mt-10 p-8 rounded-[2rem] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 shadow-inner">
                  <div className="flex items-center justify-between mb-6">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Available Settlement</p>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Ready</p>
                  </div>
                  <p className="text-5xl font-black text-white tracking-tighter">₦{(Math.random() * 500000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                     <div className="text-center">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase">Total Earned</p>
                        <p className="text-sm font-bold text-white mt-1">₦1.2M</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase">Tax Deducted</p>
                        <p className="text-sm font-bold text-rose-500 mt-1">₦24.5K</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
               <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
                  <CreditCard className="h-4 w-4" />
                  View Ledger
               </button>
               <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <TrendingUp className="h-4 w-4" />
                  Full Audit
               </button>
            </div>
         </div>
      </div>

      {/* Governance Modals */}
      <ActionModal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        title="Administer Creator Tier"
        description="Escalating or de-escalating a creator's tier dynamically adjusts their monetization splits and platform discovery ranking."
        confirmLabel="Execute Update"
        onConfirm={handleUpdateTier}
        loading={actionLoading}
        variant="primary"
      >
        <div className="grid grid-cols-3 gap-3 pt-6">
           {['silver', 'gold', 'platinum'].map(tier => (
             <button
               key={tier}
               onClick={() => setSelectedTier(tier)}
               className={cn(
                 "py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                 selectedTier === tier 
                   ? "bg-primary/20 border-primary text-primary" 
                   : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/30"
               )}
             >
               {tier}
             </button>
           ))}
        </div>
      </ActionModal>

      <ActionModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        title="Advance Onboarding Node"
        description="Verify this creator's current data submission and advance them to the next stage of the SPRED trust registry."
        confirmLabel="Confirm Verification"
        onConfirm={handleAdvanceStage}
        loading={actionLoading}
        variant="success"
      />
    </div>
  );
}
