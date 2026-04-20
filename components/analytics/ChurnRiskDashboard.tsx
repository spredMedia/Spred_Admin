"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { AlertCircle, TrendingDown } from "lucide-react";
import { analyticsApi } from "@/lib/api/analyticsApi";

interface RiskData {
  date: string;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
}

interface ChurnRiskDashboardProps {
  data?: RiskData[];
}

export function ChurnRiskDashboard({ data }: ChurnRiskDashboardProps) {
  const [chartData, setChartData] = useState<RiskData[]>([]);
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
          const backendData = await analyticsApi.getChurnRiskMetrics();
          if (backendData.length > 0) {
            setChartData(backendData);
          } else {
            // Fallback to mock data
            const now = Date.now();
            const mockData = Array.from({ length: 30 }, (_, i) => ({
              date: new Date(now - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              lowRisk: Math.floor(Math.random() * 30000) + 100000,
              mediumRisk: Math.floor(Math.random() * 15000) + 25000,
              highRisk: Math.floor(Math.random() * 5000) + 5000,
            }));
            setChartData(mockData);
          }
        }
      } catch (err) {
        setError("Failed to load churn metrics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [data]);

  const latestData = chartData[chartData.length - 1] || {
    lowRisk: 0,
    mediumRisk: 0,
    highRisk: 0,
  };
  const totalUsers =
    latestData.lowRisk + latestData.mediumRisk + latestData.highRisk;

  return (
    <div className="space-y-6">
      <Card className="glass-card border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20">
              <AlertCircle className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Churn Risk Dashboard
              </CardTitle>
              <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">
                User churn risk scoring and distribution
              </p>
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
                <p>Loading risk metrics...</p>
              </div>
            </div>
          )}
          {chartData.length > 0 && !loading && (
            <BarChartComponent
              data={chartData}
              bars={[
                { key: "lowRisk", fill: "#10B981", name: "Low Risk" },
                { key: "mediumRisk", fill: "#F59E0B", name: "Medium Risk" },
                { key: "highRisk", fill: "#EF4444", name: "High Risk" },
              ]}
              height={300}
              xAxisKey="date"
            />
          )}
        </CardContent>
      </Card>

      {/* Risk Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card border-none">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Low Risk Users</p>
              <p className="text-3xl font-bold text-emerald-500">
                {latestData.lowRisk.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500">
                {((latestData.lowRisk / totalUsers) * 100).toFixed(1)}% of total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Medium Risk Users</p>
              <p className="text-3xl font-bold text-amber-500">
                {latestData.mediumRisk.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500">
                {((latestData.mediumRisk / totalUsers) * 100).toFixed(1)}% of total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">High Risk Users</p>
              <p className="text-3xl font-bold text-rose-500">
                {latestData.highRisk.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500">
                {((latestData.highRisk / totalUsers) * 100).toFixed(1)}% of total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
