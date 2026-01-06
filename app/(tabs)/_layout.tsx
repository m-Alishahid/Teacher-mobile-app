import { CustomAlert } from "@/components/ui/CustomAlert";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SidebarDrawer } from "@/components/ui/SidebarDrawer";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const router = useRouter();
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
            // Redirection
            router.replace("/");
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
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: colors.primary.contrast,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
          },
          headerLeft: () => <MenuButton />,
          tabBarStyle: {
            position: "absolute",
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 10,
            backgroundColor: colors.background.secondary,
            borderRadius: 25,
            height: 70,
            borderTopWidth: 0,
            paddingBottom: 0,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            // Ensure it sits above other content
            zIndex: 1000,
          },
          tabBarItemStyle: {
            paddingVertical: 12,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            paddingBottom: 4,
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

        {/* Hide Schedule Tab */}
        <Tabs.Screen
          name="schedule"
          options={{
            href: null,
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

        {/* Hide Students Tab */}
        <Tabs.Screen
          name="students"
          options={{
            href: null,
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
