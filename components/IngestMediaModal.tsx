"use client";

import { useState, useRef } from "react";
import { 
  X, 
  Upload, 
  Video, 
  Film, 
  Image as ImageIcon, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Globe,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface IngestMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  onSuccess: () => void;
}

export function IngestMediaModal({ isOpen, onClose, categories, onSuccess }: IngestMediaModalProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    duration: "01:30:00",
    rating: "PG",
  });

  const [files, setFiles] = useState<{
    video: File | null;
    trailer: File | null;
    poster: File | null;
  }>({
    video: null,
    trailer: null,
    poster: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.video || !files.poster || !formData.categoryId) {
      setError("Please provide all required assets (Video, Poster, and Category).");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("categoryId", formData.categoryId);
      data.append("duration", formData.duration);
      data.append("rating", formData.rating);
      
      if (files.video) data.append("video", files.video);
      if (files.trailer) data.append("trailer", files.trailer);
      if (files.poster) data.append("poster", files.poster);

      const res = await api.ingestContent(data, (perc) => setProgress(perc));
      
      if (res.succeeded) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(res.message || "Ingestion failed.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during ingestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 backdrop-blur-3xl bg-zinc-950/80 animate-in fade-in duration-500">
      <div className="relative glass-card w-full max-w-4xl rounded-[3rem] border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter leading-none">Catalogue Ingestion</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Orchestrating high-fidelity content discovery</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:rotate-90 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          
          {/* Metadata Grid */}
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Inception: The Global Broadcast"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category</label>
                   <select 
                     required
                     value={formData.categoryId}
                     onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-zinc-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                   >
                     <option value="">Select Region...</option>
                     {categories.map(c => (
                       <option key={c._ID || c.id} value={c._ID || c.id}>{c.name}</option>
                     ))}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Content Rating</label>
                   <input 
                     value={formData.rating}
                     onChange={(e) => setFormData({...formData, rating: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                   />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Discovery Narrative</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Atmospheric description for the global Spred feed..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
            </div>

            {/* Asset Assignment Group */}
            <div className="space-y-6">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Zap className="h-3 w-3 text-primary fill-primary" />
                Physical Matrix Assets
              </p>
              
              {/* Video Upload Dropzone */}
              <div 
                className={cn(
                  "relative group flex flex-col items-center justify-center py-10 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer",
                  files.video ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/10 hover:border-primary/50"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                  <input 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => setFiles({...files, video: e.target.files?.[0] || null})}
                  />
                  {files.video ? (
                    <div className="flex flex-col items-center text-center px-4">
                       <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                          <Video className="h-6 w-6 text-emerald-500" />
                       </div>
                       <p className="text-xs font-black text-white truncate max-w-[200px]">{files.video.name}</p>
                       <p className="text-[10px] text-zinc-500 font-bold mt-1">{(files.video.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                    </div>
                  ) : (
                    <>
                      <Film className="h-10 w-10 text-zinc-700 mb-4 group-hover:text-primary transition-colors" />
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Main High-Fidelity Feature</p>
                      <p className="text-[9px] text-zinc-600 font-bold mt-1">MP4 / MOV / AV1 SUPPORTED</p>
                    </>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={cn(
                      "group p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center",
                      files.trailer ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/10 hover:border-primary/30"
                    )}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'video/*';
                      input.onchange = (e: any) => setFiles({...files, trailer: e.target.files?.[0] || null});
                      input.click();
                    }}
                  >
                     <Zap className={cn("h-6 w-6 mb-2", files.trailer ? "text-emerald-500" : "text-zinc-700 group-hover:text-primary")} />
                     <p className="text-[9px] font-black text-white uppercase truncate max-w-full">
                       {files.trailer ? files.trailer.name : "Trailer Input"}
                     </p>
                  </div>

                  <div 
                    className={cn(
                      "group p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center",
                      files.poster ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/10 hover:border-primary/30"
                    )}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => setFiles({...files, poster: e.target.files?.[0] || null});
                      input.click();
                    }}
                  >
                     <ImageIcon className={cn("h-6 w-6 mb-2", files.poster ? "text-emerald-500" : "text-zinc-700 group-hover:text-primary")} />
                     <p className="text-[9px] font-black text-white uppercase truncate max-w-full">
                       {files.poster ? files.poster.name : "High-Res Poster"}
                     </p>
                  </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Indicator */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 flex flex-wrap items-center justify-between gap-8">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                   <Database className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                   <h4 className="text-white text-xs font-black uppercase tracking-widest">Storage Target</h4>
                   <p className="text-zinc-600 text-[10px] font-medium mt-1">spredmedia-video-content • CLUSTER-01</p>
                </div>
             </div>
             <div className="flex items-center gap-10">
                <div className="text-right">
                   <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Network Path</p>
                   <p className="text-[10px] font-black text-white flex items-center gap-2 mt-1 justify-end">
                      <Globe className="h-3 w-3 text-primary" />
                      ENCRYPTED GATEWAY
                   </p>
                </div>
             </div>
          </div>
        </form>

        {/* Footer & Progress */}
        <div className="p-8 bg-zinc-950/40 border-t border-white/5 backdrop-blur-md">
          {loading && (
            <div className="mb-8 space-y-3 px-2">
               <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-primary">
                  <span>Transmitting Matrix Pulse...</span>
                  <span className="font-mono">{progress}%</span>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 shadow-[0_0_15px_rgba(244,83,3,0.5)]" 
                    style={{ width: `${progress}%` }}
                  />
               </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-500">
               <AlertCircle className="h-5 w-5 shrink-0" />
               <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-500">
               <CheckCircle2 className="h-5 w-5 shrink-0" />
               <p className="text-[10px] font-black uppercase tracking-widest">Pulse Synchronized. Content Live in Spred Vault.</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 rounded-2xl border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Abort Ingestion
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:-translate-y-1 hover:shadow-primary/50 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? "TRANSMITTING..." : "COMMAND INGESTION"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
