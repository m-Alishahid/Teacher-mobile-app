/**
 * Submission View Screen - COMPLETELY REDESIGNED
 *
 * Ultra Professional Features:
 * - Perfect spacing and padding
 * - Clean grading interface
 * - Beautiful visual indicators
 * - Modern card design
 */

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/context/ThemeContext";
import { allAssignments, generateSubmissions } from "@/data";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_PADDING = 20;
const CARD_PADDING = 16;

export default function SubmissionViewScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { assignmentId, submissionId } = useLocalSearchParams<{
    assignmentId: string;
    submissionId: string;
  }>();

  const assignment = useMemo(
    () => allAssignments.find((a) => a.id === assignmentId),
    [assignmentId]
  );

  const submission = useMemo(() => {
    if (!assignment) return null;
    const submissions = generateSubmissions(assignment.id);
    return submissions.find((s) => s.id === submissionId);
  }, [assignment, submissionId]);

  const [marks, setMarks] = useState<string>(
    submission?.marksObtained?.toString() || ""
  );
  const [feedback, setFeedback] = useState<string>(submission?.feedback || "");

  if (!assignment || !submission) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View style={styles.errorContainer}>
          <View
            style={[
              styles.errorIcon,
              { backgroundColor: colors.status.error.background },
            ]}
          >
            <IconSymbol
              name="exclamationmark.triangle.fill"
              size={40}
              color={colors.status.error.main}
            />
          </View>
          <Text style={[styles.errorText, { color: colors.text.primary }]}>
            Submission not found
          </Text>
          <TouchableOpacity
            style={[
              styles.errorButton,
              { backgroundColor: colors.primary.main },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.errorButtonText,
                { color: colors.primary.contrast },
              ]}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSaveGrading = () => {
    const marksNum = parseInt(marks);

    if (!marks || isNaN(marksNum)) {
      Alert.alert("⚠️ Invalid Marks", "Please enter valid marks");
      return;
    }

    if (marksNum < 0 || marksNum > assignment.totalMarks) {
      Alert.alert(
        "⚠️ Invalid Marks",
        `Marks must be between 0 and ${assignment.totalMarks}`
      );
      return;
    }

    if (!feedback.trim()) {
      Alert.alert("⚠️ Missing Feedback", "Please provide feedback");
      return;
    }

    Alert.alert(
      "✅ Grading Saved",
      `${submission.studentName}\n\nMarks: ${marks}/${assignment.totalMarks}\n\nGrading saved successfully!`,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const marksPercentage = marks
    ? Math.round((parseInt(marks) / assignment.totalMarks) * 100)
    : 0;

  const getGradeInfo = () => {
    if (marksPercentage >= 90)
      return {
        grade: "A+",
        label: "Outstanding",
        color: colors.status.success.main,
      };
    if (marksPercentage >= 80)
      return {
        grade: "A",
        label: "Excellent",
        color: colors.status.success.main,
      };
    if (marksPercentage >= 70)
      return {
        grade: "B",
        label: "Very Good",
        color: colors.status.info.main,
      };
    if (marksPercentage >= 60)
      return {
        grade: "C",
        label: "Good",
        color: colors.status.info.main,
      };
    if (marksPercentage >= 50)
      return {
        grade: "D",
        label: "Satisfactory",
        color: colors.status.warning.main,
      };
    return {
      grade: "F",
      label: "Needs Improvement",
      color: colors.status.error.main,
    };
  };

  const gradeInfo = getGradeInfo();

  const initials = submission.studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.primary.main}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Custom Header */}
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
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <IconSymbol
                name="chevron.left"
                size={24}
                color={colors.primary.contrast}
              />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View
                style={[
                  styles.headerAvatar,
                  { backgroundColor: "rgba(255, 255, 255, 0.25)" },
                ]}
              >
                <Text
                  style={[
                    styles.headerAvatarText,
                    { color: colors.primary.contrast },
                  ]}
                >
                  {initials}
                </Text>
              </View>
              <View style={styles.headerInfo}>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: colors.primary.contrast },
                  ]}
                  numberOfLines={1}
                >
                  {submission.studentName}
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.primary.contrast },
                  ]}
                >
                  {submission.studentRollNo}
                </Text>
              </View>
            </View>
            <View style={styles.headerRight} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Assignment Info */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.ui.card,
                borderColor: colors.ui.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <IconSymbol
                name="doc.text.fill"
                size={18}
                color={colors.primary.main}
              />
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                Assignment
              </Text>
            </View>
            <Text
              style={[styles.assignmentTitle, { color: colors.text.primary }]}
            >
              {assignment.title}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <IconSymbol
                  name="book.fill"
                  size={12}
                  color={colors.text.tertiary}
                />
                <Text
                  style={[styles.metaText, { color: colors.text.secondary }]}
                >
                  {assignment.subject}
                </Text>
              </View>
              <View style={styles.metaChip}>
                <IconSymbol
                  name="star.fill"
                  size={12}
                  color={colors.text.tertiary}
                />
                <Text
                  style={[styles.metaText, { color: colors.text.secondary }]}
                >
                  {assignment.totalMarks} marks
                </Text>
              </View>
            </View>
          </View>

          {/* Submission Info */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.ui.card,
                borderColor: colors.ui.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <IconSymbol
                name="calendar"
                size={18}
                color={colors.status.success.main}
              />
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                Submission
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>
                Submitted
              </Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                {formatDate(submission.submittedDate!)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>
                Status
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      submission.status === "late"
                        ? colors.status.warning.background
                        : colors.status.success.background,
                    borderColor:
                      submission.status === "late"
                        ? colors.status.warning.main
                        : colors.status.success.main,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        submission.status === "late"
                          ? colors.status.warning.main
                          : colors.status.success.main,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        submission.status === "late"
                          ? colors.status.warning.main
                          : colors.status.success.main,
                    },
                  ]}
                >
                  {submission.status === "late" ? "LATE" : "ON TIME"}
                </Text>
              </View>
            </View>

            {submission.attachmentName && (
              <TouchableOpacity
                style={[
                  styles.attachmentButton,
                  {
                    backgroundColor: colors.primary.main + "15",
                    borderColor: colors.primary.main,
                  },
                ]}
                onPress={() =>
                  Alert.alert(
                    "📎 Attachment",
                    `Opening: ${submission.attachmentName}`
                  )
                }
              >
                <IconSymbol
                  name="paperclip"
                  size={16}
                  color={colors.primary.main}
                />
                <Text
                  style={[
                    styles.attachmentText,
                    { color: colors.primary.main },
                  ]}
                >
                  {submission.attachmentName}
                </Text>
                <IconSymbol
                  name="arrow.right"
                  size={14}
                  color={colors.primary.main}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Student's Work */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.ui.card,
                borderColor: colors.ui.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <IconSymbol
                name="doc.fill"
                size={18}
                color={colors.status.info.main}
              />
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                Student's Work
              </Text>
            </View>
            <View
              style={[
                styles.workContent,
                { backgroundColor: colors.background.secondary },
              ]}
            >
              <Text style={[styles.workText, { color: colors.text.primary }]}>
                {submission.submissionText}
              </Text>
            </View>
          </View>

          {/* Grading Section */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.ui.card,
                borderColor: colors.ui.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <IconSymbol
                name="star.fill"
                size={18}
                color={colors.status.warning.main}
              />
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                Grade Submission
              </Text>
            </View>

            {/* Marks Input */}
            <View style={styles.inputGroup}>
              <Text
                style={[styles.inputLabel, { color: colors.text.secondary }]}
              >
                Marks Obtained
              </Text>
              <View style={styles.marksRow}>
                <TextInput
                  style={[
                    styles.marksInput,
                    {
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary,
                      borderColor: colors.ui.border,
                    },
                  ]}
                  value={marks}
                  onChangeText={setMarks}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.text.tertiary}
                  maxLength={3}
                />
                <Text
                  style={[styles.totalMarks, { color: colors.text.secondary }]}
                >
                  / {assignment.totalMarks}
                </Text>
              </View>

              {marks && !isNaN(parseInt(marks)) && (
                <View
                  style={[
                    styles.gradePreview,
                    {
                      backgroundColor: gradeInfo.color + "10",
                      borderColor: gradeInfo.color,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.gradeCircle,
                      {
                        backgroundColor: gradeInfo.color + "20",
                        borderColor: gradeInfo.color,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.gradePercent, { color: gradeInfo.color }]}
                    >
                      {marksPercentage}%
                    </Text>
                  </View>
                  <View style={styles.gradeInfo}>
                    <Text
                      style={[styles.gradeLetter, { color: gradeInfo.color }]}
                    >
                      Grade {gradeInfo.grade}
                    </Text>
                    <Text
                      style={[styles.gradeLabel, { color: gradeInfo.color }]}
                    >
                      {gradeInfo.label}
                    </Text>
                  </View>
                  <IconSymbol
                    name="star.fill"
                    size={28}
                    color={gradeInfo.color}
                  />
                </View>
              )}
            </View>

            {/* Feedback Input */}
            <View style={styles.inputGroup}>
              <Text
                style={[styles.inputLabel, { color: colors.text.secondary }]}
              >
                Feedback
              </Text>
              <TextInput
                style={[
                  styles.feedbackInput,
                  {
                    backgroundColor: colors.background.secondary,
                    color: colors.text.primary,
                    borderColor: colors.ui.border,
                  },
                ]}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Write constructive feedback..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, { color: colors.text.tertiary }]}>
                {feedback.length} characters
              </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor: colors.status.success.main,
                },
              ]}
              onPress={handleSaveGrading}
              activeOpacity={0.8}
            >
              <IconSymbol
                name="checkmark.circle.fill"
                size={22}
                color="#FFFFFF"
              />
              <Text style={styles.saveButtonText}>
                {submission.isGraded ? "Update Grading" : "Save Grading"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
  },
  headerRight: {
    width: 40,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.9,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SCREEN_PADDING,
    gap: 12,
  },

  // Card
  card: {
    padding: CARD_PADDING,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Assignment Info
  assignmentTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },

  // Submission Info
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  attachmentText: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },

  // Work Content
  workContent: {
    padding: 12,
    borderRadius: 12,
    minHeight: 100,
  },
  workText: {
    fontSize: 13,
    lineHeight: 20,
  },

  // Grading Section
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  marksRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  marksInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    borderWidth: 1.5,
    textAlign: "center",
  },
  totalMarks: {
    fontSize: 24,
    fontWeight: "bold",
  },
  gradePreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 8,
  },
  gradeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  gradePercent: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gradeInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  gradeLetter: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gradeLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  feedbackInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 13,
    borderWidth: 1.5,
    minHeight: 100,
    lineHeight: 18,
  },
  charCount: {
    fontSize: 10,
    textAlign: "right",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 24,
    gap: 8,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Error State
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SCREEN_PADDING,
    gap: 16,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 20,
    fontWeight: "700",
  },
  errorButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 8,
  },
  errorButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
