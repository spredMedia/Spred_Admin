"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Palette, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface ThemeSettings {
  mode: "light" | "dark" | "system" | "schedule";
  colorScheme: ColorScheme;
  scheduleStart?: string;
  scheduleEnd?: string;
}

interface ThemeCustomizerProps {
  settings?: ThemeSettings;
  onSave?: (settings: ThemeSettings) => void;
}

const defaultColorSchemes: { [key: string]: ColorScheme } = {
  spred: {
    primary: "#F45303",
    secondary: "#D69E2E",
    accent: "#8B8B8B",
    background: "#1A1A1A",
  },
  ocean: {
    primary: "#0EA5E9",
    secondary: "#06B6D4",
    accent: "#64748B",
    background: "#0F172A",
  },
  forest: {
    primary: "#10B981",
    secondary: "#059669",
    accent: "#6B7280",
    background: "#0F2F1F",
  },
  sunset: {
    primary: "#F97316",
    secondary: "#FB923C",
    accent: "#A3A3A3",
    background: "#1C1410",
  },
  midnight: {
    primary: "#8B5CF6",
    secondary: "#A78BFA",
    accent: "#6B7280",
    background: "#0F0F1E",
  },
};

export function ThemeCustomizer({
  settings = {
    mode: "dark",
    colorScheme: defaultColorSchemes.spred,
  },
  onSave,
}: ThemeCustomizerProps) {
  const [localSettings, setLocalSettings] = useState<ThemeSettings>(settings);
  const [selectedScheme, setSelectedScheme] = useState("spred");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme_settings");
      if (saved) {
        try {
          setLocalSettings(JSON.parse(saved));
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  const handleModeChange = (mode: "light" | "dark" | "system" | "schedule") => {
    const updated = { ...localSettings, mode };
    setLocalSettings(updated);
    localStorage.setItem("theme_settings", JSON.stringify(updated));
    onSave?.(updated);
  };

  const handleSchemeSelect = (schemeName: string) => {
    setSelectedScheme(schemeName);
    const updated = {
      ...localSettings,
      colorScheme: defaultColorSchemes[schemeName],
    };
    setLocalSettings(updated);
    localStorage.setItem("theme_settings", JSON.stringify(updated));
    onSave?.(updated);
  };

  const handleColorChange = (
    key: keyof ColorScheme,
    value: string
  ) => {
    const updated = {
      ...localSettings,
      colorScheme: {
        ...localSettings.colorScheme,
        [key]: value,
      },
    };
    setLocalSettings(updated);
    localStorage.setItem("theme_settings", JSON.stringify(updated));
    onSave?.(updated);
  };

  const handleScheduleChange = (start: string, end: string) => {
    const updated = {
      ...localSettings,
      scheduleStart: start,
      scheduleEnd: end,
    };
    setLocalSettings(updated);
    localStorage.setItem("theme_settings", JSON.stringify(updated));
    onSave?.(updated);
  };

  const handleReset = () => {
    const defaults = {
      mode: "dark" as const,
      colorScheme: defaultColorSchemes.spred,
    };
    setLocalSettings(defaults);
    setSelectedScheme("spred");
    localStorage.setItem("theme_settings", JSON.stringify(defaults));
    onSave?.(defaults);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Theme Customization</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Personalize your dashboard appearance
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-bold flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Theme Mode */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white">Theme Mode</h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
            { id: "system", icon: Monitor, label: "System" },
            { id: "schedule", icon: Clock, label: "Scheduled" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() =>
                handleModeChange(mode.id as "light" | "dark" | "system" | "schedule")
              }
              className={cn(
                "px-4 py-3 rounded-lg border-2 transition-all font-bold flex items-center justify-center gap-2",
                localSettings.mode === mode.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
              )}
            >
              <mode.icon className="h-4 w-4" />
              {mode.label}
            </button>
          ))}
        </div>

        {localSettings.mode === "schedule" && (
          <div className="glass-card rounded-xl border-white/10 p-4 space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-zinc-600 uppercase mb-2 block">
                  Dark Mode Start
                </label>
                <input
                  type="time"
                  value={localSettings.scheduleStart || "18:00"}
                  onChange={(e) =>
                    handleScheduleChange(
                      e.target.value,
                      localSettings.scheduleEnd || "06:00"
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-600 uppercase mb-2 block">
                  Dark Mode End
                </label>
                <input
                  type="time"
                  value={localSettings.scheduleEnd || "06:00"}
                  onChange={(e) =>
                    handleScheduleChange(
                      localSettings.scheduleStart || "18:00",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <p className="text-[10px] text-zinc-600">
              Dark mode will automatically enable from{" "}
              {localSettings.scheduleStart || "18:00"} to{" "}
              {localSettings.scheduleEnd || "06:00"}
            </p>
          </div>
        )}
      </div>

      {/* Color Scheme Presets */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white">Color Scheme Presets</h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(defaultColorSchemes).map(([name, scheme]) => (
            <button
              key={name}
              onClick={() => handleSchemeSelect(name)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all",
                selectedScheme === name
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              )}
            >
              <div className="flex gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded border border-white/20"
                  style={{ backgroundColor: scheme.primary }}
                />
                <div
                  className="w-6 h-6 rounded border border-white/20"
                  style={{ backgroundColor: scheme.secondary }}
                />
                <div
                  className="w-6 h-6 rounded border border-white/20"
                  style={{ backgroundColor: scheme.accent }}
                />
              </div>
              <p className="text-xs font-bold text-white capitalize">{name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold text-white">Custom Colors</h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(
            Object.entries(localSettings.colorScheme) as [
              keyof ColorScheme,
              string
            ][]
          ).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs font-bold text-zinc-600 uppercase mb-2 block capitalize">
                {key}
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-10 rounded-lg border-2 border-white/10 cursor-pointer"
                  style={{ backgroundColor: value }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-primary uppercase"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white">Preview</h4>
        <div className="glass-card rounded-xl border-white/10 p-6 space-y-4">
          <div className="flex gap-3">
            <button
              style={{ backgroundColor: localSettings.colorScheme.primary }}
              className="px-4 py-2 rounded-lg text-white font-bold"
            >
              Primary Button
            </button>
            <button
              style={{ backgroundColor: localSettings.colorScheme.secondary }}
              className="px-4 py-2 rounded-lg text-white font-bold"
            >
              Secondary Button
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-lg text-white"
              style={{ backgroundColor: localSettings.colorScheme.background }}
            >
              <p className="text-xs font-bold mb-1">Background</p>
              <p className="text-[10px] opacity-75">Sample text</p>
            </div>
            <div
              className="p-4 rounded-lg text-white"
              style={{ backgroundColor: localSettings.colorScheme.accent }}
            >
              <p className="text-xs font-bold mb-1">Accent</p>
              <p className="text-[10px] opacity-75">Sample text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
