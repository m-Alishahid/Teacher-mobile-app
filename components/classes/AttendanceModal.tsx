// /**
//  * QR-Based Attendance Modal
//  *
//  * Features:
//  * - QR scan only (no manual marking)
//  * - Real-time progress tracking
//  * - Modern glassmorphic UI
//  * - Animated scan button
//  */

// import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
// import { useTheme } from "@/context/ThemeContext";
// import { ClassItem, Student } from "@/types/classes";
// import React, { useEffect, useState } from "react";
// import {
//   Animated,
//   FlatList,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import QRScanner from "../attendance/QRScanner";
// import { IconSymbol } from "../ui/icon-symbol";

// interface AttendanceModalProps {
//   visible: boolean;
//   onClose: () => void;
//   selectedClass: ClassItem | null;
//   students: Student[];
//   onMarkAllPresent: () => void;
//   onMarkAttendance: (
//     studentId: string,
//     status: "present" | "late" | "absent" | "scanned"
//   ) => void;
//   onSubmit: () => void;
// }

// export function AttendanceModal({
//   visible,
//   onClose,
//   selectedClass,
//   students,
//   onMarkAllPresent,
//   onMarkAttendance,
//   onSubmit,
// }: AttendanceModalProps) {
//   const { colors } = useTheme();
//   const [showQRScanner, setShowQRScanner] = useState(false);
//   const [pulseAnim] = useState(new Animated.Value(1));

//   if (!selectedClass) return null;

//   // Pulse animation for scan button
//   useEffect(() => {
//     if (visible) {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulseAnim, {
//             toValue: 1.1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseAnim, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     }
//   }, [visible]);

//   const getStatusCounts = () => {
//     const present = students.filter((s) => s.status === "present").length;
//     const unmarked = students.filter((s) => s.status === null).length;
//     return { present, unmarked };
//   };

//   const getInitials = (name: string) => {
//     const parts = name.split(" ");
//     if (parts.length >= 2) {
//       return (parts[0][0] + parts[1][0]).toUpperCase();
//     }
//     return name.substring(0, 2).toUpperCase();
//   };

//   const handleStudentScan = (studentId: string) => {
//     onMarkAttendance(studentId, "present");
//   };

//   const counts = getStatusCounts();
//   const completionPercent =
//     students.length > 0
//       ? Math.round((counts.present / students.length) * 100)
//       : 0;

//   return (
//     <>
//       <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//         <View
//           style={[
//             styles.attendanceContainer,
//             { backgroundColor: colors.background.primary },
//           ]}
//         >
//           {/* Header with Gradient */}
//           <View
//             style={[
//               styles.attendanceHeader,
//               { backgroundColor: colors.primary.main },
//             ]}
//           >
//             <TouchableOpacity
//               onPress={onClose}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               style={styles.backButton}
//             >
//               <IconSymbol
//                 name="chevron.left"
//                 size={24}
//                 color={colors.primary.contrast}
//               />
//             </TouchableOpacity>
//             <View style={styles.attendanceHeaderCenter}>
//               <Text
//                 style={[
//                   styles.attendanceHeaderTitle,
//                   { color: colors.primary.contrast },
//                 ]}
//               >
//                 QR Attendance
//               </Text>
//               <Text
//                 style={[
//                   styles.attendanceHeaderSubtitle,
//                   { color: colors.primary.contrast },
//                 ]}
//               >
//                 {selectedClass.className}
//               </Text>
//             </View>
//             <View style={{ width: 24 }} />
//           </View>

