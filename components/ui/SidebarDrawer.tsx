/**
 * Professional Sidebar Drawer Component (Optimized)
 *
 * Features:
 * - LinkedIn-style sidebar navigation
 * - Profile information display with smooth animations
 * - Memoized components for optimal performance
 * - Enhanced accessibility and touch feedback
 * - Glassmorphism effect with gradient backgrounds
 *
 * Performance Optimizations:
 * - React.memo to prevent unnecessary re-renders
 * - useCallback for event handlers
 * - Optimized animations with native driver
 * - Extracted constants and memoized values
 */

import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { teacherProfile } from "@/data";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Constants
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

// Animation Constants for better control
const ANIMATION_CONFIG = {
  springTension: 65,
  springFriction: 11,
  fadeInDuration: 300,
  fadeOutDuration: 250,
  slideOutDuration: 250,
};

// Stats Constants
const TEACHER_STATS = {
  classes: 8,
  students: 245,
  rating: 4.8,
} as const;

// TypeScript Interfaces
interface SidebarDrawerProps {
  visible: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  showBadge?: boolean;
  badgeCount?: number;
}

interface StatItemProps {
  value: number | string;
  label: string;
  color: string;
  showDivider?: boolean;
  dividerColor?: string;
}

// Memoized Stat Item Component
const StatItem = React.memo<StatItemProps>(
  ({ value, label, color, showDivider, dividerColor }) => {
    const { colors } = useTheme();

    return (
      <>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            {label}
          </Text>
        </View>
        {showDivider && (
          <View
            style={[
              styles.statDivider,
              { backgroundColor: dividerColor || colors.ui.divider },
            ]}
          />
        )}
      </>
    );
  }
);

StatItem.displayName = "StatItem";

