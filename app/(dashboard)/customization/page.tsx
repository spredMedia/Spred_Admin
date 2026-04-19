"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardWidgetSystem } from "@/components/DashboardWidgetSystem";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";

export default function CustomizationPage() {
  const [activeTab, setActiveTab] = useState<"widgets" | "theme">("widgets");

  const tabs = [
    { id: "widgets", label: "Dashboard Widgets" },
    { id: "theme", label: "Theme & Colors" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Settings2 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Dashboard <span className="text-primary">Customization</span>
          </h1>
        </div>
        <p className="text-zinc-500 font-medium tracking-tight">
          Personalize your dashboard layout, widgets, and theme preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass-card rounded-2xl border-white/10 p-6">
        {activeTab === "widgets" && <DashboardWidgetSystem />}
        {activeTab === "theme" && <ThemeCustomizer />}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">
          💡 Customization Tips
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>
            Save multiple dashboard layouts for different use cases
          </li>
          <li>
            Use scheduled theme mode to automatically switch to dark mode at
            night
          </li>
          <li>
            Collapse widgets you don't need daily to reduce clutter
          </li>
          <li>
            Choose a color scheme that matches your brand or personal
            preference
          </li>
          <li>
            Custom layouts are saved to your browser and persist across
            sessions
          </li>
        </ul>
      </div>
    </div>
  );
}
