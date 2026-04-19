"use client";

import { cn } from "@/lib/utils";

interface CohortData {
  cohort: string;
  cohortSize: number;
  retention: Record<number, number>; // day -> percentage
}

interface CohortAnalysisProps {
  data: CohortData[];
  title?: string;
  description?: string;
}

export function CohortAnalysis({
  data,
  title = "Retention Cohort Analysis",
  description = "User retention rates by signup cohort",
}: CohortAnalysisProps) {
  const maxDays = Math.max(
    ...data.map((c) => Math.max(...Object.keys(c.retention).map(Number)))
  );
  const days = Array.from({ length: maxDays + 1 }, (_, i) => i);

  const getColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-emerald-400";
    if (percentage >= 40) return "bg-amber-400";
    if (percentage >= 20) return "bg-rose-400";
    return "bg-zinc-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-zinc-400">
                Cohort
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-zinc-400">
                Size
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="px-3 py-3 text-xs font-bold uppercase text-zinc-400"
                >
                  Day {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((cohort, idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-4 text-left text-sm font-medium text-white">
                  {cohort.cohort}
                </td>
                <td className="px-4 py-4 text-sm text-zinc-300 font-bold">
                  {cohort.cohortSize.toLocaleString()}
                </td>
                {days.map((day) => {
                  const retention = cohort.retention[day];
                  return (
                    <td key={day} className="px-3 py-4">
                      {retention !== undefined ? (
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white",
                              getColor(retention)
                            )}
                          >
                            {Math.round(retention)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-zinc-700 text-xs">—</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-500" />
          <span className="text-zinc-400">80%+ retention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-amber-400" />
          <span className="text-zinc-400">40-60% retention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-rose-400" />
          <span className="text-zinc-400">20-40% retention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-zinc-700" />
          <span className="text-zinc-400">Below 20%</span>
        </div>
      </div>
    </div>
  );
}

// Mock cohort data generator
export function generateMockCohortData(): CohortData[] {
  const months = [
    "Jan 2024",
    "Feb 2024",
    "Mar 2024",
    "Apr 2024",
    "May 2024",
  ];

  return months.map((month, idx) => ({
    cohort: month,
    cohortSize: Math.floor(Math.random() * 5000) + 5000,
    retention: Object.fromEntries(
      Array.from({ length: 6 }, (_, day) => [
        day,
        Math.max(
          20,
          100 -
            day * (8 + Math.random() * 5) -
            idx * 5 +
            Math.random() * 10
        ),
      ])
    ),
  }));
}
