"use client";

import { Users, Zap, Crown, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserSegment {
  id: string;
  label: string;
  description: string;
  count: number;
  percentage: number;
  icon: any;
  color: string;
}

interface UserSegmentFilterProps {
  segments?: UserSegment[];
  selectedSegment?: string;
  onSegmentChange?: (segmentId: string) => void;
}

const defaultSegments: UserSegment[] = [
  {
    id: "all",
    label: "All Users",
    description: "Complete user base",
    count: 2847,
    percentage: 100,
    icon: Users,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "creators",
    label: "Content Creators",
    description: "Users with published content",
    count: 324,
    percentage: 11.4,
    icon: TrendingUp,
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    id: "premium",
    label: "Premium Members",
    description: "Active subscription holders",
    count: 856,
    percentage: 30.1,
    icon: Crown,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "active",
    label: "Active Last 30d",
    description: "Users with recent engagement",
    count: 1923,
    percentage: 67.5,
    icon: Zap,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "flagged",
    label: "Flagged/Suspended",
    description: "Users under review or banned",
    count: 45,
    percentage: 1.6,
    icon: AlertCircle,
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
];

export function UserSegmentFilter({
  segments = defaultSegments,
  selectedSegment = "all",
  onSegmentChange,
}: UserSegmentFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">User Segments</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {segments.map((segment) => {
          const SegmentIcon = segment.icon;
          const isSelected = selectedSegment === segment.id;

          return (
            <button
              key={segment.id}
              onClick={() => onSegmentChange?.(segment.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300",
                isSelected
                  ? cn(segment.color, "border-current")
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
              )}
            >
              {/* Background Gradient */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  isSelected ? "opacity-20" : ""
                )}
                style={{
                  background: `linear-gradient(135deg, currentColor 0%, transparent 100%)`,
                }}
              />

              {/* Content */}
              <div className="relative space-y-2">
                <div className="flex items-center justify-between">
                  <SegmentIcon className={cn("h-5 w-5", isSelected ? segment.color : "text-zinc-500")} />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">
                    {segment.percentage}%
                  </span>
                </div>

                <div className="text-left">
                  <p className={cn(
                    "text-sm font-bold transition-colors",
                    isSelected ? "text-white" : "text-zinc-300"
                  )}>
                    {segment.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {segment.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className={cn(
                    "text-lg font-black transition-colors",
                    isSelected ? "text-white" : "text-zinc-400"
                  )}>
                    {segment.count.toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
