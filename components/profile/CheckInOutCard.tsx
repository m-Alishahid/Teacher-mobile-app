// /**
//  * CheckInOutCard Component
//  *
//  * Professional check-in/check-out card with gradient design
//  * Features a modern "Swipe to Confirm" interaction
//  */

// import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
// import { useTheme } from "@/context/ThemeContext";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import React, { useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   PanResponder,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// interface SwipeButtonProps {
//   onSwipeSuccess: () => void;
//   text: string;
//   icon: keyof typeof Ionicons.glyphMap;
//   color: string;
//   backgroundColor: string;
//   loading?: boolean;
// }

// const SwipeButton: React.FC<SwipeButtonProps> = ({
//   onSwipeSuccess,
//   text,
//   icon,
//   color,
//   backgroundColor,
//   loading = false,
// }) => {
//   const [swiped, setSwiped] = useState(false);
//   const translateX = useRef(new Animated.Value(0)).current;
//   const buttonWidth = useRef(0);

//   const reset = () => {
//     setSwiped(false);
//     Animated.spring(translateX, {
//       toValue: 0,
//       useNativeDriver: false,
//       bounciness: 10,
//     }).start();
//   };

//   // Reset when loading changes or component updates
//   React.useEffect(() => {
//     if (!loading && swiped) {
//       // Give time for parent to update state before resetting
//       const timer = setTimeout(reset, 300);
//       return () => clearTimeout(timer);
//     }
//   }, [loading]);

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !loading && !swiped,
//       onMoveShouldSetPanResponder: () => !loading && !swiped,
//       onPanResponderMove: (_, gestureState) => {
//         if (loading || swiped) return;

//         // Calculate max scrollable distance
//         const maxScroll = buttonWidth.current - 60; // 60 is approx thumb width

//         // Clamp value between 0 and maxScroll
//         const newValue = Math.max(0, Math.min(maxScroll, gestureState.dx));
//         translateX.setValue(newValue);
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (loading || swiped) return;

//         const maxScroll = buttonWidth.current - 60;

//         // If swiped more than 65% of the width (easier threshold)
//         if (gestureState.dx > maxScroll * 0.65) {
//           setSwiped(true);
//           Animated.spring(translateX, {
//             toValue: maxScroll,
//             useNativeDriver: false,
//             bounciness: 0,
//           }).start(() => {
//             // Call the success callback
//             onSwipeSuccess();
//             // Don't auto-reset - let parent component control the state
//           });
//         } else {
//           // Spring back if not swiped enough
//           reset();
//         }
//       },
//     })
//   ).current;

//   // Text Opacity Animation based on drag
//   const textOpacity = translateX.interpolate({
//     inputRange: [0, 50],
//     outputRange: [1, 0],
//     extrapolate: "clamp",
//   });

//   return (
//     <View
//       style={[styles.swipeContainer, { backgroundColor }]}
//       onLayout={(e) => {
//         buttonWidth.current = e.nativeEvent.layout.width;
//       }}
//     >
//       <Animated.Text
//         style={[styles.swipeText, { color, opacity: textOpacity }]}
//       >
//         {text}
//       </Animated.Text>

//       <Animated.View
//         style={[
//           styles.swipeThumb,
//           {
//             transform: [{ translateX }],
//           },
//         ]}
//         {...panResponder.panHandlers}
//       >
//         {loading ? (
//           <ActivityIndicator color={color} size="small" />
//         ) : (
//           <Ionicons name={icon} size={24} color={color} />
//         )}
//       </Animated.View>

//       {/* Arrow Indicator Overlay (fades in when dragging starts) */}
//       {!loading && !swiped && (
//         <Animated.View
//           style={[
//             styles.chevronContainer,
//             {
//               opacity: textOpacity,
//               right: 16,
//             },
//           ]}
//         >
//           <Ionicons
//             name="chevron-forward"
//             size={20}
//             color={color}
//             style={{ opacity: 0.5 }}
//           />
//           <Ionicons
//             name="chevron-forward"
//             size={20}
//             color={color}
//             style={{ marginLeft: -12, opacity: 0.8 }}
//           />
//           <Ionicons
//             name="chevron-forward"
//             size={20}
//             color={color}
//             style={{ marginLeft: -12 }}
//           />
//         </Animated.View>
//       )}
//     </View>
//   );
// };

