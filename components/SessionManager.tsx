"use client";

import { useState } from "react";
import {
  LogOut,
  Smartphone,
  Globe,
  Clock,
  MoreVertical,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSession {
  id: string;
  adminId: string;
  adminName: string;
  email: string;
  device: string;
  ipAddress: string;
  location: string;
  browser: string;
  lastActive: Date;
  createdAt: Date;
  isCurrent: boolean;
}

interface SessionManagerProps {
  sessions?: AdminSession[];
  onLogoutSession?: (sessionId: string) => void;
}

const mockSessions: AdminSession[] = [
  {
    id: "session_001",
    adminId: "admin_001",
    adminName: "Sarah Chen",
    email: "sarah@spred.com",
    device: "MacBook Pro 14\"",
    ipAddress: "192.168.1.100",
    location: "San Francisco, CA",
    browser: "Chrome 123.0 (macOS)",
    lastActive: new Date(),
    createdAt: new Date(Date.now() - 3600000),
    isCurrent: true,
  },
  {
    id: "session_002",
    adminId: "admin_001",
    adminName: "Sarah Chen",
    email: "sarah@spred.com",
    device: "iPhone 15 Pro",
    ipAddress: "203.0.113.45",
    location: "San Francisco, CA",
    browser: "Safari (iOS 17)",
    lastActive: new Date(Date.now() - 1800000),
    createdAt: new Date(Date.now() - 86400000),
    isCurrent: false,
  },
  {
    id: "session_003",
    adminId: "admin_002",
    adminName: "James Rodriguez",
    email: "james@spred.com",
    device: "Windows Desktop",
    ipAddress: "10.0.0.50",
    location: "New York, NY",
    browser: "Edge 123.0 (Windows)",
    lastActive: new Date(Date.now() - 300000),
    createdAt: new Date(Date.now() - 604800000),
    isCurrent: true,
  },
  {
    id: "session_004",
    adminId: "admin_003",
    adminName: "Maria Santos",
    email: "maria@spred.com",
    device: "iPad Air",
    ipAddress: "198.51.100.123",
    location: "São Paulo, Brazil",
    browser: "Safari (iPadOS 17)",
    lastActive: new Date(Date.now() - 7200000),
    createdAt: new Date(Date.now() - 259200000),
    isCurrent: false,
  },
];

export function SessionManager({
  sessions = mockSessions,
  onLogoutSession,
}: SessionManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleLogout = (sessionId: string) => {
    if (onLogoutSession) {
      onLogoutSession(sessionId);
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const currentSessions = sessions.filter((s) => s.isCurrent).length;
  const inactiveSessions = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Active Sessions</h3>
        </div>
        <div className="text-xs text-zinc-500">
          {currentSessions} active • {inactiveSessions} inactive
        </div>
      </div>

      {/* Session Cards */}
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            onMouseEnter={() => setHoveredId(session.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              "glass-card rounded-xl border-white/10 overflow-hidden transition-all",
              hoveredId === session.id && "bg-white/[0.05]"
            )}
          >
            {/* Session Header */}
            <button
              onClick={() =>
                setExpandedId(expandedId === session.id ? null : session.id)
              }
              className="w-full p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Device Icon */}
                  <div className="mt-1">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>

                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">
                        {session.device}
                      </span>
                      {session.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase">
                          Active
                        </span>
                      )}
                      {!session.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-500/20 text-zinc-500 text-[10px] font-bold uppercase">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">
                      {session.adminName} • {session.browser}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                      Last active: {getTimeAgo(session.lastActive)}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                {hoveredId === session.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout(session.id);
                    }}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                    title="Logout session"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === session.id && (
              <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 bg-white/[0.01]">
                {/* Connection Details */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                      Admin
                    </p>
                    <p className="text-xs text-white">{session.adminName}</p>
                    <p className="text-[10px] text-zinc-500">{session.email}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                      IP Address
                    </p>
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3 text-zinc-500" />
                      <p className="text-xs text-white font-mono">
                        {session.ipAddress}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                      Location
                    </p>
                    <p className="text-xs text-white">{session.location}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                      Device
                    </p>
                    <p className="text-xs text-white">{session.browser}</p>
                  </div>
                </div>

                {/* Session Timeline */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    <div className="flex-1">
                      <p className="text-zinc-600">Created</p>
                      <p className="text-white font-mono">
                        {session.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    <div className="flex-1">
                      <p className="text-zinc-600">Last Active</p>
                      <p className="text-white font-mono">
                        {session.lastActive.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout Action */}
                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout(session.id);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout This Session
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Alert */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          Session Security
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Logout suspicious or unrecognized sessions immediately</li>
          <li>Monitor for login attempts from unexpected locations</li>
          <li>Enable 2FA to protect all admin sessions</li>
          <li>Review inactive sessions regularly for security</li>
        </ul>
      </div>
    </div>
  );
}
