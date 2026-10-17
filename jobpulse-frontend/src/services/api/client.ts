import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach bearer token if stored in sessionStorage (or cookie takes precedence)
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('jobpulse_token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message
    const customMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(customMessage));
  }
);
