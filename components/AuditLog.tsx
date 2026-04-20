"use client";

import { useState } from "react";
import {
  Shield,
  User,
  Edit,
  Trash2,
  Lock,
  Globe,
  Filter,
  ChevronDown,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: "create" | "update" | "delete" | "login" | "logout" | "permission_change";
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  location: string;
  timestamp: Date;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface AuditLogProps {
  entries?: AuditEntry[];
  maxItems?: number;
}

const mockEntries: AuditEntry[] = [
  {
    id: "audit_1",
    adminId: "admin_001",
    adminName: "Sarah Chen",
    action: "update",
    resource: "User",
    resourceId: "user_12345",
    details: "Updated user account status",
    ipAddress: "192.168.1.100",
    location: "San Francisco, CA",
    timestamp: new Date(Date.now() - 3600000),
    changes: [
      { field: "isActive", oldValue: "true", newValue: "false" },
      { field: "suspensionReason", oldValue: "", newValue: "Terms violation" },
    ],
  },
  {
    id: "audit_2",
    adminId: "admin_002",
    adminName: "James Rodriguez",
    action: "delete",
    resource: "Video",
    resourceId: "video_67890",
    details: "Deleted content for policy violation",
    ipAddress: "10.0.0.50",
    location: "New York, NY",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "audit_3",
    adminId: "admin_001",
    adminName: "Sarah Chen",
    action: "permission_change",
    resource: "Admin",
    resourceId: "admin_003",
    details: "Granted moderator role",
    ipAddress: "192.168.1.100",
    location: "San Francisco, CA",
    timestamp: new Date(Date.now() - 10800000),
    changes: [{ field: "role", oldValue: "user", newValue: "moderator" }],
  },
  {
    id: "audit_4",
    adminId: "admin_004",
    adminName: "Maria Santos",
    action: "login",
    resource: "Admin Session",
    resourceId: "session_12345",
    details: "Admin login",
    ipAddress: "172.16.0.30",
    location: "São Paulo, Brazil",
    timestamp: new Date(Date.now() - 14400000),
  },
  {
    id: "audit_5",
    adminId: "admin_001",
    adminName: "Sarah Chen",
    action: "create",
    resource: "Alert",
    resourceId: "alert_001",
    details: "Created new system alert",
    ipAddress: "192.168.1.100",
    location: "San Francisco, CA",
    timestamp: new Date(Date.now() - 86400000),
  },
];

const actionConfig = {
  create: { icon: Edit, color: "text-blue-500 bg-blue-500/10", label: "Create" },
  update: { icon: Edit, color: "text-amber-500 bg-amber-500/10", label: "Update" },
  delete: { icon: Trash2, color: "text-rose-500 bg-rose-500/10", label: "Delete" },
  login: { icon: Lock, color: "text-emerald-500 bg-emerald-500/10", label: "Login" },
  logout: { icon: Lock, color: "text-zinc-500 bg-zinc-500/10", label: "Logout" },
  permission_change: {
    icon: Shield,
    color: "text-primary bg-primary/10",
    label: "Permission",
  },
};

export function AuditLog({ entries = mockEntries, maxItems = 20 }: AuditLogProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string>("");

  const filteredEntries = filterAction
    ? entries.filter((e) => e.action === filterAction)
    : entries;

  const displayedEntries = filteredEntries.slice(0, maxItems);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Audit Log</h3>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="permission_change">Permission Change</option>
          </select>
        </div>
      </div>

      {/* Audit Entries */}
      {displayedEntries.length > 0 ? (
        <div className="space-y-3">
          {displayedEntries.map((entry) => {
            const config =
              actionConfig[entry.action as keyof typeof actionConfig];
            const ActionIcon = config.icon;

            return (
              <div
                key={entry.id}
                className="glass-card rounded-xl border-white/10 overflow-hidden hover:bg-white/[0.03] transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Action Icon */}
                    <div className={cn("p-2 rounded-lg", config.color)}>
                      <ActionIcon className="h-4 w-4" />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">
                          {config.label}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {entry.resource}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">
                        {entry.details}
                      </p>
                    </div>

                    {/* Admin & Time */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-white">
                        {entry.adminName}
                      </p>
                      <p className="text-[10px] text-zinc-600">
                        {entry.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-zinc-500 transition-transform flex-shrink-0",
                        expandedId === entry.id && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedId === entry.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 bg-white/[0.01]">
                    {/* Resource Details */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                          Resource ID
                        </p>
                        <p className="text-xs text-white font-mono">
                          {entry.resourceId}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                          Admin ID
                        </p>
                        <p className="text-xs text-white font-mono">
                          {entry.adminId}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                          IP Address
                        </p>
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-zinc-500" />
                          <p className="text-xs text-white font-mono">
                            {entry.ipAddress}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                          Location
                        </p>
                        <p className="text-xs text-white">{entry.location}</p>
                      </div>
                    </div>

                    {/* Changes */}
                    {entry.changes && entry.changes.length > 0 && (
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">
                          Changes
                        </p>
                        <div className="space-y-2">
                          {entry.changes.map((change, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-lg bg-white/5 border border-white/5"
                            >
                              <p className="text-xs font-bold text-white mb-1">
                                {change.field}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                <span className="font-mono">
                                  "{change.oldValue}"
                                </span>
                                <span>→</span>
                                <span className="font-mono text-emerald-500">
                                  "{change.newValue}"
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Full Timestamp */}
                    <div className="flex items-center gap-2 text-[10px] text-zinc-600 pt-2 border-t border-white/5">
                      <Clock className="h-3 w-3" />
                      {entry.timestamp.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No audit entries found</p>
        </div>
      )}

      {/* Load More */}
      {filteredEntries.length > maxItems && (
        <button className="w-full px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-all">
          Load More ({filteredEntries.length - maxItems} more entries)
        </button>
      )}
    </div>
  );
}
