import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { AttendanceProvider } from "@/context/AttendanceContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isLoggedIn, isLoading } = useAuth();
  const { isDark, colors } = useTheme();

  // Custom navigation theme that matches our app theme
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary.main,
      background: colors.background.primary,
      card: colors.background.secondary,
      text: colors.text.primary,
      border: colors.ui.border,
      notification: colors.primary.main,
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.primary.main,
      background: colors.background.primary,
      card: colors.background.secondary,
      text: colors.text.primary,
      border: colors.ui.border,
      notification: colors.primary.main,
    },
  };

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === "(tabs)";

    console.log("📍 Navigation Check:", {
      isLoggedIn,
      segments,
      segmentLength: segments.length,
      inTabsGroup,
    });

    if (!isLoggedIn && inTabsGroup) {
      // If not logged in and trying to access tabs, redirect to login
      console.log("🔒 Access denied: Redirecting to Login");
      router.replace("/");
    } else if (isLoggedIn && !inTabsGroup) {
      // If logged in and not in tabs, redirect to dashboard
      console.log("✅ Authenticated: Redirecting to Dashboard");
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, segments, isLoading]);

  // Don't render anything until we check auth status
  if (isLoading) {
    return null;
  }

  return (
    <NavigationThemeProvider
      value={isDark ? customDarkTheme : customLightTheme}
    >
      <Stack
        initialRouteName="index"
        screenOptions={{
          animation: "slide_from_right",
          animationDuration: 700,
          headerStyle: {
            backgroundColor: colors.background.secondary,
          },
          headerTintColor: colors.text.primary,
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="create-assignment"
          options={{
            title: "Create Assignment",
            headerShown: true,
            animation: "slide_from_bottom",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="student-details"
          options={{
            title: "Student Details",
            headerShown: true,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="assignments"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="assignment-details"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="submission-view"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AttendanceProvider>
          <RootLayoutNav />
        </AttendanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
