/**
 * Tab Layout - Bottom Navigation
 * 
 * Tabs:
 * - Dashboard (Home)
 * - Classes (My Classes)
 * - Attendance (Quick Action)
 * - Profile (Settings)
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Use Primary color for active tab
        tabBarActiveTintColor: AppColors.primary.main,
        tabBarInactiveTintColor: AppColors.text.tertiary,
        headerShown: true,
        headerStyle: {
          backgroundColor: AppColors.primary.main,
        },
        headerTintColor: AppColors.primary.contrast,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: AppColors.background.primary,
          borderTopColor: AppColors.ui.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
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
