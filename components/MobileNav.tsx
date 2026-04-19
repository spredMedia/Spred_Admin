"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  Video,
  Zap,
  BarChart3,
  Settings,
  Shield,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface MobileNavProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <Home className="h-5 w-5" /> },
  {
    label: "Users",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
    badge: 12,
  },
  { label: "Videos", href: "/videos", icon: <Video className="h-5 w-5" /> },
  {
    label: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Monitoring",
    href: "/monitoring",
    icon: <Zap className="h-5 w-5" />,
    badge: 2,
  },
  { label: "Audit", href: "/audit", icon: <Shield className="h-5 w-5" /> },
  { label: "Reports", href: "/reports", icon: <FileText className="h-5 w-5" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
];

export function MobileNav({ items = defaultItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-lg"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-white/10 z-40 transition-transform duration-300 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Menu Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-white">Menu</h2>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                "hover:bg-white/10 text-zinc-300 hover:text-white"
              )}
            >
              <div className="text-primary">{item.icon}</div>
              <span className="text-sm font-bold flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/20">
          <p className="text-[10px] text-zinc-600 text-center">
            SPRED Admin v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
