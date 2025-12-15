/**
 * Attendance Tab Screen
 * 
 * Optimized Features:
 * - Automatically detects and shows current running class
 * - Smart class selection based on current time
 * - Quick attendance marking
 * - Real-time stats
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors, BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRScanner from '@/components/attendance/QRScanner';

type AttendanceStatus = 'present' | 'absent' | 'late' | null;

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: AttendanceStatus;
}

interface ClassSchedule {
  id: string;
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
}

export default function AttendanceScreen() {
  const { colors, isDark } = useTheme();
  const [currentClass, setCurrentClass] = useState<ClassSchedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState<Student[]>([]);

  // Mock class schedule
  const classSchedule: ClassSchedule[] = [
    {
      id: '1',
      className: 'Grade 10 - Section A',
      subject: 'Mathematics',
      startTime: '09:00',
      endTime: '10:00',
      room: 'Room 204',
      dayOfWeek: 1, // Monday
    },
    {
      id: '2',
      className: 'Grade 11 - Section A',
      subject: 'Physics',
      startTime: '10:30',
      endTime: '11:30',
      room: 'Lab 305',
      dayOfWeek: 1, // Monday
    },
    {
      id: '3',
      className: 'Grade 12 - Section A',
      subject: 'Chemistry',
      startTime: '13:00',
      endTime: '14:00',
      room: 'Lab 101',
      dayOfWeek: 1, // Monday
    },
    {
      id: '4',
      className: 'Grade 10 - Section B',
      subject: 'Mathematics',
      startTime: '14:30',
      endTime: '15:30',
      room: 'Room 204',
      dayOfWeek: 1, // Monday
    },
  ];

  // Generate mock students
  const generateStudents = (count: number = 32): Student[] => {
    const names = [
      'Ahmed Ali', 'Fatima Hassan', 'Hassan Ahmed', 'Ayesha Malik',
      'Usman Tariq', 'Zainab Hassan', 'Ali Raza', 'Maryam Siddiqui',
      'Omar Farooq', 'Sara Khan', 'Ibrahim Ali', 'Aisha Ahmed',
      'Bilal Hassan', 'Hira Malik', 'Hamza Tariq', 'Zara Ali',
      'Faisal Ahmed', 'Noor Hassan', 'Kamran Ali', 'Sana Malik',
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `${i + 1}`,
      name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
      rollNumber: String(i + 1).padStart(3, '0'),
      status: null,
    }));
  };

  // Get current running class based on time
  const getCurrentClass = (): ClassSchedule | null => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Find class that matches current day and time
    const runningClass = classSchedule.find(cls => {
      if (cls.dayOfWeek !== currentDay) return false;
      return currentTime >= cls.startTime && currentTime <= cls.endTime;
    });

    // If no class is running, find the next class
    if (!runningClass) {
      const upcomingClass = classSchedule.find(cls => {
        if (cls.dayOfWeek !== currentDay) return false;
        return currentTime < cls.startTime;
      });
      return upcomingClass || classSchedule[0]; // Default to first class
    }

    return runningClass;
  };

  // Initialize with current class
  useEffect(() => {
    const current = getCurrentClass();
    setCurrentClass(current);
    setSelectedClass(current);
    setStudents(generateStudents(32));
  }, []);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const markAttendance = (studentId: string, status: AttendanceStatus) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(prev =>
      prev.map(student => ({ ...student, status: 'present' as const }))
    );
  };

  const getStatusCounts = () => {
    const present = students.filter(s => s.status === 'present').length;
    const late = students.filter(s => s.status === 'late').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const unmarked = students.filter(s => s.status === null).length;
    return { present, late, absent, unmarked };
  };

  const submitAttendance = () => {
    const counts = getStatusCounts();
    
    if (counts.unmarked > 0) {
      Alert.alert(
        'Incomplete Attendance',
        `${counts.unmarked} student(s) not marked. Continue anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: () => {
              Alert.alert(
                '✅ Success',
                `Attendance submitted for ${selectedClass?.className}!\n\nPresent: ${counts.present}\nLate: ${counts.late}\nAbsent: ${counts.absent}`
              );
            },
          },
        ]
      );
    } else {
      Alert.alert(
        '✅ Success',
        `Attendance submitted for ${selectedClass?.className}!\n\nPresent: ${counts.present}\nLate: ${counts.late}\nAbsent: ${counts.absent}`
      );
    }
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleStudentScan = (studentId: string) => {
    // Automatically mark student as present when scanned
    markAttendance(studentId, 'present');
  };

  const counts = getStatusCounts();
  const isCurrentClass = currentClass?.id === selectedClass?.id;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: colors.primary.contrast }]}>Take Attendance</Text>
            {selectedClass && (
              <Text style={[styles.headerSubtitle, { color: colors.primary.contrast }]}>{selectedClass.className}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={handleQRScan}
            activeOpacity={0.7}
          >
            <IconSymbol name="qrcode" size={24} color={colors.primary.contrast} />
          </TouchableOpacity>
        </View>

        {/* Current Class Indicator */}
        {isCurrentClass && currentClass && (
          <View style={styles.currentClassBanner}>
            <View style={styles.currentClassDot} />
            <Text style={[styles.currentClassText, { color: colors.primary.contrast }]}>
              🔴 LIVE NOW: {currentClass.startTime} - {currentClass.endTime}
            </Text>
          </View>
        )}

        {/* Class Selector */}
        <TouchableOpacity
          style={[styles.classSelector, { backgroundColor: colors.ui.card }]}
          onPress={() => setShowClassPicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.classSelectorLeft}>
            <IconSymbol name="book.fill" size={20} color={colors.primary.main} />
            <View style={styles.classSelectorText}>
              <Text style={[styles.classSelectorTitle, { color: colors.text.primary }]}>
                {selectedClass?.subject || 'Select Class'}
              </Text>
              <Text style={[styles.classSelectorSubtitle, { color: colors.text.secondary }]}>
                {selectedClass?.room} • {selectedClass?.startTime}
              </Text>
            </View>
          </View>
          <IconSymbol name="chevron.down" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: colors.status.success.background }]}>
          <Text style={[styles.statNumber, { color: colors.status.success.main }]}>
            {counts.present}
          </Text>
          <Text style={[styles.statLabel, { color: colors.status.success.text }]}>
            Present
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.status.warning.background }]}>
          <Text style={[styles.statNumber, { color: colors.status.warning.main }]}>
            {counts.late}
          </Text>
          <Text style={[styles.statLabel, { color: colors.status.warning.text }]}>
            Late
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.status.error.background }]}>
          <Text style={[styles.statNumber, { color: colors.status.error.main }]}>
            {counts.absent}
          </Text>
          <Text style={[styles.statLabel, { color: colors.status.error.text }]}>
            Absent
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.statNumber, { color: colors.text.secondary }]}>
            {counts.unmarked}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Unmarked
          </Text>
        </View>
      </View>

      {/* Mark All Button */}
      <View style={styles.markAllContainer}>
        <TouchableOpacity
          style={[styles.markAllButton, { backgroundColor: colors.status.success.main }]}
          onPress={markAllPresent}
          activeOpacity={0.7}
        >
          <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary.contrast} />
          <Text style={[styles.markAllButtonText, { color: colors.primary.contrast }]}>Mark All Present</Text>
        </TouchableOpacity>
      </View>

      {/* Student List */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.studentList}
        renderItem={({ item }) => (
          <View style={[styles.studentCard, { backgroundColor: colors.ui.card, borderColor: colors.ui.border }]}>
            <View style={styles.studentInfo}>
              <View style={[styles.studentAvatar, { backgroundColor: colors.primary.main }]}>
                <Text style={[styles.avatarText, { color: colors.primary.contrast }]}>{getInitials(item.name)}</Text>
              </View>
              <View style={styles.studentDetails}>
                <Text style={[styles.studentName, { color: colors.text.primary }]}>{item.name}</Text>
                <Text style={[styles.studentRoll, { color: colors.text.secondary }]}>Roll No: {item.rollNumber}</Text>
              </View>
            </View>

            <View style={styles.radioGroup}>
              {/* Present */}
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => markAttendance(item.id, 'present')}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.radioOuter,
                  { borderColor: colors.status.success.main },
                  item.status === 'present' && { backgroundColor: colors.status.success.main },
                ]}>
                  {item.status === 'present' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary.contrast }]} />
                  )}
                </View>
                <Text style={[
                  styles.radioLabel,
                  { color: item.status === 'present' ? colors.status.success.main : colors.text.secondary, fontWeight: item.status === 'present' ? '700' : '400' },
                ]}>
                  P
                </Text>
              </TouchableOpacity>

              {/* Late */}
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => markAttendance(item.id, 'late')}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.radioOuter,
                  { borderColor: colors.status.warning.main },
                  item.status === 'late' && { backgroundColor: colors.status.warning.main },
                ]}>
                  {item.status === 'late' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary.contrast }]} />
                  )}
                </View>
                <Text style={[
                  styles.radioLabel,
                  { color: item.status === 'late' ? colors.status.warning.main : colors.text.secondary, fontWeight: item.status === 'late' ? '700' : '400' },
                ]}>
                  L
                </Text>
              </TouchableOpacity>

              {/* Absent */}
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => markAttendance(item.id, 'absent')}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.radioOuter,
                  { borderColor: colors.status.error.main },
                  item.status === 'absent' && { backgroundColor: colors.status.error.main },
                ]}>
                  {item.status === 'absent' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary.contrast }]} />
                  )}
                </View>
                <Text style={[
                  styles.radioLabel,
                  { color: item.status === 'absent' ? colors.status.error.main : colors.text.secondary, fontWeight: item.status === 'absent' ? '700' : '400' },
                ]}>
                  A
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Submit Button */}
      <View style={[styles.submitContainer, { backgroundColor: colors.background.primary, borderTopColor: colors.ui.border }]}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary.main }]}
          onPress={submitAttendance}
          activeOpacity={0.8}
        >
          <IconSymbol name="checkmark.seal.fill" size={20} color={colors.primary.contrast} />
          <Text style={[styles.submitButtonText, { color: colors.primary.contrast }]}>Submit Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* Class Picker Modal */}
      <Modal
        visible={showClassPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClassPicker(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.ui.overlay }]}>
          <View style={[styles.pickerModal, { backgroundColor: colors.ui.card }]}>
            <View style={[styles.pickerHeader, { borderBottomColor: colors.ui.border }]}>
              <Text style={[styles.pickerTitle, { color: colors.text.primary }]}>Select Class</Text>
              <TouchableOpacity
                onPress={() => setShowClassPicker(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol name="xmark" size={24} color={colors.text.secondary} />
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
                      isSelected && { backgroundColor: isDark ? colors.background.tertiary : colors.background.secondary },
                    ]}
                    onPress={() => {
                      setSelectedClass(cls);
                      setShowClassPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerItemLeft}>
                      <View style={styles.pickerItemHeader}>
                        <Text style={[styles.pickerItemTitle, { color: colors.text.primary }]}>{cls.className}</Text>
                        {isCurrent && (
                          <View style={styles.liveBadge}>
                            <View style={[styles.liveDot, { backgroundColor: colors.primary.contrast }]} />
                            <Text style={styles.liveText}>LIVE</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.pickerItemSubject, { color: colors.text.secondary }]}>{cls.subject}</Text>
                      <Text style={[styles.pickerItemTime, { color: colors.text.tertiary }]}>
                        {cls.room} • {cls.startTime} - {cls.endTime}
                      </Text>
                    </View>
                    {isSelected && (
                      <IconSymbol name="checkmark" size={24} color={colors.primary.main} />
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
    backgroundColor: AppColors.background.primary,
  },

  // Header
  header: {
    backgroundColor: AppColors.primary.main,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: AppColors.primary.contrast,
  },
  headerSubtitle: {
    fontSize: FontSizes.base,
    color: AppColors.primary.contrast,
    opacity: 0.9,
    marginTop: 2,
  },
  qrButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Current Class Banner
  currentClassBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  currentClassDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FF4444',
  },
  currentClassText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },

  // Class Selector
  classSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.ui.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  classSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  classSelectorText: {
    flex: 1,
  },
  classSelectorTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.primary,
  },
  classSelectorSubtitle: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    marginTop: 2,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  statBox: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },

  // Mark All
  markAllContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.status.success.main,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    shadowColor: AppColors.status.success.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  markAllButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },

  // Student List
  studentList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.ui.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
    shadowColor: AppColors.ui.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
    color: AppColors.primary.contrast,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },

  // Radio Buttons
  radioGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  radioButton: {
    alignItems: 'center',
    gap: 4,
  },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.primary.contrast,
  },
  radioLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: AppColors.text.secondary,
  },

  // Submit Button
  submitContainer: {
    padding: Spacing.lg,
    backgroundColor: AppColors.background.primary,
    borderTopWidth: 1,
    borderTopColor: AppColors.ui.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary.main,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    shadowColor: AppColors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: AppColors.ui.overlay,
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: AppColors.ui.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.ui.border,
  },
  pickerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: AppColors.text.primary,
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.ui.divider,
  },
  pickerItemSelected: {
    backgroundColor: AppColors.background.secondary,
  },
  pickerItemLeft: {
    flex: 1,
  },
  pickerItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  pickerItemTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.primary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.primary.contrast,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: AppColors.primary.contrast,
  },
  pickerItemSubject: {
    fontSize: FontSizes.base,
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  pickerItemTime: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
});
