import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { students } from "@/data";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function StudentsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = students.filter(
      (student: (typeof students)[0]) =>
        student.name.toLowerCase().includes(text.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleStudentPress = (studentId: string) => {
    router.push({
      pathname: "/student-details",
      params: { id: studentId },
    });
  };

  const renderStudentItem = ({
    item,
    index,
  }: {
    item: (typeof students)[0];
    index: number;
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleStudentPress(item.id)}
        style={[
          styles.studentCard,
          {
            backgroundColor: colors.ui.card,
            borderColor: colors.ui.border,
            shadowColor: colors.ui.shadow,
          },
        ]}
      >
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primary.main + "15" },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.primary.main }]}>
              {item.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={[styles.studentName, { color: colors.text.primary }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.studentRoll, { color: colors.text.secondary }]}
            >
              Roll: {item.rollNumber}
            </Text>
          </View>
        </View>

        <View style={styles.cardRight}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.attendance === "Present"
                    ? colors.status.success.background
                    : item.attendance === "Absent"
                    ? colors.status.error.background
                    : colors.status.warning.background,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.attendance === "Present"
                      ? colors.status.success.text
                      : item.attendance === "Absent"
                      ? colors.status.error.text
                      : colors.status.warning.text,
                },
              ]}
            >
              {item.attendance}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.tertiary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background.primary,
            borderBottomColor: colors.ui.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Students
        </Text>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <Ionicons name="filter" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.ui.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.text.tertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Search students..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.text.tertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={renderStudentItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={64}
              color={colors.text.disabled}
            />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No students found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  searchContainer: {
    padding: Spacing.lg,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    height: 50,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.base,
    height: "100%",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["3xl"],
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  studentName: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginBottom: 4,
  },
  studentRoll: {
    fontSize: FontSizes.sm,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.base,
    fontWeight: "500",
  },
});
