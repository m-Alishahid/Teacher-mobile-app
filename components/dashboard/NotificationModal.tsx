import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationModal({ visible, onClose, notifications, onMarkAsRead, onMarkAllAsRead }: NotificationModalProps) {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.ui.overlay }]}>
        <View style={[styles.notificationModal, { backgroundColor: colors.background.primary }]}>
          <View style={[styles.notificationHeader, { borderBottomColor: colors.ui.divider }]}>
            <Text style={[styles.notificationTitle, { color: colors.text.primary }]}>Notifications</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="xmark" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.notificationList} showsVerticalScrollIndicator={false}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  { backgroundColor: notification.read ? 'transparent' : (isDark ? colors.background.secondary : '#F0F9FF') },
                  { borderBottomColor: colors.ui.divider }
                ]}
                onPress={() => onMarkAsRead(notification.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.notificationIcon,
                  {
                    backgroundColor:
                      notification.type === 'warning' ? colors.status.warning.background :
                      notification.type === 'success' ? colors.status.success.background :
                      colors.status.info.background,
                  },
                ]}>
                  <IconSymbol
                    name={
                      notification.type === 'warning' ? 'bell.fill' :
                      notification.type === 'success' ? 'checkmark.circle.fill' :
                      'bell.fill'
                    }
                    size={20}
                    color={
                      notification.type === 'warning' ? colors.status.warning.main :
                      notification.type === 'success' ? colors.status.success.main :
                      colors.status.info.main
                    }
                  />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationTop}>
                    <Text style={[styles.notificationItemTitle, { color: colors.text.primary }]}>{notification.title}</Text>
                    {!notification.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary.main }]} />}
                  </View>
                  <Text style={[styles.notificationMessage, { color: colors.text.secondary }]}>{notification.message}</Text>
                  <Text style={[styles.notificationTime, { color: colors.text.tertiary }]}>{notification.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.markAllButton, { backgroundColor: colors.background.secondary, borderTopColor: colors.ui.border }]}
            onPress={onMarkAllAsRead}
          >
            <Text style={[styles.markAllButtonText, { color: colors.primary.main }]}>Mark All as Read</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  notificationModal: {
    height: '80%',
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  notificationTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationItemTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.sm,
    marginTop: 6,
  },
  notificationMessage: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: FontSizes.xs,
  },
  markAllButton: {
    padding: Spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  markAllButtonText: {
    fontSize: FontSizes.base,
    fontWeight: 'bold',
  },
});
