import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Data
const WEEK_DAYS = [
  { day: "Mon", date: "12" },
  { day: "Tue", date: "13" },
  { day: "Wed", date: "14" },
  { day: "Thu", date: "15" },
  { day: "Fri", date: "16" },
  { day: "Sat", date: "17" },
];

const SCHEDULE_DATA = [
  {
    id: "1",
    subject: "Mathematics",
    class: "Class 10-A",
    time: "08:30 AM - 09:30 AM",
    room: "Room 301",
    status: "completed",
    topic: "Quadratic Equations",
  },
  {
    id: "2",
    subject: "Physics",
    class: "Class 9-B",
    time: "09:45 AM - 10:45 AM",
    room: "Lab 2",
    status: "ongoing",
    topic: "Laws of Motion",
  },
  {
    id: "3",
    subject: "Break",
    class: "",
    time: "10:45 AM - 11:15 AM",
    room: "Staff Room",
    status: "upcoming",
    topic: "",
    isBreak: true,
  },
  {
    id: "4",
    subject: "Mathematics",
    class: "Class 8-C",
    time: "11:15 AM - 12:15 PM",
    room: "Room 204",
    status: "upcoming",
    topic: "Introduction to Algebra",
  },
  {
    id: "5",
    subject: "Physics",
    class: "Class 10-A",
    time: "01:00 PM - 02:00 PM",
    room: "Lab 1",
    status: "upcoming",
    topic: "Electromagnetism",
  },
];

export default function ScheduleScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("13"); // Mock today's stat

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            My Schedule
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.text.secondary }]}
          >
            Today, Dec 13
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.calendarButton,
            { backgroundColor: colors.primary.main + "10" },
          ]}
        >
          <IconSymbol name="calendar" size={20} color={colors.primary.main} />
        </TouchableOpacity>
      </View>

      {/* Week Strip */}
      <View style={styles.weekStrip}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekContent}
        >
          {WEEK_DAYS.map((item, index) => {
            const isSelected = item.date === selectedDate;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCard,
                  isSelected && { backgroundColor: colors.primary.main },
                  !isSelected && {
                    backgroundColor: colors.ui.card,
                    borderColor: colors.ui.border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isSelected
                        ? colors.primary.contrast
                        : colors.text.secondary,
                    },
                  ]}
                >
                  {item.day}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    {
                      color: isSelected
                        ? colors.primary.contrast
                        : colors.text.primary,
                    },
                  ]}
                >
                  {item.date}
                </Text>
                {isSelected && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Timeline */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.timelineContent}
      >
        <View style={styles.timelineContainer}>
          {SCHEDULE_DATA.map((item, index) => {
            const isLast = index === SCHEDULE_DATA.length - 1;

            if (item.isBreak) {
              return (
                <View key={item.id} style={styles.breakItem}>
                  <View style={styles.timeColumn}>
                    <Text
                      style={[
                        styles.timeText,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {item.time.split(" - ")[0]}
                    </Text>
                  </View>
                  <View style={styles.breakContent}>
                    <View
                      style={[
                        styles.breakLine,
                        { backgroundColor: colors.ui.border },
                      ]}
                    />
                    <View
                      style={[
                        styles.breakBadge,
                        { backgroundColor: colors.background.secondary },
                      ]}
                    >
                      <IconSymbol
                        name="cup.and.saucer.fill"
                        size={12}
                        color={colors.text.secondary}
                      />
                      <Text
                        style={[
                          styles.breakText,
                          { color: colors.text.secondary },
                        ]}
                      >
                        Break Time
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }

            return (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timeColumn}>
                  <Text
                    style={[styles.timeText, { color: colors.text.primary }]}
                  >
                    {item.time.split(" - ")[0]}
                  </Text>
                  <Text
                    style={[
                      styles.durationText,
                      { color: colors.text.tertiary },
                    ]}
                  >
                    60 min
                  </Text>
                </View>

                <View style={styles.timelineMarker}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          item.status === "ongoing"
                            ? colors.primary.main
                            : item.status === "completed"
                            ? colors.status.success.main
                            : colors.ui.border,
                        borderColor: colors.background.primary,
                      },
                    ]}
                  />
                  {!isLast && (
                    <View
                      style={[
                        styles.line,
                        { backgroundColor: colors.ui.border },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.cardContainer}>
                  <TouchableOpacity
                    style={[
                      styles.classCard,
                      {
                        backgroundColor: colors.ui.card,
                        borderColor:
                          item.status === "ongoing"
                            ? colors.primary.main
                            : colors.ui.border,
                        borderLeftColor:
                          item.status === "ongoing"
                            ? colors.primary.main
                            : item.status === "completed"
                            ? colors.status.success.main
                            : colors.primary.main, // Default color for upcoming
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardHeader}>
                      <Text
                        style={[
                          styles.subjectName,
                          { color: colors.text.primary },
                        ]}
                      >
                        {item.subject}
                      </Text>
                      {item.status === "ongoing" && (
                        <View
                          style={[
                            styles.liveBadge,
                            { backgroundColor: colors.primary.main },
                          ]}
                        >
                          <Text style={styles.liveText}>NOW</Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.topicText,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {item.topic}
                    </Text>

                    <View style={styles.cardFooter}>
                      <View style={styles.footerInfo}>
                        <IconSymbol
                          name="person.2.fill"
                          size={14}
                          color={colors.text.tertiary}
                        />
                        <Text
                          style={[
                            styles.footerText,
                            { color: colors.text.tertiary },
                          ]}
                        >
                          {item.class}
                        </Text>
                      </View>
                      <View style={styles.footerInfo}>
                        <IconSymbol
                          name="mappin.and.ellipse"
                          size={14}
                          color={colors.text.tertiary}
                        />
                        <Text
                          style={[
                            styles.footerText,
                            { color: colors.text.tertiary },
                          ]}
                        >
                          {item.room}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 4,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  weekStrip: {
    marginVertical: Spacing.md,
  },
  weekContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  dayCard: {
    width: 60,
    height: 80,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dayText: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
  },
  dateText: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFF",
    marginTop: 4,
  },
  timelineContent: {
    paddingBottom: Spacing["2xl"],
  },
  timelineContainer: {
    paddingHorizontal: Spacing.lg,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 120,
  },
  breakItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
  timeColumn: {
    width: 60,
    alignItems: "flex-end",
    paddingRight: Spacing.md,
    paddingTop: Spacing.sm,
  },
  timeText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  durationText: {
    fontSize: FontSizes.xs,
    marginTop: 4,
  },
  timelineMarker: {
    width: 20,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginTop: Spacing.sm + 2,
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -2,
  },
  cardContainer: {
    flex: 1,
    paddingLeft: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  classCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  subjectName: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  liveText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  topicText: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: FontSizes.xs,
    fontWeight: "500",
  },
  breakContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Spacing.md,
  },
  breakLine: {
    flex: 1,
    height: 1,
    marginRight: Spacing.md,
  },
  breakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  breakText: {
    fontSize: FontSizes.xs,
    fontWeight: "600",
  },
});