//           {/* Class Info Card */}
//           <View
//             style={[
//               styles.classInfoCard,
//               { backgroundColor: colors.background.secondary },
//             ]}
//           >
//             <View style={styles.classInfoRow}>
//               <IconSymbol
//                 name="book.fill"
//                 size={18}
//                 color={colors.primary.main}
//               />
//               <Text
//                 style={[styles.classInfoText, { color: colors.text.primary }]}
//               >
//                 {selectedClass.subject}
//               </Text>
//             </View>
//             <View style={styles.classInfoRow}>
//               <IconSymbol
//                 name="location.fill"
//                 size={18}
//                 color={colors.primary.main}
//               />
//               <Text
//                 style={[styles.classInfoText, { color: colors.text.primary }]}
//               >
//                 {selectedClass.room}
//               </Text>
//             </View>
//             <View style={styles.classInfoRow}>
//               <IconSymbol
//                 name="clock.fill"
//                 size={18}
//                 color={colors.primary.main}
//               />
//               <Text
//                 style={[styles.classInfoText, { color: colors.text.primary }]}
//               >
//                 {selectedClass.nextClassTime}
//               </Text>
//             </View>
//           </View>

//           {/* Progress Card */}
//           <View
//             style={[
//               styles.progressCard,
//               { backgroundColor: colors.background.secondary },
//             ]}
//           >
//             <View style={styles.progressHeader}>
//               <Text
//                 style={[styles.progressTitle, { color: colors.text.primary }]}
//               >
//                 Scan Progress
//               </Text>
//               <Text
//                 style={[styles.progressPercent, { color: colors.primary.main }]}
//               >
//                 {completionPercent}%
//               </Text>
//             </View>
//             <View
//               style={[
//                 styles.progressBarBg,
//                 { backgroundColor: colors.ui.border },
//               ]}
//             >
//               <Animated.View
//                 style={[
//                   styles.progressBarFill,
//                   {
//                     backgroundColor:
//                       completionPercent === 100
//                         ? colors.status.success.main
//                         : colors.primary.main,
//                     width: `${completionPercent}%`,
//                   },
//                 ]}
//               />
//             </View>
//             <View style={styles.progressStats}>
//               <View style={styles.progressStat}>
//                 <IconSymbol
//                   name="checkmark.circle.fill"
//                   size={20}
//                   color={colors.status.success.main}
//                 />
//                 <Text
//                   style={[
//                     styles.progressStatText,
//                     { color: colors.text.secondary },
//                   ]}
//                 >
//                   {counts.present} Scanned
//                 </Text>
//               </View>
//               <View style={styles.progressStat}>
//                 <IconSymbol
//                   name="clock.fill"
//                   size={20}
//                   color={colors.text.secondary}
//                 />
//                 <Text
//                   style={[
//                     styles.progressStatText,
//                     { color: colors.text.secondary },
//                   ]}
//                 >
//                   {counts.unmarked} Pending
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* QR Scan Button */}
//           <View style={styles.scanSection}>
//             <TouchableOpacity
//               onPress={() => setShowQRScanner(true)}
//               activeOpacity={0.8}
//             >
//               <Animated.View
//                 style={[
//                   styles.scanButton,
//                   {
//                     backgroundColor: colors.primary.main,
//                     transform: [{ scale: pulseAnim }],
//                   },
//                 ]}
//               >
//                 <View style={styles.scanButtonGradient}>
//                   <IconSymbol
//                     name="qrcode"
//                     size={40}
//                     color={colors.primary.contrast}
//                   />
//                   <Text
//                     style={[
//                       styles.scanButtonText,
//                       { color: colors.primary.contrast },
//                     ]}
//                   >
//                     Scan Student QR
//                   </Text>
//                   <Text
//                     style={[
//                       styles.scanButtonSubtext,
//                       { color: colors.primary.contrast },
//                     ]}
//                   >
//                     Tap to open scanner
//                   </Text>
//                 </View>
//               </Animated.View>
//             </TouchableOpacity>
//           </View>

//           {/* Student List */}
//           <View style={styles.listHeader}>
//             <Text style={[styles.listTitle, { color: colors.text.primary }]}>
//               Students ({students.length})
//             </Text>
//             <View
//               style={[
//                 styles.legend,
//                 { backgroundColor: colors.background.tertiary },
//               ]}
//             >
//               <View
//                 style={[
//                   styles.legendDot,
//                   { backgroundColor: colors.status.success.main },
//                 ]}
//               />
//               <Text
//                 style={[styles.legendText, { color: colors.text.secondary }]}
//               >
//                 Scanned
//               </Text>
//             </View>
//           </View>