// interface CheckInOutCardProps {
//   isCheckedIn: boolean;
//   checkInTime: string | null;
//   checkOutTime: string | null;
//   workingHours?: string | null;
//   onCheckIn: () => void;
//   onCheckOut: () => void;
//   loading?: boolean;
// }

// export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({
//   isCheckedIn,
//   checkInTime,
//   checkOutTime,
//   workingHours,
//   onCheckIn,
//   onCheckOut,
//   loading = false,
// }) => {
//   const { colors, isDark } = useTheme();

//   const getStatusColor = () => {
//     if (checkOutTime) return colors.status.success.main;
//     if (isCheckedIn) return colors.status.info.main;
//     return colors.status.warning.main;
//   };

//   const getStatusText = () => {
//     if (checkOutTime) return "Completed ✓";
//     if (isCheckedIn) return "Checked In";
//     return "Not Checked In";
//   };

//   return (
//     <LinearGradient
//       colors={
//         isDark
//           ? [
//               colors.primary.main + "40",
//               colors.primary.dark || colors.primary.main,
//             ]
//           : [colors.primary.light || colors.primary.main, colors.primary.main]
//       }
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={[styles.card, { borderColor: colors.ui.border }]}
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <View
//             style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
//           />
//           <Text style={[styles.statusText, { color: colors.primary.contrast }]}>
//             {getStatusText()}
//           </Text>
//         </View>
//         <Ionicons
//           name="time-outline"
//           size={24}
//           color={colors.primary.contrast}
//         />
//       </View>

//       {/* Time Display */}
//       <View style={styles.timeContainer}>
//         <View style={styles.timeItem}>
//           <Text
//             style={[
//               styles.timeLabel,
//               { color: colors.primary.contrast, opacity: 0.8 },
//             ]}
//           >
//             Check In
//           </Text>
//           <Text style={[styles.timeValue, { color: colors.primary.contrast }]}>
//             {checkInTime || "--:--"}
//           </Text>
//         </View>

//         <View
//           style={[
//             styles.divider,
//             { backgroundColor: colors.primary.contrast, opacity: 0.3 },
//           ]}
//         />

//         <View style={styles.timeItem}>
//           <Text
//             style={[
//               styles.timeLabel,
//               { color: colors.primary.contrast, opacity: 0.8 },
//             ]}
//           >
//             Check Out
//           </Text>
//           <Text style={[styles.timeValue, { color: colors.primary.contrast }]}>
//             {checkOutTime || "--:--"}
//           </Text>
//         </View>
//       </View>

//       {/* Working Hours Display (shown after checkout) */}
//       {checkOutTime && workingHours && (
//         <View style={styles.workingHoursContainer}>
//           <Ionicons
//             name="timer-outline"
//             size={18}
//             color={colors.primary.contrast}
//             style={{ opacity: 0.8 }}
//           />
//           <Text
//             style={[
//               styles.workingHoursText,
//               { color: colors.primary.contrast, opacity: 0.9 },
//             ]}
//           >
//             Total Hours: {workingHours}
//           </Text>
//         </View>
//       )}

//       {/* Swipe Action Button */}
//       {!checkOutTime && (
//         <View style={styles.actionContainer}>
//           <SwipeButton
//             text={isCheckedIn ? "Swipe to Check Out" : "Swipe to Check In"}
//             icon={isCheckedIn ? "log-out" : "log-in"}
//             onSwipeSuccess={isCheckedIn ? onCheckOut : onCheckIn}
//             color={isCheckedIn ? colors.status.error.main : colors.primary.main}
//             backgroundColor={colors.primary.contrast}
//             loading={loading}
//           />
//         </View>
//       )}
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: BorderRadius.xl,
//     padding: Spacing.lg,
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.lg,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing.sm,
//   },
//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   statusText: {
//     fontSize: FontSizes.base,
//     fontWeight: "700",
//   },
//   timeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing.md,
//   },
//   timeItem: {
//     flex: 1,
//     alignItems: "center",
//   },
//   timeLabel: {
//     fontSize: FontSizes.xs,
//     marginBottom: 4,
//     fontWeight: "600",
//   },
//   timeValue: {
//     fontSize: FontSizes["2xl"],
//     fontWeight: "bold",
//   },
//   divider: {
//     width: 1,
//     height: 40,
//     marginHorizontal: Spacing.md,
//   },
//   workingHoursContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingVertical: Spacing.sm,
//     marginBottom: Spacing.xs,
//   },
//   workingHoursText: {
//     fontSize: FontSizes.sm,
//     fontWeight: "600",
//     letterSpacing: 0.3,
//   },
//   actionContainer: {
//     marginTop: Spacing.sm,
//   },
//   // Swipe Button Styles
//   swipeContainer: {
//     height: 56,
//     borderRadius: BorderRadius.full,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//     overflow: "hidden",
//   },
//   swipeText: {
//     fontSize: FontSizes.base,
//     fontWeight: "700",
//     letterSpacing: 0.5,
//   },
//   swipeThumb: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#fff",
//     position: "absolute",
//     left: 3,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 4,
//   },
//   chevronContainer: {
//     position: "absolute",
//     flexDirection: "row",
//     alignItems: "center",
//   },
// });

