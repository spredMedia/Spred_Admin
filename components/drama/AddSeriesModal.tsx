"use client";

import { useState } from "react";
import { 
  X, 
  Save, 
  Upload, 
  Film, 
  Users, 
  Tag as TagIcon,
  Plus,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  api: any;
}

export function AddSeriesModal({ isOpen, onClose, onSuccess, api }: AddSeriesModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    posterKey: "",
    tags: "",
    seriesPrice: 5000,
  });

  const [cast, setCast] = useState<any[]>([]);
  const [newCastMember, setNewCastMember] = useState({ name: "", role: "", avatar: "" });

  const addCastMember = () => {
    if (newCastMember.name && newCastMember.role) {
      setCast([...cast, newCastMember]);
      setNewCastMember({ name: "", role: "", avatar: "" });
    }
  };

  const removeCastMember = (index: number) => {
    setCast(cast.filter((_, i) => i !== index));
  };

  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('synopsis', formData.synopsis);
      formDataToSend.append('seriesPrice', String(formData.seriesPrice));
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('cast', JSON.stringify(cast));
      
      if (posterFile) {
        formDataToSend.append('poster', posterFile);
      }

      // Using axios/fetch for multipart since api.request is JSON-centric
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/drama/series/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const res = await response.json();

      if (res.succeeded) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || "Failed to create series.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 backdrop-blur-3xl bg-zinc-950/80 animate-in fade-in duration-500">
      <div className="relative glass-card w-full max-w-4xl rounded-[3rem] border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh] scale-in-center">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter leading-none">Initialize New Series</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Creating the master record for episodic content</p>
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
          
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Series Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. Divorce Tears from the Alpha..."
                />
              </div>

              {/* Poster Upload Zone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Series Artwork (Portrait)</label>
                <div 
                  onClick={() => document.getElementById('series-poster-input')?.click()}
                  className={cn(
                    "relative group aspect-[2/3] rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-zinc-950",
                    posterFile ? "border-primary/50 shadow-2xl shadow-primary/10" : "border-white/10 hover:border-primary/30"
                  )}
                >
                  <input 
                    id="series-poster-input"
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPosterFile(file);
                    }}
                  />
                  {posterFile ? (
                    <div className="relative w-full h-full group">
                      <img 
                        src={URL.createObjectURL(posterFile)} 
                        alt="Preview" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">Change Artwork</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-zinc-700 group-hover:text-primary transition-colors mb-4" />
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Upload Main Poster</p>
                      <p className="text-zinc-600 text-[8px] font-bold mt-2 uppercase">JPEG / PNG High-Res</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Series Price (Coins)</label>
                <input 
                  type="number"
                  value={formData.seriesPrice}
                  onChange={(e) => setFormData({...formData, seriesPrice: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Series Synopsis</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({...formData, synopsis: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="The emotional journey of Ella..."
                />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Discovery Tags</label>
                 <input 
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Drama, Alpha, CEO (Comma separated)"
                  />
              </div>

              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2 pt-4">
                <Users className="h-3 w-3 text-primary" />
                Cast Manifest
              </label>
              
              <div className="space-y-3">
                {cast.map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black uppercase text-primary border border-white/5">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{member.name}</p>
                        <p className="text-[10px] text-zinc-600 mt-1 font-medium">{member.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeCastMember(i)}
                      className="text-rose-500 hover:text-rose-400 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder="Actor Name"
                    value={newCastMember.name}
                    onChange={(e) => setNewCastMember({...newCastMember, name: e.target.value})}
                    className="bg-transparent border-b border-white/10 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                  <input 
                    placeholder="Role (e.g. Lead)"
                    value={newCastMember.role}
                    onChange={(e) => setNewCastMember({...newCastMember, role: e.target.value})}
                    className="bg-transparent border-b border-white/10 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <button 
                  onClick={addCastMember}
                  className="w-full py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                  Append Cast Member
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-zinc-950/40 border-t border-white/5">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase text-center tracking-widest">
              {error}
            </div>
          )}
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:bg-white/5"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Initializing..." : (
                <>
                  <Save className="h-4 w-4" />
                  Orchestrate Series
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
