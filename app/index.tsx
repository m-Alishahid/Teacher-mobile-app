import { LoginForm } from "@/components/auth/LoginForm";
import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Hardcoded credentials
const VALID_EMAIL = "teacher@gmail.com";
const VALID_PASSWORD = "123456";

export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    // Basic validation
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);

    // Simulate API call with credential validation
    setTimeout(async () => {
      // Check if credentials match
      if (email.toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
        try {
          // Use global login function which updates state
          await login(email);
          setIsLoading(false);
          // Redirection will be handled by _layout.tsx based on isLoggedIn state
        } catch (error) {
          setIsLoading(false);
          Alert.alert("Error", "Failed to save login state");
        }
      } else {
        setIsLoading(false);
        Alert.alert(
          "Invalid Credentials",
          "Email or password is incorrect.\n\nUse:\nEmail: teacher@gmail.com\nPassword: 123456"
        );
      }
    }, 1000);
  };

  const handleBiometricLogin = () => {
    Alert.alert(
      "Biometric Login",
      "Biometric authentication will be implemented here",
      [{ text: "OK" }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View
            style={[
              styles.logoContainer,
              {
                backgroundColor: colors.primary.main,
                shadowColor: colors.primary.main,
              },
            ]}
          >
            <Text style={styles.logoEmoji}>👨‍🏫</Text>
          </View>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Sign in to access your Teacher Portal
          </Text>
        </View>

        {/* Login Component */}
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View
            style={[styles.divider, { backgroundColor: colors.ui.divider }]}
          />
          <Text style={[styles.dividerText, { color: colors.text.tertiary }]}>
            OR
          </Text>
          <View
            style={[styles.divider, { backgroundColor: colors.ui.divider }]}
          />
        </View>

        {/* Biometric Login Button */}
        <TouchableOpacity
          style={[
            styles.biometricButton,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.ui.border,
            },
          ]}
          onPress={handleBiometricLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.biometricIcon}>🔐</Text>
          <Text
            style={[styles.biometricButtonText, { color: colors.text.primary }]}
          >
            Login with Biometrics
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.secondary }]}>
            Don't have an account?{" "}
            <Text style={[styles.signUpText, { color: colors.primary.main }]}>
              Contact Admin
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  headerSection: {
    alignItems: "center",
    marginTop: Spacing["3xl"],
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: FontSizes["3xl"],
    fontWeight: "bold",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.base,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    fontWeight: "500",
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minHeight: 52,
  },
  biometricIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  biometricButtonText: {
    fontSize: FontSizes.base,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: FontSizes.sm,
  },
  signUpText: {
    fontWeight: "600",
  },
});
