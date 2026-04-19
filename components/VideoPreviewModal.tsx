"use client";

import { useState } from "react";
import {
  X,
  Play,
  Download,
  ExternalLink,
  Zap,
  Clock,
  Eye,
  Database,
  AlertCircle,
  CheckCircle2,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPreviewModalProps {
  video: any;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPreviewModal({
  video,
  isOpen,
  onClose,
}: VideoPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "metadata" | "encoding">(
    "preview"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);

  if (!isOpen || !video) return null;

  const videoMetadata = [
    { label: "Video ID", value: video.id || "N/A" },
    { label: "Title", value: video.title || "N/A" },
    { label: "Category", value: video.categoryName || "N/A" },
    { label: "Duration", value: video.duration || "0:00" },
    { label: "Resolution", value: video.resolution || "1080p" },
    { label: "Format", value: video.format || "MP4" },
    { label: "File Size", value: video.fileSize || "N/A" },
    { label: "Created At", value: new Date(video.createdAt || Date.now()).toLocaleDateString() },
    { label: "Views", value: (video.viewCount || 0).toLocaleString() },
    { label: "Upload Status", value: video.uploadStatus || "Complete" },
    { label: "Storage Bucket", value: video.bucketName || "spredmedia-video-content" },
    { label: "CDN Cache", value: video.cdnCached ? "Active" : "Pending" },
  ];

  const encodingStats = [
    { name: "4K (2160p)", status: "completed", progress: 100 },
    { name: "1080p", status: "completed", progress: 100 },
    { name: "720p", status: "completed", progress: 100 },
    { name: "480p", status: "completed", progress: 100 },
    { name: "360p", status: "completed", progress: 100 },
    { name: "Auto-caption", status: "completed", progress: 100 },
    { name: "Thumbnail sprite", status: "completed", progress: 100 },
    { name: "HLS manifest", status: "completed", progress: 100 },
  ];

  const playbackUrl = video.playbackUrl || video.videoUrl || `https://cdn.spred.cc/videos/${video.id}/stream.m3u8`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-xl bg-zinc-950/80 animate-in fade-in duration-300">
      <div className="relative glass-card w-full max-w-5xl rounded-[3rem] border-white/10 shadow-[0_0_100px_rgba(244,83,3,0.2)] overflow-hidden scale-in-center max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter">
                Media Preview
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                {video.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 md:px-8 pt-6 border-b border-white/5">
          {[
            { id: "preview", label: "Preview Player" },
            { id: "metadata", label: "Metadata" },
            { id: "encoding", label: "Encoding Status" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 text-sm font-bold transition-all border-b-2",
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
          {/* Preview Tab */}
          {activeTab === "preview" && (
            <div className="space-y-6">
              {/* Video Player */}
              <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-white/10">
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 relative group">
                  {isPlaying ? (
                    <video
                      src={playbackUrl}
                      controls
                      autoPlay
                      className="w-full h-full"
                      onEnded={() => setIsPlaying(false)}
                    />
                  ) : (
                    <>
                      <img
                        src={
                          video.thumbnailUrl ||
                          video.posterUrl ||
                          "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
                        }
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-zinc-950/40 flex items-center justify-center group-hover:bg-zinc-950/50 transition-all">
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="h-20 w-20 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition-transform"
                        >
                          <Play className="h-10 w-10 text-white fill-white ml-1" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Direct Playback Link */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <p className="text-sm font-bold text-white">Direct Playback URL</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-950/50 rounded-lg p-3 border border-white/5">
                  <code className="text-xs text-zinc-400 flex-1 font-mono truncate">
                    {playbackUrl}
                  </code>
                  <button className="px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 text-xs font-bold transition-all">
                    Copy
                  </button>
                </div>
              </div>

              {/* Download Option */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-bold text-white">Download Original</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {video.fileSize || "Full quality"}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:shadow-lg hover:shadow-primary/25 transition-all">
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Metadata Tab */}
          {activeTab === "metadata" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {videoMetadata.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1"
                  >
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-white break-words">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encoding Status Tab */}
          {activeTab === "encoding" && (
            <div className="space-y-4">
              {encodingStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {stat.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : stat.status === "processing" ? (
                        <Loader className="h-5 w-5 text-blue-500 animate-spin" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      )}
                      <p className="font-bold text-white">{stat.name}</p>
                    </div>
                    <span className="text-xs font-bold text-zinc-500 uppercase">
                      {stat.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        stat.status === "completed"
                          ? "bg-emerald-500"
                          : stat.status === "processing"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      )}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Encoding Summary */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">All formats ready</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Video is ready for global CDN distribution
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>B2 Cluster</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>CDN Active</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