//           <FlatList
//             data={students}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={styles.attendanceList}
//             renderItem={({ item }) => (
//               <View
//                 style={[
//                   styles.studentCard,
//                   {
//                     backgroundColor: colors.ui.card,
//                     borderColor:
//                       item.status === "present"
//                         ? colors.status.success.main
//                         : colors.ui.border,
//                     borderWidth: item.status === "present" ? 2 : 1,
//                   },
//                 ]}
//               >
//                 <View style={styles.studentInfo}>
//                   <View
//                     style={[
//                       styles.studentAvatar,
//                       {
//                         backgroundColor:
//                           item.status === "present"
//                             ? colors.status.success.main
//                             : colors.primary.main,
//                       },
//                     ]}
//                   >
//                     <Text
//                       style={[
//                         styles.avatarText,
//                         { color: colors.primary.contrast },
//                       ]}
//                     >
//                       {getInitials(item.name)}
//                     </Text>
//                   </View>
//                   <View style={styles.studentDetails}>
//                     <Text
//                       style={[
//                         styles.studentName,
//                         { color: colors.text.primary },
//                       ]}
//                     >
//                       {item.name}
//                     </Text>
//                     <Text
//                       style={[
//                         styles.studentRoll,
//                         { color: colors.text.secondary },
//                       ]}
//                     >
//                       Roll No: {item.rollNumber}
//                     </Text>
//                   </View>
//                 </View>

//                 {item.status === "present" ? (
//                   <View style={styles.scannedBadge}>
//                     <IconSymbol
//                       name="checkmark.seal.fill"
//                       size={28}
//                       color={colors.status.success.main}
//                     />
//                     <Text
//                       style={[
//                         styles.scannedText,
//                         { color: colors.status.success.main },
//                       ]}
//                     >
//                       ✓ Scanned
//                     </Text>
//                   </View>
//                 ) : (
//                   <View style={styles.pendingBadge}>
//                     <IconSymbol
//                       name="clock.fill"
//                       size={20}
//                       color={colors.text.secondary}
//                     />
//                   </View>
//                 )}
//               </View>
//             )}
//           />

//           {/* Submit Button */}
//           <View
//             style={[
//               styles.submitContainer,
//               {
//                 backgroundColor: colors.background.primary,
//                 borderTopColor: colors.ui.border,
//               },
//             ]}
//           >
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 { backgroundColor: colors.primary.main },
//               ]}
//               onPress={onSubmit}
//               activeOpacity={0.8}
//             >
//               <View style={styles.submitButtonGradient}>
//                 <IconSymbol
//                   name="checkmark.seal.fill"
//                   size={20}
//                   color={colors.primary.contrast}
//                 />
//                 <Text
//                   style={[
//                     styles.submitButtonText,
//                     { color: colors.primary.contrast },
//                   ]}
//                 >
//                   Submit Attendance
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* QR Scanner Modal */}
//       <QRScanner
//         visible={showQRScanner}
//         onClose={() => setShowQRScanner(false)}
//         onScan={handleStudentScan}
//         currentClassStudents={students}
//       />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   attendanceContainer: {
//     flex: 1,
//   },
//   attendanceHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: Spacing.lg,
//     paddingTop: Spacing.xl,
//     paddingBottom: Spacing.md,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   attendanceHeaderCenter: {
//     flex: 1,
//     alignItems: "center",
//   },
//   attendanceHeaderTitle: {
//     fontSize: FontSizes.xl,
//     fontWeight: "700",
//   },
//   attendanceHeaderSubtitle: {
//     fontSize: FontSizes.sm,
//     opacity: 0.9,
//     marginTop: 2,
//   },

//   // Class Info
//   classInfoCard: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     padding: Spacing.md,
//     marginHorizontal: Spacing.lg,
//     marginTop: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   classInfoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   classInfoText: {
//     fontSize: FontSizes.xs,
//     fontWeight: "600",
//   },

