import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  type?: 'link' | 'toggle' | 'info';
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  color?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  type = 'link',
  value,
  onValueChange,
  color,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { 
          backgroundColor: colors.background.secondary,
          borderBottomColor: colors.ui.divider 
        }
      ]}
      onPress={type === 'toggle' ? undefined : onPress}
      activeOpacity={type === 'toggle' ? 1 : 0.7}
      disabled={type === 'info'}
    >
      <View style={[styles.settingIcon, { backgroundColor: isDark ? colors.background.tertiary : colors.ui.divider + '40' }]}> 
        <Ionicons name={icon} size={22} color={color || colors.primary.main} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text.primary }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>{subtitle}</Text>}
      </View>

      {type === 'link' && (
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      )}
      
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.text.disabled, true: colors.primary.main }}
          thumbColor={Platform.OS === 'ios' ? '#fff' : value ? colors.primary.contrast : '#f4f3f4'} 
        />
      )}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to end your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Opening profile editor...');
  };

  const handleChangePassword = () => {
    Alert.alert('Security', 'Password change flow initiated.');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={{ paddingBottom: Spacing['3xl'] }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
        <View style={styles.headerContent}>
          <View style={[styles.avatarContainer, { borderColor: colors.primary.contrast }]}>
            <Text style={[styles.avatarText, { color: colors.primary.main }]}>MT</Text>
            <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors.secondary.main }]}>
                <Ionicons name="pencil" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: colors.primary.contrast }]}>Mr. Teacher</Text>
          <Text style={[styles.role, { color: 'rgba(255,255,255,0.9)' }]}>Mathematics Department</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.background.secondary, shadowColor: colors.ui.shadow }]}>
          <Text style={[styles.statValue, { color: colors.primary.main }]}>8</Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Classes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.background.secondary, shadowColor: colors.ui.shadow }]}>
          <Text style={[styles.statValue, { color: colors.secondary.main }]}>245</Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Students</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.background.secondary, shadowColor: colors.ui.shadow }]}>
          <Text style={[styles.statValue, { color: colors.status.success.main }]}>4.8</Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Rating</Text>
        </View>
      </View>

      {/* Settings Sections */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: colors.text.tertiary }]}>ACCOUNT SETTINGS</Text>
        <View style={[styles.card, { backgroundColor: colors.background.secondary }]}>
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Name, Email, Phone"
            onPress={handleEditProfile}
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Security"
            subtitle="Password, 2FA"
            onPress={handleChangePassword}
          />
          <SettingItem
            icon="finger-print-outline"
            title="Biometric Login"
            type="toggle"
            value={biometrics}
            onValueChange={setBiometrics}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: colors.text.tertiary }]}>PREFERENCES</Text>
        <View style={[styles.card, { backgroundColor: colors.background.secondary }]}>
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            type="toggle"
            value={isDark}
            onValueChange={toggleTheme}
            color={isDark ? '#FFD700' : '#5C5C5C'} // Yellow moon if active, grey otherwise
          />
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            type="toggle"
            value={notifications}
            onValueChange={setNotifications}
            color={colors.status.warning.main}
          />
           <SettingItem
            icon="language-outline"
            title="Language"
            subtitle="English (US)"
            onPress={() => Alert.alert('Language', 'Language selection dialog')}
            color={colors.status.info.main}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: colors.text.tertiary }]}>SUPPORT</Text>
        <View style={[styles.card, { backgroundColor: colors.background.secondary }]}>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => Alert.alert('Help', 'Navigating to Help Center...')}
          />
          <SettingItem
            icon="information-circle-outline"
            title="About App"
            subtitle="v1.0.0"
            onPress={() => Alert.alert('About', 'Teacher Mobile App\nVersion 1.0.0\nBuild 2024.12.13')}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
            style={[styles.logoutButton, { borderColor: colors.status.error.main, backgroundColor: colors.status.error.background }]} 
            onPress={handleLogout}
        >
            <Ionicons name="log-out-outline" size={20} color={colors.status.error.text} />
            <Text style={[styles.logoutText, { color: colors.status.error.text }]}>Log Out</Text>
        </TouchableOpacity>
        <Text style={[styles.versionText, { color: colors.text.tertiary }]}>Teacher App Suite © 2025</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing['3xl'], // Safe area padding mock
    paddingBottom: Spacing['2xl'],
    borderBottomLeftRadius: BorderRadius['2xl'],
    borderBottomRightRadius: BorderRadius['2xl'],
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 4,
    position: 'relative',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  role: {
    fontSize: FontSizes.base,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginTop: -Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
    letterSpacing: 1,
  },
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: FontSizes.xs,
  },
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  logoutText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  versionText: {
    fontSize: FontSizes.xs,
  },
});
