"use client";

import {
  Upload,
  Heart,
  MessageSquare,
  Share2,
  Download,
  LogIn,
  Shield,
  DollarSign,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "upload" | "like" | "comment" | "share" | "download" | "login" | "verification" | "payment";
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  events?: TimelineEvent[];
  maxItems?: number;
}

const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "upload",
    title: "Uploaded new video",
    description: "Gaming Montage 2024 - 15 min edit",
    timestamp: new Date(Date.now() - 3600000),
    metadata: { videoId: "vid_001", views: 342 },
  },
  {
    id: "2",
    type: "login",
    title: "Signed in",
    description: "From Safari on macOS",
    timestamp: new Date(Date.now() - 7200000),
    metadata: { device: "Mac", os: "macOS 14.2" },
  },
  {
    id: "3",
    type: "payment",
    title: "Received earnings",
    description: "Monthly P2P transfer revenue",
    timestamp: new Date(Date.now() - 86400000),
    metadata: { amount: "$124.50", method: "P2P" },
  },
  {
    id: "4",
    type: "share",
    title: "Shared content",
    description: "Shared video to 5 peers",
    timestamp: new Date(Date.now() - 172800000),
    metadata: { peers: 5, videoId: "vid_002" },
  },
  {
    id: "5",
    type: "verification",
    title: "Account verified",
    description: "Email verification completed",
    timestamp: new Date(Date.now() - 259200000),
    metadata: { method: "email" },
  },
  {
    id: "6",
    type: "comment",
    title: "Left a comment",
    description: "On creator's latest video",
    timestamp: new Date(Date.now() - 345600000),
  },
  {
    id: "7",
    type: "like",
    title: "Liked content",
    description: "Liked 12 videos this week",
    timestamp: new Date(Date.now() - 432000000),
  },
  {
    id: "8",
    type: "download",
    title: "Downloaded video",
    description: "For offline viewing",
    timestamp: new Date(Date.now() - 518400000),
    metadata: { quality: "1080p" },
  },
];

const eventConfig = {
  upload: {
    icon: Upload,
    color: "text-blue-500 bg-blue-500/10",
    label: "Upload",
  },
  like: {
    icon: Heart,
    color: "text-rose-500 bg-rose-500/10",
    label: "Like",
  },
  comment: {
    icon: MessageSquare,
    color: "text-amber-500 bg-amber-500/10",
    label: "Comment",
  },
  share: {
    icon: Share2,
    color: "text-primary bg-primary/10",
    label: "Share",
  },
  download: {
    icon: Download,
    color: "text-emerald-500 bg-emerald-500/10",
    label: "Download",
  },
  login: {
    icon: LogIn,
    color: "text-zinc-500 bg-zinc-500/10",
    label: "Login",
  },
  verification: {
    icon: Shield,
    color: "text-green-500 bg-green-500/10",
    label: "Verified",
  },
  payment: {
    icon: DollarSign,
    color: "text-yellow-500 bg-yellow-500/10",
    label: "Payment",
  },
};

export function ActivityTimeline({
  events = mockEvents,
  maxItems = 15,
}: ActivityTimelineProps) {
  const displayedEvents = events.slice(0, maxItems);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Activity Timeline</h3>
        <span className="text-xs text-zinc-500 ml-auto">
          {events.length} total events
        </span>
      </div>

      {/* Timeline */}
      {displayedEvents.length > 0 ? (
        <div className="relative space-y-4">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />

          {/* Events */}
          {displayedEvents.map((event, idx) => {
            const config = eventConfig[event.type as keyof typeof eventConfig];
            const EventIcon = config.icon;

            return (
              <div key={event.id} className="relative pl-16">
                {/* Timeline Dot */}
                <div
                  className={cn(
                    "absolute left-0 top-1.5 h-12 w-12 rounded-full border-2 border-zinc-950 flex items-center justify-center z-10",
                    config.color
                  )}
                >
                  <EventIcon className="h-5 w-5" />
                </div>

                {/* Event Card */}
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-2 hover:bg-white/[0.03] transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-xs text-zinc-500 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase whitespace-nowrap flex-shrink-0">
                      {config.label}
                    </span>
                  </div>

                  {/* Metadata */}
                  {event.metadata && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div
                          key={key}
                          className="px-2 py-1 rounded-lg bg-white/5 text-[10px] text-zinc-400"
                        >
                          <span className="font-bold uppercase tracking-tight">
                            {key}:
                          </span>{" "}
                          {String(value)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 pt-1 text-[10px] text-zinc-600">
                    <Clock className="h-3 w-3" />
                    {event.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500">No activity recorded</p>
        </div>
      )}

      {/* Load More */}
      {events.length > maxItems && (
        <button className="w-full px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-all">
          Load More ({events.length - maxItems} more events)
        </button>
      )}
    </div>
  );
}
