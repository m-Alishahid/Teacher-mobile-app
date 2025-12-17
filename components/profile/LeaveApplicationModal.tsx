/**
 * Leave Application Modal Component
 *
 * Features:
 * - Leave type selection (Sick, Casual, Emergency, etc.)
 * - Date range picker
 * - Reason input
 * - Professional UI with validation
 */

import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LeaveApplicationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (application: LeaveApplication) => void;
}

export interface LeaveApplication {
  id: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: Date;
}

type LeaveType = "sick" | "casual" | "emergency" | "annual" | "other";

const leaveTypes: {
  value: LeaveType;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: "sick", label: "Sick Leave", icon: "medkit", color: "#EF4444" },
  {
    value: "casual",
    label: "Casual Leave",
    icon: "calendar",
    color: "#3B82F6",
  },
  {
    value: "emergency",
    label: "Emergency Leave",
    icon: "warning",
    color: "#F59E0B",
  },
  { value: "annual", label: "Annual Leave", icon: "sunny", color: "#10B981" },
  {
    value: "other",
    label: "Other",
    icon: "ellipsis-horizontal",
    color: "#8B5CF6",
  },
];

export const LeaveApplicationModal: React.FC<LeaveApplicationModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const { colors, isDark } = useTheme();

  const [selectedType, setSelectedType] = useState<LeaveType>("casual");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // Validation
    if (!reason.trim()) {
      Alert.alert(
        "Validation Error",
        "Please provide a reason for your leave."
      );
      return;
    }

    if (startDate > endDate) {
      Alert.alert("Validation Error", "Start date cannot be after end date.");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const application: LeaveApplication = {
        id: "leave-" + new Date().getTime(),
        leaveType: selectedType,
        startDate,
        endDate,
        reason: reason.trim(),
        status: "pending",
        appliedOn: new Date(),
      };

      onSubmit(application);
      setLoading(false);

      // Reset form
      setSelectedType("casual");
      setStartDate(new Date());
      setEndDate(new Date());
      setReason("");

      Alert.alert(
        "✅ Application Submitted",
        "Your leave application has been submitted successfully and is pending approval.",
        [{ text: "OK", onPress: onClose }]
      );
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={
            isDark
              ? [
                  colors.primary.main,
                  colors.primary.dark || colors.primary.main,
                ]
              : [
                  colors.primary.main,
                  colors.primary.light || colors.primary.main,
                ]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text
              style={[styles.headerTitle, { color: colors.primary.contrast }]}
            >
              Apply for Leave
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={28}
                color={colors.primary.contrast}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Leave Type Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Leave Type
            </Text>
            <View style={styles.typeGrid}>
              {leaveTypes.map((type) => {
                const isSelected = selectedType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeCard,
                      {
                        backgroundColor: isSelected
                          ? colors.primary.main + "20"
                          : colors.background.secondary,
                        borderColor: isSelected
                          ? colors.primary.main
                          : colors.ui.border,
                      },
                    ]}
                    onPress={() => setSelectedType(type.value)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.typeIcon,
                        {
                          backgroundColor: isSelected
                            ? colors.primary.main
                            : colors.ui.divider,
                        },
                      ]}
                    >
                      <Ionicons
                        name={type.icon as any}
                        size={20}
                        color={
                          isSelected
                            ? colors.primary.contrast
                            : colors.text.secondary
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.typeLabel,
                        {
                          color: isSelected
                            ? colors.primary.main
                            : colors.text.secondary,
                          fontWeight: isSelected ? "700" : "600",
                        },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Duration
            </Text>

            <View style={styles.dateRow}>
              {/* Start Date */}
              <View style={styles.dateField}>
                <Text
                  style={[styles.dateLabel, { color: colors.text.secondary }]}
                >
                  From
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.ui.border,
                    },
                  ]}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.primary.main}
                  />
                  <Text
                    style={[styles.dateText, { color: colors.text.primary }]}
                  >
                    {formatDate(startDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* End Date */}
              <View style={styles.dateField}>
                <Text
                  style={[styles.dateLabel, { color: colors.text.secondary }]}
                >
                  To
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.ui.border,
                    },
                  ]}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.primary.main}
                  />
                  <Text
                    style={[styles.dateText, { color: colors.text.primary }]}
                  >
                    {formatDate(endDate)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Days Count */}
            <View
              style={[
                styles.daysCard,
                { backgroundColor: colors.status.info.background },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.status.info.main}
              />
              <Text
                style={[styles.daysText, { color: colors.status.info.text }]}
              >
                Total Days: {calculateDays()}
              </Text>
            </View>
          </View>

          {/* Reason Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Reason
            </Text>
            <TextInput
              style={[
                styles.reasonInput,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.ui.border,
                  color: colors.text.primary,
                },
              ]}
              placeholder="Please provide a detailed reason for your leave..."
              placeholderTextColor={colors.text.disabled}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={reason}
              onChangeText={setReason}
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: colors.text.tertiary }]}>
              {reason.length}/500
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButtonContainer}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                isDark
                  ? [
                      colors.primary.main,
                      colors.primary.dark || colors.primary.main,
                    ]
                  : [
                      colors.primary.main,
                      colors.primary.light || colors.primary.main,
                    ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary.contrast} />
              ) : (
                <>
                  <Ionicons
                    name="send"
                    size={20}
                    color={colors.primary.contrast}
                  />
                  <Text
                    style={[
                      styles.submitButtonText,
                      { color: colors.primary.contrast },
                    ]}
                  >
                    Submit Application
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowStartPicker(Platform.OS === "ios");
              if (selectedDate) {
                setStartDate(selectedDate);
                if (selectedDate > endDate) {
                  setEndDate(selectedDate);
                }
              }
            }}
            minimumDate={new Date()}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowEndPicker(Platform.OS === "ios");
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
            minimumDate={startDate}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing["3xl"],
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: "700",
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing["3xl"],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  typeCard: {
    width: "48%",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: "center",
    gap: Spacing.xs,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLabel: {
    fontSize: FontSizes.sm,
    textAlign: "center",
  },
  dateRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    flex: 1,
  },
  daysCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  daysText: {
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  reasonInput: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    minHeight: 120,
  },
  charCount: {
    fontSize: FontSizes.xs,
    textAlign: "right",
    marginTop: Spacing.xs,
  },
  submitButtonContainer: {
    marginTop: Spacing.md,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  submitButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
});
