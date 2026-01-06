/**
 * API Service - Production Ready
 * Following backend integration best practices
 * Uses Axios client with interceptors and secure token storage
 */

import { API_ENDPOINTS } from '@/config/api';
import { AxiosError } from 'axios';
import apiClient from './apiClient';
import { secureStorage } from './secureStorage';

// Types for API responses
export interface LoginResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: UserData;
  message?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  department?: string;
  [key: string]: any; // Additional fields from backend
}

export interface MeResponse {
  success: boolean;
  user?: UserData;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  statusCode?: number;
}

// API Service Class
class ApiService {
  /**
   * Get stored auth token
   */
  async getToken(): Promise<string | null> {
    return await secureStorage.getToken('authToken');
  }

  /**
   * Save auth token
   */
  async saveToken(token: string): Promise<void> {
    await secureStorage.saveToken('authToken', token);
  }

  /**
   * Save refresh token
   */
  async saveRefreshToken(refreshToken: string): Promise<void> {
    await secureStorage.saveToken('refreshToken', refreshToken);
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return await secureStorage.getToken('refreshToken');
  }

  /**
   * Remove all tokens
   */
  async clearTokens(): Promise<void> {
    await secureStorage.clearAll();
  }

  /**
   * Login API call (POST /api/auth/login)
   */
  async login(email: string, password: string): Promise<LoginResponse | ApiError> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const data = response.data;
      
      // Extract token and user from the 'data' sub-object based on your backend structure
      const responseData = data.data || data;
      const token = responseData.token || responseData.accessToken || responseData.access_token || data.token;
      const refreshToken = responseData.refreshToken || data.refreshToken;
      const user = responseData.user || data.user;

      if (token) {
        await this.saveToken(token);
      }

      if (refreshToken) {
        await this.saveRefreshToken(refreshToken);
      }

      return {
        success: true,
        token: token,
        user: user,
        message: data.message || 'Login successful',
      };
    } catch (error) {
      return this.handleError(error as AxiosError, 'Login failed');
    }
  }

  /**
   * Get current user data (GET /api/auth/me)
   */
  async getCurrentUser(): Promise<MeResponse | ApiError> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      const data = response.data;

      // Handling your backend structure: data.data.user or data.data
      const responseData = data.data || data;
      const user = responseData.user || (data.data ? data.data : data);

      return {
        success: true,
        user: user,
        message: data.message,
      };
    } catch (error) {
      return this.handleError(error as AxiosError, 'Failed to fetch user data');
    }
  }

  /**
   * Logout - Clear tokens
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      if (API_ENDPOINTS.AUTH.LOGOUT) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
      
      await this.clearTokens();
    } catch (error) {
      // We don't use console.error here because a 401 or network error 
      // during logout is common and we still perform local cleanup.
      console.log('Logout API notification skipped:', (error as Error).message);
      // Clear tokens even if backend call fails
      await this.clearTokens();
    }
  }

  /**
   * Upload file (POST /api/upload)
   * Example for image/document upload
   */
  async uploadFile(
    uri: string,
    filename: string,
    mimeType: string = 'image/jpeg',
    endpoint: string = '/api/upload'
  ): Promise<any> {
    try {
      const formData = new FormData();
      
      // @ts-ignore - React Native FormData accepts file object
      formData.append('file', {
        uri,
        name: filename,
        type: mimeType,
      });

      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error as AxiosError, 'File upload failed');
    }
  }

  /**
   * Generic GET request
   */
  async get<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'GET request failed');
    }
  }

  /**
   * Generic POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'POST request failed');
    }
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'PUT request failed');
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'DELETE request failed');
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: AxiosError, defaultMessage: string): ApiError {
    console.error('API Error:', error);

    if (error.response) {
      // Server responded with error
      const data: any = error.response.data;
      return {
        success: false,
        message: data?.message || defaultMessage,
        code: data?.code,
        statusCode: error.response.status,
      };
    } else if (error.request) {
      // No response received
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Request setup error
      return {
        success: false,
        message: error.message || defaultMessage,
        code: 'REQUEST_ERROR',
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