//   // Progress
//   progressCard: {
//     padding: Spacing.lg,
//     marginHorizontal: Spacing.lg,
//     marginTop: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   progressHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.sm,
//   },
//   progressTitle: {
//     fontSize: FontSizes.base,
//     fontWeight: "600",
//   },
//   progressPercent: {
//     fontSize: FontSizes["2xl"],
//     fontWeight: "700",
//   },
//   progressBarBg: {
//     height: 8,
//     borderRadius: BorderRadius.full,
//     overflow: "hidden",
//     marginBottom: Spacing.md,
//   },
//   progressBarFill: {
//     height: "100%",
//     borderRadius: BorderRadius.full,
//   },
//   progressStats: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   progressStat: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.xs,
//   },
//   progressStatText: {
//     fontSize: FontSizes.sm,
//     fontWeight: "500",
//   },

//   // Scan Button
//   scanSection: {
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: Spacing.md,
//   },
//   scanButton: {
//     borderRadius: BorderRadius.xl,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   scanButtonGradient: {
//     paddingVertical: Spacing.lg,
//     alignItems: "center",
//     gap: Spacing.xs,
//   },
//   scanButtonText: {
//     fontSize: FontSizes.lg,
//     fontWeight: "700",
//   },
//   scanButtonSubtext: {
//     fontSize: FontSizes.sm,
//     opacity: 0.8,
//   },

//   // List
//   listHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: Spacing.sm,
//     marginTop: Spacing.sm,
//   },
//   listTitle: {
//     fontSize: FontSizes.lg,
//     fontWeight: "700",
//   },
//   legend: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.xs,
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.md,
//   },
//   legendDot: {
//     width: 8,
//     height: 8,
//     borderRadius: BorderRadius.full,
//   },
//   legendText: {
//     fontSize: FontSizes.xs,
//     fontWeight: "500",
//   },

