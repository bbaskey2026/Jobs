import { apiClient } from './client.js';
import { JobDto, JobDetailDto, PaginatedResponse, ApiResponse, JobFilterQuery } from '@jobpulse/shared';

export const jobsApi = {
  async getJobs(params?: JobFilterQuery): Promise<PaginatedResponse<JobDto>> {
    const response = await apiClient.get<PaginatedResponse<JobDto>>('/jobs', { params });
    return response.data;
  },

  async getGovernmentJobs(params?: JobFilterQuery): Promise<PaginatedResponse<JobDto>> {
    const response = await apiClient.get<PaginatedResponse<JobDto>>('/jobs/government', { params });
    return response.data;
  },

  async getPrivateJobs(params?: JobFilterQuery): Promise<PaginatedResponse<JobDto>> {
    const response = await apiClient.get<PaginatedResponse<JobDto>>('/jobs/private', { params });
    return response.data;
  },

  async getStateStats(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/jobs/state-stats');
    return response.data.data;
  },

  async getJobDetail(slugOrId: string): Promise<JobDetailDto> {
    const response = await apiClient.get<ApiResponse<JobDetailDto>>(`/jobs/${slugOrId}`);
    return response.data.data;
  },

  async toggleBookmark(jobId: string): Promise<{ bookmarked: boolean }> {
    const response = await apiClient.post<ApiResponse<{ bookmarked: boolean }>>(`/bookmarks/${jobId}`);
    return response.data.data;
  },

  async reportJob(jobId: string, reason: string, description?: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/jobs/report', {
      jobId,
      reason,
      description
    });
    return response.data.data;
  }
};
