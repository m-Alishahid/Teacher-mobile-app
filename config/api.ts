// Base URL for the backend API
// Replace with your actual backend IP/domain
export const BASE_URL = 'http://192.168.1.244:3000'; // Adjust port if needed

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication Endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
};

// Helper function to construct full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`;
};
