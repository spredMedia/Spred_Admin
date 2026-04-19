"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { analyticsApi } from "@/lib/api/analyticsApi";

interface ActivityPoint {
  dayOfWeek: number; // 0-6 (Mon-Sun)
  hour: number; // 0-23
  activeUsers: number;
}

interface UserActivityHeatmapProps {
  data?: ActivityPoint[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export function UserActivityHeatmap({ data }: UserActivityHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<Map<string, number>>(new Map());
  const [maxActivity, setMaxActivity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        let activityData: ActivityPoint[] = [];

        if (data && data.length > 0) {
          activityData = data;
        } else {
          // Try to fetch from backend
          const backendData = await analyticsApi.getUserActivityHeatmap();
          if (backendData.length > 0) {
            activityData = backendData;
          }
        }

        if (activityData.length > 0) {
          const map = new Map<string, number>();
          let max = 0;
          activityData.forEach((point) => {
            const key = `${point.dayOfWeek}-${point.hour}`;
            map.set(key, point.activeUsers);
            max = Math.max(max, point.activeUsers);
          });
          setHeatmapData(map);
          setMaxActivity(max);
        } else {
          // Generate mock data
          const map = new Map<string, number>();
          let max = 0;
          for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
              const baseActivity = 10000;
              const dayFactor = day >= 5 ? 1.3 : 1;
              const hourFactor =
                hour >= 9 && hour <= 18 ? 1.5 : hour >= 20 && hour <= 23 ? 1.2 : 0.6;
              const activity = Math.floor(
                baseActivity * dayFactor * hourFactor + Math.random() * 5000
              );
              const key = `${day}-${hour}`;
              map.set(key, activity);
              max = Math.max(max, activity);
            }
          }
          setHeatmapData(map);
          setMaxActivity(max);
        }
      } catch (err) {
        setError("Failed to load activity heatmap");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [data]);

  const getColor = (value: number): string => {
    const intensity = value / maxActivity;
    if (intensity >= 0.8) return "bg-rose-600";
    if (intensity >= 0.6) return "bg-rose-500";
    if (intensity >= 0.4) return "bg-orange-500";
    if (intensity >= 0.2) return "bg-amber-400";
    return "bg-zinc-700";
  };

  const getText = (value: number): string => {
    const intensity = value / maxActivity;
    return intensity > 0.5 ? "text-white" : "text-zinc-400";
  };

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">
              User Activity Heatmap
            </CardTitle>
            <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">
              Peak activity hours throughout the week
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center justify-center h-96 text-rose-400">
            <div className="text-center">
              <p className="font-semibold mb-2">Error loading heatmap</p>
              <p className="text-sm text-zinc-400">{error}</p>
            </div>
          </div>
        )}
        {loading && !error && (
          <div className="flex items-center justify-center h-96 text-zinc-400">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-3"></div>
              <p>Loading activity heatmap...</p>
            </div>
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Day labels */}
                <div className="flex gap-1">
                  <div className="w-12 h-10" /> {/* Spacer for hour column */}
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="w-12 h-10 flex items-center justify-center text-xs font-semibold text-zinc-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid */}
                {HOURS.map((hour, hourIdx) => (
                  <div key={hour} className="flex gap-1">
                    <div className="w-12 h-10 flex items-center justify-center text-xs font-semibold text-zinc-500">
                      {hour}
                    </div>
                    {DAYS.map((_, dayIdx) => {
                      const key = `${dayIdx}-${hourIdx}`;
                      const value = heatmapData.get(key) || 0;
                      return (
                        <div
                          key={key}
                          className={`w-12 h-10 rounded flex items-center justify-center text-xs font-semibold cursor-pointer hover:ring-2 hover:ring-primary transition-all ${getColor(
                            value
                          )} ${getText(value)}`}
                          title={`${DAYS[dayIdx]} ${hour}: ${value.toLocaleString()} users`}
                        >
                          {Math.round(value / 1000)}k
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-zinc-400 font-semibold">Intensity:</span>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-zinc-700" />
                  <span className="text-zinc-400">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-amber-400" />
                  <span className="text-zinc-400">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-orange-500" />
                  <span className="text-zinc-400">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-rose-600" />
                  <span className="text-zinc-400">Peak</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
