"use client";

import { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Download,
  Trash2,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowSelect?: (row: T) => void;
  onDelete?: (rows: T[]) => void;
  onExport?: (data: T[]) => void;
  selectable?: boolean;
  title?: string;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  onRowSelect,
  onDelete,
  onExport,
  selectable = true,
  title,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.map((c) => c.key))
  );
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery) {
      result = result.filter((row) =>
        columns.some(
          (col) =>
            String(row[col.key])
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter((row) =>
          values.includes(String(row[key as keyof T]))
        );
      }
    });

    // Apply sorting
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal === bVal) return 0;
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        return sortOrder === "asc" ? 1 : -1;
      });
    }

    return result;
  }, [data, searchQuery, sortKey, sortOrder, filters, columns]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(
    () =>
      processedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [processedData, currentPage]
  );

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleSelectRow = (row: T) => {
    const rowId = row.id || JSON.stringify(row);
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      const newSelected = new Set<string | number>();
      paginatedData.forEach((row) => {
        newSelected.add(row.id || JSON.stringify(row));
      });
      setSelectedRows(newSelected);
    }
  };

  const toggleColumnVisibility = (key: keyof T) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
    }
    setVisibleColumns(newVisible);
  };

  const handleExport = () => {
    const csv = convertToCSV(processedData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-${Date.now()}.csv`;
    a.click();
  };

  const handleDeleteSelected = () => {
    const rowsToDelete = paginatedData.filter(
      (row) => selectedRows.has(row.id || JSON.stringify(row))
    );
    if (rowsToDelete.length > 0 && onDelete) {
      onDelete(rowsToDelete);
      setSelectedRows(new Set());
    }
  };

  const convertToCSV = (rows: T[]): string => {
    const visibleCols = columns.filter((c) => visibleColumns.has(c.key));
    const headers = visibleCols.map((c) => c.label).join(",");
    const body = rows
      .map((row) =>
        visibleCols
          .map((col) => JSON.stringify(row[col.key] || ""))
          .join(",")
      )
      .join("\n");
    return `${headers}\n${body}`;
  };

  const visibleFilterableColumns = columns.filter(
    (c) => c.filterable && visibleColumns.has(c.key)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || selectable || onExport) && (
        <div className="flex items-center justify-between gap-4">
          {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
          <div className="flex items-center gap-2 ml-auto">
            {selectedRows.size > 0 && onDelete && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedRows.size})
              </button>
            )}
            {onExport && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
          <Search className="h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 bg-transparent text-white placeholder-zinc-600 outline-none text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Column Visibility & Filters */}
        {(visibleFilterableColumns.length > 0 || columns.length > visibleColumns.size) && (
          <div className="flex items-center gap-2 flex-wrap">
            {columns.length > visibleColumns.size && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-500 font-medium uppercase">
                  Columns:
                </label>
                <div className="flex gap-1 flex-wrap">
                  {columns.map((col) => (
                    <button
                      key={String(col.key)}
                      onClick={() => toggleColumnVisibility(col.key)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-medium transition-all",
                        visibleColumns.has(col.key)
                          ? "bg-primary/20 text-primary"
                          : "bg-white/5 text-zinc-500"
                      )}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded accent-primary"
                  />
                </th>
              )}
              {columns
                .filter((c) => visibleColumns.has(c.key))
                .map((col) => (
                  <th
                    key={String(col.key)}
                    className={cn(
                      "px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-400",
                      col.width || "flex-1"
                    )}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        {col.label}
                        {sortKey === col.key && (
                          sortOrder === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => {
              const rowId = row.id || JSON.stringify(row);
              const isSelected = selectedRows.has(rowId);
              return (
                <tr
                  key={idx}
                  className={cn(
                    "border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer",
                    isSelected && "bg-primary/10"
                  )}
                  onClick={() => onRowSelect?.(row)}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded accent-primary"
                      />
                    </td>
                  )}
                  {columns
                    .filter((c) => visibleColumns.has(c.key))
                    .map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-6 py-4 text-sm text-zinc-300"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key] || "-")}
                      </td>
                    ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500 text-sm">No data to display</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, processedData.length)} of{" "}
            {processedData.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 hover:bg-white/10"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                totalPages <= 5
                  ? i + 1
                  : Math.max(1, currentPage - 2) + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    page === currentPage
                      ? "bg-primary text-white"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  )}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-white/5 text-white disabled:opacity-50 hover:bg-white/10"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
