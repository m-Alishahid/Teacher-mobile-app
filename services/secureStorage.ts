/**
 * Secure Storage Service
 * Uses expo-secure-store for production-grade token storage
 * Falls back to AsyncStorage if SecureStore is unavailable
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Check if SecureStore is available (not available on web)
const isSecureStoreAvailable = Platform.OS !== 'web';

class SecureStorageService {
  /**
   * Save token securely
   */
  async saveToken(key: string, value: string): Promise<void> {
    try {
      if (value && typeof value === 'string') {
        if (isSecureStoreAvailable) {
          await SecureStore.setItemAsync(key, value);
        } else {
          // Fallback to AsyncStorage for web
          await AsyncStorage.setItem(key, value);
        }
      }
    } catch (error) {
      console.error('Error saving to secure storage:', error);
      throw error;
    }
  }

  /**
   * Get token from secure storage
   */
  async getToken(key: string): Promise<string | null> {
    try {
      if (isSecureStoreAvailable) {
        return await SecureStore.getItemAsync(key);
      } else {
        // Fallback to AsyncStorage for web
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error('Error getting from secure storage:', error);
      return null;
    }
  }

  /**
   * Remove token from secure storage
   */
  async removeToken(key: string): Promise<void> {
    try {
      if (isSecureStoreAvailable) {
        await SecureStore.deleteItemAsync(key);
      } else {
        // Fallback to AsyncStorage for web
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from secure storage:', error);
    }
  }

  /**
   * Clear all tokens
   */
  async clearAll(): Promise<void> {
    try {
      await this.removeToken('authToken');
      await this.removeToken('refreshToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const secureStorage = new SecureStorageService();
