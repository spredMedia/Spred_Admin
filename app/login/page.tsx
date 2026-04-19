"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck,
  Activity,
  User
} from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.login({ email, password });
      if (res.succeeded) {
        router.push("/");
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07091B] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Immersive Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] opacity-20" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center mb-10">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center shadow-2xl shadow-primary/40 mb-6 group transition-transform hover:scale-105 active:scale-95">
            <Zap className="h-10 w-10 text-white fill-white group-hover:animate-bounce" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
            Spred <span className="text-primary italic">Admin</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Command Center Access</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-10 border-white/5 shadow-2xl backdrop-blur-3xl relative">
          {/* Status Indicator */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1A1F3D] border border-white/10 flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">GlobalAuth Nodes Active</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Administrative Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@spred.cc"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Clearance Protocol</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-zinc-700"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <ShieldCheck className="h-5 w-5 text-rose-500 shrink-0" />
                <p className="text-xs text-rose-200 font-bold">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-rose-600 text-white rounded-2xl py-4 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale transition-duration-500 group"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Establish Connection
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-zinc-600 font-medium mt-8 leading-relaxed uppercase tracking-widest">
            Authorization strictly required. Access is monitored and logged in real-time under <span className="text-zinc-400">Security Protocol 12-B</span>.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">AES-256</span>
           </div>
           <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Uptime 99.9%</span>
           </div>
           <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Single Entity</span>
           </div>
        </div>
      </div>
    </div>
  );
}
