/**
 * QR-Based Attendance Screen
 *
 * Features:
 * - Auto-detects current running class
 * - QR scan only (no manual marking)
 * - Real-time attendance stats
 * - Premium modern UI
 */

import QRScanner from "@/components/attendance/QRScanner";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Student } from "@/types/classes";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ClassSchedule {
  id: string;
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  dayOfWeek: number;
}

export default function AttendanceScreen() {
  const { colors, isDark } = useTheme();
  const [currentClass, setCurrentClass] = useState<ClassSchedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(
    null
  );
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Mock class schedule
  const classSchedule: ClassSchedule[] = [
    {
      id: "1",
      className: "Grade 10 - Section A",
      subject: "Mathematics",
      startTime: "09:00",
      endTime: "10:00",
      room: "Room 204",
      dayOfWeek: 1,
    },
    {
      id: "2",
      className: "Grade 11 - Section A",
      subject: "Physics",
      startTime: "10:30",
      endTime: "11:30",
      room: "Lab 305",
      dayOfWeek: 1,
    },
    {
      id: "3",
      className: "Grade 12 - Section A",
      subject: "Chemistry",
      startTime: "13:00",
      endTime: "14:00",
      room: "Lab 101",
      dayOfWeek: 1,
    },
    {
      id: "4",
      className: "Grade 10 - Section B",
      subject: "Mathematics",
      startTime: "14:30",
      endTime: "15:30",
      room: "Room 204",
      dayOfWeek: 1,
    },
  ];

  // Generate mock students
  const generateStudents = (count: number = 32): Student[] => {
    const names = [
      "Ahmed Ali",
      "Fatima Hassan",
      "Hassan Ahmed",
      "Ayesha Malik",
      "Usman Tariq",
      "Zainab Hassan",
      "Ali Raza",
      "Maryam Siddiqui",
      "Omar Farooq",
      "Sara Khan",
      "Ibrahim Ali",
      "Aisha Ahmed",
      "Bilal Hassan",
      "Hira Malik",
      "Hamza Tariq",
      "Zara Ali",
      "Faisal Ahmed",
      "Noor Hassan",
      "Kamran Ali",
      "Sana Malik",
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `${i + 1}`,
      name:
        names[i % names.length] +
        (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
      rollNumber: String(i + 1).padStart(3, "0"),
      status: null,
    }));
  };

  // Get current running class based on time
  const getCurrentClass = (): ClassSchedule | null => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const runningClass = classSchedule.find((cls) => {
      if (cls.dayOfWeek !== currentDay) return false;
      return currentTime >= cls.startTime && currentTime <= cls.endTime;
    });

    if (!runningClass) {
      const upcomingClass = classSchedule.find((cls) => {
        if (cls.dayOfWeek !== currentDay) return false;
        return currentTime < cls.startTime;
      });
      return upcomingClass || classSchedule[0];
    }

    return runningClass;
  };

  // Pulse animation for scan button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const current = getCurrentClass();
    setCurrentClass(current);
    setSelectedClass(current);
    setStudents(generateStudents(32));
  }, []);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleStudentScan = (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, status: "scanned" as const, scannedAt: new Date() }
          : student
      )
    );
  };

  const getStatusCounts = () => {
    const scanned = students.filter((s) => s.status === "scanned").length;
    const unscanned = students.filter((s) => s.status === null).length;
    return { scanned, unscanned };
  };

  const submitAttendance = () => {
    const counts = getStatusCounts();

    if (counts.unscanned > 0) {
      Alert.alert(
        "Incomplete Attendance",
        `${counts.unscanned} student(s) have not scanned yet.\n\nContinue anyway? Unmarked students will be marked absent.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Submit",
            onPress: () => {
              Alert.alert(
                "✅ Success",
                `Attendance submitted for ${selectedClass?.className}!\n\nPresent: ${counts.scanned}\nAbsent: ${counts.unscanned}`
              );
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "✅ Perfect Attendance!",
        `All students scanned for ${selectedClass?.className}!\n\nTotal Present: ${counts.scanned}`
      );
    }
  };

  const counts = getStatusCounts();
  const isCurrentClass = currentClass?.id === selectedClass?.id;
  const completionPercent =
    students.length > 0
      ? Math.round((counts.scanned / students.length) * 100)
      : 0;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={[
          colors.primary.main,
          colors.primary.dark || colors.primary.main,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text
              style={[styles.headerTitle, { color: colors.primary.contrast }]}
            >
              QR Attendance
            </Text>
            {selectedClass && (
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colors.primary.contrast },
                ]}
              >
                {selectedClass.className}
              </Text>
            )}
          </View>
        </View>

        {/* Current Class Banner */}
        {isCurrentClass && currentClass && (
          <View
            style={[
              styles.liveBanner,
              { backgroundColor: "rgba(255, 255, 255, 0.15)" },
            ]}
          >
            <View style={styles.liveDot} />
            <Text style={[styles.liveText, { color: colors.primary.contrast }]}>
              🔴 LIVE: {currentClass.startTime} - {currentClass.endTime}
            </Text>
          </View>
        )}

        {/* Class Selector */}
        <TouchableOpacity
          style={[
            styles.classSelector,
            { backgroundColor: "rgba(255, 255, 255, 0.2)" },
          ]}
          onPress={() => setShowClassPicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.classSelectorLeft}>
            <IconSymbol
              name="book.fill"
              size={20}
              color={colors.primary.contrast}
            />
            <View style={styles.classSelectorText}>
              <Text
                style={[
                  styles.classSelectorTitle,
                  { color: colors.primary.contrast },
                ]}
              >
                {selectedClass?.subject || "Select Class"}
              </Text>
              <Text
                style={[
                  styles.classSelectorSubtitle,
                  { color: colors.primary.contrast },
                ]}
              >
                {selectedClass?.room} • {selectedClass?.startTime}
              </Text>
            </View>
          </View>
          <IconSymbol
            name="chevron.down"
            size={20}
            color={colors.primary.contrast}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Completion Progress */}
      <View
        style={[
          styles.progressSection,
          { backgroundColor: colors.background.secondary },
        ]}
      >
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: colors.text.primary }]}>
            Attendance Progress
          </Text>
          <Text
            style={[styles.progressPercent, { color: colors.primary.main }]}
          >
            {completionPercent}%
          </Text>
        </View>
        <View
          style={[styles.progressBarBg, { backgroundColor: colors.ui.border }]}
        >
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                backgroundColor:
                  completionPercent === 100
                    ? colors.status.success.main
                    : colors.primary.main,
                width: `${completionPercent}%`,
              },
            ]}
          />
        </View>
        <Text
          style={[styles.progressSubtext, { color: colors.text.secondary }]}
        >
          {counts.scanned} of {students.length} students scanned
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.status.success.background },
          ]}
        >
          <IconSymbol
            name="checkmark.circle.fill"
            size={32}
            color={colors.status.success.main}
          />
          <Text
            style={[styles.statNumber, { color: colors.status.success.main }]}
          >
            {counts.scanned}
          </Text>
          <Text
            style={[styles.statLabel, { color: colors.status.success.text }]}
          >
            Scanned
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <IconSymbol
            name="clock.fill"
            size={32}
            color={colors.text.secondary}
          />
          <Text style={[styles.statNumber, { color: colors.text.primary }]}>
            {counts.unscanned}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Pending
          </Text>
        </View>
      </View>

      {/* Scan Button */}
      <View style={styles.scanSection}>
        <TouchableOpacity
          onPress={() => setShowQRScanner(true)}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.scanButton,
              {
                backgroundColor: colors.primary.main,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                colors.primary.main,
                colors.primary.dark || colors.primary.main,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scanButtonGradient}
            >
              <IconSymbol
                name="qrcode"
                size={48}
                color={colors.primary.contrast}
              />
              <Text
                style={[
                  styles.scanButtonText,
                  { color: colors.primary.contrast },
                ]}
              >
                Start Scanning
              </Text>
              <Text
                style={[
                  styles.scanButtonSubtext,
                  { color: colors.primary.contrast },
                ]}
              >
                Tap to open QR scanner
              </Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Student List */}
      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: colors.text.primary }]}>
          Student List
        </Text>
        <View
          style={[
            styles.legendItem,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.status.success.main },
            ]}
          />
          <Text style={[styles.legendText, { color: colors.text.secondary }]}>
            Scanned
          </Text>
        </View>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.studentList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.studentCard,
              {
                backgroundColor: colors.ui.card,
                borderColor:
                  item.status === "scanned"
                    ? colors.status.success.main
                    : colors.ui.border,
                borderWidth: item.status === "scanned" ? 2 : 1,
              },
            ]}
          >
            <View style={styles.studentInfo}>
              <View
                style={[
                  styles.studentAvatar,
                  {
                    backgroundColor:
                      item.status === "scanned"
                        ? colors.status.success.main
                        : colors.primary.main,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.avatarText,
                    { color: colors.primary.contrast },
                  ]}
                >
                  {getInitials(item.name)}
                </Text>
              </View>
              <View style={styles.studentDetails}>
                <Text
                  style={[styles.studentName, { color: colors.text.primary }]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[styles.studentRoll, { color: colors.text.secondary }]}
                >
                  Roll No: {item.rollNumber}
                </Text>
                {item.scannedAt && (
                  <Text
                    style={[
                      styles.scannedTime,
                      { color: colors.status.success.main },
                    ]}
                  >
                    ✓ Scanned at{" "}
                    {item.scannedAt.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
            </View>

            {item.status === "scanned" && (
              <IconSymbol
                name="checkmark.seal.fill"
                size={28}
                color={colors.status.success.main}
              />
            )}
          </View>
        )}
      />

      {/* Submit Button */}
      <View
        style={[
          styles.submitContainer,
          {
            backgroundColor: colors.background.primary,
            borderTopColor: colors.ui.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary.main },
          ]}
          onPress={submitAttendance}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[
              colors.primary.main,
              colors.primary.dark || colors.primary.main,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitButtonGradient}
          >
            <IconSymbol
              name="checkmark.seal.fill"
              size={20}
              color={colors.primary.contrast}
            />
            <Text
              style={[
                styles.submitButtonText,
                { color: colors.primary.contrast },
              ]}
            >
              Submit Attendance
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Class Picker Modal */}
      <Modal
        visible={showClassPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClassPicker(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: colors.ui.overlay }]}
        >
          <View
            style={[styles.pickerModal, { backgroundColor: colors.ui.card }]}
          >
            <View
              style={[
                styles.pickerHeader,
                { borderBottomColor: colors.ui.border },
              ]}
            >
              <Text
                style={[styles.pickerTitle, { color: colors.text.primary }]}
              >
                Select Class
              </Text>
              <TouchableOpacity
                onPress={() => setShowClassPicker(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol
                  name="xmark"
                  size={24}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.pickerList}>
              {classSchedule.map((cls) => {
                const isCurrent = currentClass?.id === cls.id;
                const isSelected = selectedClass?.id === cls.id;

                return (
                  <TouchableOpacity
                    key={cls.id}
                    style={[
                      styles.pickerItem,
                      { borderBottomColor: colors.ui.divider },
                      isSelected && {
                        backgroundColor: colors.background.secondary,
                      },
                    ]}
                    onPress={() => {
                      setSelectedClass(cls);
                      setShowClassPicker(false);
                      setStudents(generateStudents(32));
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerItemLeft}>
                      <View style={styles.pickerItemHeader}>
                        <Text
                          style={[
                            styles.pickerItemTitle,
                            { color: colors.text.primary },
                          ]}
                        >
                          {cls.className}
                        </Text>
                        {isCurrent && (
                          <View
                            style={[
                              styles.liveChip,
                              { backgroundColor: colors.status.error.main },
                            ]}
                          >
                            <View
                              style={[
                                styles.liveChipDot,
                                { backgroundColor: colors.primary.contrast },
                              ]}
                            />
                            <Text
                              style={[
                                styles.liveChipText,
                                { color: colors.primary.contrast },
                              ]}
                            >
                              LIVE
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.pickerItemSubject,
                          { color: colors.text.secondary },
                        ]}
                      >
                        {cls.subject}
                      </Text>
                      <Text
                        style={[
                          styles.pickerItemTime,
                          { color: colors.text.tertiary },
                        ]}
                      >
                        {cls.room} • {cls.startTime} - {cls.endTime}
                      </Text>
                    </View>
                    {isSelected && (
                      <IconSymbol
                        name="checkmark.circle.fill"
                        size={24}
                        color={colors.primary.main}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* QR Scanner Modal */}
      <QRScanner
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleStudentScan}
        currentClassStudents={students}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: FontSizes.base,
    opacity: 0.9,
  },

  // Live Banner
  liveBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: "#FF4444",
  },
  liveText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },

  // Class Selector
  classSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  classSelectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  classSelectorText: {
    flex: 1,
  },
  classSelectorTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
  },
  classSelectorSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
    opacity: 0.9,
  },

  // Progress Section
  progressSection: {
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
  },
  progressPercent: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    marginBottom: Spacing.xs,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  progressSubtext: {
    fontSize: FontSizes.sm,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    gap: Spacing.xs,
  },
  statNumber: {
    fontSize: FontSizes["3xl"],
    fontWeight: "700",
  },
  statLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },

  // Scan Button
  scanSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  scanButton: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButtonGradient: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
    gap: Spacing.sm,
  },
  scanButtonText: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  scanButtonSubtext: {
    fontSize: FontSizes.sm,
    opacity: 0.8,
  },

  // List Header
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  listTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  legendText: {
    fontSize: FontSizes.xs,
    fontWeight: "500",
  },

  // Student List
  studentList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: FontSizes.sm,
  },
  scannedTime: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
    marginTop: 2,
  },

  // Submit Button
  submitContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  submitButton: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  submitButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  pickerModal: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: "70%",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  pickerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  pickerItemLeft: {
    flex: 1,
  },
  pickerItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: 4,
  },
  pickerItemTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
  },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  liveChipDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  liveChipText: {
    fontSize: 10,
    fontWeight: "700",
  },
  pickerItemSubject: {
    fontSize: FontSizes.base,
    marginBottom: 2,
  },
  pickerItemTime: {
    fontSize: FontSizes.sm,
  },
});
