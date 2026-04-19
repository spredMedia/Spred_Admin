"use client";

import { useState } from "react";
import {
  GripVertical,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Widget {
  id: string;
  title: string;
  category: string;
  description: string;
  isVisible: boolean;
  isCollapsed: boolean;
  size: "small" | "medium" | "large";
  position: number;
}

interface SavedLayout {
  id: string;
  name: string;
  widgets: Widget[];
  createdAt: Date;
  isDefault: boolean;
}

interface DashboardWidgetSystemProps {
  widgets?: Widget[];
  savedLayouts?: SavedLayout[];
  onSaveLayout?: (layoutName: string) => void;
  onLoadLayout?: (layoutId: string) => void;
  onWidgetToggle?: (widgetId: string) => void;
  onWidgetCollapse?: (widgetId: string) => void;
}

const mockWidgets: Widget[] = [
  {
    id: "widget_1",
    title: "Revenue Overview",
    category: "Analytics",
    description: "Total revenue and trends",
    isVisible: true,
    isCollapsed: false,
    size: "large",
    position: 1,
  },
  {
    id: "widget_2",
    title: "Active Users",
    category: "Users",
    description: "Currently active users count",
    isVisible: true,
    isCollapsed: false,
    size: "medium",
    position: 2,
  },
  {
    id: "widget_3",
    title: "System Health",
    category: "Monitoring",
    description: "CPU, memory, and disk usage",
    isVisible: true,
    isCollapsed: false,
    size: "medium",
    position: 3,
  },
  {
    id: "widget_4",
    title: "Recent Moderation",
    category: "Content",
    description: "Latest moderation actions",
    isVisible: true,
    isCollapsed: false,
    size: "large",
    position: 4,
  },
  {
    id: "widget_5",
    title: "User Growth Chart",
    category: "Analytics",
    description: "30-day user growth visualization",
    isVisible: false,
    isCollapsed: false,
    size: "large",
    position: 5,
  },
  {
    id: "widget_6",
    title: "Alert Feed",
    category: "Monitoring",
    description: "Real-time system alerts",
    isVisible: true,
    isCollapsed: true,
    size: "medium",
    position: 6,
  },
];

const mockLayouts: SavedLayout[] = [
  {
    id: "layout_default",
    name: "Default Layout",
    widgets: mockWidgets,
    createdAt: new Date(Date.now() - 2592000000),
    isDefault: true,
  },
  {
    id: "layout_analytics",
    name: "Analytics Focus",
    widgets: mockWidgets.filter((w) => w.category === "Analytics" || w.isVisible),
    createdAt: new Date(Date.now() - 604800000),
    isDefault: false,
  },
  {
    id: "layout_monitoring",
    name: "Monitoring Focus",
    widgets: mockWidgets.filter((w) => w.category === "Monitoring" || w.isVisible),
    createdAt: new Date(Date.now() - 259200000),
    isDefault: false,
  },
];

export function DashboardWidgetSystem({
  widgets = mockWidgets,
  savedLayouts = mockLayouts,
  onSaveLayout,
  onLoadLayout,
  onWidgetToggle,
  onWidgetCollapse,
}: DashboardWidgetSystemProps) {
  const [localWidgets, setLocalWidgets] = useState(widgets);
  const [layoutName, setLayoutName] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const categories = [...new Set(localWidgets.map((w) => w.category))];
  const visibleWidgets = localWidgets.filter((w) => w.isVisible);
  const hiddenWidgets = localWidgets.filter((w) => !w.isVisible);

  const handleToggleWidget = (widgetId: string) => {
    setLocalWidgets(
      localWidgets.map((w) =>
        w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w
      )
    );
    onWidgetToggle?.(widgetId);
  };

  const handleCollapseWidget = (widgetId: string) => {
    setLocalWidgets(
      localWidgets.map((w) =>
        w.id === widgetId ? { ...w, isCollapsed: !w.isCollapsed } : w
      )
    );
    onWidgetCollapse?.(widgetId);
  };

  const handleSaveLayout = () => {
    if (layoutName.trim()) {
      onSaveLayout?.(layoutName);
      setLayoutName("");
      setShowSaveDialog(false);
    }
  };

  const handleResetLayout = () => {
    const defaultLayout = savedLayouts.find((l) => l.isDefault);
    if (defaultLayout) {
      setLocalWidgets(defaultLayout.widgets);
      onLoadLayout?.(defaultLayout.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Dashboard Widgets</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Customize your dashboard by showing/hiding widgets
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleResetLayout}
            className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-bold flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Layout
          </button>
        </div>
      </div>

      {/* Save Layout Dialog */}
      {showSaveDialog && (
        <div className="glass-card rounded-xl border-white/10 p-6 space-y-4">
          <p className="text-sm font-bold text-white">Save Layout As</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="Enter layout name..."
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-primary"
              onKeyPress={(e) => e.key === "Enter" && handleSaveLayout()}
            />
            <button
              onClick={handleSaveLayout}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Visible Widgets */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white mb-3">
            Active Widgets ({visibleWidgets.length})
          </h4>
          <div className="space-y-2">
            {visibleWidgets.map((widget) => (
              <div
                key={widget.id}
                className="glass-card rounded-xl border-white/10 p-4 flex items-start justify-between gap-4 hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-start gap-3 flex-1">
                  <GripVertical className="h-5 w-5 text-zinc-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-white">{widget.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {widget.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold uppercase bg-white/10 text-zinc-300 px-2 py-1 rounded">
                        {widget.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-primary/20 text-primary px-2 py-1 rounded">
                        {widget.size}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleCollapseWidget(widget.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    title={widget.isCollapsed ? "Expand" : "Collapse"}
                  >
                    {widget.isCollapsed ? (
                      <ChevronDown className="h-4 w-4 text-zinc-500" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-zinc-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleWidget(widget.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-all text-rose-500"
                    title="Hide"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Widgets */}
      {hiddenWidgets.length > 0 && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white mb-3">
              Available Widgets ({hiddenWidgets.length})
            </h4>
            <div className="space-y-2">
              {hiddenWidgets.map((widget) => (
                <div
                  key={widget.id}
                  className="glass-card rounded-xl border-white/10 p-4 flex items-start justify-between gap-4 opacity-60 hover:opacity-100 transition-all"
                >
                  <div className="flex-1">
                    <p className="font-bold text-white">{widget.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {widget.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleWidget(widget.id)}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-all text-emerald-500 flex-shrink-0"
                    title="Show"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Layouts */}
      <div className="space-y-4 border-t border-white/10 pt-8">
        <h4 className="text-sm font-bold text-white">Saved Layouts</h4>
        <div className="space-y-2">
          {savedLayouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onLoadLayout?.(layout.id)}
              className="w-full glass-card rounded-xl border-white/10 p-4 text-left hover:bg-white/[0.03] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-white">{layout.name}</p>
                    {layout.isDefault && (
                      <span className="text-[10px] font-bold uppercase bg-primary/20 text-primary px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600">
                    {layout.widgets.length} widgets • Created{" "}
                    {layout.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-bold text-primary uppercase">
                  Load
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
