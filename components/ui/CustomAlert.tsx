/**
 * Custom Alert Dialog Component
 * 
 * Beautiful replacement for React Native's Alert.alert()
 * Features:
 * - Smooth animations
 * - Customizable buttons
 * - Icon support
 * - Theme-aware colors
 */

import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { IconSymbol } from './icon-symbol';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  buttons?: AlertButton[];
  onClose?: () => void;
}

export function CustomAlert({
  visible,
  title,
  message,
  icon,
  iconColor,
  buttons = [{ text: 'OK', style: 'default' }],
  onClose,
}: CustomAlertProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          { backgroundColor: colors.ui.overlay, opacity: fadeAnim },
        ]}
      >
        <Animated.View
          style={[
            styles.alertContainer,
            {
              backgroundColor: colors.background.primary,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon */}
          {icon && (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: (iconColor || colors.primary.main) + '20' },
              ]}
            >
              <IconSymbol
                name={icon as any}
                size={40}
                color={iconColor || colors.primary.main}
              />
            </View>
          )}

          {/* Title */}
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {title}
          </Text>

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: colors.text.secondary }]}>
              {message}
            </Text>
          )}

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => {
              const isDestructive = button.style === 'destructive';
              const isCancel = button.style === 'cancel';
              const isDefault = !isDestructive && !isCancel;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    buttons.length === 1 && styles.buttonSingle,
                    {
                      backgroundColor: isDestructive
                        ? colors.status.error.background
                        : isDefault
                        ? colors.primary.main
                        : colors.background.secondary,
                      borderColor: isCancel ? colors.ui.border : 'transparent',
                      borderWidth: isCancel ? 1 : 0,
                    },
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: isDestructive
                          ? colors.status.error.main
                          : isDefault
                          ? colors.primary.contrast
                          : colors.text.primary,
                        fontWeight: isDefault ? '700' : '600',
                      },
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: FontSizes.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  buttonSingle: {
    marginTop: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSizes.base,
  },
});
