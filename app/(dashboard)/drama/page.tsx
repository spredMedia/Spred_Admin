"use client";

import { useEffect, useState } from "react";
import { 
  Film, 
  Plus, 
  Search, 
  Filter,
  Activity,
  Zap,
  LayoutGrid,
  List,
  Eye
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionModal } from "@/components/ActionModal";
import { SeriesTable } from "@/components/drama/SeriesTable";
import { AddSeriesModal } from "@/components/drama/AddSeriesModal";
import { ManageEpisodesModal } from "@/components/drama/ManageEpisodesModal";

export default function DramaCenterPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageEpisodesOpen, setIsManageEpisodesOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<any | null>(null);

  // Deletion State
  const [seriesToDelete, setSeriesToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadSeries() {
    setLoading(true);
    try {
      const res = await api.request<any[]>('/drama/series');
      setSeries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load drama series:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSeries();
  }, []);

  const handleDelete = (id: string) => {
    setSeriesToDelete(id);
  };

  const commitDeleteSeries = async () => {
    if (!seriesToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await api.request(`/drama/series/${seriesToDelete}`, {
        method: "DELETE"
      });

      if (res.succeeded) {
        setSeriesToDelete(null);
        loadSeries();
      } else {
        alert(res.message || "Purge failed.");
      }
    } catch (err) {
      alert("Network protocol error during purge.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSeries = series.filter(s => 
    s.Title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">Drama <span className="text-primary">Center</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight">
            Orchestrating {series.length} episodic series for the global discovery hub.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-amber-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="relative flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-xl font-bold border border-white/10 hover:border-primary/50 transition-all active:scale-95"
            >
              <Plus className="h-5 w-5 text-primary" />
              Initialize Series
            </button>
          </div>
        </div>
      </div>

      {/* Global Analytics Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-[2rem] bg-zinc-950/40 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Total Series Views</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white">{series.reduce((acc, s) => acc + (s.TotalViews || 0), 0).toLocaleString()}</h3>
            <span className="text-[10px] font-bold text-emerald-500 tracking-widest">+12.4%</span>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-zinc-950/40 border border-white/5 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="h-20 w-20 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Creator Revenue</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-emerald-500">
               ₦{series.reduce((acc, item) => acc + ((item.TotalViews || 0) * 0.5 + (item.TotalPurchaseRevenue || 0) * 0.7), 0).toLocaleString()}
            </h3>
            <span className="text-[10px] font-bold text-zinc-600 tracking-widest leading-none">ESTIMATED</span>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-zinc-950/40 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Film className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Monetized Series</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white">{series.filter(s => s.SeriesPrice > 0).length}</h3>
            <span className="text-[10px] font-bold text-zinc-600 tracking-widest">/ {series.length} Total</span>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] bg-zinc-950/40 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <List className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">In-Hub Episodes</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white">{series.reduce((acc, s) => acc + (s.TotalEpisodes || 0), 0)}</h3>
            <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">Global Capacity</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5 backdrop-blur-md shadow-2xl">
           <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 border border-white/5 text-zinc-400 uppercase tracking-widest">
              <Film className="h-4 w-4" />
              Series Vault
           </div>
           <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest cursor-pointer group">
              <Activity className="h-4 w-4 group-hover:text-primary transition-colors" />
              Financial Pulse
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search series registry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 w-64 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 cursor-pointer hover:text-white transition-all">
             <Filter className="h-4 w-4" />
             <span className="text-xs font-bold uppercase tracking-widest">Advanced Filter</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="w-full aspect-[2/1] bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse flex items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <Zap className="h-10 w-10 text-zinc-800 animate-bounce" />
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Querying Global Database...</span>
           </div>
        </div>
      ) : (
        <SeriesTable 
          series={filteredSeries}
          onManageEpisodes={(s) => {
            setSelectedSeries(s);
            setIsManageEpisodesOpen(true);
          }}
          onEdit={(s) => alert(`Edit Identity Protocol: ${s.Title}`)}
          onDelete={handleDelete}
          onPosterUpdated={loadSeries}
        />
      )}

      {/* Modals */}
      <AddSeriesModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadSeries}
        api={api}
      />

      <ManageEpisodesModal 
        isOpen={isManageEpisodesOpen}
        onClose={() => setIsManageEpisodesOpen(false)}
        series={selectedSeries}
        api={api}
      />

      <ActionModal 
        isOpen={!!seriesToDelete}
        onClose={() => setSeriesToDelete(null)}
        onConfirm={commitDeleteSeries}
        title="Purge Drama Series"
        description="⚠️ You are about to initiate a Hard-Kill protocol. This series and all associated episode sequences will be permanently purged from the registry."
        confirmLabel="Initiate Purge"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
