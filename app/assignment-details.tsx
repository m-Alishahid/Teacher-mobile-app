/**
 * Assignment Details Screen - COMPLETELY REDESIGNED FROM SCRATCH
 *
 * Professional Features:
 * - Clean, stable layout (no shifting)
 * - Clear status visibility
 * - Consistent with main assignments screen
 * - Perfect spacing and typography
 */

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/context/ThemeContext";
import {
  allAssignments,
  generateSubmissions,
  type StudentSubmission,
} from "@/data";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_PADDING = 20;
const CARD_PADDING = 16;

export default function AssignmentDetailsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "submitted" | "pending" | "graded" | "ungraded"
  >("all");

  const assignment = useMemo(
    () => allAssignments.find((a) => a.id === id),
    [id]
  );

  const allSubmissions = useMemo(
    () => (assignment ? generateSubmissions(assignment.id) : []),
    [assignment]
  );

  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter((submission) => {
      switch (selectedFilter) {
        case "submitted":
          return submission.status !== "pending";
        case "pending":
          return submission.status === "pending";
        case "graded":
          return submission.isGraded;
        case "ungraded":
          return submission.status !== "pending" && !submission.isGraded;
        default:
          return true;
      }
    });
  }, [allSubmissions, selectedFilter]);

  if (!assignment) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View style={styles.errorContainer}>
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={48}
            color={colors.status.error.main}
          />
          <Text style={[styles.errorText, { color: colors.text.primary }]}>
            Assignment not found
          </Text>
          <TouchableOpacity
            style={[
              styles.errorButton,
              { backgroundColor: colors.primary.main },
            ]}
            onPress={() => router.back()}
          >
            <Text style={{ color: colors.primary.contrast, fontWeight: "600" }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Helper Functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: StudentSubmission["status"]) => {
    switch (status) {
      case "submitted":
        return colors.status.success.main;
      case "late":
        return colors.status.warning.main;
      case "pending":
        return colors.status.error.main;
      default:
        return colors.text.secondary;
    }
  };

  const handleSubmissionPress = (submission: StudentSubmission) => {
    if (submission.status === "pending") {
      Alert.alert(
        "⏳ Not Submitted",
        `${submission.studentName} hasn't submitted yet.`
      );
    } else {
      router.push(
        `/submission-view?assignmentId=${assignment.id}&submissionId=${submission.id}`
      );
    }
  };

  // Stats Calculation
  const submissionPercentage = Math.round(
    (assignment.submittedCount / assignment.totalStudents) * 100
  );
  const gradingPercentage =
    assignment.submittedCount > 0
      ? Math.round((assignment.gradedCount / assignment.submittedCount) * 100)
      : 0;

  // Render Components
  const renderStatCard = (
    label: string,
    value: number,
    color: string,
    bgColor: string,
    icon: any,
    percent?: number
  ) => (
    <View
      style={[
        styles.statCard,
        { backgroundColor: bgColor, borderColor: color },
      ]}
    >
      <IconSymbol name={icon} size={20} color={color} />
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      <Text style={[styles.statCardLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
      {percent !== undefined && (
        <Text style={[styles.statCardPercent, { color }]}>{percent}%</Text>
      )}
    </View>
  );

  const renderFilterTab = (key: typeof selectedFilter, label: string) => {
    const isActive = selectedFilter === key;
    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.filterTab,
          {
            backgroundColor: isActive ? colors.primary.main : colors.ui.card,
            borderColor: isActive ? colors.primary.main : colors.ui.border,
          },
        ]}
        onPress={() => setSelectedFilter(key)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filterText,
            { color: isActive ? colors.primary.contrast : colors.text.primary },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStudentCard = (item: StudentSubmission) => {
    const initials = item.studentName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.studentCard,
          {
            backgroundColor: colors.ui.card,
            borderColor: colors.ui.border,
          },
        ]}
        onPress={() => handleSubmissionPress(item)}
        activeOpacity={0.7}
      >
        {/* Header Row */}
        <View style={styles.studentHeader}>
          <View style={styles.studentLeft}>
            {/* Avatar */}
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    item.status === "pending"
                      ? colors.ui.border
                      : colors.primary.main + "15",
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  {
                    color:
                      item.status === "pending"
                        ? colors.text.tertiary
                        : colors.primary.main,
                  },
                ]}
              >
                {initials}
              </Text>
            </View>

            {/* Name & Roll */}
            <View style={styles.studentInfo}>
              <Text
                style={[styles.studentName, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {item.studentName}
              </Text>
              <Text
                style={[styles.studentRoll, { color: colors.text.tertiary }]}
              >
                {item.studentRollNo}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColor + "20",
                borderColor: statusColor,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status === "submitted"
                ? "Done"
                : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Footer (Only if submitted) */}
        {item.status !== "pending" && (
          <View
            style={[styles.studentFooter, { borderTopColor: colors.ui.border }]}
          >
            <View style={styles.footerItem}>
              <IconSymbol
                name="calendar"
                size={12}
                color={colors.text.tertiary}
              />
              <Text
                style={[styles.footerText, { color: colors.text.secondary }]}
              >
                {formatDate(item.submittedDate!)}
              </Text>
            </View>

            {item.isGraded ? (
              <View style={styles.gradeChip}>
                <IconSymbol
                  name="star.fill"
                  size={12}
                  color={colors.status.success.main}
                />
                <Text
                  style={[
                    styles.gradeText,
                    { color: colors.status.success.main },
                  ]}
                >
                  {item.marksObtained}/{assignment.totalMarks}
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.ungradedText,
                  { color: colors.status.warning.main },
                ]}
              >
                To Grade
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.primary.main}
      />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark || "#1a237e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol
              name="chevron.left"
              size={24}
              color={colors.primary.contrast}
            />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text
              style={[styles.headerTitle, { color: colors.primary.contrast }]}
              numberOfLines={1}
            >
              {assignment.title}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.primary.contrast },
              ]}
            >
              {assignment.className} • {assignment.subject}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          {renderStatCard(
            "Submitted",
            assignment.submittedCount,
            colors.status.success.main,
            colors.status.success.background,
            "checkmark.circle.fill",
            submissionPercentage
          )}
          {renderStatCard(
            "Pending",
            assignment.pendingCount,
            colors.status.error.main,
            colors.status.error.background,
            "xmark.circle.fill"
          )}
          {renderStatCard(
            "Graded",
            assignment.gradedCount,
            colors.status.warning.main,
            colors.status.warning.background,
            "star.fill",
            gradingPercentage
          )}
        </ScrollView>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {renderFilterTab("all", "All")}
          {renderFilterTab("submitted", "Submitted")}
          {renderFilterTab("pending", "Pending")}
          {renderFilterTab("graded", "Graded")}
          {renderFilterTab("ungraded", "To Grade")}
        </ScrollView>

        {/* List Header */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text.primary }]}>
            Students ({filteredSubmissions.length})
          </Text>
        </View>

        {/* Students List */}
        <View style={styles.listContainer}>
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((item) => renderStudentCard(item))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol
                name="tray.fill"
                size={48}
                color={colors.text.tertiary}
              />
              <Text
                style={[styles.emptyText, { color: colors.text.secondary }]}
              >
                No students found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Stats
  statsContainer: {
    paddingHorizontal: SCREEN_PADDING,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: 100,
    height: 100,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statCardLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  statCardPercent: {
    fontSize: 10,
    fontWeight: "bold",
  },

  // Filters
  filtersContainer: {
    paddingHorizontal: SCREEN_PADDING,
    gap: 8,
    marginBottom: 20,
  },
  filterTab: {
    minWidth: 80,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // List
  listHeader: {
    paddingHorizontal: SCREEN_PADDING,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  listContainer: {
    paddingHorizontal: SCREEN_PADDING,
    gap: 12,
  },

  // Student Card
  studentCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: CARD_PADDING,
  },
  studentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  studentInfo: {
    flex: 1,
    minWidth: 0,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "600",
  },
  studentRoll: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    minWidth: 70,
    alignItems: "center",
    flexShrink: 0,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Student Footer
  studentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: CARD_PADDING,
    paddingVertical: 12,
    borderTopWidth: 1,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
  },
  gradeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  ungradedText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
  },

  // Error State
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
});
