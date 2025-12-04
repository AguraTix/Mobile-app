import { NotificationService } from "@/services/notification";
import { Notification as PersistentNotification } from "@/types/notification";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

// ============================================================================
// TOAST NOTIFICATION TYPES (for in-app toasts that auto-dismiss)
// ============================================================================
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastNotification {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// ============================================================================
// CONTEXT TYPE (combines toasts + persistent notifications)
// ============================================================================
interface NotificationContextType {
  // Toast notifications (auto-dismiss)
  toasts: ToastNotification[];
  addToast: (message: string, type: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Persistent notifications (from backend, for notification screen)
  persistentNotifications: PersistentNotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;

  // Legacy aliases for backward compatibility
  notifications: ToastNotification[];
  addNotification: (message: string, type: ToastType, duration?: number) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Toast state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Persistent notification state
  const [persistentNotifications, setPersistentNotifications] = useState<PersistentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // TOAST METHODS
  // ============================================================================
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000): string => {
      const id = `${Date.now()}-${Math.random()}`;
      const toastNotification: ToastNotification = { id, type, message, duration };

      setToasts((prev) => [...prev, toastNotification]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // ============================================================================
  // PERSISTENT NOTIFICATION METHODS
  // ============================================================================
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await NotificationService.getMyNotifications();
      setPersistentNotifications(response.notifications);
      setUnreadCount(response.unread_count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    const success = await NotificationService.markAsRead(id);
    if (success) {
      setPersistentNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const success = await NotificationService.markAllAsRead();
    if (success) {
      setPersistentNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    }
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================
  const value: NotificationContextType = {
    // Toast methods
    toasts,
    addToast,
    removeToast,
    clearToasts,

    // Persistent notification methods
    persistentNotifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,

    // Legacy aliases (for backward compatibility)
    notifications: toasts,
    addNotification: addToast,
    removeNotification: removeToast,
    clearNotifications: clearToasts,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

// Re-export the deprecated type for backward compatibility
export type NotificationType = ToastType;
export type Notification = ToastNotification;
