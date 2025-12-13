import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { ClassItem } from '@/types/classes';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface ClassCardProps {
  item: ClassItem;
  onView: (item: ClassItem) => void;
  onTakeAttendance: (item: ClassItem) => void;
  onCreateAssignment?: (item: ClassItem) => void;
}

export function ClassCard({ item, onView, onTakeAttendance, onCreateAssignment }: ClassCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.classCard, { backgroundColor: colors.ui.card, borderColor: colors.ui.border }]}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={[styles.className, { color: colors.text.primary }]}>{item.className}</Text>
          <Text style={[styles.subject, { color: colors.text.secondary }]}>{item.subject}</Text>
        </View>
        <View style={[styles.gradeBadge, { backgroundColor: colors.primary.main }]}>
          <Text style={[styles.gradeBadgeText, { color: colors.primary.contrast }]}>Grade {item.grade}</Text>
        </View>
      </View>

      {/* Card Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="person.2.fill" size={18} color={colors.primary.main} />
          <Text style={[styles.detailText, { color: colors.text.primary }]}>{item.totalStudents} Students</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="clock.fill" size={18} color={colors.primary.main} />
          <Text style={[styles.detailText, { color: colors.text.primary }]}>
            {item.nextClassDay} at {item.nextClassTime}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="location.fill" size={18} color={colors.primary.main} />
          <Text style={[styles.detailText, { color: colors.text.primary }]}>{item.room}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.cardActions, { borderTopColor: colors.ui.divider }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton, { backgroundColor: colors.background.secondary, borderColor: colors.ui.border }]}
          onPress={() => onView(item)}
          activeOpacity={0.7}
        >
          <IconSymbol name="eye.fill" size={18} color={colors.primary.main} />
          <Text style={[styles.viewButtonText, { color: colors.primary.main }]}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.attendanceButton, { backgroundColor: colors.primary.main }]}
          onPress={() => onTakeAttendance(item)}
          activeOpacity={0.7}
        >
          <IconSymbol name="checkmark.circle.fill" size={18} color={colors.primary.contrast} />
          <Text style={[styles.attendanceButtonText, { color: colors.primary.contrast }]}>Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Assignment Button */}
      {onCreateAssignment && (
        <TouchableOpacity
          style={[styles.quickAssignmentButton, { backgroundColor: colors.status.warning.background, borderTopColor: colors.ui.divider }]}
          onPress={() => onCreateAssignment(item)}
          activeOpacity={0.7}
        >
          <IconSymbol name="doc.text.fill" size={16} color={colors.status.warning.main} />
          <Text style={[styles.quickAssignmentText, { color: colors.status.warning.main }]}>Create Assignment</Text>
          <IconSymbol name="chevron.right" size={14} color={colors.status.warning.main} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  classCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.md,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  className: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subject: {
    fontSize: FontSizes.sm,
  },
  gradeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  gradeBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  cardDetails: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
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
  cardActions: {
    flexDirection: 'row',
    padding: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  viewButton: {
    borderWidth: 1,
  },
  attendanceButton: {
    // Background color handled in component
  },
  viewButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  attendanceButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  quickAssignmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.xs,
  },
  quickAssignmentText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    flex: 1,
  },
});
