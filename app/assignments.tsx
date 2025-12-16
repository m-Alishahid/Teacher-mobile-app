/**
 * Assignments Screen - OPTIMIZED & PROFESSIONAL
 *
 * improvements:
 * - Unified Filter Tab sizes (min-width) for consistent look
 * - Optimized Stat Cards layout
 * - Fixed Assignment Card layout (consistent height/spacing)
 * - Cleaned up status badges logic
 * - Reduced code duplication
 */

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/context/ThemeContext";
import { allAssignments, getAssignmentStats, type Assignment } from "@/data";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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

export default function AssignmentsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // Filter State
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "overdue" | "completed"
  >("all");

  const stats = getAssignmentStats();

  // Optimized Filtering
  const filteredAssignments = useMemo(() => {
    return allAssignments.filter((assignment) => {
      if (selectedFilter === "all") return true;
      return assignment.status === selectedFilter;
    });
  }, [selectedFilter]);

  // Helper: Status Colors
  const getStatusColor = (status: Assignment["status"]) => {
    const map = {
      active: colors.status.success.main,
      overdue: colors.status.error.main,
      completed: colors.text.tertiary, // Grey for completed
    };
    return map[status] || colors.text.secondary;
  };

  // Helper: Days Remaining
  const getDaysRemaining = (dueDate: string) => {
    const diffDays = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diffDays < 0)
      return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true };
    if (diffDays === 0) return { text: "Today", isOverdue: false };
    if (diffDays === 1) return { text: "Tomorrow", isOverdue: false };
    return { text: `${diffDays} days left`, isOverdue: false };
  };

  // --- RENDER COMPONENTS ---

  const renderStatCard = (
    label: string,
    value: number,
    color: string,
    bgColor: string,
    icon: any
  ) => (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: bgColor,
          borderColor: color,
        },
      ]}
    >
      <IconSymbol name={icon} size={22} color={color} />
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      <Text style={[styles.statCardLabel, { color }]}>{label}</Text>
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
            {
              color: isActive ? colors.primary.contrast : colors.text.primary,
            },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAssignmentCard = ({ item }: { item: Assignment }) => {
    const submissionPercentage = Math.round(
      (item.submittedCount / item.totalStudents) * 100
    );
    const dueInfo = getDaysRemaining(item.dueDate);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.ui.card, borderColor: colors.ui.border },
        ]}
        onPress={() => router.push(`/assignment-details?id=${item.id}`)}
        activeOpacity={0.7}
      >
        {/* Top Row: Icon + Title + Status */}
        <View style={styles.cardTop}>
          <View style={styles.cardTopLeft}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.primary.main + "10" },
              ]}
            >
              <IconSymbol
                name="doc.text.fill"
                size={14}
                color={colors.primary.main}
              />
            </View>
            <View style={styles.topInfo}>
              <Text
                style={[styles.cardTitle, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <View style={styles.metaRow}>
                <Text
                  style={[styles.metaText, { color: colors.text.secondary }]}
                >
                  {item.subject}
                </Text>
                <View style={styles.dot} />
                <Text
                  style={[styles.metaText, { color: colors.text.secondary }]}
                >
                  {item.className}
                </Text>
              </View>
            </View>
          </View>

          {/* Clean Text-Only Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColor + "15",
                borderColor: statusColor + "30", // Subtle border
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCol}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {item.totalStudents}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
              Students
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text
              style={[styles.statValue, { color: colors.status.success.main }]}
            >
              {item.submittedCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
              Submitted
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text
              style={[styles.statValue, { color: colors.status.warning.main }]}
            >
              {item.gradedCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
              Graded
            </Text>
          </View>
        </View>

        {/* Date Footer */}
        <View style={[styles.cardFooter, { borderTopColor: colors.ui.border }]}>
          <View style={styles.dateRow}>
            <IconSymbol
              name="calendar"
              size={12}
              color={colors.text.tertiary}
            />
            <Text style={[styles.dateText, { color: colors.text.secondary }]}>
              {new Date(item.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <IconSymbol
              name="clock"
              size={12}
              color={
                dueInfo.isOverdue
                  ? colors.status.error.main
                  : colors.text.tertiary
              }
            />
            <Text
              style={[
                styles.dueText,
                {
                  color: dueInfo.isOverdue
                    ? colors.status.error.main
                    : colors.text.secondary,
                },
              ]}
            >
              {dueInfo.text}
            </Text>
          </View>
        </View>
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
            >
              Assignments
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.primary.contrast },
              ]}
            >
              {stats.total} Total
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, gap: 12 }}
        >
          {renderStatCard(
            "Active",
            stats.active,
            colors.status.success.main,
            colors.status.success.background,
            "clock.fill"
          )}
          {renderStatCard(
            "Overdue",
            stats.overdue,
            colors.status.error.main,
            colors.status.error.background,
            "exclamationmark.triangle.fill"
          )}
          {renderStatCard(
            "To Grade",
            stats.pendingGrading,
            colors.status.warning.main,
            colors.status.warning.background,
            "star.fill"
          )}
          {renderStatCard(
            "Done",
            stats.completed,
            colors.text.secondary,
            colors.ui.card,
            "checkmark.seal.fill"
          )}
        </ScrollView>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, gap: 8 }}
        >
          {renderFilterTab("all", "All")}
          {renderFilterTab("active", "Active")}
          {renderFilterTab("overdue", "Overdue")}
          {renderFilterTab("completed", "Completed")}
        </ScrollView>

        {/* Assignments List */}
        <View style={styles.listContainer}>
          {filteredAssignments.map((item) => (
            <View key={item.id} style={{ marginBottom: 16 }}>
              {renderAssignmentCard({ item })}
            </View>
          ))}

          {filteredAssignments.length === 0 && (
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: colors.ui.border },
                ]}
              >
                <IconSymbol
                  name="tray.fill"
                  size={40}
                  color={colors.text.tertiary}
                />
              </View>
              <Text style={[styles.emptyText, { color: colors.text.primary }]}>
                No assignments found
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
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.9,
  },

  // Stats
  statsScroll: {
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
  },

  // Filters
  filterScroll: {
    marginBottom: 20,
  },
  filterTab: {
    minWidth: 80, // Fixed Minimum Width for uniformity!
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

  // Assignment Card
  listContainer: {
    paddingHorizontal: SCREEN_PADDING,
  },
  card: {
    padding: 0, // Padding handled by children
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  cardTopLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  topInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#ccc",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Stats Grid inside Card
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCol: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#eee",
  },

  // Card Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  dueText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
