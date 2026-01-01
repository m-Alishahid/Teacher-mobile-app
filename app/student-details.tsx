/**
 * Student Details Screen
 *
 * Displays detailed information about a student including:
 * - Profile Header (Photo, Name, Roll Number)
 * - Tab View:
 *   - Overview: Attendance History Chart
 *   - Performance: Test scores and trends
 *   - Communication: Message Parent button
 */

import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppColors, BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "overview" | "performance" | "communication";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late";
}

interface TestScore {
  subject: string;
  test: string;
  score: number;
  maxScore: number;
  date: string;
}

export default function StudentDetailsScreen() {
  const router = useRouter();

  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Mock student data - replace with real data from navigation params or API
  const student = {
    id: "1",
    name: "Ahmed Ali Khan",
    rollNumber: "001",
    class: "Grade 10A",
    photoUrl: null, // Will use initials
    email: "ahmed.ali@school.com",
    parentName: "Mr. Ali Khan",
    parentPhone: "+92 300 1234567",
    parentEmail: "ali.khan@email.com",
  };

  // Mock attendance data (last 30 days)
  const attendanceHistory: AttendanceRecord[] = [
    { date: "2024-12-12", status: "present" },
    { date: "2024-12-11", status: "present" },
    { date: "2024-12-10", status: "late" },
    { date: "2024-12-09", status: "present" },
    { date: "2024-12-08", status: "absent" },
    { date: "2024-12-07", status: "present" },
    { date: "2024-12-06", status: "present" },
    { date: "2024-12-05", status: "present" },
    { date: "2024-12-04", status: "present" },
    { date: "2024-12-03", status: "late" },
  ];

  // Mock test scores
  const testScores: TestScore[] = [
    {
      subject: "Mathematics",
      test: "Mid-Term Exam",
      score: 85,
      maxScore: 100,
      date: "2024-12-01",
    },
    {
      subject: "Physics",
      test: "Mid-Term Exam",
      score: 78,
      maxScore: 100,
      date: "2024-12-02",
    },
    {
      subject: "Chemistry",
      test: "Mid-Term Exam",
      score: 92,
      maxScore: 100,
      date: "2024-12-03",
    },
    {
      subject: "English",
      test: "Mid-Term Exam",
      score: 88,
      maxScore: 100,
      date: "2024-12-04",
    },
    {
      subject: "Mathematics",
      test: "Quiz 3",
      score: 18,
      maxScore: 20,
      date: "2024-11-25",
    },
    {
      subject: "Physics",
      test: "Quiz 3",
      score: 16,
      maxScore: 20,
      date: "2024-11-26",
    },
  ];

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const calculateAttendanceStats = () => {
    const total = attendanceHistory.length;
    const present = attendanceHistory.filter(
      (a) => a.status === "present"
    ).length;
    const late = attendanceHistory.filter((a) => a.status === "late").length;
    const absent = attendanceHistory.filter(
      (a) => a.status === "absent"
    ).length;
    const percentage = Math.round((present / total) * 100);
    return { total, present, late, absent, percentage };
  };

  const calculateAverageScore = () => {
    const total = testScores.reduce(
      (sum, test) => sum + (test.score / test.maxScore) * 100,
      0
    );
    return Math.round(total / testScores.length);
  };

  const handleMessageParent = () => {
    Alert.alert("Message Parent", `Send a message to ${student.parentName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send Message",
        onPress: () => {
          Alert.alert("Success", "Message interface will open here");
        },
      },
    ]);
  };

  const handleCallParent = () => {
    Alert.alert(
      "Call Parent",
      `Call ${student.parentName} at ${student.parentPhone}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            Alert.alert("Calling", `Calling ${student.parentPhone}...`);
          },
        },
      ]
    );
  };

  const stats = calculateAttendanceStats();
  const averageScore = calculateAverageScore();

  // Overview Tab Content
  const OverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Attendance Summary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Attendance Summary
        </Text>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.status.success.background },
            ]}
          >
            <Text
              style={[styles.statNumber, { color: colors.status.success.main }]}
            >
              {stats.percentage}%
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.status.success.text }]}
            >
              Attendance Rate
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.primary.main + "15" },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary.main }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Total Days
            </Text>
          </View>
        </View>

        {/* Detailed Stats */}
        <View
          style={[
            styles.detailStatsContainer,
            { backgroundColor: colors.ui.card, borderColor: colors.ui.border },
          ]}
        >
          <View style={styles.detailStatRow}>
            <View style={styles.detailStatLeft}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: colors.status.success.main },
                ]}
              />
              <Text
                style={[styles.detailStatLabel, { color: colors.text.primary }]}
              >
                Present
              </Text>
            </View>
            <Text
              style={[styles.detailStatValue, { color: colors.text.secondary }]}
            >
              {stats.present} days
            </Text>
          </View>
          <View style={styles.detailStatRow}>
            <View style={styles.detailStatLeft}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: colors.status.warning.main },
                ]}
              />
              <Text
                style={[styles.detailStatLabel, { color: colors.text.primary }]}
              >
                Late
              </Text>
            </View>
            <Text
              style={[styles.detailStatValue, { color: colors.text.secondary }]}
            >
              {stats.late} days
            </Text>
          </View>
          <View style={styles.detailStatRow}>
            <View style={styles.detailStatLeft}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: colors.status.error.main },
                ]}
              />
              <Text
                style={[styles.detailStatLabel, { color: colors.text.primary }]}
              >
                Absent
              </Text>
            </View>
            <Text
              style={[styles.detailStatValue, { color: colors.text.secondary }]}
            >
              {stats.absent} days
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Attendance History */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Recent Attendance
        </Text>
        <View style={styles.attendanceList}>
          {attendanceHistory.slice(0, 7).map((record, index) => (
            <View
              key={index}
              style={[
                styles.attendanceItem,
                {
                  backgroundColor: colors.ui.card,
                  borderColor: colors.ui.border,
                },
              ]}
            >
              <Text
                style={[styles.attendanceDate, { color: colors.text.primary }]}
              >
                {new Date(record.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
              <View
                style={[
                  styles.attendanceStatus,
                  {
                    backgroundColor:
                      record.status === "present"
                        ? colors.status.success.background
                        : record.status === "late"
                        ? colors.status.warning.background
                        : colors.status.error.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.attendanceStatusText,
                    {
                      color:
                        record.status === "present"
                          ? colors.status.success.text
                          : record.status === "late"
                          ? colors.status.warning.text
                          : colors.status.error.text,
                    },
                  ]}
                >
                  {record.status.charAt(0).toUpperCase() +
                    record.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  // Performance Tab Content
  const PerformanceTab = () => (
    <View style={styles.tabContent}>
      {/* Overall Performance */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Overall Performance
        </Text>

        <View
          style={[
            styles.performanceCard,
            { backgroundColor: colors.ui.card, borderColor: colors.ui.border },
          ]}
        >
          <View style={styles.performanceHeader}>
            <IconSymbol
              name="chart.bar.fill"
              size={32}
              color={colors.primary.main}
            />
            <View style={styles.performanceHeaderText}>
              <Text
                style={[
                  styles.performanceTitle,
                  { color: colors.text.primary },
                ]}
              >
                Average Score
              </Text>
              <Text
                style={[
                  styles.performanceSubtitle,
                  { color: colors.text.secondary },
                ]}
              >
                Across all subjects
              </Text>
            </View>
          </View>
          <Text
            style={[styles.performanceScore, { color: colors.primary.main }]}
          >
            {averageScore}%
          </Text>
          <View
            style={[
              styles.performanceBar,
              { backgroundColor: colors.background.secondary },
            ]}
          >
            <View
              style={[
                styles.performanceBarFill,
                {
                  width: `${averageScore}%`,
                  backgroundColor: colors.primary.main,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Recent Test Scores */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Recent Test Scores
        </Text>
        <View style={styles.scoresList}>
          {testScores.map((test, index) => {
            const percentage = Math.round((test.score / test.maxScore) * 100);
            const gradeColor =
              percentage >= 90
                ? colors.status.success.main
                : percentage >= 75
                ? colors.status.info.main
                : percentage >= 60
                ? colors.status.warning.main
                : colors.status.error.main;

            return (
              <View
                key={index}
                style={[
                  styles.scoreCard,
                  {
                    backgroundColor: colors.ui.card,
                    borderColor: colors.ui.border,
                  },
                ]}
              >
                <View style={styles.scoreHeader}>
                  <View style={styles.scoreHeaderLeft}>
                    <Text
                      style={[
                        styles.scoreSubject,
                        { color: colors.text.primary },
                      ]}
                    >
                      {test.subject}
                    </Text>
                    <Text
                      style={[
                        styles.scoreTest,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {test.test}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.scorePercentage,
                      { backgroundColor: gradeColor + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scorePercentageText,
                        { color: gradeColor },
                      ]}
                    >
                      {percentage}%
                    </Text>
                  </View>
                </View>
                <View style={styles.scoreDetails}>
                  <Text
                    style={[styles.scoreValue, { color: colors.text.primary }]}
                  >
                    {test.score} / {test.maxScore}
                  </Text>
                  <Text
                    style={[styles.scoreDate, { color: colors.text.tertiary }]}
                  >
                    {new Date(test.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  // Communication Tab Content
  const CommunicationTab = () => (
    <View style={styles.tabContent}>
      {/* Parent Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Parent Information
        </Text>

        <View
          style={[
            styles.parentCard,
            { backgroundColor: colors.ui.card, borderColor: colors.ui.border },
          ]}
        >
          <View
            style={[
              styles.parentAvatar,
              { backgroundColor: colors.primary.main },
            ]}
          >
            <IconSymbol
              name="person.fill"
              size={32}
              color={colors.primary.contrast}
            />
          </View>
          <View style={styles.parentInfo}>
            <Text style={[styles.parentName, { color: colors.text.primary }]}>
              {student.parentName}
            </Text>
            <View style={styles.parentDetail}>
              <IconSymbol
                name="phone.fill"
                size={14}
                color={colors.text.secondary}
              />
              <Text
                style={[
                  styles.parentDetailText,
                  { color: colors.text.secondary },
                ]}
              >
                {student.parentPhone}
              </Text>
            </View>
            <View style={styles.parentDetail}>
              <IconSymbol
                name="envelope.fill"
                size={14}
                color={colors.text.secondary}
              />
              <Text
                style={[
                  styles.parentDetailText,
                  { color: colors.text.secondary },
                ]}
              >
                {student.parentEmail}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Communication Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Contact Parent
        </Text>

        <TouchableOpacity
          style={styles.communicationButton}
          onPress={handleMessageParent}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.communicationIconContainer,
              { backgroundColor: colors.primary.main },
            ]}
          >
            <IconSymbol
              name="message.fill"
              size={24}
              color={colors.primary.contrast}
            />
          </View>
          <View style={styles.communicationButtonText}>
            <Text
              style={[
                styles.communicationButtonTitle,
                { color: colors.text.primary },
              ]}
            >
              Message Parent
            </Text>
            <Text
              style={[
                styles.communicationButtonSubtitle,
                { color: colors.text.secondary },
              ]}
            >
              Send a message via app
            </Text>
          </View>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.communicationButton}
          onPress={handleCallParent}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.communicationIconContainer,
              { backgroundColor: colors.status.success.main },
            ]}
          >
            <IconSymbol
              name="phone.fill"
              size={24}
              color={colors.primary.contrast}
            />
          </View>
          <View style={styles.communicationButtonText}>
            <Text
              style={[
                styles.communicationButtonTitle,
                { color: colors.text.primary },
              ]}
            >
              Call Parent
            </Text>
            <Text
              style={[
                styles.communicationButtonSubtitle,
                { color: colors.text.secondary },
              ]}
            >
              Make a phone call
            </Text>
          </View>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.communicationButton}
          onPress={() => Alert.alert("Email", "Email interface will open here")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.communicationIconContainer,
              { backgroundColor: colors.status.info.main },
            ]}
          >
            <IconSymbol
              name="envelope.fill"
              size={24}
              color={colors.primary.contrast}
            />
          </View>
          <View style={styles.communicationButtonText}>
            <Text
              style={[
                styles.communicationButtonTitle,
                { color: colors.text.primary },
              ]}
            >
              Send Email
            </Text>
            <Text
              style={[
                styles.communicationButtonSubtitle,
                { color: colors.text.secondary },
              ]}
            >
              Send via email
            </Text>
          </View>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Recent Communication */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Recent Communication
        </Text>
        <View style={styles.emptyState}>
          <IconSymbol
            name="bubble.left.and.bubble.right"
            size={48}
            color={colors.text.tertiary}
          />
          <Text
            style={[styles.emptyStateText, { color: colors.text.secondary }]}
          >
            No recent messages
          </Text>
          <Text
            style={[styles.emptyStateSubtext, { color: colors.text.tertiary }]}
          >
            Start a conversation with the parent
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View>
          <View
            style={[
              styles.profileHeader,
              {
                backgroundColor: colors.primary.main,
                paddingTop: Platform.OS === "ios" ? 60 : Spacing.xl,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <IconSymbol
                name="arrow.left"
                size={24}
                color={colors.primary.contrast}
              />
            </TouchableOpacity>

            <View style={styles.profileContent}>
              <View
                style={[
                  styles.profileAvatar,
                  {
                    backgroundColor: colors.primary.contrast,
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.profileAvatarText,
                    { color: colors.primary.main },
                  ]}
                >
                  {getInitials(student.name)}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.profileName,
                    { color: colors.primary.contrast },
                  ]}
                >
                  {student.name}
                </Text>
                <Text
                  style={[
                    styles.profileRoll,
                    { color: colors.primary.contrast },
                  ]}
                >
                  Roll No: {student.rollNumber}
                </Text>
                <View style={styles.profileClass}>
                  <IconSymbol
                    name="graduationcap.fill"
                    size={14}
                    color={colors.primary.contrast}
                  />
                  <Text
                    style={[
                      styles.profileClassText,
                      { color: colors.primary.contrast },
                    ]}
                  >
                    {student.class}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tab Navigation */}
          <View
            style={[
              styles.tabBar,
              {
                backgroundColor: colors.background.secondary,
                borderBottomColor: colors.ui.border,
              },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabBarContent}
            >
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "overview" && {
                    borderBottomColor: colors.primary.main,
                  },
                ]}
                onPress={() => setActiveTab("overview")}
              >
                <IconSymbol
                  name="chart.pie.fill"
                  size={20}
                  color={
                    activeTab === "overview"
                      ? colors.primary.main
                      : colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "overview"
                          ? colors.primary.main
                          : colors.text.secondary,
                    },
                  ]}
                >
                  Overview
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "performance" && {
                    borderBottomColor: colors.primary.main,
                  },
                ]}
                onPress={() => setActiveTab("performance")}
              >
                <IconSymbol
                  name="chart.bar.fill"
                  size={20}
                  color={
                    activeTab === "performance"
                      ? colors.primary.main
                      : colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "performance"
                          ? colors.primary.main
                          : colors.text.secondary,
                    },
                  ]}
                >
                  Performance
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "communication" && {
                    borderBottomColor: colors.primary.main,
                  },
                ]}
                onPress={() => setActiveTab("communication")}
              >
                <IconSymbol
                  name="message.fill"
                  size={20}
                  color={
                    activeTab === "communication"
                      ? colors.primary.main
                      : colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "communication"
                          ? colors.primary.main
                          : colors.text.secondary,
                    },
                  ]}
                >
                  Communication
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {/* Tab Content */}
        <View style={{ minHeight: 500 }}>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "performance" && <PerformanceTab />}
          {activeTab === "communication" && <CommunicationTab />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },

  // Profile Header
  profileHeader: {
    backgroundColor: AppColors.primary.main,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    // Shadow
    shadowColor: AppColors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    marginBottom: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.primary.contrast,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  profileAvatarText: {
    fontSize: FontSizes["3xl"],
    fontWeight: "bold",
    color: AppColors.primary.main,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes["2xl"],
    fontWeight: "700",
    color: AppColors.primary.contrast,
    marginBottom: Spacing.xs,
  },
  profileRoll: {
    fontSize: FontSizes.base,
    color: AppColors.primary.contrast,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  profileClass: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    alignSelf: "flex-start",
    gap: 4,
  },
  profileClassText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: AppColors.primary.contrast,
  },

  // Tab Bar
  tabBar: {
    backgroundColor: AppColors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.ui.border,
  },
  tabBarContent: {
    paddingHorizontal: Spacing.sm,
    flexGrow: 1,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: 4,
    gap: Spacing.xs,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: AppColors.primary.main,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: AppColors.text.secondary,
  },
  tabTextActive: {
    color: AppColors.primary.main,
  },

  // Tab Content
  tabContent: {
    flex: 1,
  },

  // Section
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: AppColors.text.primary,
    marginBottom: Spacing.md,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  statNumber: {
    fontSize: FontSizes["3xl"],
    fontWeight: "bold",
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    textAlign: "center",
  },

  // Detailed Stats
  detailStatsContainer: {
    backgroundColor: AppColors.ui.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  detailStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  detailStatLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
  },
  detailStatLabel: {
    fontSize: FontSizes.base,
    color: AppColors.text.primary,
    fontWeight: "500",
  },
  detailStatValue: {
    fontSize: FontSizes.base,
    color: AppColors.text.secondary,
    fontWeight: "600",
  },

  // Attendance List
  attendanceList: {
    gap: Spacing.sm,
  },
  attendanceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.ui.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  attendanceDate: {
    fontSize: FontSizes.base,
    color: AppColors.text.primary,
    fontWeight: "500",
  },
  attendanceStatus: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  attendanceStatusText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },

  // Performance
  performanceCard: {
    backgroundColor: AppColors.ui.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  performanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  performanceHeaderText: {
    flex: 1,
  },
  performanceTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: AppColors.text.primary,
  },
  performanceSubtitle: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  performanceScore: {
    fontSize: FontSizes["4xl"],
    fontWeight: "bold",
    color: AppColors.primary.main,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  performanceBar: {
    height: 12,
    backgroundColor: AppColors.background.secondary,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  performanceBarFill: {
    height: "100%",
    backgroundColor: AppColors.primary.main,
    borderRadius: BorderRadius.full,
  },

  // Scores List
  scoresList: {
    gap: Spacing.sm,
  },
  scoreCard: {
    backgroundColor: AppColors.ui.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  scoreHeaderLeft: {
    flex: 1,
  },
  scoreSubject: {
    fontSize: FontSizes.base,
    fontWeight: "700",
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  scoreTest: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  scorePercentage: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  scorePercentageText: {
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  scoreDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: AppColors.text.primary,
  },
  scoreDate: {
    fontSize: FontSizes.sm,
    color: AppColors.text.tertiary,
  },

  // Parent Card
  parentCard: {
    flexDirection: "row",
    backgroundColor: AppColors.ui.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
    gap: Spacing.md,
  },
  parentAvatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.primary.main,
    alignItems: "center",
    justifyContent: "center",
  },
  parentInfo: {
    flex: 1,
  },
  parentName: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: AppColors.text.primary,
    marginBottom: Spacing.sm,
  },
  parentDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  parentDetailText: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },

  // Communication Button
  communicationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.ui.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
    gap: Spacing.md,
  },
  communicationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  communicationButtonText: {
    flex: 1,
  },
  communicationButtonTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  communicationButtonSubtitle: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  emptyStateText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: AppColors.text.secondary,
    marginTop: Spacing.md,
  },
  emptyStateSubtext: {
    fontSize: FontSizes.base,
    color: AppColors.text.tertiary,
    marginTop: Spacing.xs,
  },
});
