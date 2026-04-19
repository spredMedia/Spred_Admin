"use client";

import { useEffect, useState } from "react";
import { 
  Video, 
  Play, 
  Eye, 
  Clock, 
  MoreVertical, 
  Upload, 
  Filter,
  Activity,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronRight,
  Database,
  X,
  Save,
  Globe,
  Lock,
  Zap
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { IngestMediaModal } from "@/components/IngestMediaModal";
import { VideoPreviewModal } from "@/components/VideoPreviewModal";

export default function ContentPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeStreams, setActiveStreams] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vod" | "live">("vod");
  
  const [velocityAssets, setVelocityAssets] = useState<any[]>([]);
  
  // Tactical Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Edit Modal State
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Ingest Modal State
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  
  // Preview Modal State
  const [previewVideo, setPreviewVideo] = useState<any | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  async function loadContent() {
    setLoading(true);
    try {
      const [videoRes, catRes, liveRes, velocityRes] = await Promise.all([
        api.getAllVideos(),
        api.request<any[]>('/Catalogue/Category/get-all-Categories'),
        api.request<any[]>('/livestream/active'),
        api.getViralVelocity()
      ]);
      setVideos(Array.isArray(videoRes.data) ? videoRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setActiveStreams(Array.isArray(liveRes) ? liveRes : []);
      setVelocityAssets(Array.isArray(velocityRes.data) ? velocityRes.data : []);
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
    
    // Polling for live discovery
    const interval = setInterval(async () => {
      try {
        const liveRes = await api.request<any[]>('/livestream/active');
        setActiveStreams(Array.isArray(liveRes) ? liveRes : []);
      } catch (e) {}
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`⚠️ HARD-KILL PROMPT\n\nAre you sure you want to physically purge "${title}" from the B2 storage clusters and database? This action is irreversible.`)) return;
    
    try {
      await api.deleteVideo(id);
      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert("Hard-kill protocol failed. Check system logs.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    
    setIsUpdating(true);
    try {
      await api.updateVideo(editingVideo.id, editingVideo);
      setVideos(prev => prev.map(v => v.id === editingVideo.id ? { ...v, ...editingVideo } : v));
      setEditingVideo(null);
    } catch (err) {
      alert("Failed to update metadata.");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || v.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">Content <span className="text-primary">Control</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight">
            Moderating {videos.length} VODs across {categories.length} categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-amber-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <button 
              onClick={() => setIsIngestModalOpen(true)}
              className="relative flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-xl font-bold border border-white/10 hover:border-primary/50 transition-all active:scale-95"
            >
              <Upload className="h-5 w-5 text-primary" />
              Ingest Content
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5 backdrop-blur-md shadow-2xl">
          <button 
            onClick={() => setActiveTab("vod")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
              activeTab === "vod" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-500 hover:text-white"
            )}
          >
            <Video className="h-4 w-4" />
            VOD Catalog
          </button>
          <button 
            onClick={() => setActiveTab("live")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
              activeTab === "live" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-500 hover:text-white"
            )}
          >
            <Activity className="h-4 w-4" />
            Live Discovery
            {activeStreams.length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-white ml-1 animate-pulse" />
            )}
          </button>
        </div>

        {activeTab === "vod" && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 w-64 transition-all"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-zinc-300 focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c._ID || c.id} value={c._ID || c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === "vod" ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {loading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-[2.5rem] bg-white/5 animate-pulse border border-white/10" />
            ))
          ) : filteredVideos.length > 0 ? (
            filteredVideos.map((video, i) => (
              <div key={video.id || i} className="group relative flex flex-col glass-card rounded-[2.5rem] border-white/10 overflow-hidden hover:scale-[1.03] transition-all duration-500 shadow-2xl">
                {/* Thumbnail Container */}
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img 
                    src={video.thumbnailUrl || video.posterUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"} 
                    alt={video.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" />
                  
                  {/* Metadata Indicators */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-primary w-fit">
                      {video.categoryName || "CATALOGUE"}
                    </span>
                    
                    {/* Velocity Highlight */}
                    {velocityAssets.find(v => v.videoId === video.id || v.videoId?.includes(video.id?.substring(0,6))) && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md animate-pulse">
                         <Zap className="h-3 w-3 text-primary fill-primary" />
                         <span className="text-[8px] font-black text-white uppercase tracking-widest">
                            {velocityAssets.find(v => v.videoId === video.id || v.videoId?.includes(video.id?.substring(0,6))).status}
                         </span>
                         <span className="text-[8px] font-black text-primary">
                            {velocityAssets.find(v => v.videoId === video.id || v.videoId?.includes(video.id?.substring(0,6))).p2pSpike}
                         </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md w-fit">
                      <Database className="h-3 w-3 text-emerald-500" />
                      <span className="text-[8px] font-black text-emerald-500 uppercase">B2-NODE-01</span>
                    </div>
                  </div>

                  {/* Play Overlay */}
                  <div 
                    onClick={() => setPreviewVideo(video)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950/40 backdrop-blur-[2px] cursor-pointer"
                  >
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 scale-75 group-hover:scale-100 transition-transform duration-500">
                      <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <button 
                      onClick={() => setEditingVideo(video)}
                      className="h-9 w-9 rounded-xl bg-white text-zinc-950 flex items-center justify-center shadow-xl hover:bg-primary hover:text-white transition-all transform hover:rotate-6"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(video.id, video.title)}
                      className="h-9 w-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xl hover:bg-rose-600 transition-all transform hover:-rotate-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-6">
                  <h3 className="font-black text-white text-lg line-clamp-1 group-hover:text-primary transition-colors leading-tight">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Eye className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{(video.viewCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{video.duration || "0:00"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="px-2 py-0.5 rounded bg-zinc-800 border border-white/5 text-[8px] font-black text-white">
                          MP4
                       </div>
                       <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">{video.resolution || "1080P"}</span>
                    </div>
                    <div className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter">
                      V-{video.videoKey?.substring(0,6) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-6 bg-white/[0.02]">
               <div className="relative">
                  <Video className="h-20 w-20 text-zinc-800" />
                  <AlertCircle className="absolute -top-2 -right-2 h-8 w-8 text-primary animate-pulse" />
               </div>
               <div className="text-center">
                  <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-sm">Vault Depleted</p>
                  <p className="text-zinc-600 text-[11px] mt-2 font-medium max-w-[280px]">The content directory is currently empty or no assets match your tactical search criteria.</p>
               </div>
               <button 
                 onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                 className="mt-4 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all"
               >
                 Clear Search Pulse
               </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {activeStreams.length > 0 ? (
            activeStreams.map((stream, i) => (
              <div key={stream.id || i} className="group glass-card rounded-[2.5rem] border-white/5 p-6 hover:border-primary/30 transition-all duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Live Now</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-white leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {stream.title}
                </h3>
                <p className="text-zinc-500 text-sm font-medium line-clamp-2 mb-6">
                  {stream.description || `Broadcasting live content to Spred discovery hubs.`}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5 text-zinc-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold">{(stream.viewerCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary">
                      <Globe className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Global Hub</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest hover:text-primary transition-colors group/btn">
                    Monitor
                    <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 glass-card rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-center">
               <Activity className="h-20 w-20 text-zinc-800 mb-8 blur-[1px]" />
               <p className="text-white font-black text-2xl tracking-tighter uppercase">No Active Heartbeats</p>
               <p className="text-zinc-500 mt-2 font-medium tracking-tight max-w-[400px]">The Live Discovery registry is currently idle. Waiting for broadcaster ingestion signals from the global cluster.</p>
            </div>
          )}
        </div>
      )}

      {/* Metadata Orchestration Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 backdrop-blur-xl bg-zinc-950/60 animate-in fade-in duration-300">
          <div className="relative glass-card w-full max-w-2xl rounded-[3rem] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden scale-in-center">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter leading-none">Metadata Orchestration</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Refining asset discovery hooks</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingVideo(null)}
                className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:rotate-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleUpdate} className="p-10 space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Title</label>
                  <input 
                    type="text" 
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:border-primary transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Catalogue Category</label>
                  <select 
                    value={editingVideo.categoryId}
                    onChange={(e) => setEditingVideo({ ...editingVideo, categoryId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:border-primary transition-all font-bold appearance-none cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c._ID || c.id} value={c._ID || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Discovery Description</label>
                <textarea 
                  rows={4}
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-primary transition-all font-medium leading-relaxed"
                  placeholder="Draft asset narrative for the global feed..."
                />
              </div>

              {/* Cluster Intelligence */}
              <div className="p-6 rounded-[2rem] bg-zinc-950/40 border border-white/5 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Database className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-black uppercase tracking-widest">B2 Storage Cluster</p>
                    <p className="text-zinc-600 text-[10px] font-medium mt-0.5">spredmedia-video-content-01</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <p className="text-[9px] font-black text-zinc-600 uppercase">Health</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-[10px] font-bold text-white uppercase">Optimal</span>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-white/5" />
                  <div className="flex flex-col items-center">
                    <p className="text-[9px] font-black text-zinc-600 uppercase">Accessibility</p>
                    <div className="flex items-center gap-1 mt-1 text-primary">
                      <Lock className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Premium</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isUpdating ? "Syncing..." : (
                    <>
                      <Save className="h-4 w-4" />
                      Commit Metadata
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-10 backdrop-blur-2xl bg-zinc-950/80 animate-in fade-in duration-500">
          <div className="relative glass-card w-full max-w-5xl aspect-video rounded-[2.5rem] border-white/10 shadow-[0_0_150px_rgba(244,83,3,0.3)] overflow-hidden scale-in-center group/modal">
            {/* Playback Layer */}
            <video 
              autoPlay 
              controls 
              className="h-full w-full object-contain bg-black"
              poster={previewVideo.thumbnailUrl || previewVideo.posterUrl}
              onWaiting={() => setIsVideoLoading(true)}
              onPlaying={() => {
                setIsVideoLoading(false);
                setPlaybackError(null);
              }}
              onError={(e: any) => {
                console.error("Playback Error:", e);
                setPlaybackError("Failed to load stream. Please verify B2 connectivity or token validity.");
                setIsVideoLoading(false);
              }}
            >
              <source 
                src={`${previewVideo.videoUrl}${previewVideo.videoUrl.includes('?') ? '&' : '?'}token=${api.getToken()}`} 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>

            {/* Loading Overlay */}
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/20 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Establishing Secure Stream...</span>
                </div>
              </div>
            )}

            {/* Error Overlay */}
            {playbackError && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 backdrop-blur-md">
                <div className="max-w-md p-8 rounded-3xl bg-zinc-900 border border-white/10 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Streaming Error</h3>
                  <p className="text-zinc-500 text-xs mb-6 leading-relaxed">{playbackError}</p>
                  <button 
                    onClick={() => {
                      setPlaybackError(null);
                      // Force reload by resetting the same video
                      const v = previewVideo;
                      setPreviewVideo(null);
                      setTimeout(() => setPreviewVideo(v), 50);
                    }}
                    className="px-8 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}

            {/* Header Overlay (Auto-hide logic handled by group hover) */}
            <div className="absolute top-0 inset-x-0 p-8 bg-gradient-to-b from-zinc-950/90 to-transparent flex items-center justify-between opacity-0 group-hover/modal:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary fill-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-widest uppercase">{previewVideo.title}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{previewVideo.categoryName || "Catalogue"}</span>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{previewVideo.duration || "B2-NODE-STREAM"}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setPreviewVideo(null)}
                className="h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-all hover:rotate-90"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ingest Modal */}
      <IngestMediaModal 
        isOpen={isIngestModalOpen}
        categories={categories}
        onSuccess={loadContent}
        onClose={() => {
          setIsIngestModalOpen(false);
          loadContent(); // Refresh catalog after potential ingestion
        }}
      />
    </div>
  );
}
