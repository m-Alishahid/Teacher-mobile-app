// import { API_ENDPOINTS, BASE_URL } from '@/config/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';
// import { useCallback, useEffect, useRef, useState } from 'react';

// // UI ke liye Type Definition (Jo aapke component me hai)
// export interface NotificationUI {
//     id: string;
//     title: string;
//     message: string;
//     time: string;
//     type: 'info' | 'warning' | 'success';
//     read: boolean;
// }

// export const useNotifications = () => {
//     const [notifications, setNotifications] = useState<NotificationUI[]>([]);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const responseListener = useRef<Notifications.Subscription | null>(null);

//     // 1. Data Formatter: Backend DB -> Mobile UI
//     const formatTime = (dateString: string) => {
//         const date = new Date(dateString);
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     const mapBackendToUI = (data: any[]): NotificationUI[] => {
//         return data.map((item) => ({
//             id: item._id,
//             title: item.title,
//             message: item.message,
//             time: formatTime(item.createdAt),
//             // Backend type ko UI type se match karo
//             type: ['assignment', 'exam', 'fee_overdue'].includes(item.type) ? 'warning'
//                 : ['result', 'fee_payment'].includes(item.type) ? 'success'
//                     : 'info',
//             read: item.isRead || false,
//         }));
//     };

//     // 2. Fetch Notifications from Backend
//     const fetchNotifications = useCallback(async () => {
//         try {
//             setLoading(true);
//             const token = await AsyncStorage.getItem('token');
//             const userStr = await AsyncStorage.getItem('user');

//             if (!userStr || !token) return;
//             const user = JSON.parse(userStr);
//             const userId = user._id || user.id;

//             const response = await fetch(`${BASE_URL}${API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS}?userId=${userId}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             const result = await response.json();

//             if (result.success) {
//                 const formattedData = mapBackendToUI(result.data.notifications);
//                 setNotifications(formattedData);
//                 setUnreadCount(result.data.unreadCount);
//             }
//         } catch (error) {
//             console.error('Fetch Notification Error:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // 3. Mark As Read (Sirf Local Update for now, Backend API call add kr skte ho)
//     const markAsRead = async (id: string) => {
//         // Optimistic UI Update
//         setNotifications(prev =>
//             prev.map(n => n.id === id ? { ...n, read: true } : n)
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));

//         // TODO: Yahan backend API call lagana: POST /api/notification/mark-read
//     };

//     const markAllAsRead = () => {
//         setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//         setUnreadCount(0);
//     };

//     // 4. Initial Load & Listeners
//     useEffect(() => {
//         fetchNotifications();

//         // Skip notification listeners in Expo Go (SDK 53+ doesn't support push notifications)
//         const isExpoGo = Constants.appOwnership === 'expo';

//         if (isExpoGo) {
//             console.log('⚠️ Running in Expo Go - Push notifications are disabled. Use a development build for full notification support.');
//             return; // Skip listener setup
//         }

//         // Jab app open ho aur notification aaye, list refresh karo
//         const subscription = Notifications.addNotificationReceivedListener(() => {
//             fetchNotifications(); // Refresh list silently
//         });

//         return () => subscription.remove();
//     }, [fetchNotifications]);

//     return {
//         notifications,
//         unreadCount,
//         loading,
//         fetchNotifications,
//         markAsRead,
//         markAllAsRead,
//     };
// };






import { API_ENDPOINTS, BASE_URL } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device'; // 🔥 Ye install hona chahiye
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// Notification Handler (App open hony p bhi notification dikhaye)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
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
    const [notifications, setNotifications] = useState<NotificationUI[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    // 1. Data Formatter
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
            type: ['assignment', 'exam', 'fee_overdue'].includes(item.type) ? 'warning'
                : ['result', 'fee_payment'].includes(item.type) ? 'success'
                    : 'info',
            read: item.isRead || false,
        }));
    };

    // 2. Fetch Notifications Logic
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

    // ============================================================
    // 🔥 NEW: TOKEN REGISTRATION & SAVING LOGIC
    // ============================================================
    const registerForPushNotificationsAsync = async () => {
        let token;

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
                console.log('Failed to get push token permission!');
                return;
            }

            // ✅ Project ID zaroori hai Development Build k liye
            token = (await Notifications.getExpoPushTokenAsync({
                projectId: '305b608b-280d-4995-beb7-9a5ad3e55fd5'
            })).data;

            console.log("📲 Generated Token:", token);
            console.log("📲 Generated Token:", token);
            // Backend par bhejo
            await saveTokenToBackend(token);
        } else {
            console.log('Must use physical device for Push Notifications');
        }
    };

    const saveTokenToBackend = async (pushToken: string) => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('token'); // Auth token
            if (!userStr) return;
            const user = JSON.parse(userStr);

            // API Endpoint for saving token
            const response = await fetch(`${BASE_URL}/api/user/save-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Agar secured hai to
                },
                body: JSON.stringify({
                    userId: user._id || user.id,
                    token: pushToken
                })
            });
            const data = await response.json();
            console.log("✅ Token Saved to DB:", data.success);
        } catch (error) {
            console.error("❌ Failed to save token:", error);
        }
    }

    // 3. Mark As Read
    const markAsRead = async (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    // 4. Initial Load
    useEffect(() => {
        // 1. Fetch List
        fetchNotifications();

        // 2. 🔥 Register Token (Ye missing tha pehle)
        registerForPushNotificationsAsync();

        // 3. Listen for incoming notifications
        const subscription = Notifications.addNotificationReceivedListener(() => {
            fetchNotifications(); // Naya message aate hi list update karo
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