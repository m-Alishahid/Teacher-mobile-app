/**
 * Dashboard Screen (Home Tab)
 * 
 * Main dashboard showing overview of teacher's activities
 * Layout:
 * 1. Header Section: Teacher Name + Notification Bell
 * 2. Quick Stats Row: 4 cards (Total Students, Today's Attendance, Pending Tasks, Upcoming Deadlines)
 * 3. Today's Schedule Card: Next Class details with Quick Attendance button
 * 4. Attendance Summary: Today's Present/Absent stats with visual representation
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors, BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardScreen() {
  // Mock data - replace with real data from API/state management
  const teacherName = 'Dr. Sarah Johnson';
  const totalStudents = 245;
  const todayAttendancePercent = 92;
  const pendingTasks = 12;
  const upcomingDeadlines = 3;
  
  const nextClass = {
    subject: 'Mathematics',
    grade: 'Grade 10A',
    time: '10:30 AM - 11:30 AM',
    room: 'Room 204',
    studentsCount: 32,
  };

  const todayAttendance = {
    present: 226,
    absent: 19,
    total: 245,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Good Morning! 👋</Text>
          <Text style={styles.headerName}>{teacherName}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <IconSymbol name="bell.fill" size={24} color={AppColors.primary.contrast} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>5</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. Quick Stats Row */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {/* Total Students */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: AppColors.primary.main + '20' }]}>
              <IconSymbol name="person.3.fill" size={24} color={AppColors.primary.main} />
            </View>
            <Text style={styles.statNumber}>{totalStudents}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>

          {/* Today's Attendance */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: AppColors.status.success.main + '20' }]}>
              <IconSymbol name="checkmark.circle.fill" size={24} color={AppColors.status.success.main} />
            </View>
            <Text style={styles.statNumber}>{todayAttendancePercent}%</Text>
            <Text style={styles.statLabel}>Today's Attendance</Text>
          </View>

          {/* Pending Tasks */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: AppColors.status.warning.main + '20' }]}>
              <IconSymbol name="doc.text.fill" size={24} color={AppColors.status.warning.main} />
            </View>
            <Text style={styles.statNumber}>{pendingTasks}</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>

          {/* Upcoming Deadlines */}
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: AppColors.status.error.main + '20' }]}>
              <IconSymbol name="clock.fill" size={24} color={AppColors.status.error.main} />
            </View>
            <Text style={styles.statNumber}>{upcomingDeadlines}</Text>
            <Text style={styles.statLabel}>Upcoming Deadlines</Text>
          </View>
        </View>
      </View>

      {/* 3. Today's Schedule Card - Next Class */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Class</Text>
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleHeaderLeft}>
              <Text style={styles.scheduleSubject}>{nextClass.subject}</Text>
              <Text style={styles.scheduleGrade}>{nextClass.grade}</Text>
            </View>
            <View style={styles.scheduleTimeContainer}>
              <IconSymbol name="clock" size={16} color={AppColors.text.secondary} />
              <Text style={styles.scheduleTime}>{nextClass.time}</Text>
            </View>
          </View>

          <View style={styles.scheduleDivider} />

          <View style={styles.scheduleDetails}>
            <View style={styles.scheduleDetailRow}>
              <IconSymbol name="location.fill" size={18} color={AppColors.primary.main} />
              <Text style={styles.scheduleDetailText}>{nextClass.room}</Text>
            </View>
            <View style={styles.scheduleDetailRow}>
              <IconSymbol name="person.2.fill" size={18} color={AppColors.primary.main} />
              <Text style={styles.scheduleDetailText}>{nextClass.studentsCount} Students</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.quickAttendanceButton}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={AppColors.primary.contrast} />
            <Text style={styles.quickAttendanceButtonText}>Quick Attendance</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Attendance Summary */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Today's Attendance Summary</Text>
        <View style={styles.attendanceCard}>
          {/* Progress Bar */}
          <View style={styles.attendanceProgressContainer}>
            <View style={styles.attendanceProgressBackground}>
              <View 
                style={[
                  styles.attendanceProgressFill, 
                  { width: `${(todayAttendance.present / todayAttendance.total) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.attendanceProgressText}>
              {Math.round((todayAttendance.present / todayAttendance.total) * 100)}% Present
            </Text>
          </View>

          {/* Stats Row */}
          <View style={styles.attendanceStatsRow}>
            {/* Present */}
            <View style={styles.attendanceStatItem}>
              <View style={styles.attendanceStatHeader}>
                <View style={[styles.attendanceStatDot, { backgroundColor: AppColors.status.success.main }]} />
                <Text style={styles.attendanceStatLabel}>Present</Text>
              </View>
              <Text style={[styles.attendanceStatNumber, { color: AppColors.status.success.main }]}>
                {todayAttendance.present}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.attendanceStatDivider} />

            {/* Absent */}
            <View style={styles.attendanceStatItem}>
              <View style={styles.attendanceStatHeader}>
                <View style={[styles.attendanceStatDot, { backgroundColor: AppColors.status.error.main }]} />
                <Text style={styles.attendanceStatLabel}>Absent</Text>
              </View>
              <Text style={[styles.attendanceStatNumber, { color: AppColors.status.error.main }]}>
                {todayAttendance.absent}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.attendanceStatDivider} />

            {/* Total */}
            <View style={styles.attendanceStatItem}>
              <View style={styles.attendanceStatHeader}>
                <View style={[styles.attendanceStatDot, { backgroundColor: AppColors.primary.main }]} />
                <Text style={styles.attendanceStatLabel}>Total</Text>
              </View>
              <Text style={[styles.attendanceStatNumber, { color: AppColors.primary.main }]}>
                {todayAttendance.total}
              </Text>
            </View>
          </View>

          {/* View Details Button */}
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsButtonText}>View Detailed Report</Text>
            <IconSymbol name="chevron.right" size={16} color={AppColors.primary.main} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Header Section
  header: {
    backgroundColor: AppColors.primary.main,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Shadow
    shadowColor: AppColors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: FontSizes.base,
    color: AppColors.primary.contrast,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  headerName: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: AppColors.primary.contrast,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: AppColors.status.error.main,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: AppColors.text.inverse,
  },

  // Section
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  lastSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: AppColors.primary.main,
    marginBottom: Spacing.md,
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: AppColors.ui.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    // Shadow
    shadowColor: AppColors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    color: AppColors.text.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Schedule Card
  scheduleCard: {
    backgroundColor: AppColors.ui.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    // Shadow
    shadowColor: AppColors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleHeaderLeft: {
    flex: 1,
  },
  scheduleSubject: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: AppColors.text.primary,
    marginBottom: Spacing.xs,
  },
  scheduleGrade: {
    fontSize: FontSizes.base,
    color: AppColors.text.secondary,
    fontWeight: '500',
  },
  scheduleTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  scheduleTime: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    fontWeight: '600',
  },
  scheduleDivider: {
    height: 1,
    backgroundColor: AppColors.ui.divider,
    marginVertical: Spacing.md,
  },
  scheduleDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  scheduleDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scheduleDetailText: {
    fontSize: FontSizes.base,
    color: AppColors.text.primary,
    fontWeight: '500',
  },
  quickAttendanceButton: {
    backgroundColor: AppColors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    // Shadow
    shadowColor: AppColors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAttendanceButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },

  // Attendance Summary Card
  attendanceCard: {
    backgroundColor: AppColors.ui.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    // Shadow
    shadowColor: AppColors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  attendanceProgressContainer: {
    marginBottom: Spacing.lg,
  },
  attendanceProgressBackground: {
    height: 12,
    backgroundColor: AppColors.background.secondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  attendanceProgressFill: {
    height: '100%',
    backgroundColor: AppColors.status.success.main,
    borderRadius: BorderRadius.full,
  },
  attendanceProgressText: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  attendanceStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  attendanceStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  attendanceStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  attendanceStatDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  attendanceStatLabel: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    fontWeight: '500',
  },
  attendanceStatNumber: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
  },
  attendanceStatDivider: {
    width: 1,
    backgroundColor: AppColors.ui.divider,
    marginHorizontal: Spacing.sm,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  viewDetailsButtonText: {
    fontSize: FontSizes.base,
    color: AppColors.primary.main,
    fontWeight: '600',
  },
});
