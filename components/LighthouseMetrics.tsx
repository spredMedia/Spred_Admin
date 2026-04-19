"use client";

import { Zap, Target, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LighthouseScore {
  name: string;
  score: number;
  status: "pass" | "needs-improvement" | "poor";
  description: string;
}

interface CoreWebVital {
  metric: string;
  value: number;
  unit: string;
  status: "good" | "needs-improvement" | "poor";
  rating: number;
}

interface LighthouseMetricsProps {
  scores?: LighthouseScore[];
  coreWebVitals?: CoreWebVital[];
}

const defaultScores: LighthouseScore[] = [
  {
    name: "Performance",
    score: 92,
    status: "pass",
    description: "Page loads quickly and renders efficiently",
  },
  {
    name: "Accessibility",
    score: 88,
    status: "pass",
    description: "Good keyboard navigation and ARIA labels",
  },
  {
    name: "Best Practices",
    score: 85,
    status: "needs-improvement",
    description: "Some security and browser API best practices not met",
  },
  {
    name: "SEO",
    score: 90,
    status: "pass",
    description: "Content is well-indexed and crawlable",
  },
  {
    name: "PWA",
    score: 72,
    status: "needs-improvement",
    description: "Progressive Web App not fully configured",
  },
];

const defaultCoreWebVitals: CoreWebVital[] = [
  {
    metric: "Largest Contentful Paint (LCP)",
    value: 2.4,
    unit: "s",
    status: "good",
    rating: 75,
  },
  {
    metric: "First Input Delay (FID)",
    value: 45,
    unit: "ms",
    status: "good",
    rating: 85,
  },
  {
    metric: "Cumulative Layout Shift (CLS)",
    value: 0.08,
    unit: "",
    status: "good",
    rating: 80,
  },
];

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-500 bg-emerald-500/10";
  if (score >= 50) return "text-amber-500 bg-amber-500/10";
  return "text-rose-500 bg-rose-500/10";
}

function getStatusColor(status: string) {
  switch (status) {
    case "pass":
    case "good":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    case "needs-improvement":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "poor":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  }
}

export function LighthouseMetrics({
  scores = defaultScores,
  coreWebVitals = defaultCoreWebVitals,
}: LighthouseMetricsProps) {
  const averageScore =
    Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Lighthouse Metrics</h3>
      </div>

      {/* Overall Score */}
      <div className="glass-card rounded-xl border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-white">Overall Score</h4>
          <div className="flex items-baseline gap-2">
            <p className={cn("text-4xl font-black", getScoreColor(averageScore))}>
              {averageScore}
            </p>
            <p className="text-sm text-zinc-500">/100</p>
          </div>
        </div>

        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              averageScore >= 90
                ? "bg-emerald-500"
                : averageScore >= 50
                  ? "bg-amber-500"
                  : "bg-rose-500"
            )}
            style={{ width: `${averageScore}%` }}
          />
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {scores.map((score) => (
          <div
            key={score.name}
            className={cn(
              "glass-card rounded-xl border-2 p-4 space-y-3",
              getStatusColor(score.status)
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-bold text-white">{score.name}</p>
              {score.status === "pass" ? (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              )}
            </div>

            <p className="text-2xl font-black text-white">{score.score}</p>

            <p className="text-[10px] text-zinc-500">{score.description}</p>

            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  score.status === "pass"
                    ? "bg-emerald-500"
                    : score.status === "needs-improvement"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                )}
                style={{ width: `${score.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Core Web Vitals */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Core Web Vitals
        </h4>
        <div className="space-y-3">
          {coreWebVitals.map((vital) => (
            <div
              key={vital.metric}
              className={cn(
                "glass-card rounded-xl border-2 p-4 space-y-3",
                getStatusColor(vital.status)
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-white text-sm">{vital.metric}</p>
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                    vital.status === "good"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : vital.status === "needs-improvement"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-rose-500/20 text-rose-500"
                  )}
                >
                  {vital.status === "good"
                    ? "Good"
                    : vital.status === "needs-improvement"
                      ? "Needs Work"
                      : "Poor"}
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-white">{vital.value}</p>
                <p className="text-[10px] text-zinc-600">{vital.unit}</p>
              </div>

              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    vital.status === "good"
                      ? "bg-emerald-500"
                      : vital.status === "needs-improvement"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  )}
                  style={{ width: `${vital.rating}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <p className="text-xs font-bold text-blue-500 uppercase flex items-center gap-2">
          <TrendingUp className="h-3 w-3" />
          Improvement Areas
        </p>
        <ul className="text-[10px] text-blue-400 space-y-1 ml-5 list-disc">
          <li>Implement image lazy-loading to improve LCP</li>
          <li>Optimize JavaScript execution to reduce CLS</li>
          <li>Add service worker for PWA functionality</li>
          <li>Implement resource hints (preload, prefetch)</li>
          <li>Reduce unused JavaScript in bundles</li>
        </ul>
      </div>
    </div>
  );
}
