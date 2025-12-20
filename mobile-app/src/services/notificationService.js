// services/notificationService.js - Push notification setup for mobile app
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Register for push notifications and get Expo push token
 */
export const registerForPushNotifications = async () => {
    let token = null;

    // Check if physical device
    if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
    }

    // Get existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push notification permissions');
        return null;
    }

    // Get Expo push token
    try {
        const response = await Notifications.getExpoPushTokenAsync({
            projectId: 'your-project-id', // Optional: from app.json
        });
        token = response.data;
        console.log('Push token:', token);
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
    }

    // Configure Android channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('announcements', {
            name: 'Announcements',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF6B35',
        });
    }

    return token;
};

/**
 * Register push token with backend
 */
export const registerTokenWithBackend = async (pushToken) => {
    if (!pushToken) return false;

    try {
        await api.post('/announcements/register-token', { pushToken });
        console.log('Push token registered with backend');
        return true;
    } catch (error) {
        console.error('Error registering push token:', error);
        return false;
    }
};

/**
 * Initialize push notifications (call on app startup after login)
 */
export const initializePushNotifications = async () => {
    const token = await registerForPushNotifications();
    if (token) {
        await registerTokenWithBackend(token);
    }
    return token;
};

/**
 * Add notification listeners
 */
export const addNotificationListeners = (navigation) => {
    // Listener for when notification is received while app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
    });

    // Listener for when user interacts with notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response:', response);
        const data = response.notification.request.content.data;

        // Navigate to notifications screen if announcementId is present
        if (data?.announcementId && navigation) {
            navigation.navigate('Notifications');
        }
    });

    // Return cleanup function
    return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
    };
};

/**
 * Get unread notification count from badge
 */
export const getBadgeCount = async () => {
    return await Notifications.getBadgeCountAsync();
};

/**
 * Clear badge count
 */
export const clearBadge = async () => {
    await Notifications.setBadgeCountAsync(0);
};

export default {
    registerForPushNotifications,
    registerTokenWithBackend,
    initializePushNotifications,
    addNotificationListeners,
    getBadgeCount,
    clearBadge,
};
