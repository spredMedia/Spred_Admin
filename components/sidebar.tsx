"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Video,
  BookOpen,
  Bell,
  Settings,
  Activity,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  Power,
  Zap,
  BarChart3,
  AlertCircle,
  Settings2,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Users, label: "User Management", href: "/users" },
  { icon: ShieldAlert, label: "Moderation Hub", href: "/moderation" },
  { icon: Film, label: "Drama Center", href: "/drama" },
  { icon: Video, label: "Content Control", href: "/videos" },
  { icon: Activity, label: "Live Monitoring", href: "/live" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: BookOpen, label: "Catalogue", href: "/catalogue" },
  { icon: Wallet, label: "Finance & Wallet", href: "/finance" },
  { icon: AlertCircle, label: "Alert Monitoring", href: "/monitoring" },
  { icon: Bell, label: "Dispatch Hub", href: "/notifications" },
  { icon: ShieldCheck, label: "Audit Hub", href: "/audit" },
  { icon: Zap, label: "P2P Monitor", href: "/p2p-monitor" },
  { icon: Zap, label: "Integrations", href: "/integrations" },
  { icon: Zap, label: "System Health", href: "/health" },
  { icon: Settings2, label: "Customization", href: "/customization" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("admin_user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear cookies for middleware
    document.cookie = "spred_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    api.logout();
  };

  return (
    <div className="flex h-full w-72 flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl text-zinc-400">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">SPRED</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Command Center</span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">System Live</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Monitoring encrypted nodes</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Main Menu</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-white" : "text-zinc-500 group-hover:text-primary"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-6">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/[0.02]">
           <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-primary font-black uppercase">
              {user?.firstName?.[0] || 'A'}
           </div>
           <div>
              <p className="text-xs font-bold text-white leading-none">{user?.firstName} {user?.lastName || 'Admin'}</p>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">{user?.role || 'Global Admin'}</p>
           </div>
        </div>
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-white/5 hover:text-zinc-200"
        >
          <Settings className="h-5 w-5 text-zinc-500" />
          Settings
        </Link>
        <button 
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-500 transition-all hover:bg-rose-500/10 mt-2"
          onClick={handleLogout}
        >
          <Power className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
