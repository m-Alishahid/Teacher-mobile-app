import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface DailyStats {
  present: number;
  absent: number;
  total: number;
}

interface DetailedReportModalProps {
  visible: boolean;
  onClose: () => void;
  stats: DailyStats;
}

export function DetailedReportModal({ visible, onClose, stats }: DetailedReportModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.ui.overlay }]}>
        <View style={[styles.reportModal, { backgroundColor: colors.background.primary }]}>
          {/* Modal Header */}
          <View style={[styles.reportHeader, { borderBottomColor: colors.ui.divider }]}>
            <View style={styles.reportHeaderLeft}>
              <IconSymbol name="chart.bar.fill" size={28} color={colors.primary.main} />
              <Text style={[styles.reportTitle, { color: colors.text.primary }]}>Attendance Report</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="xmark" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.reportContent} showsVerticalScrollIndicator={false}>
            {/* Summary Section */}
            <View style={styles.reportSection}>
              <Text style={[styles.reportSectionTitle, { color: colors.text.primary }]}>📊 Today's Summary</Text>
              <View style={[styles.reportSummaryCard, { backgroundColor: colors.background.secondary, borderColor: colors.ui.border }]}>
                <View style={styles.reportSummaryRow}>
                  <Text style={[styles.reportLabel, { color: colors.text.secondary }]}>Date:</Text>
                  <Text style={[styles.reportValue, { color: colors.text.primary }]}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </View>
                <View style={styles.reportSummaryRow}>
                  <Text style={[styles.reportLabel, { color: colors.text.secondary }]}>Total Students:</Text>
                  <Text style={[styles.reportValue, { color: colors.text.primary }]}>{stats.total}</Text>
                </View>
                <View style={styles.reportSummaryRow}>
                  <Text style={[styles.reportLabel, { color: colors.text.secondary }]}>Attendance Rate:</Text>
                  <Text style={[styles.reportValue, { color: colors.status.success.main, fontWeight: '700' }]}>
                    {Math.round((stats.present / stats.total) * 100)}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Detailed Stats */}
            <View style={styles.reportSection}>
              <Text style={[styles.reportSectionTitle, { color: colors.text.primary }]}>📈 Detailed Statistics</Text>
              
              {/* Present */}
              <View style={[styles.reportStatCard, { backgroundColor: colors.background.secondary, borderColor: colors.ui.border }]}>
                <View style={styles.reportStatHeader}>
                  <View style={[styles.reportStatIcon, { backgroundColor: colors.status.success.background }]}>
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.status.success.main} />
                  </View>
                  <View style={styles.reportStatInfo}>
                    <Text style={[styles.reportStatLabel, { color: colors.text.primary }]}>Present</Text>
                    <Text style={[styles.reportStatDescription, { color: colors.text.secondary }]}>Students who attended today</Text>
                  </View>
                </View>
                <Text style={[styles.reportStatNumber, { color: colors.status.success.main }]}>
                  {stats.present}
                </Text>
              </View>

              {/* Absent */}
              <View style={[styles.reportStatCard, { backgroundColor: colors.background.secondary, borderColor: colors.ui.border }]}>
                <View style={styles.reportStatHeader}>
                  <View style={[styles.reportStatIcon, { backgroundColor: colors.status.error.background }]}>
                    <IconSymbol name="xmark.circle.fill" size={24} color={colors.status.error.main} />
                  </View>
                  <View style={styles.reportStatInfo}>
                    <Text style={[styles.reportStatLabel, { color: colors.text.primary }]}>Absent</Text>
                    <Text style={[styles.reportStatDescription, { color: colors.text.secondary }]}>Students who missed today</Text>
                  </View>
                </View>
                <Text style={[styles.reportStatNumber, { color: colors.status.error.main }]}>
                  {stats.absent}
                </Text>
              </View>
            </View>

            {/* Class-wise Breakdown */}
            <View style={styles.reportSection}>
              <Text style={[styles.reportSectionTitle, { color: colors.text.primary }]}>📚 Class-wise Breakdown</Text>
              
              {[
                { class: 'Grade 10A', present: 30, total: 32, percentage: 94 },
                { class: 'Grade 10B', present: 26, total: 28, percentage: 93 },
                { class: 'Grade 11A', present: 28, total: 30, percentage: 93 },
                { class: 'Grade 11B', present: 24, total: 26, percentage: 92 },
                { class: 'Grade 12A', present: 22, total: 24, percentage: 92 },
              ].map((item, index) => (
                <View key={index} style={[styles.classBreakdownCard, { backgroundColor: colors.background.secondary, borderColor: colors.ui.border }]}>
                  <View style={styles.classBreakdownHeader}>
                    <Text style={[styles.classBreakdownName, { color: colors.text.primary }]}>{item.class}</Text>
                    <Text style={[
                      styles.classBreakdownPercentage,
                      { color: item.percentage >= 90 ? colors.status.success.main : colors.status.warning.main }
                    ]}>
                      {item.percentage}%
                    </Text>
                  </View>
                  <View style={styles.classBreakdownStats}>
                    <Text style={[styles.classBreakdownText, { color: colors.text.secondary }]}>
                      Present: {item.present} / {item.total}
                    </Text>
                  </View>
                  <View style={[styles.classProgressBar, { backgroundColor: colors.ui.border }]}>
                    <View style={[styles.classProgressFill, { width: `${item.percentage}%`, backgroundColor: colors.primary.main }]} />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.reportCloseButton, { backgroundColor: colors.background.secondary, borderColor: colors.ui.border }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.reportCloseButtonText, { color: colors.text.primary }]}>Close Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  reportModal: {
    height: '90%',
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  reportHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reportTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  reportContent: {
    flex: 1,
  },
  reportSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  reportSectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  reportSummaryCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  reportSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportLabel: {
    fontSize: FontSizes.base,
    fontWeight: '500',
  },
  reportValue: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
  },
  reportStatCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  reportStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  reportStatIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportStatInfo: {
    gap: 2,
  },
  reportStatLabel: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
  },
  reportStatDescription: {
    fontSize: FontSizes.xs,
  },
  reportStatNumber: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
  },
  classBreakdownCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  classBreakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  classBreakdownName: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
  },
  classBreakdownPercentage: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
  },
  classBreakdownStats: {
    marginBottom: Spacing.sm,
  },
  classBreakdownText: {
    fontSize: FontSizes.sm,
  },
  classProgressBar: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  classProgressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  reportCloseButton: {
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    borderWidth: 1,
  },
  reportCloseButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
});
