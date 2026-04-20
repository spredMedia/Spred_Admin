"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CohortAnalysis, generateMockCohortData } from "@/components/CohortAnalysis";
import { analyticsApi } from "@/lib/api/analyticsApi";

interface CohortData {
  cohort: string;
  cohortSize: number;
  retention: Record<number, number>;
}

interface CohortRetentionAnalysisProps {
  data?: CohortData[];
}

export function CohortRetentionAnalysis({
  data,
}: CohortRetentionAnalysisProps) {
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (data && data.length > 0) {
          setCohortData(data);
        } else {
          // Try to fetch from backend
          const backendData = await analyticsApi.getCohortRetention();
          if (backendData.length > 0) {
            setCohortData(backendData);
          } else {
            // Fallback to mock data
            setCohortData(generateMockCohortData());
          }
        }
      } catch (err) {
        setError("Failed to load cohort data");
        console.error(err);
        // Still show mock data on error
        setCohortData(generateMockCohortData());
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [data]);

  return (
    <Card className="glass-card border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          Retention Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center justify-center h-96 text-amber-400 mb-4 p-4 bg-amber-500/10 rounded">
            <p className="text-sm">{error} (showing mock data)</p>
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center h-96 text-zinc-400 mb-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-3"></div>
              <p>Loading cohort data...</p>
            </div>
          </div>
        )}
        {!loading && cohortData.length > 0 && (
          <CohortAnalysis data={cohortData} />
        )}
      </CardContent>
    </Card>
  );
}
