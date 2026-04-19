"use client";

import { useState } from "react";
import { ChevronDown, Search, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface RowData {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
  priority: "high" | "medium" | "low";
  format?: (value: any) => string;
}

interface ResponsiveDataTableProps {
  columns: Column[];
  data: RowData[];
  title?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: RowData) => void;
}

export function ResponsiveDataTable({
  columns,
  data,
  title,
  searchPlaceholder = "Search...",
  onRowClick,
}: ResponsiveDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const highPriorityColumns = columns.filter((c) => c.priority === "high");
  const otherColumns = columns.filter((c) => c.priority !== "high");

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const exportCSV = () => {
    const headers = columns.map((c) => c.label).join(",");
    const rows = filteredData.map((row) =>
      columns.map((c) => {
        const val = row[c.key];
        return typeof val === "string" && val.includes(",")
          ? `"${val}"`
          : val;
      }).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-bold flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-primary text-sm"
        />
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredData.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "hover:bg-white/5 transition-all",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={`${row.id}-${col.key}`}
                    className="px-4 py-3 text-sm text-white"
                  >
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (shown only on mobile) */}
      <div className="md:hidden space-y-3">
        {filteredData.map((row) => (
          <div
            key={row.id}
            className="glass-card rounded-xl border-white/10 overflow-hidden"
          >
            {/* Card Header - High Priority Columns */}
            <button
              onClick={() => {
                setExpandedRow(
                  expandedRow === row.id ? null : row.id
                );
                onRowClick?.(row);
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-white/[0.03] transition-all"
            >
              <div className="flex-1 text-left space-y-2">
                {highPriorityColumns.map((col) => (
                  <div key={col.key}>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold">
                      {col.label}
                    </p>
                    <p className="text-sm font-bold text-white">
                      {col.format
                        ? col.format(row[col.key])
                        : row[col.key]}
                    </p>
                  </div>
                ))}
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-zinc-500 transition-transform flex-shrink-0",
                  expandedRow === row.id && "rotate-180"
                )}
              />
            </button>

            {/* Card Expanded - Other Columns */}
            {expandedRow === row.id && otherColumns.length > 0 && (
              <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 bg-white/[0.01]">
                {otherColumns.map((col) => (
                  <div key={col.key}>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">
                      {col.label}
                    </p>
                    <p className="text-sm text-white font-mono">
                      {col.format
                        ? col.format(row[col.key])
                        : row[col.key]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No data found</p>
        </div>
      )}

      {/* Results Count */}
      <div className="text-xs text-zinc-600 text-center">
        Showing {filteredData.length} of {data.length} items
      </div>
    </div>
  );
}
