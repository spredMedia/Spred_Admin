"use client";

import {
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trophy,
} from "lucide-react";

interface ModeratorStats {
  id: string;
  name: string;
  actionsCompleted: number;
  approvalRate: number;
  averageResolutionTime: string;
  contentAccuracy: number;
  appealRate: number;
}

interface ModerationStatsProps {
  stats?: ModeratorStats[];
}

const mockStats: ModeratorStats[] = [
  {
    id: "1",
    name: "Sarah Chen",
    actionsCompleted: 847,
    approvalRate: 62,
    averageResolutionTime: "2.3m",
    contentAccuracy: 98.5,
    appealRate: 1.2,
  },
  {
    id: "2",
    name: "James Rodriguez",
    actionsCompleted: 723,
    approvalRate: 58,
    averageResolutionTime: "2.8m",
    contentAccuracy: 97.8,
    appealRate: 1.5,
  },
  {
    id: "3",
    name: "Maria Santos",
    actionsCompleted: 692,
    approvalRate: 65,
    averageResolutionTime: "2.1m",
    contentAccuracy: 99.2,
    appealRate: 0.8,
  },
  {
    id: "4",
    name: "Alex Thompson",
    actionsCompleted: 651,
    approvalRate: 60,
    averageResolutionTime: "2.5m",
    contentAccuracy: 98.1,
    appealRate: 1.3,
  },
];

export function ModerationStats({
  stats = mockStats,
}: ModerationStatsProps) {
  const topPerformer = stats.reduce((prev, current) =>
    current.contentAccuracy > prev.contentAccuracy ? current : prev
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Moderator Performance</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Actions */}
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Total Actions
              </p>
              <p className="text-2xl font-black text-white mt-2">
                {stats.reduce((sum, s) => sum + s.actionsCompleted, 0).toLocaleString()}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-50" />
          </div>
        </div>

        {/* Avg Approval Rate */}
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Avg Approval
              </p>
              <p className="text-2xl font-black text-white mt-2">
                {(stats.reduce((sum, s) => sum + s.approvalRate, 0) / stats.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </div>

        {/* Avg Accuracy */}
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Avg Accuracy
              </p>
              <p className="text-2xl font-black text-white mt-2">
                {(stats.reduce((sum, s) => sum + s.contentAccuracy, 0) / stats.length).toFixed(1)}%
              </p>
            </div>
            <Trophy className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">
                Avg Resolution
              </p>
              <p className="text-2xl font-black text-white mt-2">2.4m</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Individual Moderator Stats */}
      <div className="space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="glass-card rounded-xl border-white/10 p-5 space-y-4 hover:bg-white/[0.03] transition-all"
          >
            {/* Top Performer Badge */}
            {stat.id === topPerformer.id && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 w-fit">
                <Trophy className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase">
                  Top Performer
                </span>
              </div>
            )}

            {/* Moderator Name */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-primary font-black">
                {stat.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{stat.name}</p>
                <p className="text-[10px] text-zinc-500">Moderator</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Actions
                </p>
                <p className="text-lg font-black text-white">
                  {stat.actionsCompleted}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Approval
                </p>
                <p className="text-lg font-black text-emerald-500">
                  {stat.approvalRate}%
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Accuracy
                </p>
                <p className="text-lg font-black text-blue-500">
                  {stat.contentAccuracy}%
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Resolution
                </p>
                <p className="text-lg font-black text-amber-500">
                  {stat.averageResolutionTime}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                  Appeals
                </p>
                <p className="text-lg font-black text-rose-500">
                  {stat.appealRate}%
                </p>
              </div>
            </div>

            {/* Accuracy Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">
                  Content Accuracy
                </p>
                <p className="text-xs font-bold text-white">
                  {stat.contentAccuracy}%
                </p>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                  style={{ width: `${stat.contentAccuracy}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
