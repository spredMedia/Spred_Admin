"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  FolderTree, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Settings2, 
  MoreVertical 
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";

export default function CataloguePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function loadCatalogue() {
    setLoading(true);
    try {
      const [catRes, typeRes] = await Promise.all([
        api.getCategories(),
        api.getContentTypes()
      ]);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setContentTypes(Array.isArray(typeRes.data) ? typeRes.data : []);
    } catch (err) {
      console.error("Catalogue fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setIsSyncing(true);
    try {
      await api.triggerSystemSync();
      await loadCatalogue();
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }

  useEffect(() => {
    loadCatalogue();
  }, []);

  const handleCreateCategory = async () => {
    if (!newName) return;
    setActionLoading(true);
    try {
      await api.createCategory(newName, newDesc);
      setIsAddModalOpen(false);
      setNewName("");
      setNewDesc("");
      loadCatalogue();
    } catch (err: any) {
      alert(err.message || "Failed to create category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCat) return;
    setActionLoading(true);
    try {
      await api.deleteCategory(selectedCat.id || selectedCat._ID);
      setIsDeleteModalOpen(false);
      setSelectedCat(null);
      loadCatalogue();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">System <span className="text-primary">Catalogue</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight">Managing global content taxonomy and types.</p>
        </div>
        <div className="flex items-center gap-4 self-start">
            <button 
                onClick={handleSync}
                disabled={isSyncing}
                className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 border",
                    isSyncing ? "bg-white/5 border-white/10 text-zinc-500 cursor-wait" : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                )}
            >
                <Settings2 className={cn("h-5 w-5", isSyncing && "animate-spin")} />
                {isSyncing ? "Syncing..." : "Sync Storage"}
            </button>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
            >
                <Plus className="h-5 w-5" />
                Define Category
            </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Categories Section */}
        <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FolderTree className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Active Categories</h2>
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{categories.length} entries</span>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {loading ? (
                Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)
              ) : categories.map((cat, i) => (
                <div key={i} className="group flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-primary font-black">
                        {cat.name?.[0]}
                     </div>
                     <div>
                        <p className="font-bold text-zinc-100 group-hover:text-primary transition-colors">{cat.name}</p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter/2 mt-0.5">ID: #{ (cat.id || cat._ID || cat.Id)?.toString().slice(0, 8)}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedCat(cat);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Plus className="h-4 w-4 rotate-45" />
                    </button>
                    <button className="p-2 rounded-lg text-zinc-600 hover:text-white transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Types Section */}
        <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Layers className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Schema Types</h2>
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{contentTypes.length} entries</span>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {loading ? (
                Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)
              ) : contentTypes.map((type, i) => (
                <div key={i} className="group flex items-center justify-between p-5 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-500">
                        <FileText className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="font-bold text-zinc-100 group-hover:text-blue-500 transition-colors">{type.name || type.Type}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                           <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Schema</span>
                        </div>
                     </div>
                  </div>
                  <button className="p-2 rounded-lg text-zinc-600 hover:text-white transition-colors">
                    <Settings2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Viral Discovery Index */}
      <div className="glass-card rounded-[3rem] border-primary/10 overflow-hidden">
          <div className="p-10 bg-gradient-to-br from-primary/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-[2rem] bg-primary/20 flex items-center justify-center">
                      <Plus className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div>
                      <h2 className="text-3xl font-black text-white tracking-tight">Viral Discovery <span className="text-primary font-mono text-xl ml-2">INDEX</span></h2>
                      <p className="text-zinc-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Identifying high-velocity viewership trajectories.</p>
                  </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Trend Probe Active</span>
              </div>
          </div>

          <div className="p-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Lush Life in Lagos", category: "Entertainment", velocity: "14.2k", trend: "+124%", color: "text-emerald-500" },
                { title: "Afrobeats Global Tour", category: "Music", velocity: "8.9k", trend: "+82%", color: "text-primary" },
                { title: "Spred Tech Summit", category: "Education", velocity: "5.4k", trend: "+45%", color: "text-blue-500" },
              ].map((v, i) => (
                <div key={i} className="group relative p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-500">
                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">{v.trend}</span>
                    </div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">{v.category}</p>
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight mb-6">{v.title}</h4>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Velocity Score</span>
                            <span className="text-xl font-black text-white">{v.velocity} <span className="text-[10px] text-zinc-600 font-medium">VPH</span></span>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                            <Layers className="h-5 w-5 text-zinc-500" />
                        </div>
                    </div>
                </div>
              ))}
          </div>
      </div>

      {/* Modals */}
      <ActionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleCreateCategory}
        title="Define New Category"
        description="Expand the SPRED taxonomy with a new content category."
        confirmLabel="Create Category"
        loading={actionLoading}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Category Name</label>
            <input 
              type="text" 
              placeholder="e.g. Documentary, Tech, Lifestyle"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Public Description</label>
            <textarea 
              placeholder="Describe the type of content this category encompasses..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px] resize-none"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
        </div>
      </ActionModal>

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Remove Category"
        description={`Are you sure you want to remove "${selectedCat?.name}"? This action cannot be easily reversed.`}
        confirmLabel="Delete Permanently"
        variant="danger"
        loading={actionLoading}
      />
    </div>
  );
}
