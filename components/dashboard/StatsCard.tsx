import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface StatsCardProps {
  type: 'students' | 'attendance' | 'tasks' | 'deadlines';
  value: number;
  label: string;
  onPress: () => void;
  isPercentage?: boolean;
}

export function StatsCard({ type, value, label, onPress, isPercentage = false }: StatsCardProps) {
  const { colors } = useTheme();
  const [animatedValue] = useState(new Animated.Value(0));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [value]);

  const getIcon = () => {
    switch (type) {
      case 'students': return { name: 'person.3.fill', color: colors.primary.main, bg: colors.primary.main + '20' };
      case 'attendance': return { name: 'checkmark.circle.fill', color: colors.status.success.main, bg: colors.status.success.main + '20' };
      case 'tasks': return { name: 'doc.text.fill', color: colors.status.warning.main, bg: colors.status.warning.main + '20' };
      case 'deadlines': return { name: 'clock.fill', color: colors.status.error.main, bg: colors.status.error.main + '20' };
      default: return { name: 'person.fill', color: colors.primary.main, bg: colors.primary.main + '20' };
    }
  };

  const iconData = getIcon();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background.secondary, shadowColor: colors.ui.shadow }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
        <IconSymbol name={iconData.name as any} size={24} color={iconData.color} />
      </View>
      <Text style={[styles.number, { color: colors.text.primary }]}>
        {displayValue}{isPercentage ? '%' : ''}
      </Text>
      <Text style={[styles.label, { color: colors.text.secondary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  number: {
    fontSize: FontSizes['3xl'],
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
});
