import { CustomAlert } from "@/components/ui/CustomAlert";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SidebarDrawer } from "@/components/ui/SidebarDrawer";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const { logout } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    icon: "",
    iconColor: "",
    buttons: [] as any[],
  });

  const showAlert = (
    title: string,
    message: string,
    icon: string,
    iconColor: string,
    buttons: any[] = [{ text: "OK", style: "default" }]
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      icon,
      iconColor,
      buttons,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const handleLogout = async () => {
    showAlert(
      "Logout",
      "Are you sure you want to end your session?",
      "power",
      colors.status.error.main,
      [
        { text: "Cancel", style: "cancel", onPress: closeAlert },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            closeAlert();
            // Use global logout function
            await logout();
            // Redirection will be handled by the root _layout.tsx
          },
        },
      ]
    );
  };

  const MenuButton = () => (
    <TouchableOpacity
      onPress={() => setSidebarVisible(true)}
      style={{ marginLeft: 16 }}
      activeOpacity={0.7}
    >
      <Ionicons name="menu" size={28} color={colors.primary.contrast} />
    </TouchableOpacity>
  );

  return (
    <>
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
            fontWeight: "600",
          },
          headerLeft: () => <MenuButton />,
          tabBarStyle: {
            backgroundColor: colors.background.secondary, // Use secondary for tab bar
            borderTopColor: colors.ui.border,
            borderTopWidth: 1,
            height: Platform.OS === "ios" ? 82 : 60,
            paddingBottom: Platform.OS === "ios" ? 22 : 10,
            paddingTop: 8,
            elevation: 8,
            shadowColor: isDark ? "#000000" : "#000000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          // Add smooth animations for tab switching
          animation: "shift",
          tabBarHideOnKeyboard: true,
        }}
      >
        {/* Dashboard Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            headerTitle: "Teacher Dashboard",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />

        {/* Classes Tab */}
        <Tabs.Screen
          name="classes"
          options={{
            title: "Classes",
            headerTitle: "My Classes",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={28} name="book.fill" color={color} />
            ),
          }}
        />

        {/* Attendance Tab */}
        <Tabs.Screen
          name="attendance"
          options={{
            title: "Attendance",
            headerTitle: "Quick Attendance",
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
            title: "Profile",
            headerTitle: "Settings",
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Sidebar Drawer */}
      <SidebarDrawer
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onLogout={handleLogout}
      />

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        iconColor={alertConfig.iconColor}
        buttons={alertConfig.buttons}
        onClose={closeAlert}
      />
    </>
  );
}
