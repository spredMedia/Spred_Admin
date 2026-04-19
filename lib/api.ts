import axios from "axios";

export interface ApiResponse<T> {
  succeeded: boolean;
  data: T;
  message?: string;
}

const API_CONFIG = {
  // Use absolute URL to spred-advanced proxy server when in dev
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
};

class SpredApiService {
  private token: string | null = null;
  private user: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
      const savedUser = localStorage.getItem('admin_user');
      this.user = savedUser ? JSON.parse(savedUser) : null;
    }
  }

  public getToken() {
    return this.token || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null);
  }

  private getHeaders(auth = true) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (auth) {
      // Re-fetch token from localStorage if not in memory (prevents race conditions)
      const currentToken = this.token || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null);
      if (currentToken) {
        headers['Authorization'] = `Bearer ${currentToken}`;
      }
    }

    return headers;
  }

  /**
   * Core request handler
   */
  async request<T>(endpoint: string, options: RequestInit & { auth?: boolean } = {}): Promise<ApiResponse<T>> {
    if (API_CONFIG.DEMO_MODE) {
      return this.handleDemoRequest<T>(endpoint);
    }

    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(options.auth !== false),
          ...options.headers,
        },
      });

      if (response.status === 401 || response.status === 403) {
        console.warn(`🚨 [AUTH FAILURE] ${response.status} on ${endpoint}. Redirecting to login.`);
        this.logout();
        throw new Error('Session expired or unauthorized');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`❌ [API Error] ${endpoint}:`, error.message);
      // For development: fallback to demo handlers for specific endpoints if backend is offline
      if (process.env.NODE_ENV === 'development') {
        return this.handleDemoRequest<T>(endpoint);
      }
      return { succeeded: false, message: error.message, data: null as any };
    }
  }

  /**
   * AUTHENTICATION
   */
  async login(credentials: any): Promise<ApiResponse<any>> {
    const response = await this.request<any>('/Authentication/Admin/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(credentials),
    });

    if (response.succeeded) {
      this.token = response.data.token;
      this.user = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', this.token!);
        localStorage.setItem('admin_user', JSON.stringify(this.user));
        // Set cookie for middleware
        document.cookie = `spred_admin_token=${this.token}; path=/; max-age=${12 * 60 * 60}; SameSite=Lax`;
      }
    }

    return response;
  }

  logout() {
    this.token = null;
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
  }

  /**
   * SYSTEM STATUS
   */
  async getDashboardStats() {
    return this.request<any>('/Analytics/dashboard');
  }

  async getActiveStreams() {
    return this.request<any[]>('/Live/channels');
  }

  /**
   * USER MANAGEMENT
   */
  async getAllUsers() {
    return this.request<any[]>('/UserManagement/User/get-all-users');
  }

  async updateUserStatus(id: string, isActive: boolean) {
    return this.request(`/UserManagement/User/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  /**
   * CONTENT MANAGEMENT
   */
  async getAllVideos() {
    return this.request<any[]>('/Catalogue/Video/get-all-videos');
  }

  async updateVideo(id: string, data: any) {
    return this.request(`/Catalogue/Video/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVideo(id: string) {
    return this.request(`/Catalogue/Video/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories() {
    return this.request<any[]>('/Catalogue/Categories');
  }

  async getContentTypes() {
    return this.request<any[]>('/Catalogue/ContentTypes');
  }

  async createCategory(name: string, description: string) {
    return this.request('/Catalogue/Category/create', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/Catalogue/Category/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * MODERATION & GOVERNANCE
   * (Consolidated at the bottom of class)
   */
  async getModerationStatus() {
    return this.request<any>('/dashboard/moderation-status');
  }

  /**
   * SYSTEM & AUDIT
   */
  async getAuditLogs() {
    return this.request<any[]>('/System/AuditLogs');
  }

  /**
   * FINANCE & SETTLEMENTS
   */
  async getWalletStats() {
    return this.request<any>('/Finance/get-wallet-stats');
  }

  async getAllTransactions() {
    return this.request<any[]>('/Finance/get-all-transactions');
  }

  async processPayout(transactionId: string, action: 'approve' | 'reject') {
    return this.request('/Finance/Payout/process', {
      method: 'POST',
      body: JSON.stringify({ transactionId, action }),
    });
  }

  /**
   * LIVE STREAM GOVERNANCE
   */
  async terminateStream(streamId: string) {
    return this.request(`/Live/channels/${streamId}/terminate`, {
      method: 'POST',
    });
  }

  async getStreamHealth(streamId: string) {
    return this.request<any>(`/stream/${streamId}/health`);
  }

  async getStreamHealthHistory(streamId: string, hours = 24) {
    return this.request<any[]>(`/stream/${streamId}/health-history?hours=${hours}`);
  }

  async getActiveStreamAlerts(limit = 20) {
    return this.request<any[]>(`/stream/alerts/active?limit=${limit}`);
  }

  async resolveStreamAlert(alertId: string | number) {
    return this.request(`/stream/alerts/${alertId}/resolve`, {
      method: 'PUT',
    });
  }

  /**
   * CREATOR ANALYTICS & INTELLIGENCE
   */
  async getCreatorMetrics(userId: string) {
    return this.request<any>(`/creator/${userId}/metrics`);
  }

  async getCreatorRetention(userId: string, days = 30) {
    return this.request<any[]>(`/creator/${userId}/analytics/retention?days=${days}`);
  }

  async getCreatorGeographic(userId: string) {
    return this.request<any>(`/creator/${userId}/analytics/geographic`);
  }

  async getCreatorContentStats(userId: string, contentId: string) {
    return this.request<any>(`/creator/${userId}/content/${contentId}/viewers`);
  }

  /**
   * CREATOR GOVERNANCE & VERIFICATION
   */
  async getCreatorsDirectory(filters: { page?: number, limit?: number, tier?: string, status?: string } = {}) {
    const params = new URLSearchParams(filters as any).toString();
    return this.request<any[]>(`/creators/directory?${params}`);
  }

  async updateCreatorTier(userId: string, tier: 'silver' | 'gold' | 'platinum') {
    return this.request(`/creator/${userId}/verification/tier`, {
      method: 'PUT',
      body: JSON.stringify({ tier }),
    });
  }

  async initiateVerification(userId: string) {
    return this.request(`/creator/${userId}/verification/initiate`, {
      method: 'POST',
    });
  }

  async getCreatorOnboarding(userId: string) {
    return this.request<any>(`/creator/${userId}/onboarding`);
  }

  async advanceOnboarding(userId: string) {
    return this.request(`/creator/${userId}/onboarding/advance`, {
      method: 'POST',
    });
  }

  /**
   * SYSTEM HEALTH DASHBOARD
   */
  async getCreatorOverallHealth() {
    return this.request<any>('/dashboard/creator-health');
  }

  /**
   * DEMO HANDLER (For development/offline)
   */
  private async handleDemoRequest<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.warn(`🎭 Mocking API response for: ${endpoint}`);
    await new Promise(r => setTimeout(r, 800)); // Simulate latency

    const mocks: any = {
      '/Analytics/dashboard': {
        succeeded: true,
        data: {
          users: { total: 12842, change: '+12.5%', trend: 'up' },
          videos: { total: 4521, change: '+8.3%', trend: 'up' },
          revenue: { total: 892450, change: '+23.1%', trend: 'up' },
          p2pTransfers: { total: 23456, change: '+45.2%', trend: 'up' },
        }
      },
      '/livestream/active': {
        succeeded: true,
        data: [
          { streamId: 'demo-1', title: 'Live Gaming: EAFC24', broadcaster: 'ProGamer99', viewers: 1250 },
          { streamId: 'demo-2', title: 'Nollywood Premiere', broadcaster: 'SpredMovies', viewers: 5400 }
        ]
      }
    };

    return mocks[endpoint] || { succeeded: false, message: 'Mock not found', data: null as any };
  }

  // ─── MODERATION GOVERNANCE ──────────────────────────────────────────
  async getModerationQueue(filters: { status?: string; priority?: string; limit?: number } = {}) {
    const params = new URLSearchParams(filters as any).toString();
    return this.request<any[]>(`/moderation/queue${params ? '?' + params : ''}`);
  }

  async updateReportStatus(reportId: string | number, status: 'pending' | 'investigating' | 'resolved') {
    return this.request(`/moderation/report/${reportId}/status`, { 
      method: 'PUT',
      body: JSON.stringify({ status }) 
    });
  }

  async updateReportPriority(reportId: string | number, priority: 'low' | 'normal' | 'high' | 'urgent') {
    return this.request(`/moderation/report/${reportId}/priority`, { 
      method: 'PUT',
      body: JSON.stringify({ priority })
    });
  }

  async resolveModerationCase(reportId: string | number, resolution: string, note?: string) {
    return this.request(`/moderation/report/${reportId}/resolve`, { 
      method: 'POST',
      body: JSON.stringify({ resolution, note })
    });
  }

  // ─── DISPATCH & BROADCAST ──────────────────────────────────────────
  async sendBroadcast(data: { title: string; message: string; targetAudience: string; priority: string }) {
    return this.request('/dispatch/broadcast', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getBroadcastHistory() {
    return this.request<any[]>('/dispatch/broadcasts');
  }

  async getEmergencyFeed() {
    return this.request<any[]>('/dispatch/emergency-feed');
  }

  async getSystemHealth() {
    return this.request<any>('/system/health');
  }

  // --- SYSTEM MANAGEMENT ---
  async getSystemSettings() {
    return this.request<any>('/system/settings');
  }

  async updateSystemSettings(category: string, settings: any) {
    return this.request('/system/settings', {
      method: 'PUT',
      body: JSON.stringify({ category, settings })
    });
  }

  async rotateAdminCredentials(currentPassword: string, newPassword: string) {
    return this.request('/system/auth/rotate-credentials', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  // --- INTELLIGENCE & FORECASTING ---
  async getRevenueForecast() {
    return this.request<any>('/intelligence/revenue-forecast');
  }

  async getP2PTopology() {
    return this.request<any>('/intelligence/p2p-topology');
  }

  async getViralVelocity() {
    return this.request<any>('/intelligence/viral-velocity');
  }

  /**
   * P2P ECONOMICS & SETTLEMENTS
   */
  async getP2PEconomicsStats() {
    return this.request<any>('/p2p/economics/stats');
  }

  async getTopMeshEarners() {
    return this.request<any[]>('/p2p/economics/top-earners');
  }

  // --- CONTENT INGESTION (PHASE 12) ---
  async ingestContent(formData: FormData, onProgress?: (percent: number) => void) {
    if (API_CONFIG.DEMO_MODE) {
      return { succeeded: true, message: 'Demo mode ingest success' };
    }

    // We use raw axios for upload progress tracking
    const currentToken = this.token || (typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null);

    const response = await axios.post(`${API_CONFIG.BASE_URL}/content/ingest-pro`, formData, {
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data;
  }

  // --- EMERGENCY PROTOCOLS (PHASE 13) ---
  async sendGlobalBroadcast(payload: { header: string, body: string, actionUrl?: string, type: string }) {
    return this.request<any>('/system/broadcast', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async toggleMaintenanceMode() {
    return this.request<any>('/system/maintenance-toggle', {
      method: 'POST'
    });
  }

  async exportAuditLogs() {
    return this.request<any>('/system/audit-export');
  }

  async getEmergencyStatus() {
    return this.request<any>('/system/active-broadcasts');
  }
}

export const api = new SpredApiService();
