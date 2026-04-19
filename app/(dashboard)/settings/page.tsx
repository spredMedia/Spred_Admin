"use client";

import { useEffect, useState } from "react";
import { 
  Settings, 
  Shield, 
  Database, 
  Zap, 
  Lock, 
  Save, 
  RefreshCw, 
  HardDrive,
  Globe,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  UserX,
  FileText,
  Activity,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { BroadcastModal } from "@/components/BroadcastModal";

const TABS = [
  { id: 'profile', label: 'Institutional Profile', icon: Shield },
  { id: 'infrastructure', label: 'Core Infrastructure', icon: Database },
  { id: 'governance', label: 'Sentinel Governance', icon: Zap },
  { id: 'advanced', label: 'Advanced Tools', icon: Settings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    fetchData();
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await api.getSystemSettings();
    if (res.succeeded) {
      setSettings(res.data);
    }
    setLoading(false);
  };

  const handleUpdateSettings = async (category: string) => {
    setSaving(true);
    const res = await api.updateSystemSettings(category, settings[category]);
    setSaving(false);
    if (res.succeeded) {
      // Show toast or feedback
    }
  };

  const handleRotatePasswords = async () => {
    if (passwords.next !== passwords.confirm) return;
    setSaving(true);
    await api.rotateAdminCredentials(passwords.current, passwords.next);
    setSaving(false);
    setPasswords({ current: '', next: '', confirm: '' });
  };

  // Emergency Protocols
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  const handleToggleMaintenance = async () => {
    setMaintenanceLoading(true);
    const res = await api.toggleMaintenanceMode();
    if (res.succeeded) {
      setSettings({...settings, platform: { ...settings.platform, maintenanceMode: res.data.isMaintenanceMode }});
    }
    setMaintenanceLoading(false);
  };

  const handleExportAudit = async () => {
    const res = await api.exportAuditLogs();
    if (res.succeeded) {
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spred-audit-${new Date().toISOString()}.json`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Institutional Configuration</h1>
          <p className="text-zinc-500 font-medium mt-2">Manage global infrastructure, security protocols, and governance thresholds.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 self-start">
           {TABS.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                 activeTab === tab.id 
                   ? "bg-primary text-white shadow-lg shadow-primary/25" 
                   : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
               )}
             >
               <tab.icon className="h-3.5 w-3.5" />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Left Column: Form Content */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Tab: Profile & Security */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <section className="glass-card p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <Shield className="h-40 w-40 text-white" />
                   </div>
                   <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <Lock className="h-5 w-5 text-primary" />
                      Security Integrity
                   </h3>
                   <div className="mt-10 grid gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Current Administrative Password</label>
                        <input 
                          type="password"
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                          placeholder="••••••••••••"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">New Password</label>
                          <input 
                            type="password"
                            value={passwords.next}
                            onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                            placeholder="••••••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Confirm New Password</label>
                          <input 
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                            placeholder="••••••••••••"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={handleRotatePasswords}
                        disabled={saving || !passwords.next}
                        className="mt-4 flex items-center justify-center gap-3 bg-white text-black font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50"
                      >
                        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Rotate Admin Credentials
                      </button>
                   </div>
                </section>
              </div>
            )}

            {/* Tab: Infrastructure */}
            {activeTab === 'infrastructure' && (
              <div className="space-y-8">
                <section className="glass-card p-10 rounded-[2.5rem] border-white/5">
                   <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      API Architecture
                   </h3>
                   <div className="mt-10 grid gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">SPRED Core Gateway</label>
                        <input 
                          value={settings?.infrastructure?.spredApiBase}
                          onChange={(e) => setSettings({...settings, infrastructure: {...settings.infrastructure, spredApiBase: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Backblaze Video Bucket</label>
                           <input 
                             value={settings?.infrastructure?.b2VideoBucketId}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-zinc-500 cursor-not-allowed font-mono"
                             readOnly
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Backblaze Trailer Bucket</label>
                           <input 
                             value={settings?.infrastructure?.b2TrailerBucketId}
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-zinc-500 cursor-not-allowed font-mono"
                             readOnly
                           />
                         </div>
                      </div>
                      <button 
                        onClick={() => handleUpdateSettings('infrastructure')}
                        disabled={saving}
                        className="flex items-center justify-center gap-3 bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-primary/90 transition-all mt-4"
                      >
                        <Save className="h-4 w-4" />
                        Synchronize Architecture
                      </button>
                   </div>
                </section>
              </div>
            )}

            {/* Tab: Governance */}
            {activeTab === 'governance' && (
              <div className="space-y-8">
                <section className="glass-card p-10 rounded-[2.5rem] border-white/5">
                   <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      Sentinel Policies
                   </h3>
                   <div className="mt-10 grid gap-8">
                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-white">Auto-Moderation Sensitivity</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Flag content automatically if certainty exceeds this threshold.</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <input 
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={settings?.governance?.autoModerationThreshold}
                              onChange={(e) => setSettings({...settings, governance: {...settings.governance, autoModerationThreshold: parseFloat(e.target.value)}})}
                              className="accent-primary w-32"
                            />
                            <span className="text-xs font-black text-white font-mono w-10">{(settings?.governance?.autoModerationThreshold * 100).toFixed(0)}%</span>
                         </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-white">P2P Network Baseline</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Target coefficient for active mesh participation.</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <input 
                              type="range"
                              min="0.05"
                              max="0.5"
                              step="0.01"
                              value={settings?.governance?.p2pReachBaseline}
                              onChange={(e) => setSettings({...settings, governance: {...settings.governance, p2pReachBaseline: parseFloat(e.target.value)}})}
                              className="accent-primary w-32"
                            />
                            <span className="text-xs font-black text-white font-mono w-10">{(settings?.governance?.p2pReachBaseline * 100).toFixed(0)}%</span>
                         </div>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-white">Emergency Triage Hard-Kill</p>
                            <p className="text-[10px] text-zinc-500 font-medium">Bypasses secondary moderation for critical stability alerts.</p>
                         </div>
                         <div 
                           onClick={() => setSettings({...settings, governance: {...settings.governance, hardKillEnabled: !settings.governance.hardKillEnabled}})}
                           className={cn(
                             "h-6 w-12 rounded-full p-1 cursor-pointer transition-all",
                             settings?.governance?.hardKillEnabled ? "bg-emerald-500" : "bg-zinc-800"
                           )}
                         >
                            <div className={cn(
                              "h-4 w-4 bg-white rounded-full transition-all",
                              settings?.governance?.hardKillEnabled ? "translate-x-6" : "translate-x-0"
                            )} />
                         </div>
                      </div>

                      <button 
                         onClick={() => handleUpdateSettings('governance')}
                         className="flex items-center justify-center gap-3 bg-white text-black font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-zinc-200 transition-all mt-4"
                      >
                         <Save className="h-4 w-4" />
                         Enforce Governance Policies
                      </button>
                   </div>
                 </section>
              </div>
            )}

            {/* Tab: Advanced Tools */}
            {activeTab === 'advanced' && (
              <div className="space-y-8">
                <section className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <AlertCircle className="h-40 w-40 text-rose-500" />
                   </div>
                   <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <Megaphone className="h-5 w-5 text-primary" />
                      Emergency Protocol
                   </h3>
                   <p className="text-xs text-zinc-500 mt-2 font-medium">Orchestrate high-visibility ecosystem state changes and global communications.</p>
                   
                   <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Global Broadcast */}
                      <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/50 transition-all group">
                         <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Megaphone className="h-6 w-6 text-primary" />
                         </div>
                         <h4 className="text-sm font-black text-white uppercase tracking-widest">Global Broadcast</h4>
                         <p className="text-[10px] text-zinc-500 font-medium mt-2 leading-relaxed">
                            Dispatch a priority announcement to all active mobile and desktop nodes across the Spred global mesh.
                         </p>
                         <button 
                           onClick={() => setIsBroadcastModalOpen(true)}
                           className="mt-8 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                         >
                            Orchestrate Pulse
                         </button>
                      </div>

                      {/* Maintenance Mode */}
                      <div className={cn(
                        "p-8 rounded-[2.5rem] border transition-all group relative overflow-hidden",
                        settings?.platform?.maintenanceMode ? "bg-amber-500/10 border-amber-500/30" : "bg-white/[0.02] border-white/5 hover:border-amber-500/50"
                      )}>
                         <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UserX className="h-6 w-6 text-amber-500" />
                         </div>
                         <h4 className="text-sm font-black text-white uppercase tracking-widest">System Suspension</h4>
                         <p className="text-[10px] text-zinc-500 font-medium mt-2 leading-relaxed">
                            Globally toggle maintenance mode to restrict non-administrative access during critical migration windows.
                         </p>
                         <button 
                           onClick={handleToggleMaintenance}
                           disabled={maintenanceLoading}
                           className={cn(
                             "mt-8 w-full py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all",
                             settings?.platform?.maintenanceMode 
                               ? "bg-amber-500 text-black hover:bg-amber-400" 
                               : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                           )}
                         >
                            {maintenanceLoading ? 'TRANSITIONING...' : settings?.platform?.maintenanceMode ? 'RESUME SYSTEM' : 'ACTIVATE SUSPENSION'}
                         </button>
                      </div>

                      {/* Audit Export */}
                      <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/50 transition-all group col-span-1 md:col-span-2">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                               <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <FileText className="h-6 w-6 text-emerald-500" />
                               </div>
                               <div>
                                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Audit Governance Export</h4>
                                  <p className="text-[10px] text-zinc-500 font-medium mt-1 leading-relaxed">
                                     Generate official JSON/CSV summary of administrative actions for institutional compliance and ledger audit.
                                  </p>
                               </div>
                            </div>
                            <button 
                              onClick={handleExportAudit}
                              className="px-8 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all font-mono"
                            >
                               GENERATE_REPORT.EXPORT
                            </button>
                         </div>
                      </div>
                   </div>
                </section>
              </div>
            )}
         </div>

         {/* Right Column: Information & Status */}
         <div className="space-y-8">
            <section className="glass-card p-8 rounded-[2rem] border-white/5 bg-primary/5">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-6">
                   <Shield className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-black text-white tracking-tight">Institutional Integrity</h4>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed font-medium">
                  Modifying these settings impacts the entire decentralized SPRED ecosystem. Use institutional caution when rotating credentials or updating core infrastructure gateways.
                </p>
                <div className="mt-8 space-y-4">
                   <div className="flex items-center gap-3 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption Active</span>
                   </div>
                   <div className="flex items-center gap-3 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">B2 Storage Synchronized</span>
                   </div>
                </div>
            </section>

            <section className="glass-card p-8 rounded-[2rem] border-white/5">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <RefreshCw className="h-3 w-3" />
                   System Pulse
                </h4>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">Sentinel Version</span>
                      <span className="text-xs font-black text-white font-mono">{settings?.platform?.systemVersion}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">Maintenance Mode</span>
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-lg border",
                        settings?.platform?.maintenanceMode ? "text-amber-500 border-amber-500/20 bg-amber-500/5" : "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                      )}>
                        {settings?.platform?.maintenanceMode ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">Registration Flow</span>
                      <span className="text-[10px] font-black text-zinc-500">{(settings?.platform?.allowNewRegistrations ? 'UNRESTRICTED' : 'INVITE ONLY')}</span>
                   </div>
                </div>
            </section>

            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
               <div className="flex gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Audit Protocol</p>
                     <p className="text-[11px] font-medium text-amber-500/80 leading-snug">
                        All configuration changes are logged with administrative fingerprints and IP mapping.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <BroadcastModal 
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
      />
    </div>
  );
}
