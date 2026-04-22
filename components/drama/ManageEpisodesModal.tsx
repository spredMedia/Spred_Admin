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
  AlertCircle,
  Upload,
  Zap,
  Loader2,
  ArrowRight,
  Play,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

import { ActionModal } from "@/components/ActionModal";

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
  
  const [workMode, setWorkMode] = useState<"link" | "upload">("link");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Deletion State
  const [episodeToDelete, setEpisodeToDelete] = useState<string | null>(null);
  const [isDeletingEp, setIsDeletingEp] = useState(false);

  // Preview State
  const [previewEpisode, setPreviewEpisode] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
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

  const [episodePoster, setEpisodePoster] = useState<File | null>(null);

  const handleRapidIngest = async () => {
    if (!selectedFile || !series) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // 1. Prepare Metadata
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', `${series.Title} - Ep ${linkData.episodeNumber}`);
      formData.append('description', series.Synopsis || `Episode ${linkData.episodeNumber} of ${series.Title}`);
      formData.append('categoryId', series.Category || 'drama');
      formData.append('duration', '0'); // Duration handled by backend usually
      formData.append('rating', 'PG');

      // 2. Poster Strategy: Manual Upload OR Automatic Inheritance
      if (episodePoster) {
        formData.append('poster', episodePoster);
      } else if (series.PosterKey) {
        try {
          const posterUrl = `/api/ContentManager/Content/download-content?bucketName=spredmedia-video-content&key=${series.PosterKey}`;
          const response = await fetch(posterUrl);
          const blob = await response.blob();
          const posterFile = new File([blob], "poster.jpg", { type: "image/jpeg" });
          formData.append('poster', posterFile);
        } catch (e) {
          console.warn("Could not reuse series poster, placeholder will be used by backend");
        }
      }

      // 3. Trigger Ingestion
      const ingestRes = await api.ingestContent(formData, (percent: number) => {
        setUploadProgress(percent);
      });

      if (!ingestRes.succeeded) {
        throw new Error(ingestRes.message || "Ingestion failed");
      }

      const newContentId = ingestRes.data.id;

      // 4. Auto-Link Episode
      const linkRes = await api.request("/drama/series/episodes/link", {
        method: "POST",
        body: JSON.stringify({
          seriesId: series.SeriesId,
          contentId: newContentId,
          episodeNumber: linkData.episodeNumber,
          isPremium: linkData.isPremium
        })
      });

      if (linkRes.succeeded) {
        setSelectedFile(null);
        setUploadProgress(0);
        setLinkData(prev => ({ ...prev, episodeNumber: prev.episodeNumber + 1 }));
        loadData();
        alert("✅ Rapid Ingest Successful!");
      } else {
        alert("Video uploaded but linking failed. Please link it manually from the existing videos.");
      }

    } catch (err: any) {
      alert(`Rapid Ingest Failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEpisode = (episodeId: string) => {
    setEpisodeToDelete(episodeId);
  };

  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const handlePreview = async (ep: any) => {
    if (!ep.ContentId) {
      setPreviewEpisode(ep);
      setPreviewUrl('');
      return;
    }

    setIsLoadingPreview(true);
    setPreviewEpisode(ep);
    setPreviewUrl('');

    try {
      // Step 1: Find the videoKey from the already-loaded catalogue list
      const matched = availableVideos.find(
        v => v.id === ep.ContentId || v._id === ep.ContentId || String(v.id) === String(ep.ContentId)
      );

      let videoKey: string | null =
        matched?.videoKey || matched?.video_key || matched?.VideoKey || null;

      // Step 1b: Parse videoKey out of existing videoUrl if direct field is missing
      if (!videoKey && matched?.videoUrl) {
        try {
          videoKey = new URL(matched.videoUrl).searchParams.get('key');
        } catch {}
      }

      // Step 1c: If ContentId looks like a direct B2 filename (not a DB ID), use it directly
      if (!videoKey && ep.ContentId && !ep.ContentId.match(/^[0-9a-f]{24}$|^video_/)) {
        // Looks like a raw B2 fileId — can't directly use as filename, so try the catalogue stream key
        // or treat it as the key itself (some setups store B2 fileNames as ContentId)
        videoKey = ep.ContentId;
      }

      if (!videoKey) {
        console.warn('[Preview] No videoKey found for ContentId:', ep.ContentId, '| Loaded videos:', availableVideos.length);
        setIsLoadingPreview(false);
        return;
      }

      // Step 2: Use the EXISTING /api/b2/stream?redirect=false endpoint (returns signed URL as JSON).
      // api.request() sends the Bearer token via fetch() — something <video src> cannot do.
      const res: any = await api.request(`/b2/stream?key=${encodeURIComponent(videoKey)}&bucket=video&redirect=false`);

      if (res?.succeeded && res.data?.url) {
        setPreviewUrl(res.data.url);
      } else if ((res as any)?.url) {
        // Some proxy versions return url at top-level
        setPreviewUrl((res as any).url);
      } else {
        console.error('[Preview] Signed URL response unexpected:', res);
      }
    } catch (err) {
      console.error('[Preview] Failed:', err);
    } finally {
      setIsLoadingPreview(false);
    }
  };


  const commitDeleteEpisode = async () => {
    if (!episodeToDelete) return;
    
    setIsDeletingEp(true);
    try {
      const res = await api.request(`/drama/episodes/${episodeToDelete}`, {
        method: "DELETE"
      });

      if (res.succeeded) {
        setEpisodeToDelete(null);
        loadData();
      } else {
        alert(res.message || "Failed to remove episode.");
      }
    } catch (err) {
      alert("Error removing episode.");
    } finally {
      setIsDeletingEp(false);
    }
  };

  const handleTogglePremium = async (episodeId: string) => {
    try {
      const res = await api.request(`/drama/episodes/${episodeId}/toggle-premium`, {
        method: "PATCH"
      });
      if (res.succeeded) {
        loadData(); // Refresh list to show new status
      } else {
        alert(res.message || "Failed to toggle status.");
      }
    } catch (err: any) {
      alert("Error toggling status: " + err.message);
      console.error('Toggle premium failed:', err);
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
          
            {/* Form Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                     <Plus className="h-3 w-3 text-primary" />
                     Append Episode
                   </h3>
                   <div className="flex p-1 bg-zinc-950 rounded-xl border border-white/5">
                     <button 
                       onClick={() => setWorkMode("link")}
                       className={cn(
                         "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                         workMode === "link" ? "bg-primary text-white" : "text-zinc-600 hover:text-zinc-400"
                       )}
                     >
                       Existing
                     </button>
                     <button 
                       onClick={() => setWorkMode("upload")}
                       className={cn(
                         "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                         workMode === "upload" ? "bg-primary text-white" : "text-zinc-600 hover:text-zinc-400"
                       )}
                     >
                       Rapid Ingest
                     </button>
                   </div>
                 </div>
                 
                 {workMode === "link" ? (
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
                 ) : (
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Episode Video Asset</label>
                        <div 
                          className={cn(
                            "relative aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all p-4 text-center group",
                            selectedFile ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30 bg-zinc-950"
                          )}
                          onClick={() => document.getElementById('ep-video-input')?.click()}
                        >
                          <input 
                            id="ep-video-input"
                            type="file" 
                            accept="video/mp4,video/quicktime"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelectedFile(file);
                            }}
                          />
                          {selectedFile ? (
                            <>
                              <Film className="h-8 w-8 text-primary" />
                              <div className="space-y-1">
                                <p className="text-white text-[10px] font-bold line-clamp-1 px-4">{selectedFile.name}</p>
                                <p className="text-zinc-600 text-[8px] uppercase">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-zinc-700 group-hover:text-primary transition-colors" />
                              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest leading-none">Select Episode Video<br/><span className="text-[8px] opacity-50 mt-1">MP4 / MOV</span></p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Optional Poster Override */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Episode Poster (Optional Override)</label>
                        <div 
                          className={cn(
                            "relative h-20 rounded-2xl border-2 border-dashed flex items-center justify-center gap-4 transition-all px-4 cursor-pointer overflow-hidden bg-zinc-950",
                            episodePoster ? "border-amber-500/20 bg-amber-500/5" : "border-white/5 hover:border-white/20"
                          )}
                          onClick={() => document.getElementById('ep-poster-input')?.click()}
                        >
                           <input 
                              id="ep-poster-input"
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setEpisodePoster(file);
                              }}
                           />
                           {episodePoster ? (
                             <>
                               <div className="h-12 w-12 rounded-lg overflow-hidden border border-amber-500/30">
                                 <img src={URL.createObjectURL(episodePoster)} className="w-full h-full object-cover" alt="Preview"/>
                               </div>
                               <div className="flex-1 text-left">
                                 <p className="text-white text-[9px] font-black uppercase truncate">{episodePoster.name}</p>
                                 <p className="text-amber-500 text-[8px] font-black">OVERRIDING SERIES POSTER</p>
                               </div>
                               <Trash2 
                                 className="h-4 w-4 text-zinc-600 hover:text-rose-500 transition-colors cursor-pointer" 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setEpisodePoster(null);
                                 }}
                               />
                             </>
                           ) : (
                             <>
                                <Plus className="h-4 w-4 text-zinc-700" />
                                <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Custom Cover Art (Inherited by default)</span>
                             </>
                           )}
                        </div>
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

                      {isUploading ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-primary animate-pulse">Streaming to Cluster...</span>
                            <span className="text-white">{uploadProgress}%</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={handleRapidIngest}
                          disabled={!selectedFile}
                          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-amber-500 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Zap className="h-4 w-4 fill-white" />
                          Rapid Ingest
                        </button>
                      )}
                   </div>
                 )}
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

            {/* List Section */}
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
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                               ID: {ep.ContentId ? ep.ContentId.substring(0, 8) : ep.EpisodeId?.substring(0, 8) || 'pending'}
                            </span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 text-primary text-[8px] font-black uppercase border border-white/5">
                               <Video className="h-3 w-3" />
                               VOD Link
                            </div>
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {ep.IsPremium ? (
                        <button 
                          onClick={() => handleTogglePremium(ep.EpisodeId)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase hover:bg-amber-500/20 transition-all"
                          title="Click to make FREE"
                        >
                          <Lock className="h-2.5 w-2.5" />
                          Premium
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleTogglePremium(ep.EpisodeId)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase hover:bg-emerald-500/20 transition-all"
                          title="Click to make PREMIUM"
                        >
                          <Unlock className="h-2.5 w-2.5" />
                          Free
                        </button>
                      )}
                      <button 
                        onClick={() => handlePreview(ep)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
                        title="Preview Episode"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEpisode(ep.EpisodeId)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-rose-500 transition-all"
                      >
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
      <ActionModal 
        isOpen={!!episodeToDelete}
        onClose={() => setEpisodeToDelete(null)}
        onConfirm={commitDeleteEpisode}
        title="Remove Episode"
        description="☣️ This link will be permanently severed from the series sequence. The video asset will remain in the global registry but will no longer be associated with this drama."
        confirmLabel="Sever Link"
        variant="danger"
        loading={isDeletingEp}
      />

      {/* ─── Episode Video Preview Overlay ─── */}
      {previewEpisode && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Episode Preview</p>
              <h3 className="text-white font-bold text-lg mt-0.5">
                {series?.Title} — Ep {previewEpisode.EpisodeNumber}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {previewEpisode.IsPremium ? (
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
              <button
                onClick={() => { setPreviewEpisode(null); setPreviewUrl(''); }}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center p-6">
            {isLoadingPreview ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-zinc-500 text-sm font-black uppercase tracking-widest">Generating Secure Stream...</p>
              </div>
            ) : previewUrl ? (
              <video
                key={previewUrl}
                src={previewUrl}
                controls
                autoPlay
                className="max-h-full max-w-full rounded-2xl shadow-2xl"
                style={{ maxHeight: 'calc(100vh - 120px)' }}
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  console.error('Stream error:', target.error);
                }}
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4 opacity-50">
                <AlertCircle className="h-16 w-16 text-zinc-700" />
                <div>
                  <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">No Stream Available</p>
                  <p className="text-zinc-600 text-xs mt-1">This episode has no linked video key. Link a VOD first.</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-zinc-600 text-[10px]">Content ID: {previewEpisode.ContentId || 'Not linked'}</p>
            <p className="text-zinc-700 text-[10px]">🔒 Admin Preview Only — Watermarked for audit</p>
          </div>
        </div>
      )}
    </div>
  );
}
