import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';

interface ThemedSafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * Themed SafeAreaView component that automatically adapts to light/dark mode
 * Use this instead of regular SafeAreaView for consistent theming
 */
export function ThemedSafeAreaView({ 
  children, 
  style,
  edges = ['top', 'bottom', 'left', 'right']
}: ThemedSafeAreaViewProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: colors.background.primary },
        style
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
