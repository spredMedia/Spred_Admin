"use client";

import { useState } from "react";
import {
  Mail,
  Ban,
  Shield,
  Key,
  Crown,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

interface UserActionPanelProps {
  user?: any;
  onSuspend?: () => void;
  onBan?: () => void;
  onVerify?: () => void;
  onSendMessage?: (message: string) => void;
  onResetPassword?: () => void;
  onGrantRole?: (role: string) => void;
  onImpersonate?: () => void;
}

export function UserActionPanel({
  user,
  onSuspend,
  onBan,
  onVerify,
  onSendMessage,
  onResetPassword,
  onGrantRole,
  onImpersonate,
}: UserActionPanelProps) {
  const [activeSection, setActiveSection] = useState<"quick" | "advanced">(
    "quick"
  );
  const [messageText, setMessageText] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [suspensionReason, setSuspensionReason] = useState("");

  if (!user) return null;

  const suspensionReasons = [
    "Terms of Service Violation",
    "Spam/Harassment",
    "Illegal Content",
    "Repeat Violations",
    "Manual Review",
    "Other",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">User Management</h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-xl w-fit border border-white/5">
        {[
          { id: "quick", label: "Quick Actions" },
          { id: "advanced", label: "Advanced" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              activeSection === tab.id
                ? "bg-primary text-white"
                : "text-zinc-500 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      {activeSection === "quick" && (
        <div className="space-y-3">
          {/* Send Message */}
          <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <p className="font-bold text-white text-sm">Send Direct Message</p>
            </div>
            <textarea
              placeholder="Type message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-primary text-xs resize-none"
              rows={3}
            />
            <button
              onClick={() => {
                onSendMessage?.(messageText);
                setMessageText("");
                toast.success("Message sent");
              }}
              className="w-full px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Send
            </button>
          </div>

          {/* Quick Verification */}
          {!user.verified && (
            <button
              onClick={onVerify}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-sm hover:bg-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="h-5 w-5" />
              Mark as Verified Creator
            </button>
          )}

          {/* Reset Password */}
          <button
            onClick={onResetPassword}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold text-sm hover:bg-blue-500/20 transition-all"
          >
            <Key className="h-5 w-5" />
            Force Password Reset
          </button>

          {/* Clear Sessions */}
          <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-sm hover:bg-amber-500/20 transition-all">
            <LogOut className="h-5 w-5" />
            Clear All Sessions
          </button>
        </div>
      )}

      {/* Advanced Actions */}
      {activeSection === "advanced" && (
        <div className="space-y-4">
          {/* Grant Role */}
          <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-4 w-4 text-primary" />
              <p className="font-bold text-white text-sm">Grant Role</p>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-primary"
            >
              <option value="">Select role...</option>
              <option value="moderator">Moderator</option>
              <option value="creator">Premium Creator</option>
              <option value="ambassador">Brand Ambassador</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={() => {
                if (selectedRole) {
                  onGrantRole?.(selectedRole);
                  setSelectedRole("");
                  toast.success(`Role updated`);
                }
              }}
              disabled={!selectedRole}
              className="w-full px-3 py-2 rounded-lg bg-primary/10 text-primary disabled:opacity-50 text-xs font-bold hover:bg-primary/20 transition-all"
            >
              Apply Role
            </button>
          </div>

          {/* Suspend User */}
          <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <p className="font-bold text-white text-sm">Suspend Account</p>
            </div>
            <select
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-primary"
            >
              <option value="">Select reason...</option>
              {suspensionReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (suspensionReason) {
                  onSuspend?.();
                  setSuspensionReason("");
                  toast.warning("User suspended for 72 hours");
                }
              }}
              disabled={!suspensionReason}
              className="w-full px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 disabled:opacity-50 text-xs font-bold hover:bg-amber-500/20 transition-all"
            >
              Suspend (72h)
            </button>
          </div>

          {/* Ban User */}
          <button
            onClick={onBan}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-sm hover:bg-rose-500/20 transition-all"
          >
            <Ban className="h-5 w-5" />
            Permanent Ban
          </button>

          {/* Impersonate User */}
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-bold text-blue-500 uppercase">
                Debug Only - Audit Logged
              </p>
            </div>
            <button
              onClick={onImpersonate}
              className="w-full px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 text-xs font-bold hover:bg-blue-500/20 transition-all"
            >
              Impersonate User (Debug)
            </button>
          </div>

          {/* Payment Adjustment */}
          <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
            <p className="font-bold text-white text-sm">Payment Adjustment</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-all">
                Issue Refund
              </button>
              <button className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-all">
                Manual Payout
              </button>
              <button className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-all">
                Mark Chargeback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
