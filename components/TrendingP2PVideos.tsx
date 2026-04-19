"use client";

import { useState } from "react";
import {
  Flame,
  TrendingUp,
  Users,
  Share2,
  Clock,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingVideo {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  p2pShares: number;
  downloads: number;
  viewers: number;
  trendingScore: number;
  momentum: "hot" | "rising" | "stable" | "cooling";
  shareVelocity: number;
  duration: string;
  trending24h: number;
}

interface TrendingP2PVideosProps {
  videos?: TrendingVideo[];
  onVideoClick?: (videoId: string) => void;
}

const mockTrendingVideos: TrendingVideo[] = [
  {
    id: "v1",
    title: "Epic Gaming Moments 2024",
    creator: "Gaming Hub",
    thumbnail: "🎮",
    p2pShares: 4523,
    downloads: 12847,
    viewers: 45230,
    trendingScore: 9.8,
    momentum: "hot",
    shareVelocity: 125,
    duration: "18:45",
    trending24h: 8540,
  },
  {
    id: "v2",
    title: "Music Festival Highlights",
    creator: "Festival TV",
    thumbnail: "🎵",
    p2pShares: 3847,
    downloads: 9234,
    viewers: 38450,
    trendingScore: 9.2,
    momentum: "hot",
    shareVelocity: 98,
    duration: "22:15",
    trending24h: 6230,
  },
  {
    id: "v3",
    title: "Tech Tutorial - Web Development",
    creator: "Tech Academy",
    thumbnail: "💻",
    p2pShares: 2156,
    downloads: 5432,
    viewers: 28900,
    trendingScore: 8.5,
    momentum: "rising",
    shareVelocity: 67,
    duration: "42:30",
    trending24h: 3450,
  },
  {
    id: "v4",
    title: "Fitness Challenge Week 1",
    creator: "Fitness Pro",
    thumbnail: "💪",
    p2pShares: 1843,
    downloads: 4128,
    viewers: 19450,
    trendingScore: 7.9,
    momentum: "rising",
    shareVelocity: 54,
    duration: "15:20",
    trending24h: 2340,
  },
  {
    id: "v5",
    title: "Cooking Masterclass - Italian",
    creator: "Chef's Kitchen",
    thumbnail: "🍝",
    p2pShares: 945,
    downloads: 2347,
    viewers: 12340,
    trendingScore: 7.2,
    momentum: "stable",
    shareVelocity: 32,
    duration: "28:45",
    trending24h: 1240,
  },
];

export function TrendingP2PVideos({
  videos = mockTrendingVideos,
  onVideoClick,
}: TrendingP2PVideosProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getMomentumColor = (momentum: string) => {
    switch (momentum) {
      case "hot":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "rising":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "stable":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "cooling":
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
      default:
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case "hot":
        return "🔥";
      case "rising":
        return "📈";
      case "stable":
        return "➡️";
      case "cooling":
        return "❄️";
      default:
        return "◆";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Trending on P2P</h3>
      </div>

      {/* Videos Grid */}
      <div className="space-y-3">
        {videos.map((video, idx) => (
          <div key={video.id} className="space-y-2">
            <button
              onClick={() => {
                setExpandedId(expandedId === video.id ? null : video.id);
                onVideoClick?.(video.id);
              }}
              className={cn(
                "w-full glass-card rounded-xl border-white/10 p-4 transition-all hover:bg-white/[0.03]"
              )}
            >
              {/* Video Card */}
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                    idx === 0
                      ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white"
                      : idx === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                        : idx === 2
                          ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                          : "bg-primary/20 text-primary"
                  )}>
                    {idx + 1}
                  </div>
                  <span className="text-2xl">{video.thumbnail}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm line-clamp-2">
                      {video.title}
                    </h4>
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full flex-shrink-0",
                        getMomentumColor(video.momentum)
                      )}
                    >
                      {getMomentumIcon(video.momentum)}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 mb-2">{video.creator}</p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                    <div className="flex items-center gap-1 text-primary">
                      <Share2 className="h-3 w-3" />
                      <span className="font-bold">{video.p2pShares.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-bold">{video.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-500">
                      <Users className="h-3 w-3" />
                      <span className="font-bold">{video.viewers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Flame className="h-3 w-3" />
                      <span className="font-bold">{video.trendingScore}/10</span>
                    </div>
                  </div>
                </div>

                {/* Trending Score Circle */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center font-black text-lg",
                      video.trendingScore >= 9
                        ? "bg-gradient-to-br from-primary to-amber-500 text-white"
                        : video.trendingScore >= 8
                          ? "bg-primary/20 text-primary"
                          : "bg-white/10 text-white"
                    )}
                  >
                    {video.trendingScore.toFixed(1)}
                  </div>
                  <p className="text-[10px] text-zinc-600 text-center">Score</p>
                </div>
              </div>

              {/* Progress Bar for 24h trend */}
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] text-zinc-600 mb-1">
                  <span>24h trend</span>
                  <span>+{video.trending24h.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        (video.trending24h / mockTrendingVideos[0].trending24h) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === video.id && (
              <div className="pl-4 space-y-2">
                <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
                  {/* Video Details */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                        Duration
                      </p>
                      <p className="text-sm text-white flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {video.duration}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                        Share Velocity
                      </p>
                      <p className="text-sm text-white flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        {video.shareVelocity} shares/hour
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                        Total P2P Shares
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {video.p2pShares.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                        Total Viewers
                      </p>
                      <p className="text-sm font-bold text-emerald-500">
                        {video.viewers.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Momentum Status */}
                  <div className={cn(
                    "p-3 rounded-lg border-2",
                    getMomentumColor(video.momentum)
                  )}>
                    <p className="text-xs font-bold uppercase">
                      {getMomentumIcon(video.momentum)} {video.momentum.toUpperCase()} - Growing at {video.shareVelocity} shares/hour
                    </p>
                  </div>

                  {/* Action Button */}
                  <button className="w-full px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold flex items-center justify-center gap-2">
                    <Play className="h-4 w-4" />
                    View Analytics
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase">Trending Algorithm</p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Hot: Rapidly increasing shares and viewer velocity</li>
          <li>Rising: Steady growth with positive momentum</li>
          <li>Stable: Consistent engagement with established audience</li>
          <li>Cooling: Declining interest and share velocity</li>
          <li>Score based on P2P shares, downloads, viewers, and viral chains</li>
        </ul>
      </div>
    </div>
  );
}
