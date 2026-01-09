import { API_ENDPOINTS, BASE_URL } from '@/config/api';
import { useAuth } from '@/context/AuthContext'; // 🔥 Context se User lenge
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// 1. Notification Handler Configuration
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationUI {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'warning' | 'success';
    read: boolean;
}

export const useNotifications = () => {
    // 🔥 DIRECT ACCESS TO USER (No waiting for AsyncStorage)
    const { user } = useAuth();

    const [notifications, setNotifications] = useState<NotificationUI[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    // Helper: Time Format
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper: Map Backend Data to UI
    const mapBackendToUI = (data: any[]): NotificationUI[] => {
        return data.map((item) => ({
            id: item._id,
            title: item.title,
            message: item.message,
            time: formatTime(item.createdAt),
            type: ['assignment', 'exam', 'fee_overdue'].includes(item.type) ? 'warning'
                : ['result', 'fee_payment'].includes(item.type) ? 'success'
                    : 'info',
            read: item.isRead || false,
        }));
    };

    // ============================================================
    // 2. TOKEN GENERATION & SAVING
    // ============================================================
    const registerForPushNotificationsAsync = async () => {
        if (!user || !user._id) return; // User nahi to Token kiske liye?

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('❌ Permission not granted for notifications');
                return;
            }

            try {
                // 🔥 Project ID (App.json wala ID)
                const tokenData = await Notifications.getExpoPushTokenAsync({
                    projectId: '305b608b-280d-4995-beb7-9a5ad3e55fd5'
                });

                const token = tokenData.data;
                console.log("📲 Generated Token:", token);

                // Backend par bhejo
                await saveTokenToBackend(token);
            } catch (error) {
                console.error("❌ Error getting token:", error);
            }
        } else {
            console.log('⚠️ Physical device required for Push Notifications');
        }
    };

    const saveTokenToBackend = async (pushToken: string) => {
        try {
            if (!user || !user._id) return;

            const authToken = await AsyncStorage.getItem('token'); // Auth Token
            const url = `${BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.SAVE_TOKEN}`;

            console.log("📡 Saving Token to DB for User:", user.fullName);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    userId: user._id,
                    token: pushToken
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log("✅ Token Saved Successfully!");
            } else {
                console.log("⚠️ Token Save Failed:", data.message);
            }

        } catch (error) {
            console.error("🔥 Network Error (Save Token):", error);
        }
    }

    // ============================================================
    // 3. FETCH NOTIFICATIONS
    // ============================================================
    const fetchNotifications = useCallback(async () => {
        if (!user || !user._id) return;

        try {
            setLoading(true);
            const authToken = await AsyncStorage.getItem('token');

            const url = `${BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS}?userId=${user._id}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                const formattedData = mapBackendToUI(result.data.notifications);
                setNotifications(formattedData);
                setUnreadCount(result.data.unreadCount);
            }
        } catch (error) {
            console.error('❌ Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // 4. Mark Read Actions
    const markAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        // TODO: Call Backend API here
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    // 5. Initial Lifecycle
    useEffect(() => {
        if (user) {
            // 1. Token Register karo (Only if user exists)
            registerForPushNotificationsAsync();

            // 2. Notifications Load karo
            fetchNotifications();
        }

        // 3. Listeners setup karo
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("🔔 New Notification Received!");
            fetchNotifications(); // Refresh list
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("👆 Notification Clicked");
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, [user]); // 🔥 Run whenever user changes (Login/Logout)

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    };
};