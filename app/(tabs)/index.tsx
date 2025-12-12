/**
 * Dashboard Screen (Home Tab)
 * 
 * Main dashboard showing overview of teacher's activities
 */

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
  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Good Morning! 👋</Text>
        <Text style={styles.teacherName}>Mr. Teacher</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Total Classes</Text>
        </View>
        <View style={[styles.statCard, styles.statCardSecondary]}>
          <Text style={styles.statNumber}>245</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
      </View>

      {/* Today's Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleTime}>
            <Text style={styles.timeText}>9:00 AM</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleClass}>Mathematics - Grade 10A</Text>
            <Text style={styles.scheduleRoom}>Room 204</Text>
          </View>
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.scheduleTime}>
            <Text style={styles.timeText}>11:00 AM</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleClass}>Physics - Grade 11B</Text>
            <Text style={styles.scheduleRoom}>Room 305</Text>
          </View>
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.scheduleTime}>
            <Text style={styles.timeText}>2:00 PM</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleClass}>Chemistry - Grade 12A</Text>
            <Text style={styles.scheduleRoom}>Lab 101</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>✓</Text>
            <Text style={styles.quickActionText}>Mark Attendance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📝</Text>
            <Text style={styles.quickActionText}>Add Assignment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>View Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📢</Text>
            <Text style={styles.quickActionText}>Send Notice</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: AppColors.status.success.main }]} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Attendance marked for Grade 10A</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: AppColors.status.info.main }]} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Assignment posted for Grade 11B</Text>
            <Text style={styles.activityTime}>5 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: AppColors.status.warning.main }]} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>Exam schedule updated</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
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
  welcomeSection: {
    backgroundColor: AppColors.primary.main,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  greeting: {
    fontSize: FontSizes.lg,
    color: AppColors.primary.contrast,
    marginBottom: Spacing.xs,
  },
  teacherName: {
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    color: AppColors.primary.contrast,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  statCardPrimary: {
    backgroundColor: AppColors.primary.main,
  },
  statCardSecondary: {
    backgroundColor: AppColors.secondary.main,
  },
  statNumber: {
    fontSize: FontSizes['4xl'],
    fontWeight: 'bold',
    color: AppColors.text.inverse,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: AppColors.text.inverse,
    fontWeight: '500',
  },
  section: {
    padding: Spacing.md,
  },
  lastSection: {
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: Spacing.md,
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: AppColors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary.main,
  },
  scheduleTime: {
    marginRight: Spacing.md,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.primary.main,
  },
  scheduleDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  scheduleClass: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  scheduleRoom: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickActionButton: {
    width: '47%',
    backgroundColor: AppColors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  quickActionText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.text.primary,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    marginTop: 4,
    marginRight: Spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: FontSizes.base,
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: FontSizes.xs,
    color: AppColors.text.tertiary,
  },
});
