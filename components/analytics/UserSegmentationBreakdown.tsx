"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { analyticsApi } from "@/lib/api/analyticsApi";

interface SegmentData {
  segment: "free" | "premium" | "creator";
  count: number;
  percentage: number;
  d30Retention: number;
  arpu: number;
  engagementScore: number;
  growthRate: number;
}

interface UserSegmentationBreakdownProps {
  data?: SegmentData[];
}

const COLORS = {
  free: "#8B8B8B",
  premium: "#F45303",
  creator: "#D69E2E",
};

const SEGMENT_LABELS = {
  free: "Free Users",
  premium: "Premium Users",
  creator: "Creators",
};

export function UserSegmentationBreakdown({
  data,
}: UserSegmentationBreakdownProps) {
  const [segments, setSegments] = useState<SegmentData[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (data && data.length > 0) {
          setSegments(data);
          setPieData(
            data.map((s) => ({
              name: SEGMENT_LABELS[s.segment],
              value: s.percentage,
              count: s.count,
            }))
          );
        } else {
          // Try to fetch from backend
          const backendData = await analyticsApi.getUserSegmentationMetrics();
          if (backendData.length > 0) {
            setSegments(backendData);
            setPieData(
              backendData.map((s) => ({
                name: SEGMENT_LABELS[s.segment],
                value: s.percentage,
                count: s.count,
              }))
            );
          } else {
            // Generate mock data
            const mockSegments: SegmentData[] = [
              {
                segment: "free",
                count: 285000,
                percentage: 85.5,
                d30Retention: 18.3,
                arpu: 0,
                engagementScore: 4.2,
                growthRate: 3.5,
              },
              {
                segment: "premium",
                count: 45000,
                percentage: 13.5,
                d30Retention: 72.5,
                arpu: 2400,
                engagementScore: 7.8,
                growthRate: 8.2,
              },
              {
                segment: "creator",
                count: 3500,
                percentage: 1.0,
                d30Retention: 95.2,
                arpu: 15000,
                engagementScore: 8.9,
                growthRate: 12.5,
              },
            ];
            setSegments(mockSegments);
            setPieData(
              mockSegments.map((s) => ({
                name: SEGMENT_LABELS[s.segment],
                value: s.percentage,
                count: s.count,
              }))
            );
          }
        }
      } catch (err) {
        setError("Failed to load segmentation data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [data]);

  return (
    <div className="space-y-6">
      <Card className="glass-card border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                User Segmentation
              </CardTitle>
              <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">
                Distribution across user tiers
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center justify-center h-96 text-rose-400">
              <div className="text-center">
                <p className="font-semibold mb-2">Error loading data</p>
                <p className="text-sm text-zinc-400">{error}</p>
              </div>
            </div>
          )}
          {loading && !error && (
            <div className="flex items-center justify-center h-96 text-zinc-400">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-3"></div>
                <p>Loading segmentation data...</p>
              </div>
            </div>
          )}
          {pieData.length > 0 && !loading && !error && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            Object.values(COLORS)[
                              index % Object.values(COLORS).length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value.toFixed(1)}%`}
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {segments.map((segment) => (
                  <div
                    key={segment.segment}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[segment.segment as keyof typeof COLORS],
                          }}
                        />
                        <span className="text-sm font-semibold text-white">
                          {SEGMENT_LABELS[segment.segment]}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">
                        {segment.percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-zinc-500">Users</p>
                        <p className="text-white font-bold">
                          {(segment.count / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500">D30 Retention</p>
                        <p className="text-white font-bold">
                          {segment.d30Retention.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500">ARPU</p>
                        <p className="text-white font-bold">
                          ₦{(segment.arpu / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="text-zinc-500">Growth</p>
                          <p className="text-white font-bold">
                            +{segment.growthRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
