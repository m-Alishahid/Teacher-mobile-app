/**
 * Classes Screen
 * 
 * Display all classes taught by the teacher
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

interface ClassCardProps {
  className: string;
  grade: string;
  subject: string;
  students: number;
  schedule: string;
  room: string;
}

const ClassCard: React.FC<ClassCardProps> = ({
  className,
  grade,
  subject,
  students,
  schedule,
  room,
}) => {
  return (
    <TouchableOpacity style={styles.classCard} activeOpacity={0.7}>
      <View style={styles.classHeader}>
        <View>
          <Text style={styles.className}>{className}</Text>
          <Text style={styles.subject}>{subject}</Text>
        </View>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeText}>{grade}</Text>
        </View>
      </View>

      <View style={styles.classDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>👥</Text>
          <Text style={styles.detailText}>{students} Students</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailText}>{schedule}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{room}</Text>
        </View>
      </View>

      <View style={styles.classActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function ClassesScreen() {
  const classes: ClassCardProps[] = [
    {
      className: 'Grade 10A',
      grade: '10A',
      subject: 'Mathematics',
      students: 32,
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 204',
    },
    {
      className: 'Grade 10B',
      grade: '10B',
      subject: 'Mathematics',
      students: 28,
      schedule: 'Tue, Thu - 10:00 AM',
      room: 'Room 204',
    },
    {
      className: 'Grade 11A',
      grade: '11A',
      subject: 'Physics',
      students: 30,
      schedule: 'Mon, Wed - 11:00 AM',
      room: 'Room 305',
    },
    {
      className: 'Grade 11B',
      grade: '11B',
      subject: 'Physics',
      students: 26,
      schedule: 'Tue, Thu, Fri - 11:00 AM',
      room: 'Room 305',
    },
    {
      className: 'Grade 12A',
      grade: '12A',
      subject: 'Chemistry',
      students: 24,
      schedule: 'Mon, Wed, Fri - 2:00 PM',
      room: 'Lab 101',
    },
    {
      className: 'Grade 12B',
      grade: '12B',
      subject: 'Chemistry',
      students: 22,
      schedule: 'Tue, Thu - 2:00 PM',
      room: 'Lab 101',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{classes.length}</Text>
          <Text style={styles.summaryLabel}>Total Classes</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {classes.reduce((sum, cls) => sum + cls.students, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Total Students</Text>
        </View>
      </View>

      {/* Classes List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.classesContainer}>
          <Text style={styles.sectionTitle}>My Classes</Text>
          {classes.map((classItem, index) => (
            <ClassCard key={index} {...classItem} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  summarySection: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: AppColors.background.secondary,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: AppColors.primary.main,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    color: AppColors.primary.contrast,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: AppColors.primary.contrast,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  classesContainer: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: Spacing.md,
  },
  classCard: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  className: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  subject: {
    fontSize: FontSizes.base,
    color: AppColors.text.secondary,
  },
  gradeBadge: {
    backgroundColor: AppColors.primary.main,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  gradeText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },
  classDetails: {
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  detailText: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  classActions: {
    borderTopWidth: 1,
    borderTopColor: AppColors.ui.divider,
    paddingTop: Spacing.sm,
  },
  actionButton: {
    backgroundColor: AppColors.primary.main,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },
});
