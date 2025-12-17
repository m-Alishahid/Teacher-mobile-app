/**
 * AttendanceHistory Component
 *
 * Displays teacher's attendance history in a professional card list
 * with month filtering capability
 */

import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { AttendanceRecord } from "@/data";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  records,
}) => {
  const { colors } = useTheme();
  const [selectedMonthOffset, setSelectedMonthOffset] = useState(0); // 0 = current, 1 = last month, etc.

  // Generate month options (current + 5 previous months)
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      options.push({
        offset: i,
        label: date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    }
    return options;
  }, []);

  // Filter records by selected month
  const filteredRecords = useMemo(() => {
    const selectedMonth = monthOptions[selectedMonthOffset];
    return records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === selectedMonth.month &&
        recordDate.getFullYear() === selectedMonth.year
      );
    });
  }, [records, selectedMonthOffset, monthOptions]);

  const getStatusIcon = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return { name: "checkmark-circle", color: colors.status.success.main };
      case "checked-in":
        return { name: "time", color: colors.status.info.main };
      default:
        return { name: "close-circle", color: colors.status.error.main };
    }
  };

  // Calculate stats for selected month
  const monthStats = useMemo(() => {
    const present = filteredRecords.filter(
      (r) => r.status === "present"
    ).length;
    const total = filteredRecords.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, total, percentage };
  }, [filteredRecords]);

  return (
    <>
      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthScrollContent}
        >
          {monthOptions.map((option) => {
            const isSelected = option.offset === selectedMonthOffset;
            return (
              <TouchableOpacity
                key={option.offset}
                style={[
                  styles.monthChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary.main
                      : colors.background.secondary,
                    borderColor: isSelected
                      ? colors.primary.main
                      : colors.ui.border,
                  },
                ]}
                onPress={() => setSelectedMonthOffset(option.offset)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.monthChipText,
                    {
                      color: isSelected
                        ? colors.primary.contrast
                        : colors.text.secondary,
                      fontWeight: isSelected ? "700" : "600",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Month Stats */}
      {filteredRecords.length > 0 && (
        <View
          style={[
            styles.statsCard,
            { backgroundColor: colors.status.success.background },
          ]}
        >
          <View style={styles.statItem}>
            <Ionicons
              name="checkmark-done-circle"
              size={20}
              color={colors.status.success.main}
            />
            <Text
              style={[styles.statLabel, { color: colors.status.success.text }]}
            >
              Present: {monthStats.present}/{monthStats.total}
            </Text>
          </View>
          <View
            style={[
              styles.percentageBadge,
              { backgroundColor: colors.status.success.main },
            ]}
          >
            <Text
              style={[
                styles.percentageText,
                { color: colors.primary.contrast },
              ]}
            >
              {monthStats.percentage}%
            </Text>
          </View>
        </View>
      )}

      {/* Records List */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredRecords.length === 0 ? (
          <View
            style={[styles.emptyContainer, { backgroundColor: colors.ui.card }]}
          >
            <Ionicons
              name="calendar-outline"
              size={48}
              color={colors.text.tertiary}
            />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No attendance records for this month
            </Text>
          </View>
        ) : (
          filteredRecords.map((record) => {
            const statusIcon = getStatusIcon(record.status);
            return (
              <View
                key={record.id}
                style={[
                  styles.recordCard,
                  {
                    backgroundColor: colors.ui.card,
                    borderColor: colors.ui.border,
                  },
                ]}
              >
                <View style={styles.recordHeader}>
                  <View style={styles.dateContainer}>
                    <Ionicons
                      name="calendar"
                      size={16}
                      color={colors.text.secondary}
                    />
                    <Text
                      style={[styles.dateText, { color: colors.text.primary }]}
                    >
                      {record.date}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusIcon.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={statusIcon.name as any}
                      size={14}
                      color={statusIcon.color}
                    />
                    <Text
                      style={[styles.statusText, { color: statusIcon.color }]}
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.recordBody}>
                  <View style={styles.timeRow}>
                    <View style={styles.timeInfo}>
                      <Ionicons
                        name="log-in-outline"
                        size={18}
                        color={colors.status.success.main}
                      />
                      <View style={styles.timeDetails}>
                        <Text
                          style={[
                            styles.timeLabel,
                            { color: colors.text.secondary },
                          ]}
                        >
                          Check In
                        </Text>
                        <Text
                          style={[
                            styles.timeValue,
                            { color: colors.text.primary },
                          ]}
                        >
                          {record.checkInTime || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timeInfo}>
                      <Ionicons
                        name="log-out-outline"
                        size={18}
                        color={colors.status.error.main}
                      />
                      <View style={styles.timeDetails}>
                        <Text
                          style={[
                            styles.timeLabel,
                            { color: colors.text.secondary },
                          ]}
                        >
                          Check Out
                        </Text>
                        <Text
                          style={[
                            styles.timeValue,
                            { color: colors.text.primary },
                          ]}
                        >
                          {record.checkOutTime || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {record.workingHours && (
                    <View
                      style={[
                        styles.hoursContainer,
                        { backgroundColor: colors.primary.main + "10" },
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={colors.primary.main}
                      />
                      <Text
                        style={[
                          styles.hoursText,
                          { color: colors.primary.main },
                        ]}
                      >
                        Total: {record.workingHours}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.md,
  },
  monthSelector: {
    marginBottom: Spacing.md,
  },
  monthScrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  monthChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    marginRight: Spacing.xs,
  },
  monthChipText: {
    fontSize: FontSizes.sm,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  percentageBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  percentageText: {
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  emptyContainer: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  emptyText: {
    fontSize: FontSizes.base,
    marginTop: Spacing.md,
  },
  recordCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.base,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
  },
  recordBody: {
    gap: Spacing.sm,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  timeInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  timeDetails: {
    flex: 1,
  },
  timeLabel: {
    fontSize: FontSizes.xs,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  hoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
  },
  hoursText: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
  },
});
