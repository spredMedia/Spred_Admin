import { ApiResponse } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface GrowthMetric {
  date: string;
  dau: number;
  mau: number;
  newSignups: number;
  churnRate: number;
}

interface RiskData {
  date: string;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
}

interface ActivityPoint {
  dayOfWeek: number;
  hour: number;
  activeUsers: number;
}

interface SegmentData {
  segment: "free" | "premium" | "creator";
  count: number;
  percentage: number;
  d30Retention: number;
  arpu: number;
  engagementScore: number;
  growthRate: number;
}

interface CreatorStage {
  stage: "all_users" | "potential" | "beginner" | "active" | "verified";
  count: number;
  percentage: number;
  avgDaysToConvert?: number;
  monthlyGrowth?: number;
}

interface CohortData {
  cohort: string;
  cohortSize: number;
  retention: Record<number, number>;
}

export class AnalyticsApiService {
  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`❌ Analytics API Error: ${endpoint}`, error.message);
      return {
        succeeded: false,
        message: error.message,
        data: null as any,
      };
    }
  }

  async getUserGrowthMetrics(days: 30 | 60 | 90): Promise<GrowthMetric[]> {
    const response = await this.request<GrowthMetric[]>(
      `/analytics/user-growth?days=${days}`
    );
    return response.succeeded ? response.data : [];
  }

  async getChurnRiskMetrics(): Promise<RiskData[]> {
    const response = await this.request<RiskData[]>(
      `/analytics/churn-risk`
    );
    return response.succeeded ? response.data : [];
  }

  async getUserActivityHeatmap(segment?: string): Promise<ActivityPoint[]> {
    const url = segment
      ? `/analytics/activity-heatmap?segment=${segment}`
      : `/analytics/activity-heatmap`;
    const response = await this.request<ActivityPoint[]>(url);
    return response.succeeded ? response.data : [];
  }

  async getUserSegmentationMetrics(): Promise<SegmentData[]> {
    const response = await this.request<SegmentData[]>(
      `/analytics/user-segmentation`
    );
    return response.succeeded ? response.data : [];
  }

  async getCreatorConversionFunnel(): Promise<CreatorStage[]> {
    const response = await this.request<CreatorStage[]>(
      `/analytics/creator-conversion-funnel`
    );
    return response.succeeded ? response.data : [];
  }

  async getCohortRetention(): Promise<CohortData[]> {
    const response = await this.request<CohortData[]>(
      `/analytics/cohort-retention`
    );
    return response.succeeded ? response.data : [];
  }
}

export const analyticsApi = new AnalyticsApiService();
