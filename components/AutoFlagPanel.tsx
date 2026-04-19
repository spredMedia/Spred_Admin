"use client";

import { AlertTriangle, Brain, CheckCircle2, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlaggedContent {
  id: string;
  contentId: string;
  title: string;
  category: string;
  confidenceScore: number;
  violationType: string;
  description: string;
  flags: string[];
}

interface AutoFlagPanelProps {
  flaggedItems?: FlaggedContent[];
  onApprove?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const mockFlaggedItems: FlaggedContent[] = [
  {
    id: "flag_1",
    contentId: "video_12345",
    title: "Suspicious Gaming Montage",
    category: "Gaming",
    confidenceScore: 0.92,
    violationType: "Potential Account Boosting",
    description: "Unusual win patterns and suspected automation detected",
    flags: ["automation", "unnatural_patterns", "high_win_rate"],
  },
  {
    id: "flag_2",
    contentId: "comment_67890",
    title: "Suspicious Comment",
    category: "Comment",
    confidenceScore: 0.78,
    violationType: "Spam Detection",
    description: "Repetitive promotional language and shortened URLs",
    flags: ["spam", "promotional", "url_shortener"],
  },
  {
    id: "flag_3",
    contentId: "profile_54321",
    title: "New Creator Profile",
    category: "Profile",
    confidenceScore: 0.65,
    violationType: "Potential Ban Evasion",
    description: "Similar metadata to previously banned account",
    flags: ["ban_evasion_risk", "similar_metadata"],
  },
];

const violationTypeColors = {
  "Potential Account Boosting":
    "text-rose-500 bg-rose-500/10 border-rose-500/20",
  "Spam Detection": "text-amber-500 bg-amber-500/10 border-amber-500/20",
  "Potential Ban Evasion": "text-rose-500 bg-rose-500/10 border-rose-500/20",
  "Hate Speech Detection": "text-red-500 bg-red-500/10 border-red-500/20",
  "Misinformation": "text-orange-500 bg-orange-500/10 border-orange-500/20",
};

function getConfidenceColor(score: number) {
  if (score >= 0.9) return "text-red-500 bg-red-500/20";
  if (score >= 0.75) return "text-rose-500 bg-rose-500/20";
  if (score >= 0.6) return "text-amber-500 bg-amber-500/20";
  return "text-yellow-500 bg-yellow-500/20";
}

function getConfidenceLabel(score: number) {
  if (score >= 0.9) return "Critical";
  if (score >= 0.75) return "High";
  if (score >= 0.6) return "Medium";
  return "Low";
}

export function AutoFlagPanel({
  flaggedItems = mockFlaggedItems,
  onApprove,
  onDismiss,
}: AutoFlagPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-brain-500/20 border border-brain-500/30 flex items-center justify-center flex-shrink-0">
          <Brain className="h-6 w-6 text-indigo-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">
            ML-Based Auto Flagging
          </h3>
          <p className="text-sm text-zinc-500 mt-1">
            {flaggedItems.length} content item
            {flaggedItems.length !== 1 ? "s" : ""} flagged for review based on
            machine learning analysis
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Critical Items */}
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">
                Critical
              </p>
              <p className="text-2xl font-black text-rose-500 mt-2">
                {flaggedItems.filter((f) => f.confidenceScore >= 0.9).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-rose-500 opacity-30" />
          </div>
        </div>

        {/* High Confidence */}
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">
                High
              </p>
              <p className="text-2xl font-black text-amber-500 mt-2">
                {flaggedItems.filter((f) => f.confidenceScore >= 0.75 && f.confidenceScore < 0.9).length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-amber-500 opacity-30" />
          </div>
        </div>

        {/* Reviewed */}
        <div className="glass-card rounded-xl border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase">
                Pending
              </p>
              <p className="text-2xl font-black text-blue-500 mt-2">
                {flaggedItems.length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-blue-500 opacity-30" />
          </div>
        </div>
      </div>

      {/* Flagged Items */}
      <div className="space-y-3">
        {flaggedItems.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-xl border-white/10 p-5 space-y-4 hover:bg-white/[0.03] transition-all"
          >
            {/* Top Row: Content Info & Confidence */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-white truncate">
                    {item.title}
                  </h4>
                  <span className="px-2 py-1 rounded-full text-[8px] font-bold text-white bg-zinc-700 flex-shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Content ID: {item.contentId}
                </p>
              </div>

              {/* Confidence Badge */}
              <div
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-lg border text-center",
                  getConfidenceColor(item.confidenceScore)
                )}
              >
                <p className="text-[10px] font-black uppercase">
                  {getConfidenceLabel(item.confidenceScore)}
                </p>
                <p className="text-sm font-black">
                  {(item.confidenceScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Violation Info */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">
                  {item.violationType}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Flags/Reasons */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-600 uppercase">
                Detected Patterns
              </p>
              <div className="flex flex-wrap gap-2">
                {item.flags.map((flag) => (
                  <span
                    key={flag}
                    className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-tight"
                  >
                    {flag.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => onApprove?.(item.id)}
                className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => onDismiss?.(item.id)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 text-xs font-bold transition-all"
              >
                False Positive
              </button>
              <button className="flex-1 px-3 py-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold transition-all">
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ML Model Info */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
        <p className="text-xs font-bold text-indigo-500 uppercase flex items-center gap-2">
          <Brain className="h-3 w-3" />
          Content Safety Model v2.1
        </p>
        <p className="text-[10px] text-indigo-400">
          Using trained models for spam, harassment, misinformation, and policy
          violation detection. Accuracy: 96.2%
        </p>
      </div>
    </div>
  );
}
