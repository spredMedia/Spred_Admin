"use client";

import { useState } from "react";
import {
  Lock,
  Shield,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSecurityConfig {
  adminId: string;
  adminName: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: "authenticator" | "sms" | "email";
  sessionTimeout: number;
  ipWhitelist: string[];
  lastSecurityUpdate: Date;
}

interface AdminSecurityPanelProps {
  config?: AdminSecurityConfig;
  onUpdate?: (config: AdminSecurityConfig) => void;
}

const mockConfig: AdminSecurityConfig = {
  adminId: "admin_001",
  adminName: "Sarah Chen",
  twoFactorEnabled: true,
  twoFactorMethod: "authenticator",
  sessionTimeout: 30,
  ipWhitelist: [
    "192.168.1.100",
    "203.0.113.45",
    "198.51.100.50",
  ],
  lastSecurityUpdate: new Date(Date.now() - 604800000),
};

export function AdminSecurityPanel({
  config = mockConfig,
  onUpdate,
}: AdminSecurityPanelProps) {
  const [localConfig, setLocalConfig] = useState<AdminSecurityConfig>(config);
  const [newIp, setNewIp] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [tab, setTab] = useState<"2fa" | "timeout" | "whitelist">("2fa");

  const handleToggle2FA = (enabled: boolean) => {
    const updated = { ...localConfig, twoFactorEnabled: enabled };
    setLocalConfig(updated);
    onUpdate?.(updated);
  };

  const handleChange2FAMethod = (
    method: "authenticator" | "sms" | "email"
  ) => {
    const updated = {
      ...localConfig,
      twoFactorMethod: method,
    };
    setLocalConfig(updated);
    onUpdate?.(updated);
  };

  const handleSessionTimeoutChange = (minutes: number) => {
    const updated = { ...localConfig, sessionTimeout: minutes };
    setLocalConfig(updated);
    onUpdate?.(updated);
  };

  const handleAddIp = () => {
    if (newIp.trim() && !localConfig.ipWhitelist.includes(newIp)) {
      const updated = {
        ...localConfig,
        ipWhitelist: [...localConfig.ipWhitelist, newIp],
      };
      setLocalConfig(updated);
      setNewIp("");
      onUpdate?.(updated);
    }
  };

  const handleRemoveIp = (ip: string) => {
    const updated = {
      ...localConfig,
      ipWhitelist: localConfig.ipWhitelist.filter((i) => i !== ip),
    };
    setLocalConfig(updated);
    onUpdate?.(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Admin Security</h3>
      </div>

      {/* Admin Info */}
      <div className="glass-card rounded-xl border-white/10 p-4">
        <p className="text-xs font-bold text-zinc-600 uppercase mb-1">
          Configured For
        </p>
        <p className="text-sm font-bold text-white">{localConfig.adminName}</p>
        <p className="text-xs text-zinc-500 mt-1">
          ID: {localConfig.adminId}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {["2fa", "timeout", "whitelist"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={cn(
              "px-4 py-2 text-sm font-bold transition-all border-b-2",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-white"
            )}
          >
            {t === "2fa"
              ? "Two-Factor Auth"
              : t === "timeout"
                ? "Session Timeout"
                : "IP Whitelist"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* 2FA Tab */}
        {tab === "2fa" && (
          <div className="space-y-4">
            {/* 2FA Toggle */}
            <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <span className="font-bold text-white">Enable 2FA</span>
                </div>
                <button
                  onClick={() => handleToggle2FA(!localConfig.twoFactorEnabled)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-bold text-sm transition-all",
                    localConfig.twoFactorEnabled
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-zinc-500/10 text-zinc-500"
                  )}
                >
                  {localConfig.twoFactorEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Require two-factor authentication for all admin logins
              </p>
            </div>

            {/* 2FA Method Selection */}
            {localConfig.twoFactorEnabled && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-zinc-600 uppercase">
                  Preferred Method
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["authenticator", "sms", "email"].map((method) => (
                    <button
                      key={method}
                      onClick={() =>
                        handleChange2FAMethod(
                          method as "authenticator" | "sms" | "email"
                        )
                      }
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-sm font-bold",
                        localConfig.twoFactorMethod === method
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      )}
                    >
                      {method === "authenticator"
                        ? "Authenticator App"
                        : method === "sms"
                          ? "SMS Text"
                          : "Email Code"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Secret Key */}
            {localConfig.twoFactorEnabled &&
              localConfig.twoFactorMethod === "authenticator" && (
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  <p className="text-xs font-bold text-zinc-600 uppercase">
                    Secret Key
                  </p>
                  <div className="flex items-center gap-2">
                    <code
                      className={cn(
                        "flex-1 p-2 rounded-lg bg-white/5 text-xs font-mono",
                        showSecret ? "text-white" : "text-white/30"
                      )}
                    >
                      {showSecret
                        ? "JBSWY3DPEBLW64TMMQ======"
                        : "••••••••••••••••••••••"}
                    </code>
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    >
                      {showSecret ? (
                        <EyeOff className="h-4 w-4 text-zinc-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-zinc-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Scan with your authenticator app (Google Authenticator,
                    Authy, Microsoft Authenticator)
                  </p>
                </div>
              )}

            {/* Backup Codes */}
            {localConfig.twoFactorEnabled && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <p className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" />
                  Backup Codes
                </p>
                <p className="text-[10px] text-amber-400">
                  Save these backup codes in a secure location. You can use them
                  to sign in if you lose access to your authenticator.
                </p>
                <div className="grid gap-2 mt-3">
                  {["8F9J2K4L", "5H2M8N9P", "3Q7R1S4T", "6U2V8W9X"].map(
                    (code, idx) => (
                      <code
                        key={idx}
                        className="text-xs font-mono text-amber-300 p-2 bg-amber-500/10 rounded"
                      >
                        {code}
                      </code>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Timeout Tab */}
        {tab === "timeout" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-zinc-600 uppercase mb-3">
                  Auto-Logout Duration
                </p>
                <p className="text-sm font-bold text-white mb-4">
                  {localConfig.sessionTimeout} minutes
                </p>
              </div>

              <div className="space-y-2">
                {[15, 30, 60, 120].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => handleSessionTimeoutChange(minutes)}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border-2 transition-all text-sm font-bold",
                      localConfig.sessionTimeout === minutes
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    {minutes === 15
                      ? "15 minutes"
                      : minutes === 30
                        ? "30 minutes"
                        : minutes === 60
                          ? "1 hour"
                          : "2 hours"}
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-zinc-500 pt-2">
                Admin sessions will automatically logout after the selected
                period of inactivity
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" />
                Best Practice
              </p>
              <p className="text-[10px] text-blue-400">
                Use shorter timeouts (15-30 minutes) for sensitive admin
                accounts. Longer timeouts (60+ minutes) for low-privilege
                accounts.
              </p>
            </div>
          </div>
        )}

        {/* IP Whitelist Tab */}
        {tab === "whitelist" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl border-white/10 p-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-zinc-600 uppercase mb-3">
                  Add IP Address
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleAddIp();
                    }}
                    placeholder="e.g., 192.168.1.100"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleAddIp}
                    className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-600 uppercase">
                  Whitelisted IPs ({localConfig.ipWhitelist.length})
                </p>
                {localConfig.ipWhitelist.length > 0 ? (
                  <div className="space-y-2">
                    {localConfig.ipWhitelist.map((ip) => (
                      <div
                        key={ip}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div>
                          <p className="font-mono text-sm text-white">{ip}</p>
                          <p className="text-[10px] text-zinc-500">
                            Allowed for login
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveIp(ip)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 text-center py-4">
                    No IPs whitelisted. Any IP can login.
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" />
                IP Whitelist Tips
              </p>
              <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
                <li>
                  Add your office/home IP for secure access from known locations
                </li>
                <li>Include VPN IP if you use VPN for admin access</li>
                <li>
                  IP whitelist works with 2FA for defense-in-depth security
                </li>
                <li>Monitor login attempts from whitelisted IPs in audit log</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Last Update */}
      <div className="text-xs text-zinc-600 text-center">
        Last security update: {localConfig.lastSecurityUpdate.toLocaleString()}
      </div>
    </div>
  );
}
