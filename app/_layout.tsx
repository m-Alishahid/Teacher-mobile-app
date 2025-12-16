import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
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

  return (
    <NavigationThemeProvider
      value={isDark ? customDarkTheme : customLightTheme}
    >
      <Stack
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
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: "none",
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
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
            animation: "fade_from_bottom",
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
      <RootLayoutNav />
    </ThemeProvider>
  );
}