//   attendanceList: {
//     paddingHorizontal: Spacing.lg,
//     paddingTop: Spacing.xs,
//     paddingBottom: 100,
//   },
//   studentCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     marginBottom: Spacing.sm,
//   },
//   studentInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   studentAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: BorderRadius.full,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: Spacing.md,
//   },
//   avatarText: {
//     fontSize: FontSizes.base,
//     fontWeight: "700",
//   },
//   studentDetails: {
//     flex: 1,
//   },
//   studentName: {
//     fontSize: FontSizes.base,
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   studentRoll: {
//     fontSize: FontSizes.sm,
//   },
//   scannedBadge: {
//     alignItems: "center",
//     gap: 2,
//   },
//   scannedText: {
//     fontSize: FontSizes.xs,
//     fontWeight: "600",
//   },
//   pendingBadge: {
//     padding: Spacing.xs,
//   },

//   // Submit
//   submitContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: Spacing.lg,
//     borderTopWidth: 1,
//   },
//   submitButton: {
//     borderRadius: BorderRadius.lg,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   submitButtonGradient: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Spacing.md,
//     gap: Spacing.sm,
//   },
//   submitButtonText: {
//     fontSize: FontSizes.lg,
//     fontWeight: "600",
//   },
// });

import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { ClassItem, Student } from "@/types/classes";
import { LinearGradient } from "expo-linear-gradient"; // Ab properly use ho raha hai
import React, { useEffect, useMemo, useState, memo } from "react";
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Better safe area handling
import QRScanner from "../attendance/QRScanner";
import { IconSymbol } from "../ui/icon-symbol";

interface AttendanceModalProps {
  visible: boolean;
  onClose: () => void;
  selectedClass: ClassItem | null;
  students: Student[];
  onMarkAllPresent: () => void;
  onMarkAttendance: (
    studentId: string,
    status: "present" | "late" | "absent"
  ) => void;
  onSubmit: () => void;
}

// Helper: Initials function ko bahar nikala taake har render pe create na ho
const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Optimization: List Item ko alag component banaya
const StudentItem = memo(({ item, colors }: { item: Student; colors: any }) => (
  <View
    style={[
      styles.studentCard,
      {
        backgroundColor: colors.ui.card,
        borderColor:
          item.status === "present"
            ? colors.status.success.main
            : colors.ui.border,
        borderWidth: item.status === "present" ? 2 : 1,
      },
    ]}
  >
    <View style={styles.studentInfo}>
      <View
        style={[
          styles.studentAvatar,
          {
            backgroundColor:
              item.status === "present"
                ? colors.status.success.main
                : colors.primary.main,
          },
        ]}
      >
        <Text style={[styles.avatarText, { color: colors.primary.contrast }]}>
          {getInitials(item.name)}
        </Text>
      </View>
      <View style={styles.studentDetails}>
        <Text style={[styles.studentName, { color: colors.text.primary }]}>
          {item.name}
        </Text>
        <Text style={[styles.studentRoll, { color: colors.text.secondary }]}>
          Roll No: {item.rollNumber}
        </Text>
      </View>
    </View>

    {item.status === "present" ? (
      <View style={styles.scannedBadge}>
        <IconSymbol
          name="checkmark.seal.fill"
          size={28}
          color={colors.status.success.main}
        />
        <Text
          style={[styles.scannedText, { color: colors.status.success.main }]}
        >
          ✓ Scanned
        </Text>
      </View>
    ) : (
      <View style={styles.pendingBadge}>
        <IconSymbol name="clock.fill" size={20} color={colors.text.secondary} />
      </View>
    )}
  </View>
));

export function AttendanceModal({
  visible,
  onClose,
  selectedClass,
  students,
  onMarkAttendance,
  onSubmit,
}: AttendanceModalProps) {
  const { colors } = useTheme();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Pulse animation logic
  useEffect(() => {
    if (visible) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05, // Thora subtle kiya (1.1 se 1.05)
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [visible, pulseAnim]);

  // Optimization: useMemo se calculations cache kar li
  const stats = useMemo(() => {
    const present = students.filter((s) => s.status === "present").length;
    const unmarked = students.filter((s) => s.status === null).length;
    const percent =
      students.length > 0 ? Math.round((present / students.length) * 100) : 0;
    return { present, unmarked, percent };
  }, [students]);

  const handleStudentScan = (studentId: string) => {
    onMarkAttendance(studentId, "present");
  };

  if (!selectedClass) return null;

  return (
    <>
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        {/* SafeAreaView use kiya taake content safe rahe */}
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: colors.background.primary },
          ]}
        >
          <View style={styles.attendanceContainer}>
            {/* Header */}
            <View style={styles.attendanceHeader}>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.backButton}
              >
                <IconSymbol
                  name="chevron.left"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
              <View style={styles.attendanceHeaderCenter}>
                <Text
                  style={[
                    styles.attendanceHeaderTitle,
                    { color: colors.text.primary },
                  ]}
                >
                  QR Attendance
                </Text>
                <Text
                  style={[
                    styles.attendanceHeaderSubtitle,
                    { color: colors.text.secondary },
                  ]}
                >
                  {selectedClass.className}
                </Text>
              </View>
              <View style={{ width: 40 }} />
            </View>

            {/* Class Info Card */}
            <View
              style={[
                styles.classInfoCard,
                { backgroundColor: colors.background.secondary },
              ]}
            >
              <View style={styles.classInfoRow}>
                <IconSymbol
                  name="book.fill"
                  size={16}
                  color={colors.primary.main}
                />
                <Text
                  style={[styles.classInfoText, { color: colors.text.primary }]}
                >
                  {selectedClass.subject}
                </Text>
              </View>
              <View style={styles.classInfoRow}>
                <IconSymbol
                  name="location.fill"
                  size={16}
                  color={colors.primary.main}
                />
                <Text
                  style={[styles.classInfoText, { color: colors.text.primary }]}
                >
                  {selectedClass.room}
                </Text>
              </View>
            </View>

            {/* Progress Card */}
            <View
              style={[
                styles.progressCard,
                { backgroundColor: colors.background.secondary },
              ]}
            >
              <View style={styles.progressHeader}>
                <Text
                  style={[styles.progressTitle, { color: colors.text.primary }]}
                >
                  Scan Progress
                </Text>
                <Text
                  style={[
                    styles.progressPercent,
                    { color: colors.primary.main },
                  ]}
                >
                  {stats.percent}%
                </Text>
              </View>
              <View
                style={[
                  styles.progressBarBg,
                  { backgroundColor: colors.ui.border },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor:
                        stats.percent === 100
                          ? colors.status.success.main
                          : colors.primary.main,
                      width: `${stats.percent}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressStats}>
                <Text
                  style={[
                    styles.progressStatText,
                    { color: colors.status.success.main },
                  ]}
                >
                  ● {stats.present} Scanned
                </Text>
                <Text
                  style={[
                    styles.progressStatText,
                    { color: colors.text.secondary },
                  ]}
                >
                  ● {stats.unmarked} Pending
                </Text>
              </View>
            </View>

            {/* Scan Button with LinearGradient */}
            <View style={styles.scanSection}>
              <TouchableOpacity
                onPress={() => setShowQRScanner(true)}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.scanButtonWrapper,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <LinearGradient
                    colors={[colors.primary.main, "#4c669f"]} // Example gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.scanButtonGradient}
                  >
                    <IconSymbol
                      name="qrcode"
                      size={32}
                      color={colors.primary.contrast}
                    />
                    <View style={styles.scanTextContainer}>
                      <Text
                        style={[
                          styles.scanButtonText,
                          { color: colors.primary.contrast },
                        ]}
                      >
                        Scan Student QR
                      </Text>
                      <Text
                        style={[
                          styles.scanButtonSubtext,
                          { color: colors.primary.contrast },
                        ]}
                      >
                        Tap to open scanner
                      </Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Student List */}
            <View style={styles.listHeader}>
              <Text style={[styles.listTitle, { color: colors.text.primary }]}>
                Students ({students.length})
              </Text>
            </View>

            <FlatList
              data={students}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.attendanceList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <StudentItem item={item} colors={colors} />
              )}
            />

            {/* Submit Button with Gradient */}
            <View
              style={[
                styles.submitContainer,
                {
                  backgroundColor: colors.background.primary,
                  borderTopColor: colors.ui.border,
                },
              ]}
            >
              <TouchableOpacity onPress={onSubmit} activeOpacity={0.8}>
                <LinearGradient
                  colors={[colors.primary.main, "#3b5998"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButtonGradient}
                >
                  <IconSymbol
                    name="checkmark.seal.fill"
                    size={20}
                    color={colors.primary.contrast}
                  />
                  <Text
                    style={[
                      styles.submitButtonText,
                      { color: colors.primary.contrast },
                    ]}
                  >
                    Submit Attendance
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <QRScanner
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleStudentScan}
        currentClassStudents={students}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  attendanceContainer: {
    flex: 1,
  },
  attendanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.full,
  },
  attendanceHeaderCenter: {
    flex: 1,
    alignItems: "center",
  },
  attendanceHeaderTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
  },
  attendanceHeaderSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  classInfoCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  classInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  classInfoText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
  },
  progressCard: {
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
  },
  progressPercent: {
    fontSize: FontSizes["2xl"],
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressStatText: {
    fontSize: FontSizes.sm,
    fontWeight: "500",
  },
  scanSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  scanButtonWrapper: {
    borderRadius: BorderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  scanButtonGradient: {
    flexDirection: "row",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },
  scanTextContainer: {
    alignItems: "flex-start",
  },
  scanButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  scanButtonSubtext: {
    fontSize: FontSizes.sm,
    opacity: 0.9,
  },
  listHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  listTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
  },
  attendanceList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100, // Space for submit button
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    marginBottom: 2,
  },
  studentRoll: {
    fontSize: FontSizes.xs,
  },
  scannedBadge: {
    alignItems: "center",
    gap: 2,
  },
  scannedText: {
    fontSize: 10,
    fontWeight: "700",
  },
  pendingBadge: {
    padding: Spacing.xs,
  },
  submitContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  submitButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  submitButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
});
