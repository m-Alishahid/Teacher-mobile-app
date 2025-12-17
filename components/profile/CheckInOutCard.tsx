/**
 * CheckInOutCard Component
 *
 * Professional check-in/check-out card with gradient design
 * Shows current status and allows teachers to check in/out
 */

import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CheckInOutCardProps {
  isCheckedIn: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  onCheckIn: () => void;
  onCheckOut: () => void;
  loading?: boolean;
}

export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({
  isCheckedIn,
  checkInTime,
  checkOutTime,
  onCheckIn,
  onCheckOut,
  loading = false,
}) => {
  const { colors, isDark } = useTheme();

  const getStatusColor = () => {
    if (checkOutTime) return colors.text.tertiary;
    if (isCheckedIn) return colors.status.success.main;
    return colors.status.warning.main;
  };

  const getStatusText = () => {
    if (checkOutTime) return "Checked Out";
    if (isCheckedIn) return "Checked In";
    return "Not Checked In";
  };

  return (
    <LinearGradient
      colors={
        isDark
          ? [
              colors.primary.main + "40",
              colors.primary.dark || colors.primary.main,
            ]
          : [colors.primary.light || colors.primary.main, colors.primary.main]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderColor: colors.ui.border }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
          <Text style={[styles.statusText, { color: colors.primary.contrast }]}>
            {getStatusText()}
          </Text>
        </View>
        <Ionicons
          name="time-outline"
          size={24}
          color={colors.primary.contrast}
        />
      </View>

      {/* Time Display */}
      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Text
            style={[
              styles.timeLabel,
              { color: colors.primary.contrast, opacity: 0.8 },
            ]}
          >
            Check In
          </Text>
          <Text style={[styles.timeValue, { color: colors.primary.contrast }]}>
            {checkInTime || "--:--"}
          </Text>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.primary.contrast, opacity: 0.3 },
          ]}
        />

        <View style={styles.timeItem}>
          <Text
            style={[
              styles.timeLabel,
              { color: colors.primary.contrast, opacity: 0.8 },
            ]}
          >
            Check Out
          </Text>
          <Text style={[styles.timeValue, { color: colors.primary.contrast }]}>
            {checkOutTime || "--:--"}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      {!checkOutTime && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primary.contrast,
              opacity: loading ? 0.6 : 1,
            },
          ]}
          onPress={isCheckedIn ? onCheckOut : onCheckIn}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary.main} />
          ) : (
            <>
              <Ionicons
                name={isCheckedIn ? "log-out-outline" : "log-in-outline"}
                size={20}
                color={colors.primary.main}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  { color: colors.primary.main },
                ]}
              >
                {isCheckedIn ? "Check Out Now" : "Check In Now"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  timeItem: {
    flex: 1,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: FontSizes.xs,
    marginBottom: 4,
    fontWeight: "600",
  },
  timeValue: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: Spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButtonText: {
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
});
