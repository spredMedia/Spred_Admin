"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartComponent } from "@/components/charts/LineChartComponent";
import { BarChart3, TrendingUp } from "lucide-react";
import { analyticsApi } from "@/lib/api/analyticsApi";

interface GrowthMetric {
  date: string;
  dau: number;
  mau: number;
  newSignups: number;
  churnRate: number;
}

interface UserGrowthChartProps {
  data?: GrowthMetric[];
  period?: 30 | 60 | 90;
  onPeriodChange?: (period: 30 | 60 | 90) => void;
}

export function UserGrowthChart({
  data,
  period = 30,
  onPeriodChange,
}: UserGrowthChartProps) {
  const [chartData, setChartData] = useState<GrowthMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (data && data.length > 0) {
          setChartData(data);
        } else {
          // Try to fetch from backend
          const backendData = await analyticsApi.getUserGrowthMetrics(period);
          if (backendData.length > 0) {
            setChartData(backendData);
          } else {
            // Fallback to mock data
            const now = Date.now();
            const mockData = Array.from({ length: period }, (_, i) => ({
              date: new Date(now - (period - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              dau: Math.floor(Math.random() * 50000) + 80000 + i * 1000,
              mau: Math.floor(Math.random() * 100000) + 200000 + i * 2000,
              newSignups: Math.floor(Math.random() * 3000) + 1000,
              churnRate: Math.max(1, Math.floor(Math.random() * 5) + 2),
            }));
            setChartData(mockData);
          }
        }
      } catch (err) {
        setError("Failed to load growth metrics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [data, period]);

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                User Growth Metrics
              </CardTitle>
              <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">
                DAU vs MAU trends over time
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {[30, 60, 90].map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange?.(p as 30 | 60 | 90)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  period === p
                    ? "bg-primary text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {p}d
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center justify-center h-72 text-rose-400">
            <div className="text-center">
              <p className="font-semibold mb-2">Error loading metrics</p>
              <p className="text-sm text-zinc-400">{error}</p>
            </div>
          </div>
        )}
        {loading && !error && (
          <div className="flex items-center justify-center h-72 text-zinc-400">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-3"></div>
              <p>Loading growth metrics...</p>
            </div>
          </div>
        )}
        {chartData.length > 0 && !loading && (
          <LineChartComponent
            data={chartData}
            lines={[
              { key: "dau", stroke: "#F45303", name: "Daily Active Users" },
              { key: "mau", stroke: "#D69E2E", name: "Monthly Active Users" },
            ]}
            height={300}
            xAxisKey="date"
          />
        )}
      </CardContent>
    </Card>
  );
}
