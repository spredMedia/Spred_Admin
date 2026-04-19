"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  AlertTriangle,
  Filter,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModerationAction {
  id: string;
  moderatorId: string;
  moderatorName: string;
  contentId: string;
  contentType: "video" | "comment" | "profile";
  action: "approved" | "rejected" | "flagged" | "removed" | "suspended";
  reason?: string;
  timestamp: Date;
  notes?: string;
}

interface ModerationHistoryProps {
  actions?: ModerationAction[];
  maxItems?: number;
}

const mockActions: ModerationAction[] = [
  {
    id: "1",
    moderatorId: "mod_001",
    moderatorName: "Sarah Chen",
    contentId: "video_12345",
    contentType: "video",
    action: "approved",
    reason: "Content meets guidelines",
    timestamp: new Date(Date.now() - 3600000),
    notes: "Clear educational content, properly categorized",
  },
  {
    id: "2",
    moderatorId: "mod_002",
    moderatorName: "James Rodriguez",
    contentId: "comment_98765",
    contentType: "comment",
    action: "removed",
    reason: "Violates community standards",
    timestamp: new Date(Date.now() - 7200000),
    notes: "Harassment and hate speech detected",
  },
  {
    id: "3",
    moderatorId: "mod_003",
    moderatorName: "Alex Thompson",
    contentId: "profile_54321",
    contentType: "profile",
    action: "suspended",
    reason: "Repeat violations",
    timestamp: new Date(Date.now() - 10800000),
    notes: "3rd strike - 72 hour suspension",
  },
  {
    id: "4",
    moderatorId: "mod_001",
    moderatorName: "Sarah Chen",
    contentId: "video_67890",
    contentType: "video",
    action: "flagged",
    reason: "Requires manual review",
    timestamp: new Date(Date.now() - 14400000),
    notes: "Borderline content - escalated for review",
  },
  {
    id: "5",
    moderatorId: "mod_004",
    moderatorName: "Maria Santos",
    contentId: "comment_11111",
    contentType: "comment",
    action: "approved",
    reason: "Clean content",
    timestamp: new Date(Date.now() - 86400000),
    notes: "User post follows all guidelines",
  },
];

const actionConfig = {
  approved: {
    icon: CheckCircle2,
    color: "text-emerald-500 bg-emerald-500/10",
    label: "Approved",
  },
  rejected: {
    icon: XCircle,
    color: "text-rose-500 bg-rose-500/10",
    label: "Rejected",
  },
  removed: {
    icon: XCircle,
    color: "text-rose-500 bg-rose-500/10",
    label: "Removed",
  },
  flagged: {
    icon: AlertTriangle,
    color: "text-amber-500 bg-amber-500/10",
    label: "Flagged",
  },
  suspended: {
    icon: AlertTriangle,
    color: "text-rose-500 bg-rose-500/10",
    label: "Suspended",
  },
};

export function ModerationHistory({
  actions = mockActions,
  maxItems = 10,
}: ModerationHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string>("");

  const filteredActions = filterAction
    ? actions.filter((a) => a.action === filterAction)
    : actions;

  const displayedActions = filteredActions.slice(0, maxItems);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Moderation History</h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
          >
            <option value="">All Actions</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="removed">Removed</option>
            <option value="flagged">Flagged</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Actions List */}
      {displayedActions.length > 0 ? (
        <div className="space-y-3">
          {displayedActions.map((action) => {
            const config =
              actionConfig[action.action as keyof typeof actionConfig];
            const ActionIcon = config.icon;

            return (
              <div
                key={action.id}
                className="glass-card rounded-xl border-white/10 overflow-hidden hover:bg-white/[0.03] transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === action.id ? null : action.id)
                  }
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Action Icon */}
                    <div className={cn("p-2 rounded-lg", config.color)}>
                      <ActionIcon className="h-4 w-4" />
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">
                          {config.label}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {action.contentType}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        ID: {action.contentId}
                      </p>
                    </div>

                    {/* Moderator Info */}
                    <div className="flex items-center gap-2 text-right">
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">
                          {action.moderatorName}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {action.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-zinc-500 transition-transform",
                          expandedId === action.id && "rotate-180"
                        )}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedId === action.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3">
                    {action.reason && (
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                          Reason
                        </p>
                        <p className="text-sm text-zinc-300">{action.reason}</p>
                      </div>
                    )}

                    {action.notes && (
                      <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">
                          Notes
                        </p>
                        <p className="text-sm text-zinc-400">{action.notes}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex gap-2">
                      <button className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-all">
                        View Content
                      </button>
                      <button className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs font-medium hover:bg-white/10 transition-all">
                        Appeal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No moderation history available</p>
        </div>
      )}
    </div>
  );
}
