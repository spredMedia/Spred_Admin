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

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const newStatus = !selectedUser.isActive;
      await api.updateUserStatus(selectedUser.id, newStatus);
      toast.success("User status updated");
      setIsStatusModalOpen(false);
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
          { label: "Flagged Accounts", val: users.filter(u => !u.isActive).length, icon: Ban, color: "text-rose-500" },
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
              joinDate: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-",
              subscription: user.subscription || "Free",
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
                key: "subscription" as any,
                label: "Plan",
                sortable: true,
                filterable: true,
                render: (value) => (
                  <span className="text-sm font-medium text-zinc-300">{value}</span>
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
              if (user) setSelectedUser(user);
            }}
            selectable
            title="User Directory"
          />
        </div>
      )}

      <ActionModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleToggleStatus}
        title={selectedUser?.isActive ? "Suspend Character" : "Activate Character"}
        description={selectedUser?.isActive 
          ? `Are you sure you want to suspend ${selectedUser.firstName}? This will revoke their platform access immediately.`
          : `Restoring access for ${selectedUser?.firstName}. They will regain all platform privileges.`
        }
        confirmLabel={selectedUser?.isActive ? "Terminate Access" : "Restore Access"}
        variant={selectedUser?.isActive ? "danger" : "success"}
        loading={actionLoading}
      />
    </div>
  );
}