// Memoized Menu Item Component
const MenuItem = React.memo<MenuItemProps>(
  ({ icon, title, subtitle, onPress, color, showBadge, badgeCount }) => {
    const { colors } = useTheme();
    const iconBgColor = useMemo(
      () => (color ? `${color}15` : `${colors.primary.main}15`),
      [color, colors.primary.main]
    );

    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: colors.background.secondary,
            borderBottomColor: colors.ui.divider,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={subtitle}
      >
        <View
          style={[styles.menuIconContainer, { backgroundColor: iconBgColor }]}
        >
          <Ionicons
            name={icon}
            size={22}
            color={color || colors.primary.main}
          />
        </View>

        <View style={styles.menuContent}>
          <Text style={[styles.menuTitle, { color: colors.text.primary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.menuSubtitle, { color: colors.text.secondary }]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {showBadge && badgeCount && badgeCount > 0 && (
          <View
            style={[
              styles.badge,
              { backgroundColor: colors.status.error.main },
            ]}
            accessibilityLabel={`${badgeCount} notifications`}
          >
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}

        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.text.tertiary}
        />
      </TouchableOpacity>
    );
  }
);

MenuItem.displayName = "MenuItem";

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  visible,
  onClose,
  onLogout,
}) => {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // Animation refs - use useRef to persist across renders
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Memoized teacher initials calculation
  const teacherInitials = useMemo(
    () =>
      teacherProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    []
  );

  // Memoized gradient colors
  const gradientColors = useMemo(
    () =>
      isDark
        ? ([colors.primary.main, colors.primary.dark || "#1a237e"] as const)
        : ([colors.primary.main, colors.primary.light || "#5c6bc0"] as const),
    [isDark, colors.primary.main, colors.primary.dark, colors.primary.light]
  );

  // Animation effect with cleanup
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: ANIMATION_CONFIG.springTension,
          friction: ANIMATION_CONFIG.springFriction,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_CONFIG.fadeInDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: ANIMATION_CONFIG.slideOutDuration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIMATION_CONFIG.fadeOutDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  // Memoized event handlers with useCallback
  const handleDashboard = useCallback(() => {
    onClose();
    router.push("/");
  }, [onClose, router]);

  const handleClasses = useCallback(() => {
    onClose();
    router.push("/classes");
  }, [onClose, router]);

  const handleStudents = useCallback(() => {
    onClose();
    // Navigate to students when screen is created
    console.log("Students screen - Coming soon!");
  }, [onClose]);

  const handleSchedule = useCallback(() => {
    onClose();
    // Navigate to schedule when screen is created
    console.log("Schedule screen - Coming soon!");
  }, [onClose]);

  const handleAttendance = useCallback(() => {
    onClose();
    router.push("/attendance");
  }, [onClose, router]);

  const handleEditProfile = useCallback(() => {
    onClose();
    router.push("/profile");
  }, [onClose, router]);

  const handleSettings = useCallback(() => {
    onClose();
    router.push("/profile");
  }, [onClose, router]);

  const handleNotifications = useCallback(() => {
    onClose();
    // Navigate to notifications when available
    console.log("Notifications opened");
  }, [onClose]);

  const handleHelp = useCallback(() => {
    onClose();
    // Navigate to help when available
    console.log("Help opened");
  }, [onClose]);

  const handleLogout = useCallback(() => {
    onClose();
    if (onLogout) {
      onLogout();
    }
  }, [onClose, onLogout]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: fadeAnim,
              },
            ]}
          />
        </Pressable>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: colors.background.primary,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.drawerHeader}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Close drawer"
            >
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.profileSection}>
              <View
                style={[
                  styles.avatarContainer,
                  { borderColor: colors.primary.contrast },
                ]}
              >
                <Text
                  style={[styles.avatarText, { color: colors.primary.main }]}
                >
                  {teacherInitials}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.editBadge,
                    { backgroundColor: colors.secondary.main },
                  ]}
                  onPress={handleEditProfile}
                  accessibilityRole="button"
                  accessibilityLabel="Edit profile"
                >
                  <Ionicons name="pencil" size={12} color="#FFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.profileName}>{teacherProfile.name}</Text>
              <Text style={styles.profileRole}>
                {teacherProfile.designation}
              </Text>
              <Text style={styles.profileId}>
                ID: {teacherProfile.employeeId}
              </Text>
            </View>
          </LinearGradient>

          {/* Menu Items - Wrapped in ScrollView */}
          <ScrollView
            style={styles.menuContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={styles.menuContentContainer}
          >
            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <StatItem
                value={TEACHER_STATS.classes}
                label="Classes"
                color={colors.primary.main}
                showDivider
              />
              <StatItem
                value={TEACHER_STATS.students}
                label="Students"
                color={colors.secondary.main}
                showDivider
              />
              <StatItem
                value={TEACHER_STATS.rating}
                label="Rating"
                color={colors.status.success.main}
              />
            </View>

            {/* Section: Navigation */}
            <View style={styles.menuSection}>
              <Text
                style={[styles.sectionTitle, { color: colors.text.tertiary }]}
              >
                NAVIGATION
              </Text>
              <MenuItem
                icon="home-outline"
                title="Dashboard"
                subtitle="Overview & analytics"
                onPress={handleDashboard}
                color={colors.primary.main}
              />
              <MenuItem
                icon="book-outline"
                title="Classes"
                subtitle="Manage your classes"
                onPress={handleClasses}
                color={colors.secondary.main}
              />
              <MenuItem
                icon="people-outline"
                title="Students"
                subtitle="Student management"
                onPress={handleStudents}
                color={colors.status.info.main}
              />
              <MenuItem
                icon="calendar-outline"
                title="Schedule"
                subtitle="View your timetable"
                onPress={handleSchedule}
                color={colors.status.warning.main}
              />
              <MenuItem
                icon="checkmark-done-outline"
                title="Attendance"
                subtitle="Track attendance"
                onPress={handleAttendance}
                color={colors.status.success.main}
              />
            </View>

            {/* Section: Account */}
            <View style={styles.menuSection}>
              <Text
                style={[styles.sectionTitle, { color: colors.text.tertiary }]}
              >
                ACCOUNT
              </Text>
              <MenuItem
                icon="person-outline"
                title="My Profile"
                subtitle="View and edit profile"
                onPress={handleEditProfile}
                color={colors.primary.main}
              />
              <MenuItem
                icon="settings-outline"
                title="Settings"
                subtitle="Preferences & privacy"
                onPress={handleSettings}
                color={colors.status.info.main}
              />
              <MenuItem
                icon="notifications-outline"
                title="Notifications"
                subtitle="Manage alerts"
                onPress={handleNotifications}
                color={colors.status.warning.main}
                showBadge
                badgeCount={3}
              />
            </View>

            {/* Section: Support */}
            <View style={styles.menuSection}>
              <Text
                style={[styles.sectionTitle, { color: colors.text.tertiary }]}
              >
                SUPPORT
              </Text>
              <MenuItem
                icon="help-circle-outline"
                title="Help & Support"
                subtitle="FAQs and contact"
                onPress={handleHelp}
                color={colors.status.success.main}
              />
              <MenuItem
                icon="information-circle-outline"
                title="About"
                subtitle="Version 1.0.0"
                onPress={() => {}}
                color={colors.text.secondary}
              />
            </View>
          </ScrollView>

          {/* Footer - Logout Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  backgroundColor: colors.status.error.background,
                  borderColor: colors.status.error.main,
                },
              ]}
              onPress={handleLogout}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Log out"
              accessibilityHint="Double tap to log out of your account"
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={colors.status.error.text}
              />
              <Text
                style={[styles.logoutText, { color: colors.status.error.text }]}
              >
                Log Out
              </Text>
            </TouchableOpacity>
            <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
              Teacher App Suite © 2025
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: Spacing.xs,
    marginBottom: Spacing.md,
  },
  profileSection: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    borderWidth: 3,
    position: "relative",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileName: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: FontSizes.sm,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 2,
  },
  profileId: {
    fontSize: FontSizes.xs,
    color: "rgba(255, 255, 255, 0.7)",
  },
  menuContainer: {
    flex: 1,
  },
  menuContentContainer: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(100, 100, 100, 0.05)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.xs,
  },
  menuSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.sm,
    marginVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FontSizes.xs,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginRight: Spacing.sm,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 40 : Spacing.lg,
    paddingTop: Spacing.md,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.md,
  },
  logoutText: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  footerText: {
    fontSize: FontSizes.xs,
    textAlign: "center",
  },
});
