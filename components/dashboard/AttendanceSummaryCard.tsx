import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface AttendanceSummaryProps {
  present: number;
  absent: number;
  total: number;
  onViewDetails: () => void;
}

export function AttendanceSummaryCard({ present, absent, total, onViewDetails }: AttendanceSummaryProps) {
  const { colors } = useTheme();
  const percentage = Math.round((present / total) * 100);

  return (
    <View style={[styles.card, { backgroundColor: colors.background.secondary, shadowColor: colors.ui.shadow }]}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor: colors.ui.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${percentage}%`, backgroundColor: colors.status.success.main }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.text.secondary }]}>
          {percentage}% Present
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <View style={[styles.dot, { backgroundColor: colors.status.success.main }]} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Present</Text>
          </View>
          <Text style={[styles.statNumber, { color: colors.status.success.main }]}>
            {present}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.ui.divider }]} />

        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <View style={[styles.dot, { backgroundColor: colors.status.error.main }]} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Absent</Text>
          </View>
          <Text style={[styles.statNumber, { color: colors.status.error.main }]}>
            {absent}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.ui.divider }]} />

        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <View style={[styles.dot, { backgroundColor: colors.primary.main }]} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total</Text>
          </View>
          <Text style={[styles.statNumber, { color: colors.primary.main }]}>
            {total}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onViewDetails}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: colors.primary.main }]}>View Detailed Report</Text>
        <IconSymbol name="chevron.right" size={16} color={colors.primary.main} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  progressBackground: {
    height: 8,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
