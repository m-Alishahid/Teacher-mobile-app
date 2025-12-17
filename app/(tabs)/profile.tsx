/**
 * Enhanced Profile Screen
 *
 * Features:
 * - Teacher profile information
 * - Check-in/Check-out functionality
 * - Attendance history
 * - Settings and preferences
 * - Professional UI with gradient design
 */

import { AttendanceHistory } from "@/components/profile/AttendanceHistory";
import { CheckInOutCard } from "@/components/profile/CheckInOutCard";
import {
  LeaveApplication,
  LeaveApplicationModal,
} from "@/components/profile/LeaveApplicationModal";
import { CustomAlert } from "@/components/ui/CustomAlert";
import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import {
  AttendanceRecord,
  attendanceHistory as initialAttendanceHistory,
  currentAttendance as initialCurrentAttendance,
  teacherProfile,
} from "@/data";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  type?: "link" | "toggle" | "info";
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  color?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  type = "link",
  value,
  onValueChange,
  color,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          backgroundColor: colors.background.secondary,
          borderBottomColor: colors.ui.divider,
        },
      ]}
      onPress={type === "toggle" ? undefined : onPress}
      activeOpacity={type === "toggle" ? 1 : 0.7}
      disabled={type === "info"}
    >
      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor: isDark
              ? colors.background.tertiary
              : colors.ui.divider + "40",
          },
        ]}
      >
        <Ionicons name={icon} size={22} color={color || colors.primary.main} />
      </View>

      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.settingSubtitle, { color: colors.text.secondary }]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {type === "link" && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.text.tertiary}
        />
      )}

      {type === "toggle" && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: colors.text.disabled,
            true: colors.primary.main,
          }}
          thumbColor={
            Platform.OS === "ios"
              ? "#fff"
              : value
              ? colors.primary.contrast
              : "#f4f3f4"
          }
        />
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [showAttendanceHistory, setShowAttendanceHistory] = useState(false);
  const [showLeaveApplication, setShowLeaveApplication] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >([]);

  // Attendance state
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord>(
    initialCurrentAttendance
  );
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >(initialAttendanceHistory);
  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    icon: "",
    iconColor: "",
    buttons: [] as any[],
  });

  const showAlert = (
    title: string,
    message: string,
    icon: string,
    iconColor: string,
    buttons: any[] = [{ text: "OK", style: "default" }]
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      icon,
      iconColor,
      buttons,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const isCheckedIn =
    currentAttendance.status === "checked-in" ||
    currentAttendance.status === "present";

  const handleCheckIn = () => {
    setCheckInLoading(true);
    setTimeout(() => {
      const now = new Date();
      const checkInTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setCurrentAttendance({
        ...currentAttendance,
        checkInTime,
        status: "checked-in",
      });

      setCheckInLoading(false);
      showAlert(
        "✅ Checked In",
        `Welcome! You checked in at ${checkInTime}`,
        "checkmark.circle.fill",
        colors.status.success.main
      );
    }, 1000);
  };

  const handleCheckOut = () => {
    showAlert(
      "Confirm Check Out",
      "Are you sure you want to check out for the day?",
      "log-out.fill",
      colors.status.warning.main,
      [
        { text: "Cancel", style: "cancel", onPress: closeAlert },
        {
          text: "Check Out",
          style: "default",
          onPress: () => {
            closeAlert();
            setCheckInLoading(true);
            setTimeout(() => {
              const now = new Date();
              const checkOutTime = now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              // Calculate working hours (simplified)
              const workingHours = "8h 15m";

              const completedRecord: AttendanceRecord = {
                ...currentAttendance,
                checkOutTime,
                workingHours,
                status: "present",
              };

              // Add to history
              setAttendanceHistory([completedRecord, ...attendanceHistory]);

              // Update current state to show COMPLETED status instead of resetting
              setCurrentAttendance(completedRecord);

              setCheckInLoading(false);
              setTimeout(() => {
                showAlert(
                  "👋 See You Tomorrow!",
                  `You worked for ${workingHours} today. Have a great evening!`,
                  "moon.stars.fill",
                  colors.primary.main
                );
              }, 500);
            }, 1000);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    showAlert(
      "Logout",
      "Are you sure you want to end your session?",
      "power",
      colors.status.error.main,
      [
        { text: "Cancel", style: "cancel", onPress: closeAlert },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            closeAlert();
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    showAlert(
      "Edit Profile",
      "Opening profile editor...",
      "person.circle.fill",
      colors.primary.main
    );
  };

  const handleChangePassword = () => {
    showAlert(
      "Security",
      "Password change flow initiated.",
      "lock.fill",
      colors.status.info.main
    );
  };

  const handleLeaveApplicationSubmit = (application: LeaveApplication) => {
    setLeaveApplications([application, ...leaveApplications]);
    setShowLeaveApplication(false);
    setTimeout(() => {
      showAlert(
        "Application Submitted",
        "Your leave request has been sent for approval.",
        "checkmark.circle.fill",
        colors.status.success.main
      );
    }, 500);
  };

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
        contentContainerStyle={{ paddingBottom: Spacing["3xl"] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={
            isDark
              ? [colors.primary.main, colors.primary.dark || "#1a237e"]
              : [colors.primary.main, colors.primary.light || "#5c6bc0"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View
              style={[
                styles.avatarContainer,
                { borderColor: colors.primary.contrast },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.primary.main }]}>
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
              >
                <Ionicons name="pencil" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.name, { color: colors.primary.contrast }]}>
              {teacherProfile.name}
            </Text>
            <Text style={[styles.role, { color: "rgba(255,255,255,0.9)" }]}>
              {teacherProfile.designation} • {teacherProfile.department}
            </Text>
            <Text
              style={[styles.employeeId, { color: "rgba(255,255,255,0.8)" }]}
            >
              ID: {teacherProfile.employeeId}
            </Text>
          </View>
        </LinearGradient>

        {/* Check-In/Out Card */}
        <View style={styles.checkInSection}>
          <CheckInOutCard
            isCheckedIn={isCheckedIn}
            checkInTime={currentAttendance.checkInTime}
            checkOutTime={currentAttendance.checkOutTime}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            loading={checkInLoading}
          />

          {/* Attendance History Button */}
          <TouchableOpacity
            style={[
              styles.historyButton,
              {
                backgroundColor: colors.ui.card,
                borderColor: colors.ui.border,
              },
            ]}
            onPress={() => setShowAttendanceHistory(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.primary.main}
            />
            <Text
              style={[styles.historyButtonText, { color: colors.text.primary }]}
            >
              View Attendance History
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.background.secondary,
                shadowColor: colors.ui.shadow,
              },
            ]}
          >
            <Ionicons name="book" size={24} color={colors.primary.main} />
            <Text style={[styles.statValue, { color: colors.primary.main }]}>
              8
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Classes
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.background.secondary,
                shadowColor: colors.ui.shadow,
              },
            ]}
          >
            <Ionicons name="people" size={24} color={colors.secondary.main} />
            <Text style={[styles.statValue, { color: colors.secondary.main }]}>
              245
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Students
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.background.secondary,
                shadowColor: colors.ui.shadow,
              },
            ]}
          >
            <Ionicons
              name="star"
              size={24}
              color={colors.status.success.main}
            />
            <Text
              style={[styles.statValue, { color: colors.status.success.main }]}
            >
              4.8
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Rating
            </Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.text.tertiary }]}>
            PERSONAL INFORMATION
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <SettingItem
              icon="mail-outline"
              title="Email"
              subtitle={teacherProfile.email}
              type="info"
              color={colors.status.info.main}
            />
            <SettingItem
              icon="call-outline"
              title="Phone"
              subtitle={teacherProfile.phone}
              type="info"
              color={colors.status.success.main}
            />
            <SettingItem
              icon="briefcase-outline"
              title="Department"
              subtitle={teacherProfile.department}
              type="info"
              color={colors.primary.main}
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.text.tertiary }]}>
            ACCOUNT SETTINGS
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <SettingItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update your information"
              onPress={handleEditProfile}
            />
            <SettingItem
              icon="lock-closed-outline"
              title="Security"
              subtitle="Password, 2FA"
              onPress={handleChangePassword}
            />
            <SettingItem
              icon="finger-print-outline"
              title="Biometric Login"
              type="toggle"
              value={biometrics}
              onValueChange={setBiometrics}
            />
          </View>
        </View>

        {/* Leave Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.text.tertiary }]}>
            LEAVE MANAGEMENT
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <SettingItem
              icon="calendar-outline"
              title="Apply for Leave"
              subtitle="Submit leave application"
              onPress={() => setShowLeaveApplication(true)}
              color={colors.status.warning.main}
            />
            <SettingItem
              icon="document-text-outline"
              title="Leave History"
              subtitle={`${leaveApplications.length} application(s)`}
              onPress={() =>
                showAlert(
                  "Leave History",
                  leaveApplications.length > 0
                    ? `You have ${leaveApplications.length} leave application(s)`
                    : "No leave applications yet",
                  "document-text-outline",
                  colors.status.info.main
                )
              }
              color={colors.status.info.main}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.text.tertiary }]}>
            PREFERENCES
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              type="toggle"
              value={isDark}
              onValueChange={toggleTheme}
              color={isDark ? "#FFD700" : "#5C5C5C"}
            />
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              type="toggle"
              value={notifications}
              onValueChange={setNotifications}
              color={colors.status.warning.main}
            />
            <SettingItem
              icon="language-outline"
              title="Language"
              subtitle="English (US)"
              onPress={() =>
                showAlert(
                  "Language",
                  "Language selection dialog is coming soon.",
                  "language-outline",
                  colors.status.info.main
                )
              }
              color={colors.status.info.main}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.text.tertiary }]}>
            SUPPORT
          </Text>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <SettingItem
              icon="help-circle-outline"
              title="Help Center"
              onPress={() =>
                showAlert(
                  "Help Center",
                  "Redirection to Help Center is under construction.",
                  "help-circle-outline",
                  colors.primary.main
                )
              }
            />
            <SettingItem
              icon="information-circle-outline"
              title="About App"
              subtitle="v1.0.0"
              onPress={() =>
                showAlert(
                  "About",
                  "Teacher Mobile App\nVersion 1.0.0\nBuild 2024.12.17",
                  "information-circle-outline",
                  colors.primary.main
                )
              }
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                borderColor: colors.status.error.main,
                backgroundColor: colors.status.error.background,
              },
            ]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.status.error.text}
            />
            <Text
              style={[styles.logoutText, { color: colors.status.error.text }]}
            >
              Log Out
            </Text>
          </TouchableOpacity>
          <Text style={[styles.versionText, { color: colors.text.tertiary }]}>
            Teacher App Suite © 2025
          </Text>
        </View>
      </ScrollView>

      {/* Attendance History Modal */}
      <Modal
        visible={showAttendanceHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAttendanceHistory(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background.primary },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.ui.divider },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              Attendance History
            </Text>
            <TouchableOpacity
              onPress={() => setShowAttendanceHistory(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <AttendanceHistory records={attendanceHistory} />
          </View>
        </View>
      </Modal>

      {/* Leave Application Modal */}
      <LeaveApplicationModal
        visible={showLeaveApplication}
        onClose={() => setShowLeaveApplication(false)}
        onSubmit={handleLeaveApplicationSubmit}
      />

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        iconColor={alertConfig.iconColor}
        buttons={alertConfig.buttons}
        onClose={closeAlert}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing["3xl"],
    paddingBottom: Spacing["2xl"],
    borderBottomLeftRadius: BorderRadius["2xl"],
    borderBottomRightRadius: BorderRadius["2xl"],
    alignItems: "center",
    marginBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    alignItems: "center",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    borderWidth: 4,
    position: "relative",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  name: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
    marginBottom: 4,
  },
  role: {
    fontSize: FontSizes.base,
    opacity: 0.9,
    marginBottom: 2,
  },
  employeeId: {
    fontSize: FontSizes.sm,
    opacity: 0.8,
  },
  checkInSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing["2xl"],
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyButtonText: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    fontSize: FontSizes.xs,
    fontWeight: "bold",
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
    letterSpacing: 1,
  },
  card: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: FontSizes.xs,
  },
  footer: {
    padding: Spacing.lg,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing["2xl"],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    width: "100%",
    marginBottom: Spacing.lg,
  },
  logoutText: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  versionText: {
    fontSize: FontSizes.xs,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
  },
  closeButton: {
    padding: Spacing.xs,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
});
