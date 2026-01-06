import { API_ENDPOINTS, BASE_URL } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';

// UI ke liye Type Definition (Jo aapke component me hai)
export interface NotificationUI {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'warning' | 'success';
    read: boolean;
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationUI[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    // 1. Data Formatter: Backend DB -> Mobile UI
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const mapBackendToUI = (data: any[]): NotificationUI[] => {
        return data.map((item) => ({
            id: item._id,
            title: item.title,
            message: item.message,
            time: formatTime(item.createdAt),
            // Backend type ko UI type se match karo
            type: ['assignment', 'exam', 'fee_overdue'].includes(item.type) ? 'warning'
                : ['result', 'fee_payment'].includes(item.type) ? 'success'
                    : 'info',
            read: item.isRead || false,
        }));
    };

    // 2. Fetch Notifications from Backend
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');

            if (!userStr || !token) return;
            const user = JSON.parse(userStr);
            const userId = user._id || user.id;

            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS}?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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
            console.error('Fetch Notification Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Mark As Read (Sirf Local Update for now, Backend API call add kr skte ho)
    const markAsRead = async (id: string) => {
        // Optimistic UI Update
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        // TODO: Yahan backend API call lagana: POST /api/notification/mark-read
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    // 4. Initial Load & Listeners
    useEffect(() => {
        fetchNotifications();

        // Jab app open ho aur notification aaye, list refresh karo
        const subscription = Notifications.addNotificationReceivedListener(() => {
            fetchNotifications(); // Refresh list silently
        });

        return () => subscription.remove();
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    };
};