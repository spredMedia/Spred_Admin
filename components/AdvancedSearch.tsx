"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Search,
  X,
  Clock,
  Bookmark,
  Trash2,
  ChevronDown,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedFilter {
  id: string;
  name: string;
  query: string;
  filters: Record<string, any>;
  createdAt: Date;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: Record<string, any>) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  filterOptions?: Array<{
    key: string;
    label: string;
    type: "select" | "date" | "daterange" | "number" | "text";
    options?: Array<{ label: string; value: string }>;
  }>;
  placeholder?: string;
}

export function AdvancedSearch({
  onSearch,
  onFilterChange,
  filterOptions = [],
  placeholder = "Search...",
}: AdvancedSearchProps) {
  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [filterName, setFilterName] = useState("");

  const handleSearch = useCallback(() => {
    onSearch(query, activeFilters);
    if (query && !searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev.slice(0, 9)]);
    }
  }, [query, activeFilters, onSearch, searchHistory]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters };
    if (value === null || value === "") {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleClearAll = () => {
    setQuery("");
    setActiveFilters({});
    onSearch("", {});
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    const newSavedFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      query,
      filters: activeFilters,
      createdAt: new Date(),
    };
    setSavedFilters((prev) => [newSavedFilter, ...prev]);
    setFilterName("");
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    setQuery(filter.query);
    setActiveFilters(filter.filters);
    onSearch(filter.query, filter.filters);
    setShowSaved(false);
  };

  const handleDeleteSavedFilter = (id: string) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const activeFilterCount = Object.keys(activeFilters).length;
  const hasActiveSearch = query || activeFilterCount > 0;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 hover:border-white/20 transition-colors">
          <Search className="h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowHistory(e.target.value.length === 0 && searchHistory.length > 0);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-transparent text-white placeholder-zinc-600 outline-none text-sm"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setShowHistory(true);
              }}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              showAdvanced
                ? "bg-primary text-white"
                : "bg-white/5 text-zinc-400 hover:bg-white/10"
            )}
          >
            <Filter className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
          >
            Search
          </button>
        </div>

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
            <p className="text-xs font-bold uppercase text-zinc-500 px-2">Recent Searches</p>
            {searchHistory.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(item);
                  setShowHistory(false);
                  setQuery(item);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <Clock className="h-4 w-4 text-zinc-600" />
                <span className="text-sm text-zinc-300 truncate">{item}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && filterOptions.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterOptions.map((option) => (
              <div key={option.key} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {option.label}
                </label>
                {option.type === "select" && (
                  <select
                    value={activeFilters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">All</option>
                    {option.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {option.type === "date" && (
                  <input
                    type="date"
                    value={activeFilters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                )}
                {option.type === "daterange" && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={activeFilters[`${option.key}_from`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${option.key}_from`, e.target.value)
                      }
                      className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      placeholder="From"
                    />
                    <input
                      type="date"
                      value={activeFilters[`${option.key}_to`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${option.key}_to`, e.target.value)
                      }
                      className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      placeholder="To"
                    />
                  </div>
                )}
                {option.type === "number" && (
                  <input
                    type="number"
                    value={activeFilters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    placeholder="Enter value"
                  />
                )}
                {option.type === "text" && (
                  <input
                    type="text"
                    value={activeFilters[option.key] || ""}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    placeholder="Enter text"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Save & Load Filters */}
          <div className="border-t border-white/10 pt-6 flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Filter name (optional)"
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Bookmark className="h-4 w-4" />
                Save
              </button>
            </div>

            {savedFilters.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowSaved(!showSaved)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
                >
                  Saved ({savedFilters.length})
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showSaved && (
                  <div className="absolute top-full right-0 mt-2 bg-zinc-950 border border-white/10 rounded-xl p-3 space-y-2 w-64 z-50 shadow-xl">
                    {savedFilters.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-white/10 group"
                      >
                        <button
                          onClick={() => handleLoadFilter(f)}
                          className="flex-1 text-left text-sm text-zinc-300 hover:text-white"
                        >
                          {f.name}
                        </button>
                        <button
                          onClick={() => handleDeleteSavedFilter(f.id)}
                          className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-500 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-500 font-medium hover:bg-rose-500/20 transition-all"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveSearch && (
        <div className="flex items-center gap-2 flex-wrap">
          {query && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30">
              <Search className="h-3 w-3 text-primary" />
              <span className="text-xs text-primary font-medium">{query}</span>
              <button
                onClick={() => setQuery("")}
                className="text-primary/60 hover:text-primary ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {Object.entries(activeFilters).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30"
            >
              <span className="text-xs text-blue-300 font-medium">
                {key}: {String(value).substring(0, 15)}
              </span>
              <button
                onClick={() => handleFilterChange(key, null)}
                className="text-blue-300/60 hover:text-blue-300 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
