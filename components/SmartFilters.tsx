"use client";

import { useState } from "react";
import { Zap, Users, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartFilterTemplate {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  filters: Record<string, any>;
  color: "primary" | "emerald" | "blue" | "rose" | "amber";
}

interface SmartFiltersProps {
  templates: SmartFilterTemplate[];
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
}

const colorClasses = {
  primary: "bg-primary/10 border-primary/20 text-primary",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  rose: "bg-rose-500/10 border-rose-500/20 text-rose-500",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-500",
};

const colorIconClasses = {
  primary: "bg-primary/20",
  emerald: "bg-emerald-500/20",
  blue: "bg-blue-500/20",
  rose: "bg-rose-500/20",
  amber: "bg-amber-500/20",
};

export function SmartFilters({
  templates,
  onApply,
  onClear,
}: SmartFiltersProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleApply = (template: SmartFilterTemplate) => {
    setSelectedTemplate(template.id);
    onApply(template.filters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
          Smart Filter Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleApply(template)}
              className={cn(
                "p-4 rounded-xl border transition-all text-left group hover:scale-105 active:scale-95",
                selectedTemplate === template.id
                  ? colorClasses[template.color]
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                  colorIconClasses[template.color]
                )}
              >
                {template.icon}
              </div>
              <h4 className="font-bold text-sm mb-1">{template.label}</h4>
              <p className="text-xs opacity-75">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <button
          onClick={onClear}
          className="text-xs font-bold uppercase text-rose-500 hover:text-rose-400 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

// Pre-built filter templates for Users
export const userFilterTemplates: SmartFilterTemplate[] = [
  {
    id: "active-creators",
    label: "Active Creators",
    description: "Users with 10+ uploads in last 30 days",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "emerald",
    filters: {
      role: "creator",
      minUploads: "10",
      dateRange_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  },
  {
    id: "premium-users",
    label: "Premium Users",
    description: "Paid subscription members",
    icon: <Zap className="h-5 w-5" />,
    color: "primary",
    filters: {
      subscription: "premium",
      status: "active",
    },
  },
  {
    id: "new-users",
    label: "New Users",
    description: "Joined in last 7 days",
    icon: <Users className="h-5 w-5" />,
    color: "blue",
    filters: {
      dateRange_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  },
  {
    id: "inactive-30d",
    label: "Inactive 30+ Days",
    description: "No activity in last month",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "rose",
    filters: {
      lastActive_to: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  },
];

// Pre-built filter templates for Content
export const contentFilterTemplates: SmartFilterTemplate[] = [
  {
    id: "trending-videos",
    label: "Trending Videos",
    description: "1000+ views, high engagement",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "emerald",
    filters: {
      minViews: "1000",
      status: "published",
    },
  },
  {
    id: "pending-approval",
    label: "Pending Approval",
    description: "Awaiting moderation review",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "amber",
    filters: {
      status: "pending",
    },
  },
  {
    id: "flagged-content",
    label: "Flagged Content",
    description: "User reports or AI detection",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "rose",
    filters: {
      isFlagged: "true",
    },
  },
  {
    id: "recent-uploads",
    label: "Recent Uploads",
    description: "Last 24 hours",
    icon: <Users className="h-5 w-5" />,
    color: "blue",
    filters: {
      dateRange_from: new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  },
];
