/**
 * Attendance Screen
 * 
 * Quick attendance marking for classes
 */

import { AppColors, BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | null;
}

export default function AttendanceScreen() {
  const [selectedClass, setSelectedClass] = useState('Grade 10A');
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Ahmed Ali', rollNumber: '001', status: null },
    { id: 2, name: 'Fatima Khan', rollNumber: '002', status: null },
    { id: 3, name: 'Hassan Ahmed', rollNumber: '003', status: null },
    { id: 4, name: 'Ayesha Malik', rollNumber: '004', status: null },
    { id: 5, name: 'Usman Tariq', rollNumber: '005', status: null },
    { id: 6, name: 'Zainab Hassan', rollNumber: '006', status: null },
    { id: 7, name: 'Ali Raza', rollNumber: '007', status: null },
    { id: 8, name: 'Maryam Siddiqui', rollNumber: '008', status: null },
  ]);

  const markAttendance = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const submitAttendance = () => {
    const unmarked = students.filter(s => s.status === null).length;
    
    if (unmarked > 0) {
      Alert.alert(
        'Incomplete Attendance',
        `${unmarked} student(s) not marked. Continue anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: () => {
              Alert.alert('Success', 'Attendance submitted successfully!');
            },
          },
        ]
      );
    } else {
      Alert.alert('Success', 'Attendance submitted successfully!');
    }
  };

  const getStatusCounts = () => {
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const late = students.filter(s => s.status === 'late').length;
    return { present, absent, late };
  };

  const counts = getStatusCounts();

  return (
    <View style={styles.container}>
      {/* Class Selector */}
      <View style={styles.classSelector}>
        <Text style={styles.classLabel}>Selected Class:</Text>
        <TouchableOpacity style={styles.classButton}>
          <Text style={styles.classButtonText}>{selectedClass}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: AppColors.status.success.background }]}>
          <Text style={[styles.statNumber, { color: AppColors.status.success.text }]}>
            {counts.present}
          </Text>
          <Text style={[styles.statLabel, { color: AppColors.status.success.text }]}>
            Present
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: AppColors.status.error.background }]}>
          <Text style={[styles.statNumber, { color: AppColors.status.error.text }]}>
            {counts.absent}
          </Text>
          <Text style={[styles.statLabel, { color: AppColors.status.error.text }]}>
            Absent
          </Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: AppColors.status.warning.background }]}>
          <Text style={[styles.statNumber, { color: AppColors.status.warning.text }]}>
            {counts.late}
          </Text>
          <Text style={[styles.statLabel, { color: AppColors.status.warning.text }]}>
            Late
          </Text>
        </View>
      </View>

      {/* Students List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.studentsContainer}>
          <Text style={styles.sectionTitle}>Mark Attendance</Text>
          
          {students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.rollNumber}>Roll No: {student.rollNumber}</Text>
              </View>

              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    styles.presentButton,
                    student.status === 'present' && styles.statusButtonActive,
                  ]}
                  onPress={() => markAttendance(student.id, 'present')}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      student.status === 'present' && styles.statusButtonTextActive,
                    ]}
                  >
                    ✓
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    styles.lateButton,
                    student.status === 'late' && styles.statusButtonActive,
                  ]}
                  onPress={() => markAttendance(student.id, 'late')}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      student.status === 'late' && styles.statusButtonTextActive,
                    ]}
                  >
                    ⏱
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    styles.absentButton,
                    student.status === 'absent' && styles.statusButtonActive,
                  ]}
                  onPress={() => markAttendance(student.id, 'absent')}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      student.status === 'absent' && styles.statusButtonTextActive,
                    ]}
                  >
                    ✗
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={submitAttendance}>
          <Text style={styles.submitButtonText}>Submit Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  classSelector: {
    backgroundColor: AppColors.background.secondary,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.ui.border,
  },
  classLabel: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
    marginBottom: Spacing.xs,
  },
  classButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.background.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  classButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.primary,
  },
  dropdownIcon: {
    fontSize: FontSizes.sm,
    color: AppColors.text.tertiary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  statBox: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  studentsContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: Spacing.md,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.background.secondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.primary,
    marginBottom: 2,
  },
  rollNumber: {
    fontSize: FontSizes.sm,
    color: AppColors.text.secondary,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  presentButton: {
    borderColor: AppColors.status.success.main,
    backgroundColor: AppColors.background.primary,
  },
  lateButton: {
    borderColor: AppColors.status.warning.main,
    backgroundColor: AppColors.background.primary,
  },
  absentButton: {
    borderColor: AppColors.status.error.main,
    backgroundColor: AppColors.background.primary,
  },
  statusButtonActive: {
    backgroundColor: 'transparent',
  },
  statusButtonText: {
    fontSize: 18,
    color: AppColors.text.tertiary,
  },
  statusButtonTextActive: {
    fontWeight: 'bold',
  },
  submitContainer: {
    padding: Spacing.md,
    backgroundColor: AppColors.background.primary,
    borderTopWidth: 1,
    borderTopColor: AppColors.ui.border,
  },
  submitButton: {
    backgroundColor: AppColors.primary.main,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },
});
