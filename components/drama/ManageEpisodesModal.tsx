"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Plus, 
  Film, 
  Trash2, 
  Video, 
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ManageEpisodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  series: any;
  api: any;
}

export function ManageEpisodesModal({ isOpen, onClose, series, api }: ManageEpisodesModalProps) {
  const [loading, setLoading] = useState(false);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [availableVideos, setAvailableVideos] = useState<any[]>([]);
  const [isLinking, setIsLinking] = useState(false);
  
  const [linkData, setLinkData] = useState({
    contentId: "",
    episodeNumber: 1,
    isPremium: true
  });

  async function loadData() {
    if (!series) return;
    setLoading(true);
    try {
      const [seriesRes, videosRes] = await Promise.all([
        api.request(`/drama/series/${series.SeriesId}`),
        api.getAllVideos()
      ]);
      setEpisodes(seriesRes.data.episodes || []);
      setAvailableVideos(Array.isArray(videosRes.data) ? videosRes.data : []);
      setLinkData(prev => ({ ...prev, episodeNumber: (seriesRes.data.episodes?.length || 0) + 1 }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen && series) {
      loadData();
    }
  }, [isOpen, series]);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkData.contentId) return;
    
    setIsLinking(true);
    try {
      const res = await api.request("/drama/series/episodes/link", {
        method: "POST",
        body: JSON.stringify({
          seriesId: series.SeriesId,
          ...linkData
        })
      });

      if (res.succeeded) {
        loadData();
        setLinkData(prev => ({ ...prev, contentId: "", episodeNumber: prev.episodeNumber + 1 }));
      } else {
        alert(res.message || "Failed to link episode.");
      }
    } catch (err) {
      alert("An error occurred.");
    } finally {
      setIsLinking(false);
    }
  };

  if (!isOpen || !series) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 backdrop-blur-3xl bg-zinc-950/80 animate-in fade-in duration-500">
      <div className="relative glass-card w-full max-w-5xl rounded-[3rem] border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter leading-none">Episode Inventory</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{series.Title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:rotate-90 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Link Form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                 <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                   <Plus className="h-3 w-3 text-primary" />
                   Append Episode
                 </h3>
                 
                 <form onSubmit={handleLink} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Source Video</label>
                      <select 
                        required
                        value={linkData.contentId}
                        onChange={(e) => setLinkData({...linkData, contentId: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-bold focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Choose Approved Video...</option>
                        {availableVideos.filter(v => !episodes.some(e => e.ContentId === v.id)).map(v => (
                          <option key={v.id} value={v.id}>{v.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ep Number</label>
                        <input 
                          type="number"
                          value={linkData.episodeNumber}
                          onChange={(e) => setLinkData({...linkData, episodeNumber: parseInt(e.target.value)})}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-bold focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pricing Matrix</label>
                        <div 
                          onClick={() => setLinkData({...linkData, isPremium: !linkData.isPremium})}
                          className={cn(
                            "flex items-center gap-2 h-[41px] px-4 rounded-xl border cursor-pointer transition-all",
                            linkData.isPremium ? "border-amber-500/20 bg-amber-500/5 text-amber-500" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                          )}
                        >
                          {linkData.isPremium ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                          <span className="text-[9px] font-black uppercase tracking-widest">{linkData.isPremium ? "Premium" : "Free"}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLinking || !linkData.contentId}
                      className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                      {isLinking ? "Synchronizing..." : "Link to Series"}
                    </button>
                 </form>
              </div>

              <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                     <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                   </div>
                   <div>
                     <p className="text-white text-[10px] font-black uppercase tracking-widest leading-none">Global Metadata Sync</p>
                     <p className="text-zinc-600 text-[9px] mt-1 font-medium">All episodes share master series title/synopsis</p>
                   </div>
                 </div>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Current Episode Sequence</h3>
              
              <div className="grid gap-4">
                {episodes.length > 0 ? episodes.map((ep) => (
                  <div key={ep.EpisodeId} className="group flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-primary font-black text-xl">
                        {ep.EpisodeNumber}
                      </div>
                      <div>
                         <h4 className="text-white text-sm font-bold line-clamp-1">{series.Title} (Ep {ep.EpisodeNumber})</h4>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">ID: {ep.ContentId.substring(0,8)}</span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 text-primary text-[8px] font-black uppercase border border-white/5">
                               <Video className="h-3 w-3" />
                               VOD Link
                            </div>
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {ep.IsPremium ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase">
                          <Lock className="h-2.5 w-2.5" />
                          Premium
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase">
                          <Unlock className="h-2.5 w-2.5" />
                          Free
                        </div>
                      )}
                      <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-rose-500 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                    <AlertCircle className="h-12 w-12 text-zinc-800 mb-4" />
                    <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">Registry Empty</p>
                    <p className="text-zinc-700 text-[10px] mt-1">Start linking approved VODs to this series sequence.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
