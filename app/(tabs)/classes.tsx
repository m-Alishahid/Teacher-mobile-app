/**
 * My Classes Screen
 * 
 * Display all classes assigned to the teacher with filtering options
 * Features:
 * - List of class cards with details
 * - Filter by Subject and Grade Level
 * - Action buttons for View and Take Attendance
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors, BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ClassItem {
  id: string;
  className: string;
  grade: string;
  section: string;
  subject: string;
  totalStudents: number;
  nextClassTime: string;
  nextClassDay: string;
  room: string;
}

export default function ClassesScreen() {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [showSubjectFilter, setShowSubjectFilter] = useState(false);
  const [showGradeFilter, setShowGradeFilter] = useState(false);

  // Mock data - replace with real data from API/state management
  const allClasses: ClassItem[] = [
    {
      id: '1',
      className: 'Grade 10 - Section A',
      grade: '10',
      section: 'A',
      subject: 'Mathematics',
      totalStudents: 32,
      nextClassTime: '9:00 AM',
      nextClassDay: 'Tomorrow',
      room: 'Room 204',
    },
    {
      id: '2',
      className: 'Grade 10 - Section B',
      grade: '10',
      section: 'B',
      subject: 'Mathematics',
      totalStudents: 28,
      nextClassTime: '10:30 AM',
      nextClassDay: 'Today',
      room: 'Room 204',
    },
    {
      id: '3',
      className: 'Grade 11 - Section A',
      grade: '11',
      section: 'A',
      subject: 'Physics',
      totalStudents: 30,
      nextClassTime: '11:00 AM',
      nextClassDay: 'Today',
      room: 'Lab 305',
    },
    {
      id: '4',
      className: 'Grade 11 - Section B',
      grade: '11',
      section: 'B',
      subject: 'Physics',
      totalStudents: 26,
      nextClassTime: '2:00 PM',
      nextClassDay: 'Tomorrow',
      room: 'Lab 305',
    },
    {
      id: '5',
      className: 'Grade 12 - Section A',
      grade: '12',
      section: 'A',
      subject: 'Chemistry',
      totalStudents: 24,
      nextClassTime: '1:00 PM',
      nextClassDay: 'Today',
      room: 'Lab 101',
    },
    {
      id: '6',
      className: 'Grade 12 - Section B',
      grade: '12',
      section: 'B',
      subject: 'Chemistry',
      totalStudents: 22,
      nextClassTime: '3:00 PM',
      nextClassDay: 'Tomorrow',
      room: 'Lab 101',
    },
    {
      id: '7',
      className: 'Grade 9 - Section A',
      grade: '9',
      section: 'A',
      subject: 'Science',
      totalStudents: 35,
      nextClassTime: '8:00 AM',
      nextClassDay: 'Today',
      room: 'Room 102',
    },
    {
      id: '8',
      className: 'Grade 9 - Section B',
      grade: '9',
      section: 'B',
      subject: 'Science',
      totalStudents: 33,
      nextClassTime: '9:30 AM',
      nextClassDay: 'Tomorrow',
      room: 'Room 102',
    },
  ];

  // Extract unique subjects and grades for filters
  const subjects = ['All', ...Array.from(new Set(allClasses.map(c => c.subject)))];
  const grades = ['All', ...Array.from(new Set(allClasses.map(c => c.grade))).sort()];

  // Filter classes based on selected filters
  const filteredClasses = allClasses.filter(classItem => {
    const matchesSubject = selectedSubject === 'All' || classItem.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'All' || classItem.grade === selectedGrade;
    return matchesSubject && matchesGrade;
  });

  const handleViewClass = (classItem: ClassItem) => {
    // Navigate to class details or show details
    console.log('View class:', classItem.className);
  };

  const handleTakeAttendance = (classItem: ClassItem) => {
    // Navigate to attendance screen
    console.log('Take attendance for:', classItem.className);
  };

  const renderClassCard = ({ item }: { item: ClassItem }) => (
    <View style={styles.classCard}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.className}>{item.className}</Text>
          <Text style={styles.subject}>{item.subject}</Text>
        </View>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeBadgeText}>Grade {item.grade}</Text>
        </View>
      </View>

      {/* Card Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="person.2.fill" size={18} color={AppColors.primary.main} />
          <Text style={styles.detailText}>{item.totalStudents} Students</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="clock.fill" size={18} color={AppColors.primary.main} />
          <Text style={styles.detailText}>
            {item.nextClassDay} at {item.nextClassTime}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="location.fill" size={18} color={AppColors.primary.main} />
          <Text style={styles.detailText}>{item.room}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleViewClass(item)}
          activeOpacity={0.7}
        >
          <IconSymbol name="eye.fill" size={18} color={AppColors.primary.main} />
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.attendanceButton]}
          onPress={() => handleTakeAttendance(item)}
          activeOpacity={0.7}
        >
          <IconSymbol name="checkmark.circle.fill" size={18} color={AppColors.primary.contrast} />
          <Text style={styles.attendanceButtonText}>Take Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const FilterModal = ({
    visible,
    onClose,
    title,
    options,
    selectedValue,
    onSelect,
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.modalScroll}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  selectedValue === option && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedValue === option && styles.modalOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {selectedValue === option && (
                  <IconSymbol name="checkmark" size={20} color={AppColors.primary.main} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filters</Text>
        <View style={styles.filterButtons}>
          {/* Subject Filter */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowSubjectFilter(true)}
          >
            <IconSymbol name="book.fill" size={16} color={AppColors.text.secondary} />
            <Text style={styles.filterButtonText}>
              {selectedSubject === 'All' ? 'Subject' : selectedSubject}
            </Text>
            <IconSymbol name="chevron.down" size={14} color={AppColors.text.secondary} />
          </TouchableOpacity>

          {/* Grade Filter */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowGradeFilter(true)}
          >
            <IconSymbol name="graduationcap.fill" size={16} color={AppColors.text.secondary} />
            <Text style={styles.filterButtonText}>
              {selectedGrade === 'All' ? 'Grade' : `Grade ${selectedGrade}`}
            </Text>
            <IconSymbol name="chevron.down" size={14} color={AppColors.text.secondary} />
          </TouchableOpacity>

          {/* Clear Filters */}
          {(selectedSubject !== 'All' || selectedGrade !== 'All') && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={() => {
                setSelectedSubject('All');
                setSelectedGrade('All');
              }}
            >
              <IconSymbol name="xmark.circle.fill" size={18} color={AppColors.status.error.main} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Classes Count */}
      <View style={styles.countSection}>
        <Text style={styles.countText}>
          {filteredClasses.length} {filteredClasses.length === 1 ? 'Class' : 'Classes'}
        </Text>
      </View>

      {/* Classes List */}
      <FlatList
        data={filteredClasses}
        renderItem={renderClassCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="tray.fill" size={64} color={AppColors.text.tertiary} />
            <Text style={styles.emptyText}>No classes found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />

      {/* Filter Modals */}
      <FilterModal
        visible={showSubjectFilter}
        onClose={() => setShowSubjectFilter(false)}
        title="Select Subject"
        options={subjects}
        selectedValue={selectedSubject}
        onSelect={setSelectedSubject}
      />

      <FilterModal
        visible={showGradeFilter}
        onClose={() => setShowGradeFilter(false)}
        title="Select Grade"
        options={grades}
        selectedValue={selectedGrade}
        onSelect={setSelectedGrade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },

  // Filter Section
  filterSection: {
    backgroundColor: AppColors.background.secondary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.ui.border,
  },
  filterTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.text.secondary,
    marginBottom: Spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.ui.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
    gap: Spacing.xs,
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    color: AppColors.text.primary,
    fontWeight: '500',
  },
  clearFilterButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.status.error.background,
    borderRadius: BorderRadius.full,
  },

  // Count Section
  countSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  countText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: AppColors.text.primary,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  // Class Card
  classCard: {
    backgroundColor: AppColors.ui.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
    // Shadow
    shadowColor: AppColors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  className: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: AppColors.text.primary,
    marginBottom: Spacing.xs,
  },
  subject: {
    fontSize: FontSizes.base,
    color: AppColors.text.secondary,
    fontWeight: '500',
  },
  gradeBadge: {
    backgroundColor: AppColors.primary.main,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  gradeBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },

  // Card Details
  cardDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: FontSizes.base,
    color: AppColors.text.primary,
    fontWeight: '500',
  },

  // Card Actions
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AppColors.ui.divider,
    paddingTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  viewButton: {
    backgroundColor: AppColors.background.secondary,
    borderWidth: 1,
    borderColor: AppColors.ui.border,
  },
  viewButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.primary.main,
  },
  attendanceButton: {
    backgroundColor: AppColors.primary.main,
    // Shadow
    shadowColor: AppColors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  attendanceButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: AppColors.primary.contrast,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: AppColors.text.secondary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSizes.base,
    color: AppColors.text.tertiary,
    marginTop: Spacing.xs,
  },

  // Filter Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: AppColors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: AppColors.ui.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: AppColors.text.primary,
    marginBottom: Spacing.md,
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  modalOptionSelected: {
    backgroundColor: AppColors.background.secondary,
  },
  modalOptionText: {
    fontSize: FontSizes.base,
    color: AppColors.text.primary,
    fontWeight: '500',
  },
  modalOptionTextSelected: {
    color: AppColors.primary.main,
    fontWeight: '600',
  },
});
