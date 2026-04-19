"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabletOptimizedLayoutProps {
  listPanel: React.ReactNode;
  detailPanel: React.ReactNode;
  listTitle: string;
  detailTitle: string;
}

export function TabletOptimizedLayout({
  listPanel,
  detailPanel,
  listTitle,
  detailTitle,
}: TabletOptimizedLayoutProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* List Panel */}
      <div
        className={cn(
          "glass-card rounded-xl border-white/10 p-4 md:p-6 overflow-auto",
          "lg:col-span-1",
          "transition-all duration-300",
          showDetail && "hidden lg:block"
        )}
      >
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h3 className="font-bold text-white">{listTitle}</h3>
          {showDetail && (
            <button
              onClick={() => setShowDetail(false)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
        <div className="hidden lg:block mb-4">
          <h3 className="font-bold text-white text-sm">{listTitle}</h3>
        </div>
        {listPanel}
      </div>

      {/* Detail Panel */}
      <div
        className={cn(
          "glass-card rounded-xl border-white/10 p-4 md:p-6 overflow-auto",
          "lg:col-span-2",
          "transition-all duration-300",
          !showDetail && "hidden lg:block"
        )}
      >
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h3 className="font-bold text-white">{detailTitle}</h3>
          <button
            onClick={() => setShowDetail(false)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
        </div>
        <div className="hidden lg:block mb-4">
          <h3 className="font-bold text-white text-sm">{detailTitle}</h3>
        </div>
        {detailPanel}
      </div>

      {/* Mobile Detail Trigger */}
      <button
        onClick={() => setShowDetail(true)}
        className={cn(
          "fixed bottom-24 right-6 px-4 py-2 rounded-full bg-primary text-white font-bold text-sm",
          "lg:hidden transition-all",
          !showDetail ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
