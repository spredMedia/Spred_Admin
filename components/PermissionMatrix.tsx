"use client";

import { useState } from "react";
import { Lock, User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminPermission {
  resource: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
  adminCount: number;
  createdAt: Date;
}

interface PermissionMatrixProps {
  roles?: AdminRole[];
}

const mockRoles: AdminRole[] = [
  {
    id: "role_super",
    name: "Super Admin",
    description: "Full access to all system resources",
    adminCount: 2,
    createdAt: new Date(Date.now() - 31536000000),
    permissions: [
      { resource: "Users", create: true, read: true, update: true, delete: true },
      { resource: "Videos", create: true, read: true, update: true, delete: true },
      {
        resource: "Moderation",
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      {
        resource: "Finance",
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      { resource: "Reports", create: true, read: true, update: true, delete: true },
      { resource: "Settings", create: true, read: true, update: true, delete: true },
    ],
  },
  {
    id: "role_moderator",
    name: "Content Moderator",
    description: "Manage user content and moderation tasks",
    adminCount: 5,
    createdAt: new Date(Date.now() - 15768000000),
    permissions: [
      { resource: "Users", create: false, read: true, update: false, delete: false },
      { resource: "Videos", create: false, read: true, update: true, delete: true },
      {
        resource: "Moderation",
        create: true,
        read: true,
        update: true,
        delete: false,
      },
      { resource: "Finance", create: false, read: true, update: false, delete: false },
      { resource: "Reports", create: false, read: true, update: false, delete: false },
      { resource: "Settings", create: false, read: false, update: false, delete: false },
    ],
  },
  {
    id: "role_support",
    name: "Support Agent",
    description: "View-only access for customer support",
    adminCount: 8,
    createdAt: new Date(Date.now() - 7776000000),
    permissions: [
      { resource: "Users", create: false, read: true, update: false, delete: false },
      { resource: "Videos", create: false, read: true, update: false, delete: false },
      {
        resource: "Moderation",
        create: false,
        read: true,
        update: false,
        delete: false,
      },
      { resource: "Finance", create: false, read: true, update: false, delete: false },
      { resource: "Reports", create: false, read: true, update: false, delete: false },
      { resource: "Settings", create: false, read: false, update: false, delete: false },
    ],
  },
  {
    id: "role_finance",
    name: "Finance Manager",
    description: "Manage financial operations and reporting",
    adminCount: 3,
    createdAt: new Date(Date.now() - 10368000000),
    permissions: [
      { resource: "Users", create: false, read: true, update: false, delete: false },
      { resource: "Videos", create: false, read: true, update: false, delete: false },
      {
        resource: "Moderation",
        create: false,
        read: true,
        update: false,
        delete: false,
      },
      { resource: "Finance", create: true, read: true, update: true, delete: false },
      { resource: "Reports", create: true, read: true, update: true, delete: false },
      { resource: "Settings", create: false, read: false, update: false, delete: false },
    ],
  },
];

export function PermissionMatrix({ roles = mockRoles }: PermissionMatrixProps) {
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const getRoleColor = (name: string) => {
    switch (name) {
      case "Super Admin":
        return "bg-rose-500/10 border-rose-500/20 text-rose-500";
      case "Content Moderator":
        return "bg-amber-500/10 border-amber-500/20 text-amber-500";
      case "Support Agent":
        return "bg-blue-500/10 border-blue-500/20 text-blue-500";
      case "Finance Manager":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
      default:
        return "bg-zinc-500/10 border-zinc-500/20 text-zinc-500";
    }
  };

  const countPermissions = (permissions: AdminPermission[]) => {
    let granted = 0;
    permissions.forEach((p) => {
      if (p.create) granted++;
      if (p.read) granted++;
      if (p.update) granted++;
      if (p.delete) granted++;
    });
    return granted;
  };

  const totalPermissions = 24; // 6 resources * 4 actions

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Lock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Permission Matrix</h3>
      </div>

      {/* Role Cards */}
      <div className="space-y-3">
        {roles.map((role) => {
          const granted = countPermissions(role.permissions);
          const percentage = (granted / totalPermissions) * 100;

          return (
            <div key={role.id} className="space-y-2">
              <button
                onClick={() =>
                  setExpandedRole(expandedRole === role.id ? null : role.id)
                }
                className={cn(
                  "w-full glass-card rounded-xl border-2 p-4 transition-all hover:bg-white/[0.03]",
                  getRoleColor(role.name)
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 text-left">
                    <p className="font-bold">{role.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {role.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span>
                        {granted} / {totalPermissions} permissions
                      </span>
                      <span>•</span>
                      <span>{role.adminCount} admins</span>
                    </div>
                  </div>

                  {/* Permission Bar */}
                  <div className="w-24 flex-shrink-0">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1 text-right">
                      {Math.round(percentage)}%
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Permissions Grid */}
              {expandedRole === role.id && (
                <div className="pl-4 space-y-2">
                  {role.permissions.map((perm) => (
                    <div
                      key={perm.resource}
                      className="glass-card rounded-xl border-white/10 p-3"
                    >
                      <p className="text-xs font-bold text-white mb-2">
                        {perm.resource}
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { action: "Create", value: perm.create },
                          { action: "Read", value: perm.read },
                          { action: "Update", value: perm.update },
                          { action: "Delete", value: perm.delete },
                        ].map((action) => (
                          <button
                            key={action.action}
                            disabled
                            className={cn(
                              "px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all text-center",
                              action.value
                                ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                                : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                            )}
                          >
                            {action.action}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Role Info */}
                  <div className="glass-card rounded-xl border-white/10 p-3 space-y-1 text-xs">
                    <p className="text-zinc-600">
                      Created: {role.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-zinc-600">
                      Members: {role.adminCount} admin
                      {role.adminCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Permission Legend */}
      <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
        <p className="text-xs font-bold text-zinc-600 uppercase">Actions</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Create", desc: "Create new resources" },
            { label: "Read", desc: "View resources" },
            { label: "Update", desc: "Modify resources" },
            { label: "Delete", desc: "Remove resources" },
          ].map((action) => (
            <div key={action.label} className="text-xs">
              <p className="font-bold text-white">{action.label}</p>
              <p className="text-zinc-500">{action.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <AlertTriangle className="h-3 w-3" />
          Permission Best Practices
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Follow principle of least privilege - grant minimum needed roles</li>
          <li>Review admin permissions quarterly for compliance</li>
          <li>Create custom roles for specific job functions</li>
          <li>Never grant delete permissions to support staff</li>
          <li>Separate duties: Finance approval needs two admins</li>
          <li>Log all permission changes in audit trail</li>
        </ul>
      </div>
    </div>
  );
}
