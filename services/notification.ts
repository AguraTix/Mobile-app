import { Notification, NotificationResponse } from '@/types/notification';
import {client} from './client';
import { API_ENDPOINTS } from './constants';

/**
 * Notification Service for managing user notifications.
 * Handles fetching, reading, and marking notifications.
 */
export const NotificationService = {
    /**
     * Fetch all notifications for the current user.
     */
    async getMyNotifications(): Promise<NotificationResponse> {
        try {
            const response = await client.get<NotificationResponse>(
                API_ENDPOINTS.NOTIFICATIONS.MY
            );
            return response;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Return empty array as fallback
            return {
                message: 'Failed to fetch notifications',
                notifications: [],
                unread_count: 0,
            };
        }
    },

    /**
     * Get a single notification by ID.
     */
    async getById(id: string): Promise<Notification | null> {
        try {
            const response = await client.get<{ notification: Notification }>(
                API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)
            );
            return response.notification;
        } catch (error) {
            console.error('Error fetching notification:', error);
            return null;
        }
    },

    /**
     * Mark a single notification as read.
     */
    async markAsRead(id: string): Promise<boolean> {
        try {
            await client.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
            return true;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return false;
        }
    },

    /**
     * Mark all notifications as read.
     */
    async markAllAsRead(): Promise<boolean> {
        try {
            await client.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
            return true;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            return false;
        }
    },

    /**
     * Get unread notification count.
     */
    async getUnreadCount(): Promise<number> {
        try {
            const response = await client.get<{ count: number }>(
                API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT
            );
            return response.count;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    },
};
