/**
 * Axios API Client with Interceptors
 * Production-ready API client following backend integration best practices
 */

import { BASE_URL } from '@/config/api';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from './secureStorage';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds Authorization token to all requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await secureStorage.getToken('authToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (__DEV__) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          hasToken: !!token,
        });
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common errors (401, 403, etc.)
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (__DEV__) {
      // Don't log error for logout 401s as they are expected
      const isLogout401 = error.response?.status === 401 && error.config?.url?.includes('/logout');
      
      if (!isLogout401) {
        console.error('❌ API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });
      }
    }

    // Handle 401 Unauthorized - Token expired/invalid
    if (error.response?.status === 401) {
      // If it's the logout endpoint, we don't need to log it as an error
      if (error.config?.url?.includes('/logout')) {
        console.log('🚪 Session already cleared on server');
        return Promise.resolve({ data: { success: true } });
      }

      console.log('🔒 Unauthorized - Clearing session');
      // Clear tokens and redirect to login will be handled by AuthContext
      await secureStorage.clearAll();
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      console.log('🚫 Forbidden - Insufficient permissions');
    }

    // Handle 429 Rate Limit
    if (error.response?.status === 429) {
      console.log('⏸️ Rate limit exceeded - Please wait');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.log('⚠️ Server error - Please try again later');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
