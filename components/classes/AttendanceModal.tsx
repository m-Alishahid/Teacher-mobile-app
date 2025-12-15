import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { ClassItem, Student } from '@/types/classes';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface AttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  selectedClass: ClassItem | null;
  students: Student[];
  onMarkAllPresent: () => void;
  onMarkAttendance: (studentId: string, status: 'present' | 'late' | 'absent') => void;
  onSubmit: () => void;
}

export function AttendanceModal({
  visible,
  onClose,
  selectedClass,
  students,
  onMarkAllPresent,
  onMarkAttendance,
  onSubmit,
}: AttendanceModalProps) {
  const { colors } = useTheme();

  if (!selectedClass) return null;

  const getStatusCounts = () => {
    const present = students.filter(s => s.status === 'present').length;
    const late = students.filter(s => s.status === 'late').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const unmarked = students.filter(s => s.status === null).length;
    return { present, late, absent, unmarked };
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const counts = getStatusCounts();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.attendanceContainer, { backgroundColor: colors.background.primary }]}>
        {/* Header */}
        <View style={[styles.attendanceHeader, { backgroundColor: colors.primary.main, borderBottomColor: colors.ui.border }]}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.primary.contrast} />
          </TouchableOpacity>
          <View style={styles.attendanceHeaderCenter}>
            <Text style={[styles.attendanceHeaderTitle, { color: colors.primary.contrast }]}>Take Attendance</Text>
            <Text style={[styles.attendanceHeaderSubtitle, { color: colors.primary.contrast }]}>{selectedClass.className}</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        {/* Class Info Card */}
        <View style={[styles.attendanceClassInfo, { backgroundColor: colors.background.secondary, borderBottomColor: colors.ui.border }]}>
          <View style={styles.attendanceClassInfoRow}>
            <IconSymbol name="book.fill" size={18} color={colors.primary.main} />
            <Text style={[styles.attendanceClassInfoText, { color: colors.text.primary }]}>{selectedClass.subject}</Text>
          </View>
          <View style={styles.attendanceClassInfoRow}>
            <IconSymbol name="location.fill" size={18} color={colors.primary.main} />
            <Text style={[styles.attendanceClassInfoText, { color: colors.text.primary }]}>{selectedClass.room}</Text>
          </View>
          <View style={styles.attendanceClassInfoRow}>
            <IconSymbol name="clock.fill" size={18} color={colors.primary.main} />
            <Text style={[styles.attendanceClassInfoText, { color: colors.text.primary }]}>{selectedClass.nextClassTime}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.attendanceStats}>
          <View style={[styles.attendanceStatBox, { backgroundColor: colors.status.success.background }]}>
            <Text style={[styles.attendanceStatNumber, { color: colors.status.success.main }]}>
              {counts.present}
            </Text>
            <Text style={[styles.attendanceStatLabel, { color: colors.status.success.text }]}>
              Present
            </Text>
          </View>
          <View style={[styles.attendanceStatBox, { backgroundColor: colors.status.warning.background }]}>
            <Text style={[styles.attendanceStatNumber, { color: colors.status.warning.main }]}>
              {counts.late}
            </Text>
            <Text style={[styles.attendanceStatLabel, { color: colors.status.warning.text }]}>
              Late
            </Text>
          </View>
          <View style={[styles.attendanceStatBox, { backgroundColor: colors.status.error.background }]}>
            <Text style={[styles.attendanceStatNumber, { color: colors.status.error.main }]}>
              {counts.absent}
            </Text>
            <Text style={[styles.attendanceStatLabel, { color: colors.status.error.text }]}>
              Absent
            </Text>
          </View>
          <View style={[styles.attendanceStatBox, { backgroundColor: colors.background.secondary }]}>
            <Text style={[styles.attendanceStatNumber, { color: colors.text.secondary }]}>
              {counts.unmarked}
            </Text>
            <Text style={[styles.attendanceStatLabel, { color: colors.text.secondary }]}>
              Unmarked
            </Text>
          </View>
        </View>

        {/* Mark All Button */}
        <View style={styles.markAllContainer}>
          <TouchableOpacity
            style={[styles.markAllButton, { backgroundColor: colors.status.success.main }]}
            onPress={onMarkAllPresent}
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
          contentContainerStyle={styles.attendanceList}
          renderItem={({ item }) => (
            <View style={[styles.attendanceStudentCard, { backgroundColor: colors.background.secondary, borderColor: colors.ui.border }]}>
              {/* Student Info */}
              <View style={styles.attendanceStudentInfo}>
                <View style={[styles.attendanceStudentAvatar, { backgroundColor: colors.primary.main }]}>
                  <Text style={[styles.attendanceAvatarText, { color: colors.primary.contrast }]}>{getInitials(item.name)}</Text>
                </View>
                <View style={styles.attendanceStudentDetails}>
                  <Text style={[styles.attendanceStudentName, { color: colors.text.primary }]}>{item.name}</Text>
                  <Text style={[styles.attendanceStudentRoll, { color: colors.text.secondary }]}>Roll No: {item.rollNumber}</Text>
                </View>
              </View>

              {/* Radio Buttons */}
              <View style={styles.attendanceRadioGroup}>
                {/* Present */}
                <TouchableOpacity
                  style={styles.attendanceRadioButton}
                  onPress={() => onMarkAttendance(item.id, 'present')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.attendanceRadioOuter,
                    { borderColor: colors.status.success.main },
                    item.status === 'present' && { backgroundColor: colors.status.success.main },
                  ]}>
                    {item.status === 'present' && (
                      <View style={[styles.attendanceRadioInner, { backgroundColor: colors.primary.contrast }]} />
                    )}
                  </View>
                  <Text style={[
                    styles.attendanceRadioLabel,
                    { color: item.status === 'present' ? colors.status.success.main : colors.text.secondary, fontWeight: item.status === 'present' ? '700' : '400' },
                  ]}>
                    P
                  </Text>
                </TouchableOpacity>

                {/* Late */}
                <TouchableOpacity
                  style={styles.attendanceRadioButton}
                  onPress={() => onMarkAttendance(item.id, 'late')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.attendanceRadioOuter,
                    { borderColor: colors.status.warning.main },
                    item.status === 'late' && { backgroundColor: colors.status.warning.main },
                  ]}>
                    {item.status === 'late' && (
                      <View style={[styles.attendanceRadioInner, { backgroundColor: colors.primary.contrast }]} />
                    )}
                  </View>
                  <Text style={[
                    styles.attendanceRadioLabel,
                    { color: item.status === 'late' ? colors.status.warning.main : colors.text.secondary, fontWeight: item.status === 'late' ? '700' : '400' },
                  ]}>
                    L
                  </Text>
                </TouchableOpacity>

                {/* Absent */}
                <TouchableOpacity
                  style={styles.attendanceRadioButton}
                  onPress={() => onMarkAttendance(item.id, 'absent')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.attendanceRadioOuter,
                    { borderColor: colors.status.error.main },
                    item.status === 'absent' && { backgroundColor: colors.status.error.main },
                  ]}>
                    {item.status === 'absent' && (
                      <View style={[styles.attendanceRadioInner, { backgroundColor: colors.primary.contrast }]} />
                    )}
                  </View>
                  <Text style={[
                    styles.attendanceRadioLabel,
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
        <View style={[styles.attendanceSubmitContainer, { backgroundColor: colors.background.primary, borderTopColor: colors.ui.border }]}>
          <TouchableOpacity
            style={[styles.attendanceSubmitButton, { backgroundColor: colors.primary.main }]}
            onPress={onSubmit}
            activeOpacity={0.8}
          >
            <IconSymbol name="checkmark.seal.fill" size={20} color={colors.primary.contrast} />
            <Text style={[styles.attendanceSubmitButtonText, { color: colors.primary.contrast }]}>Submit Attendance</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  attendanceContainer: {
    flex: 1,
  },
  attendanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  attendanceHeaderCenter: {
    alignItems: 'center',
  },
  attendanceHeaderTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  attendanceHeaderSubtitle: {
    fontSize: FontSizes.sm,
    opacity: 0.9,
  },
  attendanceClassInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  attendanceClassInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendanceClassInfoText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  attendanceStats: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  attendanceStatBox: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceStatNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  attendanceStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  markAllContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  markAllButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
  attendanceList: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  attendanceStudentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  attendanceStudentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attendanceStudentAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  attendanceAvatarText: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
  },
  attendanceStudentDetails: {
    flex: 1,
  },
  attendanceStudentName: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  attendanceStudentRoll: {
    fontSize: FontSizes.xs,
  },
  attendanceRadioGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  attendanceRadioButton: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  attendanceRadioOuter: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceRadioInner: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
  },
  attendanceRadioLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  attendanceSubmitContainer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  attendanceSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  attendanceSubmitButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
});
