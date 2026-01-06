import { apiService, UserData } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserData | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if token exists
      const token = await apiService.getToken();

      if (token) {
        // Validate token by fetching user data
        const response = await apiService.getCurrentUser();

        if ("success" in response && response.success && response.user) {
          setUser(response.user);
          setIsLoggedIn(true);
        } else {
          // Token is invalid, clear it
          await apiService.clearTokens();
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        // No token, user must login
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (e) {
      console.error("Auth check failed", e);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.login(email, password);

      if ("success" in response && response.success && response.user) {
        const userData = response.user;
        setUser(userData);
        setIsLoggedIn(true);

        // Store user data in AsyncStorage for offline access
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        return { success: true, message: response.message };
      } else {
        return {
          success: false,
          message:
            "message" in response
              ? response.message
              : "Login failed. Please try again.",
        };
      }
    } catch (error: any) {
      console.error("🔐 Login error:", error);
      return {
        success: false,
        message:
          error.message || "Network error. Please check your connection.",
      };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();

      if ("success" in response && response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem("userData", JSON.stringify(response.user));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const logout = async () => {
    try {
      // 1. Try to notify backend (don't let it block local logout)
      apiService.logout().catch((err) => {
        console.log("Backend logout notification skipped/failed:", err.message);
      });

      // 2. Clear local storage
      await apiService.clearTokens();
      await AsyncStorage.removeItem("userData");
    } catch (error) {
      console.error("Local cleanup during logout failed:", error);
    } finally {
      // 3. Always update state to log out the user UI-wise
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, user, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
