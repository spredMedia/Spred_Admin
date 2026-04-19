"use client";

import { useState } from "react";
import {
  X,
  User,
  CheckCircle2,
  AlertCircle,
  Shield,
  Share2,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityTimeline } from "./ActivityTimeline";
import { FinancialSummary } from "./FinancialSummary";
import { UserActionPanel } from "./UserActionPanel";

interface UserDetailModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "financial" | "actions">(
    "overview"
  );

  if (!isOpen || !user) return null;

  const socialMetrics = {
    followers: user.followerCount || Math.floor(Math.random() * 10000),
    following: user.followingCount || Math.floor(Math.random() * 500),
    totalInteractions: user.interactionCount || Math.floor(Math.random() * 5000),
  };

  const contentMetrics = {
    uploaded: user.uploadedCount || 24,
    published: user.publishedCount || 18,
    views: user.totalViews || 125430,
    engagementRate: user.engagementRate || (Math.random() * 15 + 2).toFixed(1),
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-xl bg-zinc-950/80 animate-in fade-in duration-300">
      <div className="relative glass-card w-full max-w-4xl rounded-[3rem] border-white/10 shadow-[0_0_100px_rgba(244,83,3,0.2)] overflow-hidden max-h-[90vh] flex flex-col scale-in-center">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-2xl font-black text-white">
              {user.firstName?.charAt(0)}
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-zinc-500">{user.email}</p>
                {user.verified && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="px-6 md:px-8 py-4 border-b border-white/5 bg-white/[0.01] flex flex-wrap gap-2">
          {user.isActive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Zap className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-500 uppercase">
                Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="h-3 w-3 text-rose-500" />
              <span className="text-xs font-bold text-rose-500 uppercase">
                Suspended
              </span>
            </div>
          )}

          {user.role && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-3 w-3 text-primary" />
              <span className="text-xs font-bold text-primary uppercase">
                {user.role}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Share2 className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-bold text-blue-500 uppercase">
              {user.subscription || "Free"}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 md:px-8 pt-6 border-b border-white/5 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "activity", label: "Activity" },
            { id: "financial", label: "Financial" },
            { id: "actions", label: "Actions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                    User ID
                  </p>
                  <p className="text-sm font-bold text-white font-mono">
                    {user.id || "N/A"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                    Joined
                  </p>
                  <p className="text-sm font-bold text-white">
                    {new Date(
                      user.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                    Last Login
                  </p>
                  <p className="text-sm font-bold text-white">
                    {new Date(
                      user.lastLogin || Date.now()
                    ).toLocaleTimeString()}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                    Location
                  </p>
                  <p className="text-sm font-bold text-white">
                    {user.country || "Unknown"}
                  </p>
                </div>
              </div>

              {/* Social Graph */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Social Graph
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "Followers",
                      value: socialMetrics.followers.toLocaleString(),
                    },
                    {
                      label: "Following",
                      value: socialMetrics.following.toLocaleString(),
                    },
                    {
                      label: "Interactions",
                      value: socialMetrics.totalInteractions.toLocaleString(),
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                        {stat.label}
                      </p>
                      <p className="text-lg font-black text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Library */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Content Library</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  {[
                    { label: "Uploaded", value: contentMetrics.uploaded },
                    { label: "Published", value: contentMetrics.published },
                    { label: "Total Views", value: contentMetrics.views.toLocaleString() },
                    {
                      label: "Engagement",
                      value: `${contentMetrics.engagementRate}%`,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">
                        {stat.label}
                      </p>
                      <p className="text-lg font-black text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && <ActivityTimeline maxItems={10} />}

          {/* Financial Tab */}
          {activeTab === "financial" && <FinancialSummary />}

          {/* Actions Tab */}
          {activeTab === "actions" && <UserActionPanel user={user} />}
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 border-t border-white/5 bg-white/[0.02] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
