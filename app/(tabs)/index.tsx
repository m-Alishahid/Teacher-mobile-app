/**
 * Dashboard Screen (Home Tab)
 *
 * Premium "Senior Developer" Design Overhaul:
 * - Sophisticated typography and spacing
 * - Modern card layouts with glassmorphism touches
 * - Clean, professional data visualization
 * - Refined navigation and interaction points
 */

import { AttendanceSummaryCard } from "@/components/dashboard/AttendanceSummaryCard";
import { DetailedReportModal } from "@/components/dashboard/DetailedReportModal";
import { NotificationModal } from "@/components/dashboard/NotificationModal";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CheckInOutCard } from "@/components/profile/CheckInOutCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { FontSizes, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  classSchedule,
  dashboardStats,
  recentActivities as initialRecentActivities,
  todayAttendance,
  type QuickAction,
  type RecentActivity,
} from "@/data";
import { useNotifications } from "@/hooks/usePushNotifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAttendance } from "../../context/AttendanceContext";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const [showReportModal, setShowReportModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  // Notification state from backend hook
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Check-in/out state from Global Context
  const {
    currentAttendance,
    checkIn,
    checkOut,
    isLoading: isAttendanceLoading,
    isCheckedIn,
  } = useAttendance();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

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

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Attendance",
      icon: "checkmark.circle.fill",
      color: colors.status.success.main,
      action: () => router.push("/(tabs)/attendance"),
    },
    {
      id: "2",
      title: "Classes",
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
      action: () => router.push("/assignments"),
    },
  ];

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

  const handleQuickAttendance = () => {
    Alert.alert("Quick Attendance", `Mark attendance for ${nextClass.grade}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Start",
        onPress: () => router.push("/(tabs)/attendance"),
      },
    ]);
  };

  const handleStatCard = (type: string) => {
    const titles = {
      students: "Total Students",
      attendance: "Today's Attendance",
      tasks: "Pending Tasks",
      deadlines: "Upcoming Deadlines",
    };
    Alert.alert(
      titles[type as keyof typeof titles],
      "Detailed view coming soon."
    );
  };

  const handleCheckIn = checkIn;
  const handleCheckOut = checkOut;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Refined Header */}
      <View
        style={[styles.header, { backgroundColor: colors.background.primary }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: colors.text.secondary }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.teacherName, { color: colors.primary.main }]}>
              {user?.fullName || user?.name || "Teacher"}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.notificationBtn,
              { backgroundColor: colors.background.secondary },
            ]}
            onPress={() => {
              fetchNotifications(); // Fetch fresh data
              setNotificationModalVisible(true);
            }}
          >
            <IconSymbol
              name="bell.fill"
              size={20}
              color={colors.text.primary}
            />
            {unreadCount > 0 && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.status.error.main },
                ]}
              >
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Key Metrics Grid */}
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <StatsCard
                type="students"
                value={dashboardStats.totalStudents}
                label="Students"
                onPress={() => handleStatCard("students")}
              />
              <StatsCard
                type="attendance"
                value={dashboardStats.todayAttendancePercent}
                label="Attendance"
                onPress={() => handleStatCard("attendance")}
                isPercentage
              />
              <StatsCard
                type="tasks"
                value={dashboardStats.pendingTasks}
                label="Tasks"
                onPress={() => handleStatCard("tasks")}
              />
              <StatsCard
                type="deadlines"
                value={dashboardStats.upcomingDeadlines}
                label="Deadlines"
                onPress={() => handleStatCard("deadlines")}
              />
            </View>
          </View>

          {/* Quick Actions Strip */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Quick Actions
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsScroll}
            >
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionPill,
                    { backgroundColor: colors.background.secondary },
                  ]}
                  onPress={action.action}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.color + "15" },
                    ]}
                  >
                    <IconSymbol
                      name={action.icon as any}
                      size={20}
                      color={action.color}
                    />
                  </View>
                  <Text
                    style={[styles.actionText, { color: colors.text.primary }]}
                  >
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Current Status / Schedule */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <Text
                style={[styles.sectionTitle, { color: colors.text.primary }]}
              >
                {nextClass.isLive ? "Happening Now" : "Up Next"}
              </Text>
              {nextClass.isLive && (
                <View style={styles.liveTag}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
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

          {/* Check In/Out */}
          <View style={styles.section}>
            <CheckInOutCard
              isCheckedIn={isCheckedIn}
              checkInTime={currentAttendance.checkInTime}
              checkOutTime={currentAttendance.checkOutTime}
              workingHours={currentAttendance.workingHours}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              loading={isAttendanceLoading}
            />
          </View>

          {/* Attendance Chart Preview */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <Text
                style={[styles.sectionTitle, { color: colors.text.primary }]}
              >
                Overview
              </Text>
              <TouchableOpacity onPress={() => setShowReportModal(true)}>
                <Text
                  style={{
                    color: colors.primary.main,
                    fontSize: FontSizes.sm,
                    fontWeight: "600",
                  }}
                >
                  See Report
                </Text>
              </TouchableOpacity>
            </View>
            <AttendanceSummaryCard
              present={todayAttendance.present}
              absent={todayAttendance.absent}
              total={todayAttendance.total}
              onViewDetails={() => setShowReportModal(true)}
            />
          </View>

          {/* Timeline Feed */}
          <View style={[styles.section, styles.lastSection]}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Activity Feed
            </Text>
            <View style={styles.timeline}>
              {recentActivities.map((activity, index) => (
                <View key={activity.id} style={styles.timelineItem}>
                  {/* Timeline Line */}
                  {index !== recentActivities.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: colors.ui.border },
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.timelineIcon,
                      {
                        backgroundColor: activity.iconColor + "15",
                        borderColor: activity.iconColor,
                      },
                    ]}
                  >
                    <IconSymbol
                      name={activity.icon as any}
                      size={16}
                      color={activity.iconColor}
                    />
                  </View>
                  <View
                    style={[
                      styles.timelineContent,
                      {
                        borderBottomWidth:
                          index === recentActivities.length - 1 ? 0 : 1,
                        borderColor: colors.ui.border,
                      },
                    ]}
                  >
                    <View style={styles.rowBetween}>
                      <Text
                        style={[
                          styles.timelineTitle,
                          { color: colors.text.primary },
                        ]}
                      >
                        {activity.title}
                      </Text>
                      <Text
                        style={[
                          styles.timelineTime,
                          { color: colors.text.tertiary },
                        ]}
                      >
                        {activity.time}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.timelineDesc,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {activity.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modals */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
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
  scrollContent: {
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === "android" ? Spacing.xl : Spacing.md,
    paddingBottom: Spacing.md,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  teacherName: {
    fontSize: FontSizes["2xl"],
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  statsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  lastSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
  },
  quickActionsScroll: {
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.1)",
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    backgroundColor: "white",
    borderRadius: 3,
  },
  liveText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  timeline: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 0,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 15,
    top: 30,
    bottom: -10, // Extend to next item
    width: 1,
    zIndex: 0,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    zIndex: 1,
    borderWidth: 2,
    backgroundColor: "white", // Ensure it covers the line
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing.lg,
    justifyContent: "center",
  },
  timelineTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: FontSizes.xs,
  },
  timelineDesc: {
    fontSize: FontSizes.sm,
  },
});
