"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  BarChart3,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartComponent } from "@/components/charts/LineChartComponent";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { CohortAnalysis, generateMockCohortData } from "@/components/CohortAnalysis";
import { ReportBuilder } from "@/components/ReportBuilder";
import { toast } from "@/lib/toast";

interface Report {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  schedule?: "daily" | "weekly" | "monthly";
  recipients?: string[];
  lastRun?: Date;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [savedReports, setSavedReports] = useState<Report[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [cohortData, setCohortData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Generate mock chart data
      const now = Date.now();
      setChartData(
        Array.from({ length: 30 }, (_, i) => ({
          date: new Date(now - (29 - i) * 24 * 60 * 60 * 1000)
            .toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          dau: Math.floor(Math.random() * 50000) + 80000 + i * 1000,
          mau: Math.floor(Math.random() * 100000) + 200000 + i * 2000,
          engagement: Math.floor(Math.random() * 20) + 40 + i * 0.5,
        }))
      );

      // Generate cohort data
      setCohortData(generateMockCohortData());

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveReport = (report: Report) => {
    setSavedReports([...savedReports, report]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Analytics <span className="text-primary">Dashboard</span>
        </h1>
        <p className="text-zinc-400 text-lg">
          Deep dive into user behavior, engagement, and revenue metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          label="Daily Active Users"
          value={142500}
          unit="users"
          change={12}
          target={150000}
          icon={<Users className="h-6 w-6" />}
          color="emerald"
          trend="up"
          comparison="12% increase vs last week"
        />
        <AnalyticsCard
          label="Engagement Score"
          value={7.8}
          unit="/10"
          change={3}
          icon={<Zap className="h-6 w-6" />}
          color="primary"
          trend="up"
          comparison="Content engagement up"
        />
        <AnalyticsCard
          label="Total Revenue"
          value="₦2.4M"
          change={18}
          target={3000000}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
          trend="up"
          comparison="18% MoM growth"
        />
        <AnalyticsCard
          label="Churn Rate"
          value={3.2}
          unit="%"
          change={-5}
          icon={<TrendingUp className="h-6 w-6" />}
          color="rose"
          trend="down"
          comparison="5% improvement"
        />
      </div>

      {/* Growth Metrics Chart */}
      <Card className="glass-card border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Growth Metrics
              </CardTitle>
              <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">
                DAU vs MAU trends over time
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LineChartComponent
            data={chartData}
            lines={[
              { key: "dau", stroke: "#F45303", name: "Daily Active Users" },
              { key: "mau", stroke: "#D69E2E", name: "Monthly Active Users" },
            ]}
            height={300}
            xAxisKey="date"
          />
        </CardContent>
      </Card>

      {/* Engagement Chart */}
      <Card className="glass-card border-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <Target className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                User Engagement
              </CardTitle>
              <p className="text-xs text-zinc-500 font-medium tracking-tight mt-0.5">
                Engagement score trajectory
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LineChartComponent
            data={chartData}
            lines={[
              {
                key: "engagement",
                stroke: "#10B981",
                name: "Engagement Score",
              },
            ]}
            height={250}
            xAxisKey="date"
          />
        </CardContent>
      </Card>

      {/* Cohort Analysis */}
      <Card className="glass-card border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Retention Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CohortAnalysis data={cohortData} />
        </CardContent>
      </Card>

      {/* Report Builder */}
      <Card className="glass-card border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Custom Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReportBuilder
            onSave={handleSaveReport}
            existingReports={savedReports}
          />
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="glass-card border-none bg-gradient-to-r from-primary/5 to-amber-500/5">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">
                  User growth accelerating
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  12% week-over-week growth indicates strong product-market fit
                  and improved marketing effectiveness.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Revenue concentration</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Top 20% of creators account for 65% of revenue. Consider VIP
                  creator programs to boost retention.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Engagement plateau</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Engagement score has stabilized. New feature releases needed
                  to drive re-engagement.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
