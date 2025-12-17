/**
 * CheckInOutCard Component
 *
 * Professional check-in/check-out card with gradient design
 * Features a modern "Swipe to Confirm" interaction
 */

import { BorderRadius, FontSizes, Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  const contentWidth = useRef(0); // To track the thumb width

  // Padding inside the button container
  const PADDING = 4;

  const reset = () => {
    setSwiped(false);
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 10,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !loading && !swiped,
      onMoveShouldSetPanResponder: () => !loading && !swiped,
      onPanResponderMove: (_, gestureState) => {
        if (loading || swiped) return;

        // Calculate max scrollable distance
        const maxScroll = buttonWidth.current - 60; // 60 is approx thumb width

        // Clamp value between 0 and maxScroll
        const newValue = Math.max(0, Math.min(maxScroll, gestureState.dx));
        translateX.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (loading || swiped) return;

        const maxScroll = buttonWidth.current - 60;

        // If swiped more than 70% of the width
        if (gestureState.dx > maxScroll * 0.7) {
          setSwiped(true);
          Animated.spring(translateX, {
            toValue: maxScroll,
            useNativeDriver: false,
            bounciness: 0,
          }).start(() => {
            onSwipeSuccess();
            // Reset after a delay if action failed or completed (handled by parent props mainly)
            // But here we rely on parent to update state or we manually reset if needed
            setTimeout(reset, 2000);
          });
        } else {
          // Spring back
          reset();
        }
      },
    })
  ).current;

  // Text Opacity Animation based on drag
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

      {/* Arrow Indicator Overlay (fades in when dragging starts) */}
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
  onCheckIn: () => void;
  onCheckOut: () => void;
  loading?: boolean;
}

export const CheckInOutCard: React.FC<CheckInOutCardProps> = ({
  isCheckedIn,
  checkInTime,
  checkOutTime,
  onCheckIn,
  onCheckOut,
  loading = false,
}) => {
  const { colors, isDark } = useTheme();

  const getStatusColor = () => {
    if (checkOutTime) return colors.text.tertiary;
    if (isCheckedIn) return colors.status.success.main;
    return colors.status.warning.main;
  };

  const getStatusText = () => {
    if (checkOutTime) return "Checked Out";
    if (isCheckedIn) return "Checked In";
    return "Not Checked In";
  };

  return (
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
          <Text style={[styles.statusText, { color: colors.primary.contrast }]}>
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
          <Text style={[styles.timeValue, { color: colors.primary.contrast }]}>
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
          <Text style={[styles.timeValue, { color: colors.primary.contrast }]}>
            {checkOutTime || "--:--"}
          </Text>
        </View>
      </View>

      {/* Swipe Action Button */}
      {!checkOutTime && (
        <View style={styles.actionContainer}>
          <SwipeButton
            text={isCheckedIn ? "Swipe to Check Out" : "Swipe to Check In"}
            icon={isCheckedIn ? "log-out" : "log-in"}
            onSwipeSuccess={isCheckedIn ? onCheckOut : onCheckIn}
            color={isCheckedIn ? colors.status.error.main : colors.primary.main}
            backgroundColor={colors.primary.contrast}
            loading={loading}
          />
        </View>
      )}
    </LinearGradient>
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
});
