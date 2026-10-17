import { apiClient } from './client.js';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserDto,
  ApiResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '@jobpulse/shared';

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.data.data.accessToken) {
      sessionStorage.setItem('jobpulse_token', response.data.data.accessToken);
    }
    return response.data.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    if (response.data.data.accessToken) {
      sessionStorage.setItem('jobpulse_token', response.data.data.accessToken);
    }
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    sessionStorage.removeItem('jobpulse_token');
  },

  async me(): Promise<UserDto> {
    const response = await apiClient.get<ApiResponse<UserDto>>('/auth/me');
    return response.data.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data);
    return response.data.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', data);
    return response.data.data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-email', { token });
    return response.data.data;
  }
};
