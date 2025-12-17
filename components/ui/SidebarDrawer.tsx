/**
 * Professional Sidebar Drawer Component
 *
 * Features:
 * - LinkedIn-style sidebar navigation
 * - Profile information display
 * - Quick access to settings and logout
 * - Smooth animations and modern design
 * - Glassmorphism effect
 */

import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { teacherProfile } from "@/data";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

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

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  color,
  showBadge,
  badgeCount,
}) => {
  const { colors } = useTheme();

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
    >
      <View
        style={[
          styles.menuIconContainer,
          {
            backgroundColor: color ? `${color}15` : `${colors.primary.main}15`,
          },
        ]}
      >
        <Ionicons name={icon} size={22} color={color || colors.primary.main} />
      </View>

      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: colors.text.primary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: colors.text.secondary }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {showBadge && badgeCount && badgeCount > 0 && (
        <View
          style={[styles.badge, { backgroundColor: colors.status.error.main }]}
        >
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}

      <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
};

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  visible,
  onClose,
  onLogout,
}) => {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleEditProfile = () => {
    onClose();
    // Navigate to edit profile
  };

  const handleSettings = () => {
    onClose();
    router.push("/(tabs)/profile");
  };

  const handleNotifications = () => {
    onClose();
    // Navigate to notifications
  };

  const handleHelp = () => {
    onClose();
    // Navigate to help
  };

  const handleLogout = () => {
    onClose();
    if (onLogout) {
      onLogout();
    }
  };

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
            colors={
              isDark
                ? [colors.primary.main, colors.primary.dark || "#1a237e"]
                : [colors.primary.main, colors.primary.light || "#5c6bc0"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.drawerHeader}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
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
                  {teacherProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.editBadge,
                    { backgroundColor: colors.secondary.main },
                  ]}
                  onPress={handleEditProfile}
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

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: colors.primary.main }]}
                >
                  8
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.text.secondary }]}
                >
                  Classes
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: colors.ui.divider },
                ]}
              />
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: colors.secondary.main }]}
                >
                  245
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.text.secondary }]}
                >
                  Students
                </Text>
              </View>
              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: colors.ui.divider },
                ]}
              />
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    { color: colors.status.success.main },
                  ]}
                >
                  4.8
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.text.secondary }]}
                >
                  Rating
                </Text>
              </View>
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
          </View>

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
    paddingTop: Spacing.md,
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
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
