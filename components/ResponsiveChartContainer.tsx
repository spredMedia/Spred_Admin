"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: string;
  fullscreenHeight?: string;
}

export function ResponsiveChartContainer({
  title,
  subtitle,
  children,
  height = "h-80",
  fullscreenHeight = "h-screen",
}: ResponsiveChartContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isFullscreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 bg-zinc-950 z-50 p-4 flex flex-col",
          fullscreenHeight
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          >
            <Minimize2 className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Chart */}
        <div className="flex-1 overflow-auto mt-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl border-white/10 p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm md:text-base font-bold text-white">{title}</h3>
          {subtitle && (
            <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
          )}
        </div>
        <button
          onClick={() => setIsFullscreen(true)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex-shrink-0 md:hidden"
        >
          <Maximize2 className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Chart Container */}
      <div className={cn(height, "overflow-hidden")}>{children}</div>
    </div>
  );
}
