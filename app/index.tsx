/**
 * Login Screen - Entry point of the app
 * 
 * This is the first screen users see.
 * After successful login, navigate to (tabs)
 */

import { AppColors, BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to main app (tabs)
      router.replace('/(tabs)/' as any);
    }, 1000);
  };

  const handleBiometricLogin = () => {
    Alert.alert(
      'Biometric Login',
      'Biometric authentication will be implemented here',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>📚</Text>
          </View>
          <Text style={styles.title}>Teacher Portal</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={AppColors.text.tertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={AppColors.text.tertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Biometric Login Button */}
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.biometricIcon}>🔐</Text>
            <Text style={styles.biometricButtonText}>Login with Biometrics</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.signUpText}>Contact Admin</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: Spacing['3xl'],
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    // Shadow for iOS
    shadowColor: AppColors.primary.main,
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
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: AppColors.text.secondary,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: AppColors.ui.input.background,
    borderWidth: 1,
    borderColor: AppColors.ui.input.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.base,
    color: AppColors.text.primary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: FontSizes.sm,
    color: AppColors.primary.main,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: AppColors.primary.main,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    // Shadow
    shadowColor: AppColors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: AppColors.primary.contrast,
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.ui.divider,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    color: AppColors.text.tertiary,
    fontWeight: '500',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.background.secondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
    minHeight: 52,
  },
  biometricIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  biometricButtonText: {
    color: AppColors.text.primary,
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  signUpText: {
    color: AppColors.primary.main,
    fontWeight: '600',
  },
});
