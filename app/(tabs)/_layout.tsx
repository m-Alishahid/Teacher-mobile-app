import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/ThemeContext';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        // Use Primary color for active tab
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.tertiary,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary.main,
        },
        headerTintColor: colors.primary.contrast,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: colors.background.secondary, // Use secondary for tab bar
          borderTopColor: colors.ui.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: isDark ? '#000000' : '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        // Add smooth animations for tab switching
        animation: 'shift',
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Dashboard Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'Teacher Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="house.fill" 
              color={color}
            />
          ),
        }}
      />

      {/* Classes Tab */}
      <Tabs.Screen
        name="classes"
        options={{
          title: 'Classes',
          headerTitle: 'My Classes',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="book.fill" 
              color={color}
            />
          ),
        }}
      />

      {/* Attendance Tab */}
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          headerTitle: 'Quick Attendance',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="checkmark.circle.fill" 
              color={color}
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="person.fill" 
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
