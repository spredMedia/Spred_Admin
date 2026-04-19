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
  MoreVertical 
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await api.getAllUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const newStatus = !selectedUser.isActive;
      await api.updateUserStatus(selectedUser.id, newStatus);
      setIsStatusModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.firstName + " " + user.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 font-bold text-xs transition-all">
              <Filter className="h-4 w-4" />
              Detailed Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                <th className="px-8 py-5">Global Identifier</th>
                <th className="px-4 py-5">Communication</th>
                <th className="px-4 py-5">Role/Tier</th>
                <th className="px-4 py-5">Status</th>
                <th className="px-4 py-5 text-right">Coordination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-white/5 rounded w-full" /></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                        <Link href={`/users/${user.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 text-primary font-black">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-white leading-tight underline decoration-primary/30 underline-offset-4">{user.firstName} {user.lastName}</p>
                            <p className="text-[10px] text-zinc-500 mt-1 font-mono tracking-tighter">ID: #{user.id?.slice(0, 8)}</p>
                          </div>
                        </Link>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                          <Mail className="h-3 w-3 text-zinc-500" />
                          {user.email}
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium tracking-tight">@{user.username || 'unknown'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                        user.role === "Admin" ? "bg-primary/20 text-primary border-primary/20 font-black" : "bg-zinc-500/10 text-zinc-500 border-white/5"
                      )}>
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full", user.isActive ? "bg-emerald-500" : "bg-rose-500")} />
                        <span className={cn("text-xs font-bold", user.isActive ? "text-zinc-200" : "text-rose-500")}>
                          {user.isActive ? "Active" : "Suspended"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-500 hover:text-primary transition-all">
                          <Shield className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsStatusModalOpen(true);
                          }}
                          className={cn(
                            "p-2 rounded-xl border border-white/10 transition-all",
                            user.isActive ? "text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/10" : "text-emerald-500/30 hover:text-emerald-500 hover:bg-emerald-500/10"
                          )}
                        >
                          {user.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </button>
                        <button className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-zinc-600">
                      <Search className="h-12 w-12 opacity-20" />
                      <p className="font-bold uppercase tracking-[0.2em] text-xs">No personnel found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