/**
 * CheckInOutCard Component
 *
 * Professional check-in/check-out card with gradient design
 * Features a modern "Swipe to Confirm" interaction with Alert Modal
 */

import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  type,
  onClose,
}) => {
  const { colors } = useTheme();

  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return {
          icon: "checkmark-circle" as const,
          color: colors.status.success.main,
        };
      case "error":
        return {
          icon: "close-circle" as const,
          color: colors.status.error.main,
        };
      case "warning":
        return {
          icon: "warning" as const,
          color: colors.status.warning.main,
        };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.alertContainer, { backgroundColor: colors.ui.card }]}
        >
          <View
            style={[
              styles.alertIconContainer,
              { backgroundColor: color + "20" },
            ]}
          >
            <Ionicons name={icon} size={48} color={color} />
          </View>

          <Text style={[styles.alertTitle, { color: colors.text.primary }]}>
            {title}
          </Text>

          <Text style={[styles.alertMessage, { color: colors.text.secondary }]}>
            {message}
          </Text>

          <TouchableOpacity
            style={[styles.alertButton, { backgroundColor: color }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface SwipeButtonProps {
  onSwipeSuccess: () => void;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
  loading?: boolean;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({
  onSwipeSuccess,
  text,
  icon,
  color,
  backgroundColor,
  loading = false,
}) => {
  const [swiped, setSwiped] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const buttonWidth = useRef(0);

  const reset = () => {
    setSwiped(false);
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 10,
    }).start();
  };

  // Reset when loading becomes false
  React.useEffect(() => {
    if (!loading && swiped) {
      const timer = setTimeout(reset, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, swiped]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !loading && !swiped,
      onMoveShouldSetPanResponder: () => !loading && !swiped,
      onPanResponderMove: (_, gestureState) => {
        if (loading || swiped) return;

        const maxScroll = buttonWidth.current - 60;
        const newValue = Math.max(0, Math.min(maxScroll, gestureState.dx));
        translateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (loading || swiped) return;

        const maxScroll = buttonWidth.current - 60;

        // Swipe threshold: 65% of the width
        if (gestureState.dx > maxScroll * 0.45) {
          setSwiped(true);
          Animated.spring(translateX, {
            toValue: maxScroll,
            useNativeDriver: false,
            bounciness: 0,
          }).start(() => {
            onSwipeSuccess();
          });
        } else {
          reset();
        }
      },
    })
  ).current;

  const textOpacity = translateX.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View
      style={[styles.swipeContainer, { backgroundColor }]}
      onLayout={(e) => {
        buttonWidth.current = e.nativeEvent.layout.width;
      }}
    >
      <Animated.Text
        style={[styles.swipeText, { color, opacity: textOpacity }]}
      >
        {text}
      </Animated.Text>

      <Animated.View
        style={[
          styles.swipeThumb,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {loading ? (
          <ActivityIndicator color={color} size="small" />
        ) : (
          <Ionicons name={icon} size={24} color={color} />
        )}
      </Animated.View>

      {!loading && !swiped && (
        <Animated.View
          style={[
            styles.chevronContainer,
            {
              opacity: textOpacity,
              right: 16,
            },
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={color}
            style={{ opacity: 0.5 }}
          />
          <Ionicons
            name="chevron-forward"
            size={20}
            color={color}
            style={{ marginLeft: -12, opacity: 0.8 }}
          />
          <Ionicons
            name="chevron-forward"
            size={20}
            color={color}
            style={{ marginLeft: -12 }}
          />
        </Animated.View>
      )}
    </View>
  );
};

interface CheckInOutCardProps {
  isCheckedIn: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours?: string | null;
  onCheckIn: () => void;
  onCheckOut: () => void;
  loading?: boolean;
}

export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({
  isCheckedIn,
  checkInTime,
  checkOutTime,
  workingHours,
  onCheckIn,
  onCheckOut,
  loading = false,
}) => {
  const { colors, isDark } = useTheme();
  const [alert, setAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setAlert({ visible: true, title, message, type });
  };

  const handleCheckIn = () => {
    try {
      onCheckIn();
      showAlert(
        "Check-In Successful!",
        "Your attendance has been recorded successfully.",
        "success"
      );
    } catch (error) {
      showAlert(
        "Check-In Failed",
        "Unable to record check-in. Please try again.",
        "error"
      );
    }
  };

  const handleCheckOut = () => {
    try {
      onCheckOut();
      showAlert(
        "Check-Out Successful!",
        "Your check-out has been recorded. Have a great day!",
        "success"
      );
    } catch (error) {
      showAlert(
        "Check-Out Failed",
        "Unable to record check-out. Please try again.",
        "error"
      );
    }
  };

  const getStatusColor = () => {
    if (checkOutTime) return colors.status.success.main;
    if (isCheckedIn) return colors.status.info.main;
    return colors.status.warning.main;
  };

  const getStatusText = () => {
    if (checkOutTime) return "Completed ✓";
    if (isCheckedIn) return "Checked In";
    return "Not Checked In";
  };

  return (
    <>
      <LinearGradient
        colors={
          isDark
            ? [
                colors.primary.main + "40",
                colors.primary.dark || colors.primary.main,
              ]
            : [colors.primary.light || colors.primary.main, colors.primary.main]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: colors.ui.border }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
            />
            <Text
              style={[styles.statusText, { color: colors.primary.contrast }]}
            >
              {getStatusText()}
            </Text>
          </View>
          <Ionicons
            name="time-outline"
            size={24}
            color={colors.primary.contrast}
          />
        </View>

        {/* Time Display */}
        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Text
              style={[
                styles.timeLabel,
                { color: colors.primary.contrast, opacity: 0.8 },
              ]}
            >
              Check In
            </Text>
            <Text
              style={[styles.timeValue, { color: colors.primary.contrast }]}
            >
              {checkInTime || "--:--"}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: colors.primary.contrast, opacity: 0.3 },
            ]}
          />

          <View style={styles.timeItem}>
            <Text
              style={[
                styles.timeLabel,
                { color: colors.primary.contrast, opacity: 0.8 },
              ]}
            >
              Check Out
            </Text>
            <Text
              style={[styles.timeValue, { color: colors.primary.contrast }]}
            >
              {checkOutTime || "--:--"}
            </Text>
          </View>
        </View>

        {/* Working Hours Display */}
        {checkOutTime && workingHours && (
          <View style={styles.workingHoursContainer}>
            <Ionicons
              name="timer-outline"
              size={18}
              color={colors.primary.contrast}
              style={{ opacity: 0.8 }}
            />
            <Text
              style={[
                styles.workingHoursText,
                { color: colors.primary.contrast, opacity: 0.9 },
              ]}
            >
              Total Hours: {workingHours}
            </Text>
          </View>
        )}

        {/* Swipe Action Button */}
        {!checkOutTime && (
          <View style={styles.actionContainer}>
            <SwipeButton
              text={isCheckedIn ? "Swipe to Check Out" : "Swipe to Check In"}
              icon={isCheckedIn ? "log-out" : "log-in"}
              onSwipeSuccess={isCheckedIn ? handleCheckOut : handleCheckIn}
              color={
                isCheckedIn ? colors.status.error.main : colors.primary.main
              }
              backgroundColor={colors.primary.contrast}
              loading={loading}
            />
          </View>
        )}
      </LinearGradient>

      {/* Alert Modal */}
      <AlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  timeItem: {
    flex: 1,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: FontSizes.xs,
    marginBottom: 4,
    fontWeight: "600",
  },
  timeValue: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: Spacing.md,
  },
  workingHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  workingHoursText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  actionContainer: {
    marginTop: Spacing.sm,
  },
  // Swipe Button Styles
  swipeContainer: {
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  swipeText: {
    fontSize: FontSizes.base,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  swipeThumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    position: "absolute",
    left: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  chevronContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  // Alert Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  alertContainer: {
    width: "100%",
    maxWidth: 320,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  alertIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  alertTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: FontSizes.sm,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  alertButton: {
    width: "100%",
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  alertButtonText: {
    color: "#fff",
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
});
