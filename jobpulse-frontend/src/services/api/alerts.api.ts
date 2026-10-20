import { apiClient } from './client.js';
import {
  JobAlertDto,
  NotificationDto,
  ApplicationRecordDto,
  ApiResponse,
  CreateJobAlertRequest,
  DashboardMetricsDto,
  OrganizationDto
} from '@jobpulse/shared';

export const alertsApi = {
  async getAlerts(): Promise<JobAlertDto[]> {
    const res = await apiClient.get<ApiResponse<JobAlertDto[]>>('/alerts');
    return res.data.data;
  },

  async createAlert(data: CreateJobAlertRequest): Promise<JobAlertDto> {
    const res = await apiClient.post<ApiResponse<JobAlertDto>>('/alerts', data);
    return res.data.data;
  },

  async toggleAlertActive(id: string, isActive: boolean): Promise<JobAlertDto> {
    const res = await apiClient.patch<ApiResponse<JobAlertDto>>(`/alerts/${id}`, { isActive });
    return res.data.data;
  },

  async deleteAlert(id: string): Promise<void> {
    await apiClient.delete(`/alerts/${id}`);
  }
};

export const notificationsApi = {
  async getNotifications(): Promise<{ notifications: NotificationDto[]; unreadCount: number }> {
    const res = await apiClient.get<ApiResponse<{ notifications: NotificationDto[]; unreadCount: number }>>('/notifications');
    return res.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/read-all');
  }
};

export const applicationsApi = {
  async getApplications(): Promise<ApplicationRecordDto[]> {
    const res = await apiClient.get<ApiResponse<ApplicationRecordDto[]>>('/applications');
    return res.data.data;
  },

  async trackOutboundClick(jobId: string, notes?: string): Promise<void> {
    await apiClient.post('/applications/track-outbound', { jobId, notes });
  }
};

export const organizationsApi = {
  async getOrganizations(): Promise<OrganizationDto[]> {
    const res = await apiClient.get<{ data: OrganizationDto[] }>('/organizations?limit=100');
    return res.data.data;
  },

  async getOrganizationDetail(slug: string): Promise<OrganizationDto & { jobs: any[] }> {
    const res = await apiClient.get<ApiResponse<OrganizationDto & { jobs: any[] }>>(`/organizations/${slug}`);
    return res.data.data;
  },

  async createOrganization(data: {
    name: string;
    sector: string;
    category?: string;
    description?: string;
    websiteUrl?: string;
    officialNotificationDomain?: string;
    headquartersState?: string;
    logoUrl?: string;
  }): Promise<OrganizationDto> {
    const res = await apiClient.post<ApiResponse<OrganizationDto>>('/organizations', data);
    return res.data.data;
  }
};

export const categoriesApi = {
  async getCategories(): Promise<any[]> {
    const res = await apiClient.get<ApiResponse<any[]>>('/categories');
    return res.data.data;
  },

  async createCategory(data: { name: string; description?: string; iconName?: string }): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/categories', data);
    return res.data.data;
  }
};

export const adminApi = {
  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    const res = await apiClient.get<ApiResponse<DashboardMetricsDto>>('/admin/dashboard');
    return res.data.data;
  },

  async getAdminJobs(params?: { page?: number; limit?: number; status?: string }): Promise<any> {
    const res = await apiClient.get('/admin/jobs', { params });
    return res.data;
  },

  async updateJobStatus(id: string, status: string): Promise<void> {
    await apiClient.patch(`/admin/jobs/${id}/status`, { status });
  },

  async createJob(data: any): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/admin/jobs', data);
    return res.data.data;
  },

  async triggerSourceSync(code: string): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/admin/sources/sync', { code });
    return res.data.data;
  },

  async getReports(): Promise<any[]> {
    const res = await apiClient.get<ApiResponse<any[]>>('/admin/reports');
    return res.data.data;
  }
};
