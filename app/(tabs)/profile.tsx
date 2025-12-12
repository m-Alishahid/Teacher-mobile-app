/**
 * Profile Screen (Settings)
 * 
 * User profile and app settings
 */

import { AppColors, BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
}) => {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <Text style={styles.arrowIcon}>›</Text>}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate back to login
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>MT</Text>
        </View>
        <Text style={styles.profileName}>Mr. Teacher</Text>
        <Text style={styles.profileEmail}>teacher@school.edu</Text>
        <Text style={styles.profileRole}>Mathematics Teacher</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Classes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>245</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="👤"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon')}
          />
          <SettingItem
            icon="🔒"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => Alert.alert('Change Password', 'Password change coming soon')}
          />
          <SettingItem
            icon="🔐"
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="🔔"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={() => Alert.alert('Notifications', 'Notification settings coming soon')}
          />
          <SettingItem
            icon="🌙"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            onPress={() => Alert.alert('Dark Mode', 'Dark mode coming soon')}
          />
          <SettingItem
            icon="🌐"
            title="Language"
            subtitle="English"
            onPress={() => Alert.alert('Language', 'Language selection coming soon')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="❓"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => Alert.alert('Help', 'Help center coming soon')}
          />
          <SettingItem
            icon="📄"
            title="Terms & Conditions"
            onPress={() => Alert.alert('Terms', 'Terms & Conditions coming soon')}
          />
          <SettingItem
            icon="🔒"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy', 'Privacy Policy coming soon')}
          />
          <SettingItem
            icon="ℹ️"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'Teacher Mobile App v1.0.0')}
          />
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Teacher Mobile App</Text>
        <Text style={styles.footerVersion}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  profileHeader: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: AppColors.primary.main,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.primary.contrast,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    color: AppColors.primary.main,
  },
  profileName: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: AppColors.primary.contrast,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    fontSize: FontSizes.sm,
    color: AppColors.primary.contrast,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  profileRole: {
    fontSize: FontSizes.sm,
    color: AppColors.primary.contrast,
    opacity: 0.8,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: AppColors.background.secondary,
    padding: Spacing.lg,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: AppColors.primary.main,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: AppColors.ui.divider,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsGroup: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.ui.divider,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconText: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  arrowIcon: {
    fontSize: 24,
    color: AppColors.text.tertiary,
  },
  logoutSection: {
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.status.error.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: AppColors.status.error.main,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  logoutText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.status.error.text,
  },
  footer: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: AppColors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  footerVersion: {
    fontSize: FontSizes.xs,
    color: AppColors.text.tertiary,
  },
});
