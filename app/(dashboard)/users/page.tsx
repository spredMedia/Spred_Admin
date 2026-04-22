"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  Ban,
  Mail,
  MoreVertical,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { SmartFilters, userFilterTemplates } from "@/components/SmartFilters";
import { DataTable } from "@/components/DataTable";
import { toast } from "@/lib/toast";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  // Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await api.getAllUsers();
      const usersData = Array.isArray(res.data) ? res.data : [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (query: string, filters: Record<string, any>) => {
    setCurrentFilters(filters);

    let result = [...users];

    // Apply text search
    if (query) {
      result = result.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.username?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case "role":
            result = result.filter((u) => u.role === value);
            break;
          case "status":
            result = result.filter((u) =>
              value === "active" ? u.isActive : !u.isActive
            );
            break;
          case "subscription":
            result = result.filter((u) => u.subscription === value);
            break;
        }
      }
    });

    setFilteredUsers(result);
  };

  const handleUpdateTier = async (tier: 'silver' | 'gold' | 'platinum') => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await api.updateCreatorTier(selectedUser.id, tier);
      toast.success(`User promoted to ${tier.toUpperCase()} tier`);
      setIsTierModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err: any) {
      toast.error("Failed to update verification tier");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const newStatus = !selectedUser.isActive;
      await api.updateUserStatus(selectedUser.id, newStatus);
      toast.success("User status updated");
      setIsTierModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err: any) {
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUsers = async (usersToDelete: any[]) => {
    const confirmed = confirm(
      `Delete ${usersToDelete.length} user(s)? This action cannot be undone.`
    );
    if (!confirmed) return;

    toast.loading("Deleting users...");
    try {
      for (const user of usersToDelete) {
        await api.deleteUser(user.id);
      }
      toast.success(`${usersToDelete.length} user(s) deleted`);
      loadUsers();
    } catch (err: any) {
      toast.error("Failed to delete users");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">User <span className="text-primary">Ecosystem</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight">Managing {users.length} global Spred accounts.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95 self-start">
          <UserPlus className="h-5 w-5" />
          Create Account
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Nodes", val: users.filter(u => u.isActive).length, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Verification Pending", val: 12, icon: Shield, color: "text-amber-500" },
          { label: "Social Nodes", val: users.filter(u => u.followersCount > 0 || u.followingCount > 0).length, icon: Users, color: "text-primary" },
          { label: "Admin Tier", val: users.filter(u => u.role === 'Admin').length, icon: Shield, color: "text-blue-500" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl flex items-center justify-between border-white/5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.val}</p>
            </div>
            <stat.icon className={cn("h-8 w-8 opacity-20", stat.color)} />
          </div>
        ))}
      </div>

      {/* Smart Filters */}
      <SmartFilters
        templates={userFilterTemplates}
        onApply={(filters) => handleSearch("", filters)}
        onClear={() => {
          handleSearch("", {});
          setCurrentFilters({});
        }}
      />

      {/* Advanced Search */}
      <div className="glass-card rounded-xl border-white/10 p-6">
        <AdvancedSearch
          onSearch={handleSearch}
          filterOptions={[
            {
              key: "role",
              label: "Role",
              type: "select",
              options: [
                { label: "Creator", value: "creator" },
                { label: "User", value: "user" },
                { label: "Admin", value: "admin" },
              ],
            },
            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
            {
              key: "subscription",
              label: "Subscription",
              type: "select",
              options: [
                { label: "Free", value: "free" },
                { label: "Premium", value: "premium" },
                { label: "Pro", value: "pro" },
              ],
            },
          ]}
          placeholder="Search users by name, email, or ID..."
        />
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="glass-card rounded-xl border-white/10 p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl border-white/10 p-6">
          <DataTable
            data={filteredUsers.map((user) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role || "User",
              status: user.isActive ? "Active" : "Inactive",
              tier: user.tier || "unverified",
              joinDate: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-",
              subscription: user.subscription || "Free",
              followers: user.followersCount || 0,
              following: user.followingCount || 0,
            }))}
            columns={[
              {
                key: "name" as any,
                label: "Name",
                sortable: true,
                render: (value, row) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 text-primary font-bold text-sm">
                      {value?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{value}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: "email" as any,
                label: "Email",
                sortable: true,
                filterable: true,
              },
              {
                key: "role" as any,
                label: "Role",
                sortable: true,
                filterable: true,
                render: (value) => (
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                    {value}
                  </span>
                ),
              },
              {
                key: "status" as any,
                label: "Status",
                sortable: true,
                filterable: true,
                render: (value) => (
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      value === "Active"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-rose-500/20 text-rose-500"
                    )}
                  >
                    {value}
                  </span>
                ),
              },
              {
                key: "tier" as any,
                label: "Tier",
                sortable: true,
                filterable: true,
                render: (value) => {
                  const colors: Record<string, string> = {
                    platinum: "bg-amber-500/20 text-amber-500 border border-amber-500/50",
                    gold: "bg-yellow-500/20 text-yellow-500",
                    silver: "bg-zinc-400/20 text-zinc-400",
                    unverified: "bg-zinc-800 text-zinc-500"
                  };
                  return (
                    <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", colors[value] || colors.unverified)}>
                      {value}
                    </span>
                  );
                }
              },
              {
                key: "subscription" as any,
                label: "Plan",
                sortable: true,
                filterable: true,
                render: (value) => (
                  <span className="text-sm font-medium text-zinc-300">{value}</span>
                ),
              },
              {
                key: "followers" as any,
                label: "Followers",
                sortable: true,
                render: (value) => (
                  <span className="text-sm font-bold text-primary">
                    {value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}
                  </span>
                ),
              },
              {
                key: "following" as any,
                label: "Following",
                sortable: true,
                render: (value) => (
                  <span className="text-sm text-zinc-400">{value}</span>
                ),
              },
              {
                key: "joinDate" as any,
                label: "Joined",
                sortable: true,
              },
            ]}
            onDelete={handleDeleteUsers}
            onExport={() => toast.success("Exported users data")}
            onRowSelect={(row) => {
              const user = users.find(u => u.id === (row as any).id);
              if (user) {
                setSelectedUser(user);
                setIsTierModalOpen(true);
              }
            }}
            selectable
            title="User Directory"
          />
        </div>
      )}

      <ActionModal
        isOpen={isTierModalOpen}
        onClose={() => setIsTierModalOpen(false)}
        onConfirm={() => {}} // Not used as we have custom buttons
        title="Manage Institutional Access"
        description={`Set verification tier for ${selectedUser?.firstName} ${selectedUser?.lastName}. This affects their platform badges and player watermarks.`}
        confirmLabel="Close"
        variant="primary"
        loading={actionLoading}
      >
        <div className="grid grid-cols-1 gap-3 mt-4">
          {[
            { id: 'platinum', label: 'Platinum (Institutional Master)', icon: Shield, color: 'text-amber-500', desc: 'Watermarks + Gold Badge + Official Tab' },
            { id: 'gold', label: 'Gold (Verified Partner)', icon: Shield, color: 'text-yellow-500', desc: 'Gold Badge + Priority Search' },
            { id: 'silver', label: 'Silver (Verified Creator)', icon: CheckCircle2, color: 'text-zinc-400', desc: 'Silver Badge only' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => handleUpdateTier(tier.id as any)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border border-white/5 transition-all text-left group",
                selectedUser?.tier === tier.id ? "bg-primary/20 border-primary/50" : "hover:bg-white/5"
              )}
            >
              <tier.icon className={cn("h-5 w-5 mt-0.5", tier.color)} />
              <div>
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{tier.label}</p>
                <p className="text-[10px] text-zinc-500">{tier.desc}</p>
              </div>
            </button>
          ))}
          
          <button
            onClick={handleToggleStatus}
            className={cn(
              "flex items-center justify-center gap-2 p-3 mt-2 rounded-xl border font-bold text-sm transition-all",
              selectedUser?.isActive 
                ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"
            )}
          >
            {selectedUser?.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            {selectedUser?.isActive ? "Suspend Access" : "Restore Access"}
          </button>
        </div>
      </ActionModal>
    </div>
  );
}
