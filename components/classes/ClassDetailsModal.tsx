import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { ClassItem } from '@/types/classes';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';
import { AssignmentFormModal } from './AssignmentFormModal';

interface ClassDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedClass: ClassItem | null;
  onTakeAttendance: (item: ClassItem) => void;
}

export function ClassDetailsModal({
  visible,
  onClose,
  selectedClass,
  onTakeAttendance,
}: ClassDetailsModalProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!selectedClass) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none" // Controlled by Animated.View
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.ui.overlay }]}>
        <Animated.View style={[styles.detailsModal, { opacity: fadeAnim, backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={[styles.detailsHeader, { backgroundColor: colors.background.secondary, borderBottomColor: colors.ui.border }]}>
            <View style={styles.detailsHeaderLeft}>
              <IconSymbol name="book.fill" size={28} color={colors.primary.main} />
              <View style={styles.detailsHeaderText}>
                <Text style={[styles.detailsTitle, { color: colors.text.primary }]}>{selectedClass.className}</Text>
                <Text style={[styles.detailsSubtitle, { color: colors.text.secondary }]}>{selectedClass.subject}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="xmark" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false}>
            {/* Quick Stats */}
            <View style={[styles.detailsSection, { borderBottomColor: colors.ui.divider }]}>
              <Text style={[styles.detailsSectionTitle, { color: colors.text.primary }]}>📊 Quick Stats</Text>
              <View style={styles.detailsStatsGrid}>
                <View style={[styles.detailsStatCard, { backgroundColor: colors.background.secondary }]}>
                  <IconSymbol name="person.2.fill" size={24} color={colors.primary.main} />
                  <Text style={[styles.detailsStatNumber, { color: colors.text.primary }]}>{selectedClass.totalStudents}</Text>
                  <Text style={[styles.detailsStatLabel, { color: colors.text.secondary }]}>Students</Text>
                </View>
                <View style={[styles.detailsStatCard, { backgroundColor: colors.background.secondary }]}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.status.success.main} />
                  <Text style={[styles.detailsStatNumber, { color: colors.text.primary }]}>{selectedClass.averageAttendance}%</Text>
                  <Text style={[styles.detailsStatLabel, { color: colors.text.secondary }]}>Attendance</Text>
                </View>
                <View style={[styles.detailsStatCard, { backgroundColor: colors.background.secondary }]}>
                  <IconSymbol name="doc.text.fill" size={24} color={colors.status.warning.main} />
                  <Text style={[styles.detailsStatNumber, { color: colors.text.primary }]}>{selectedClass.pendingAssignments}</Text>
                  <Text style={[styles.detailsStatLabel, { color: colors.text.secondary }]}>Pending</Text>
                </View>
              </View>
            </View>

            {/* Class Information */}
            <View style={[styles.detailsSection, { borderBottomColor: colors.ui.divider }]}>
              <Text style={[styles.detailsSectionTitle, { color: colors.text.primary }]}>📚 Class Information</Text>
              <View style={[styles.detailsInfoCard, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.detailsInfoRow}>
                  <IconSymbol name="location.fill" size={18} color={colors.primary.main} />
                  <Text style={[styles.detailsInfoLabel, { color: colors.text.secondary }]}>Room:</Text>
                  <Text style={[styles.detailsInfoValue, { color: colors.text.primary }]}>{selectedClass.room}</Text>
                </View>
                <View style={styles.detailsInfoRow}>
                  <IconSymbol name="clock.fill" size={18} color={colors.primary.main} />
                  <Text style={[styles.detailsInfoLabel, { color: colors.text.secondary }]}>Schedule:</Text>
                  <Text style={[styles.detailsInfoValue, { color: colors.text.primary }]}>{selectedClass.schedule}</Text>
                </View>
                <View style={styles.detailsInfoRow}>
                  <IconSymbol name="calendar" size={18} color={colors.primary.main} />
                  <Text style={[styles.detailsInfoLabel, { color: colors.text.secondary }]}>Next Class:</Text>
                  <Text style={[styles.detailsInfoValue, { color: colors.text.primary }]}>
                    {selectedClass.nextClassDay} at {selectedClass.nextClassTime}
                  </Text>
                </View>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={[styles.detailsSection, { borderBottomColor: colors.ui.divider }]}>
              <Text style={[styles.detailsSectionTitle, { color: colors.text.primary }]}>📈 Recent Activity</Text>
              <View style={styles.activityCard}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: colors.status.success.main }]} />
                  <Text style={[styles.activityText, { color: colors.text.primary }]}>
                    Attendance marked for {selectedClass.nextClassDay === 'Today' ? 'yesterday' : 'last class'}
                  </Text>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: colors.status.info.main }]} />
                  <Text style={[styles.activityText, { color: colors.text.primary }]}>
                    {selectedClass.recentTests} tests conducted this month
                  </Text>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.activityDot, { backgroundColor: colors.status.warning.main }]} />
                  <Text style={[styles.activityText, { color: colors.text.primary }]}>
                    {selectedClass.pendingAssignments} assignments pending review
                  </Text>
                </View>
              </View>
            </View>

            {/* Performance Overview */}
            <View style={[styles.detailsSection, { borderBottomColor: colors.ui.divider }]}>
              <Text style={[styles.detailsSectionTitle, { color: colors.text.primary }]}>🎯 Performance Overview</Text>
              <View style={[styles.performanceCard, { backgroundColor: colors.background.secondary }]}>
                <View style={styles.performanceRow}>
                  <Text style={[styles.performanceLabel, { color: colors.text.secondary }]}>Average Attendance</Text>
                  <View style={styles.performanceBarContainer}>
                    <View style={[styles.performanceBarBackground, { backgroundColor: colors.ui.divider }]}>
                      <View 
                        style={[
                          styles.performanceBarFill, 
                          { 
                            width: `${selectedClass.averageAttendance}%`,
                            backgroundColor: 
                              selectedClass.averageAttendance >= 90 ? colors.status.success.main :
                              selectedClass.averageAttendance >= 75 ? colors.status.warning.main :
                              colors.status.error.main
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.performanceValue, { color: colors.text.primary }]}>{selectedClass.averageAttendance}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={[styles.detailsSection, { borderBottomColor: colors.ui.divider }]}>
              <Text style={[styles.detailsSectionTitle, { color: colors.text.primary }]}>⚡ Quick Actions</Text>
              <TouchableOpacity
                style={[styles.detailsActionButton, { backgroundColor: colors.background.secondary }]}
                onPress={() => {
                  onClose();
                  setTimeout(() => onTakeAttendance(selectedClass), 300);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.detailsActionIcon, { backgroundColor: colors.primary.main }]}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary.contrast} />
                </View>
                <View style={styles.detailsActionText}>
                  <Text style={[styles.detailsActionTitle, { color: colors.text.primary }]}>Take Attendance</Text>
                  <Text style={[styles.detailsActionSubtitle, { color: colors.text.secondary }]}>Mark attendance for this class</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.detailsActionButton, { backgroundColor: colors.background.secondary }]}
                onPress={() => {
                  Alert.alert('View Students', `Showing ${selectedClass.totalStudents} students from ${selectedClass.className}`);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.detailsActionIcon, { backgroundColor: colors.status.info.main }]}>
                  <IconSymbol name="person.3.fill" size={24} color={colors.primary.contrast} />
                </View>
                <View style={styles.detailsActionText}>
                  <Text style={[styles.detailsActionTitle, { color: colors.text.primary }]}>View Students</Text>
                  <Text style={[styles.detailsActionSubtitle, { color: colors.text.secondary }]}>See all {selectedClass.totalStudents} students</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.detailsActionButton, { backgroundColor: colors.background.secondary }]}
                onPress={() => {
                  setShowAssignmentForm(true);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.detailsActionIcon, { backgroundColor: colors.status.warning.main }]}>
                  <IconSymbol name="doc.text.fill" size={24} color={colors.primary.contrast} />
                </View>
                <View style={styles.detailsActionText}>
                  <Text style={[styles.detailsActionTitle, { color: colors.text.primary }]}>Create Assignment</Text>
                  <Text style={[styles.detailsActionSubtitle, { color: colors.text.secondary }]}>Add new assignment for class</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.detailsCloseButton, { backgroundColor: colors.primary.main }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.detailsCloseButtonText, { color: colors.primary.contrast }]}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Assignment Form Modal */}
      <AssignmentFormModal
        visible={showAssignmentForm}
        onClose={() => setShowAssignmentForm(false)}
        selectedClass={selectedClass}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailsModal: {
    height: '92%',
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  detailsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailsHeaderText: {
    marginLeft: Spacing.xs,
  },
  detailsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  detailsSubtitle: {
    fontSize: FontSizes.sm,
  },
  detailsContent: {
    flex: 1,
  },
  detailsSection: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  detailsSectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  detailsStatsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  detailsStatCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsStatNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  detailsStatLabel: {
    fontSize: FontSizes.xs,
  },
  detailsInfoCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  detailsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailsInfoLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    width: 80,
  },
  detailsInfoValue: {
    fontSize: FontSizes.sm,
    flex: 1,
  },
  activityCard: {
    paddingLeft: Spacing.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginTop: 6,
  },
  activityText: {
    fontSize: FontSizes.sm,
    flex: 1,
    lineHeight: 20,
  },
  performanceCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  performanceRow: {
    gap: Spacing.sm,
  },
  performanceLabel: {
    fontSize: FontSizes.sm,
    marginBottom: 4,
  },
  performanceBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  performanceBarBackground: {
    flex: 1,
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  performanceBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  performanceValue: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  detailsActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  detailsActionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  detailsActionText: {
    flex: 1,
  },
  detailsActionTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailsActionSubtitle: {
    fontSize: FontSizes.xs,
  },
  detailsCloseButton: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  detailsCloseButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
});
