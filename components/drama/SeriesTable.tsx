"use client";

import { useState } from "react";
import { 
  Film, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  PlusSquare,
  Eye,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SeriesTableProps {
  series: any[];
  onManageEpisodes: (series: any) => void;
  onEdit: (series: any) => void;
  onDelete: (id: string) => void;
}

export function SeriesTable({ series, onManageEpisodes, onEdit, onDelete }: SeriesTableProps) {
  return (
    <div className="w-full overflow-hidden glass-card rounded-[2.5rem] border-white/10 shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Series Identity</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Narrative</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Engagement</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Earnings</th>
            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {series.length > 0 ? series.map((item) => (
            <tr key={item.SeriesId} className="group hover:bg-white/[0.02] transition-colors">
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-12 rounded-lg bg-zinc-900 border border-white/10 overflow-hidden relative">
                    {item.PosterKey ? (
                      <img src={item.PosterKey} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Film className="h-5 w-5 text-zinc-800" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors">{item.Title}</h4>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">ID: {item.SeriesId.substring(0, 12)}</p>
                  </div>
                </div>
              </td>
              <td className="p-6 max-w-md">
                <p className="text-xs text-zinc-400 font-medium line-clamp-2 leading-relaxed">
                  {item.Synopsis || "No synopsis defined for this series."}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                    item.SeriesPrice > 0 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  )}>
                    {item.SeriesPrice > 0 ? `${item.SeriesPrice} Coins` : "Free Access"}
                  </span>
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <Eye className="h-3 w-3" />
                    <span className="text-[10px] font-black">{item.TotalViews || 0}</span>
                  </div>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">{item.TotalEpisodes || 0} Episodes</span>
                </div>
              </td>
              <td className="p-6 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-black text-emerald-500">
                    ₦{((item.TotalViews || 0) * 0.5 + (item.TotalPurchaseRevenue || 0) * 0.7).toLocaleString()}
                  </span>
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">Estimated</span>
                </div>
              </td>
              <td className="p-6">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onManageEpisodes(item)}
                    className="h-10 px-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                  >
                    Manage Episodes
                  </button>
                  <button 
                    onClick={() => onEdit(item)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(item.SeriesId)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="p-32 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-[2rem] bg-zinc-950/50 flex items-center justify-center border border-white/5 shadow-2xl">
                    <Film className="h-10 w-10 text-zinc-800" />
                  </div>
                  <div>
                    <h5 className="text-white font-black text-xl tracking-tight">Empty Discovery Hub</h5>
                    <p className="text-zinc-600 font-medium text-xs mt-1">No drama series have been ingested into the global registry yet.</p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
