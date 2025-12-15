import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface ScheduleCardProps {
  subject: string;
  grade: string;
  time: string;
  room: string;
  studentsCount: number;
  onQuickAttendance: () => void;
}

export function ScheduleCard({ subject, grade, time, room, studentsCount, onQuickAttendance }: ScheduleCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.background.secondary, shadowColor: colors.ui.shadow }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.subject, { color: colors.text.primary }]}>{subject}</Text>
          <Text style={[styles.grade, { color: colors.text.secondary }]}>{grade}</Text>
        </View>
        <View style={[styles.timeContainer, { backgroundColor: isDark ? colors.background.tertiary : '#F0F0F0' }]}>
          <IconSymbol name="clock" size={16} color={colors.text.secondary} />
          <Text style={[styles.time, { color: colors.text.secondary }]}>{time}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.ui.divider }]} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <IconSymbol name="location.fill" size={18} color={colors.primary.main} />
          <Text style={[styles.detailText, { color: colors.text.secondary }]}>{room}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="person.2.fill" size={18} color={colors.primary.main} />
          <Text style={[styles.detailText, { color: colors.text.secondary }]}>{studentsCount} Students</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary.main }]}
        onPress={onQuickAttendance}
        activeOpacity={0.8}
      >
        <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary.contrast} />
        <Text style={[styles.buttonText, { color: colors.primary.contrast }]}>Quick Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  subject: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  grade: {
    fontSize: FontSizes.base,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  time: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  details: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
});
