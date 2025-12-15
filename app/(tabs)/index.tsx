/**
 * Dashboard Screen (Home Tab)
 *
 * Premium Features:
 * - Gradient header with dynamic greeting
 * - Animated stat cards with icons
 * - Live class indicator
 * - Quick action shortcuts
 * - Recent activity feed
 * - Smooth animations and transitions
 */

import { AttendanceSummaryCard } from "@/components/dashboard/AttendanceSummaryCard";
import { DetailedReportModal } from "@/components/dashboard/DetailedReportModal";
import { NotificationModal } from "@/components/dashboard/NotificationModal";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import {
  classSchedule,
  dashboardStats,
  initialNotifications,
  recentActivities as initialRecentActivities,
  teacherProfile,
  todayAttendance,
  type Notification,
  type QuickAction,
  type RecentActivity,
} from "@/data";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  // Get dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get current or next class
  const getCurrentClass = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const runningClass = classSchedule.find((cls) => {
      if (cls.dayOfWeek !== currentDay) return false;
      return currentTime >= cls.startTime && currentTime <= cls.endTime;
    });

    if (runningClass) {
      return { ...runningClass, isLive: true };
    }

    const upcomingClass = classSchedule.find((cls) => {
      if (cls.dayOfWeek !== currentDay) return false;
      return currentTime < cls.startTime;
    });

    return upcomingClass
      ? { ...upcomingClass, isLive: false }
      : { ...classSchedule[0], isLive: false };
  };

  const currentClassData = getCurrentClass();
  const nextClass = {
    subject: currentClassData.subject,
    grade: currentClassData.className,
    time: `${currentClassData.startTime} - ${currentClassData.endTime}`,
    room: currentClassData.room,
    studentsCount: currentClassData.studentsCount,
    isLive: currentClassData.isLive,
  };

  // Quick Actions
  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Take Attendance",
      icon: "checkmark.circle.fill",
      color: colors.status.success.main,
      action: () => router.push("/(tabs)/attendance"),
    },
    {
      id: "2",
      title: "My Classes",
      icon: "book.fill",
      color: colors.primary.main,
      action: () => router.push("/(tabs)/classes"),
    },
    {
      id: "3",
      title: "Messages",
      icon: "envelope.fill",
      color: colors.status.info.main,
      action: () => Alert.alert("Messages", "Opening messages..."),
    },
    {
      id: "4",
      title: "Assignments",
      icon: "doc.text.fill",
      color: colors.status.warning.main,
      action: () => Alert.alert("Assignments", "Opening assignments..."),
    },
  ];

  // Map recent activities with theme colors
  const recentActivities: RecentActivity[] = initialRecentActivities.map(
    (activity, index) => ({
      ...activity,
      iconColor:
        index === 0
          ? colors.status.success.main
          : index === 1
          ? colors.status.warning.main
          : colors.status.info.main,
    })
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleQuickAttendance = () => {
    Alert.alert(
      "📋 Quick Attendance",
      `Mark attendance for ${nextClass.grade}?\n\nSubject: ${nextClass.subject}\nTime: ${nextClass.time}\nRoom: ${nextClass.room}\nStudents: ${nextClass.studentsCount}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start Attendance",
          onPress: () => router.push("/(tabs)/attendance"),
        },
      ]
    );
  };

  const handleStatCard = (type: string) => {
    switch (type) {
      case "students":
        Alert.alert(
          "👥 Total Students",
          `You teach ${dashboardStats.totalStudents} students across all classes\n\n📚 Class Distribution:\n• Grade 10A: 32 students\n• Grade 10B: 28 students\n• Grade 11A: 30 students\n• Grade 11B: 26 students\n• Grade 12A: 24 students\n• And more...`
        );
        break;
      case "attendance":
        setShowReportModal(true);
        break;
      case "tasks":
        Alert.alert(
          "📝 Pending Tasks",
          `You have ${dashboardStats.pendingTasks} pending tasks:\n\n📋 Breakdown:\n• Grade assignments: 5\n• Review submissions: 4\n• Parent meetings: 3\n\nStay organized!`
        );
        break;
      case "deadlines":
        Alert.alert(
          "⏰ Upcoming Deadlines",
          `${dashboardStats.upcomingDeadlines} deadlines approaching:\n\n📅 Schedule:\n• Math assignment (Tomorrow)\n• Physics quiz (2 days)\n• Chemistry project (3 days)\n\nPlan ahead!`
        );
        break;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={
          isDark
            ? [colors.primary.main, colors.primary.dark || "#1a237e"]
            : [colors.primary.main, colors.primary.light || "#5c6bc0"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text
              style={[
                styles.headerGreeting,
                { color: colors.primary.contrast },
              ]}
            >
              {getGreeting()}! 👋
            </Text>
            <Text
              style={[styles.headerName, { color: colors.primary.contrast }]}
            >
              {teacherProfile.name}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.primary.contrast },
              ]}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => setShowNotifications(true)}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="bell.fill"
              size={24}
              color={colors.primary.contrast}
            />
            {unreadCount > 0 && (
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: colors.status.error.main },
                ]}
              >
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Live Class Banner */}
        {nextClass.isLive && (
          <Animated.View
            style={[
              styles.liveClassBanner,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.liveDotContainer}>
              <View style={[styles.liveDot, styles.liveDotPulse]} />
              <View style={styles.liveDot} />
            </View>
            <Text
              style={[styles.liveClassText, { color: colors.primary.contrast }]}
            >
              LIVE NOW: {nextClass.subject} • {nextClass.room}
            </Text>
          </Animated.View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statsGrid}>
            <StatsCard
              type="students"
              value={dashboardStats.totalStudents}
              label="Total Students"
              onPress={() => handleStatCard("students")}
            />
            <StatsCard
              type="attendance"
              value={dashboardStats.todayAttendancePercent}
              label="Today's Attendance"
              onPress={() => handleStatCard("attendance")}
              isPercentage
            />
            <StatsCard
              type="tasks"
              value={dashboardStats.pendingTasks}
              label="Pending Tasks"
              onPress={() => handleStatCard("tasks")}
            />
            <StatsCard
              type="deadlines"
              value={dashboardStats.upcomingDeadlines}
              label="Deadlines"
              onPress={() => handleStatCard("deadlines")}
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickActionCard,
                  {
                    backgroundColor: colors.ui.card,
                    borderColor: colors.ui.border,
                  },
                ]}
                onPress={action.action}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color + "20" },
                  ]}
                >
                  <IconSymbol
                    name={action.icon as any}
                    size={24}
                    color={action.color}
                  />
                </View>
                <Text
                  style={[
                    styles.quickActionText,
                    { color: colors.text.primary },
                  ]}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Next Class Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {nextClass.isLive ? "Current Class" : "Next Class"}
            </Text>
            {nextClass.isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveBadgeDot} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
          </View>
          <ScheduleCard
            subject={nextClass.subject}
            grade={nextClass.grade}
            time={nextClass.time}
            room={nextClass.room}
            studentsCount={nextClass.studentsCount}
            onQuickAttendance={handleQuickAttendance}
          />
        </View>

        {/* Today's Attendance Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Today's Attendance
          </Text>
          <AttendanceSummaryCard
            present={todayAttendance.present}
            absent={todayAttendance.absent}
            total={todayAttendance.total}
            onViewDetails={() => setShowReportModal(true)}
          />
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Recent Activity
          </Text>
          <View style={styles.activityList}>
            {recentActivities.map((activity) => (
              <View
                key={activity.id}
                style={[
                  styles.activityItem,
                  {
                    backgroundColor: colors.ui.card,
                    borderColor: colors.ui.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: activity.iconColor + "20" },
                  ]}
                >
                  <IconSymbol
                    name={activity.icon as any}
                    size={20}
                    color={activity.iconColor}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text
                    style={[
                      styles.activityTitle,
                      { color: colors.text.primary },
                    ]}
                  >
                    {activity.title}
                  </Text>
                  <Text
                    style={[
                      styles.activityDescription,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {activity.description}
                  </Text>
                  <Text
                    style={[
                      styles.activityTime,
                      { color: colors.text.tertiary },
                    ]}
                  >
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />
      <DetailedReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        stats={todayAttendance}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Gradient Header
  gradientHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: FontSizes.base,
    opacity: 0.9,
    marginBottom: 4,
  },
  headerName: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    opacity: 0.8,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // Live Class Banner
  liveClassBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  liveDotContainer: {
    position: "relative",
    width: 12,
    height: 12,
  },
  liveDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: "#FF4444",
    top: 2,
    left: 2,
  },
  liveDotPulse: {
    width: 12,
    height: 12,
    backgroundColor: "#FF4444",
    opacity: 0.4,
    top: 0,
    left: 0,
  },
  liveClassText: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Stats Section
  statsSection: {
    marginTop: -Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },

  // Section
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  lastSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },

  // Live Badge
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4444",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  liveBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: "#FFFFFF",
  },
  liveBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  quickActionCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  quickActionText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    textAlign: "center",
  },

  // Recent Activity
  activityList: {
    gap: Spacing.sm,
  },
  activityItem: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: FontSizes.sm,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: FontSizes.xs,
  },
});
