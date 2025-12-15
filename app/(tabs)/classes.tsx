/**
 * My Classes Screen
 *
 * Optimized with:
 * - Beautiful class details modal
 * - Functional take attendance with UI modal
 * - Smooth animations
 * - Filter functionality
 * - Optimized code
 */

import { AssignmentFormModal } from "@/components/classes/AssignmentFormModal";
import { AttendanceModal } from "@/components/classes/AttendanceModal";
import { ClassCard } from "@/components/classes/ClassCard";
import { ClassDetailsModal } from "@/components/classes/ClassDetailsModal";
import { FilterModal } from "@/components/common/FilterModal";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppColors, BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { allClasses, generateStudents, getGrades, getSubjects } from "@/data";
import { ClassItem, Student } from "@/types/classes";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ClassesScreen() {
  const { colors, isDark } = useTheme();
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [showSubjectFilter, setShowSubjectFilter] = useState(false);
  const [showGradeFilter, setShowGradeFilter] = useState(false);
  const [showClassDetails, setShowClassDetails] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  const [students, setStudents] = useState<Student[]>([]);

  const subjects = getSubjects();
  const grades = getGrades();

  const filteredClasses = allClasses.filter((classItem) => {
    const matchesSubject =
      selectedSubject === "All" || classItem.subject === selectedSubject;
    const matchesGrade =
      selectedGrade === "All" || classItem.grade === selectedGrade;
    return matchesSubject && matchesGrade;
  });

  const handleViewClass = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setShowClassDetails(true);
  };

  const handleCloseDetails = () => {
    setShowClassDetails(false);
    setSelectedClass(null);
  };

  const handleTakeAttendance = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setStudents(generateStudents(classItem.totalStudents));
    setShowAttendanceModal(true);
  };

  const markAttendance = (
    studentId: string,
    status: "present" | "late" | "absent"
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status: "present" as const }))
    );
  };

  const submitAttendance = () => {
    const unmarked = students.filter((s) => s.status === null).length;

    if (unmarked > 0) {
      Alert.alert(
        "Incomplete Attendance",
        `${unmarked} student(s) not marked. Continue anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Submit",
            onPress: () => {
              setShowAttendanceModal(false);
              Alert.alert(
                "✅ Success",
                `Attendance submitted for ${selectedClass?.className}!`
              );
            },
          },
        ]
      );
    } else {
      setShowAttendanceModal(false);
      Alert.alert(
        "✅ Success",
        `Attendance submitted for ${selectedClass?.className}!`
      );
    }
  };

  const handleCreateAssignment = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setShowAssignmentForm(true);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Filter Section */}
      <View
        style={[
          styles.filterSection,
          {
            backgroundColor: colors.background.secondary,
            borderBottomColor: colors.ui.border,
          },
        ]}
      >
        <Text style={[styles.filterTitle, { color: colors.text.secondary }]}>
          Filters
        </Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.ui.card,
                borderColor: colors.ui.border,
              },
            ]}
            onPress={() => setShowSubjectFilter(true)}
          >
            <IconSymbol
              name="book.fill"
              size={16}
              color={colors.text.secondary}
            />
            <Text
              style={[styles.filterButtonText, { color: colors.text.primary }]}
            >
              {selectedSubject === "All" ? "Subject" : selectedSubject}
            </Text>
            <IconSymbol
              name="chevron.down"
              size={14}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: colors.ui.card,
                borderColor: colors.ui.border,
              },
            ]}
            onPress={() => setShowGradeFilter(true)}
          >
            <IconSymbol
              name="graduationcap.fill"
              size={16}
              color={colors.text.secondary}
            />
            <Text
              style={[styles.filterButtonText, { color: colors.text.primary }]}
            >
              {selectedGrade === "All" ? "Grade" : `Grade ${selectedGrade}`}
            </Text>
            <IconSymbol
              name="chevron.down"
              size={14}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          {(selectedSubject !== "All" || selectedGrade !== "All") && (
            <TouchableOpacity
              style={[
                styles.clearFilterButton,
                { backgroundColor: colors.status.error.background },
              ]}
              onPress={() => {
                setSelectedSubject("All");
                setSelectedGrade("All");
              }}
            >
              <IconSymbol
                name="xmark.circle.fill"
                size={18}
                color={colors.status.error.main}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Classes Count */}
      <View style={styles.countSection}>
        <Text style={[styles.countText, { color: colors.text.primary }]}>
          {filteredClasses.length}{" "}
          {filteredClasses.length === 1 ? "Class" : "Classes"}
        </Text>
      </View>

      {/* Classes List */}
      <FlatList
        data={filteredClasses}
        renderItem={({ item }) => (
          <ClassCard
            item={item}
            onView={handleViewClass}
            onTakeAttendance={handleTakeAttendance}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol
              name="tray.fill"
              size={64}
              color={colors.text.tertiary}
            />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No classes found
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.text.tertiary }]}
            >
              Try adjusting your filters
            </Text>
          </View>
        }
      />

      {/* Modals */}
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

      <ClassDetailsModal
        visible={showClassDetails}
        onClose={handleCloseDetails}
        selectedClass={selectedClass}
        onTakeAttendance={handleTakeAttendance}
      />
      <AttendanceModal
        visible={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        selectedClass={selectedClass}
        students={students}
        onMarkAllPresent={markAllPresent}
        onMarkAttendance={markAttendance}
        onSubmit={submitAttendance}
      />

      <AssignmentFormModal
        visible={showAssignmentForm}
        onClose={() => setShowAssignmentForm(false)}
        selectedClass={selectedClass}
      />

      {/* Floating Action Button for Create Assignment */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary.main }]}
        onPress={() => {
          if (!selectedClass && filteredClasses.length > 0) {
            // If no class is selected, show a picker
            Alert.alert(
              "📚 Select Class",
              "Choose a class to create assignment for:",
              [
                ...filteredClasses.map((cls) => ({
                  text: cls.className,
                  onPress: () => {
                    setSelectedClass(cls);
                    setShowAssignmentForm(true);
                  },
                })),
                { text: "Cancel", style: "cancel" as const },
              ]
            );
          } else if (selectedClass) {
            setShowAssignmentForm(true);
          } else {
            Alert.alert("No Classes", "Please add classes first");
          }
        }}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={28} color={colors.primary.contrast} />
      </TouchableOpacity>
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
    fontWeight: "600",
    color: AppColors.text.secondary,
    marginBottom: Spacing.sm,
  },
  filterButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "500",
  },
  clearFilterButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "600",
    color: AppColors.text.primary,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: AppColors.text.secondary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSizes.base,
    color: AppColors.text.tertiary,
    marginTop: Spacing.xs,
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: Spacing["2xl"],
    right: Spacing.lg,
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
