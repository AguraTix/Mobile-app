import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  type: 'order_success' | 'event_reminder' | 'promotion';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionText?: string;
  actionUrl?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_success':
        return '✓';
      case 'event_reminder':
        return '📅';
      case 'promotion':
        return '🎉';
      default:
        return '📱';
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-start py-3 border-b border-white/10"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="w-10 h-10 rounded-full bg-[#4CAF50] items-center justify-center mr-3">
        <Text className="text-white text-lg font-bold">{getNotificationIcon(notification.type)}</Text>
      </View>

      <View className="flex-1 pr-3">
        <Text className="text-text text-base font-semibold mb-1">{notification.title}</Text>
        <Text className="text-text-secondary text-sm leading-5 mb-2">{notification.message}</Text>

        {notification.actionText && (
          <TouchableOpacity className="self-start">
            <Text className="text-primary text-sm font-semibold">{notification.actionText}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="justify-center">
        <Text className="text-text-secondary text-xs text-right">{formatTime(notification.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock notifications data (would come from backend)
  const mockNotifications: Notification[] = useMemo(() => [
    {
      id: '1',
      type: 'order_success',
      title: 'Successfully Order',
      message: 'Your order has been successfully made',
      timestamp: new Date(), // Today
      isRead: false,
      actionText: 'View Now',
      actionUrl: '/orders/1'
    },
    {
      id: '2',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '3',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '4',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '5',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '6',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '7',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      id: '8',
      type: 'order_success',
      title: 'Successfully order',
      message: 'Your order has been placed success...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
  ], []);

  const loadNotifications = useCallback(async () => {
    try {
      // In real app, fetch from API
      // const data = await NotificationsAPI.getNotifications();
      setNotifications(mockNotifications);
    } catch (error) {
      setNotifications(mockNotifications);
    }
  }, [mockNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read and navigate if needed
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const isToday = (date: Date) => {
      return date.toDateString() === today.toDateString();
    };

    const isYesterday = (date: Date) => {
      return date.toDateString() === yesterday.toDateString();
    };

    const todayNotifications = notifications.filter(n => isToday(n.timestamp));
    const yesterdayNotifications = notifications.filter(n => isYesterday(n.timestamp));
    const olderNotifications = notifications.filter(n => !isToday(n.timestamp) && !isYesterday(n.timestamp));

    return {
      today: todayNotifications,
      yesterday: yesterdayNotifications,
      older: olderNotifications
    };
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  const renderNotificationGroup = (title: string, notifications: Notification[]) => {
    if (notifications.length === 0) return null;

    return (
      <View className="mb-6" key={title}>
        <Text className="text-text text-base font-bold mb-4">{title}</Text>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />
      <Header showLogo showProfile showSearch />

      <View className="flex-1 px-5">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-text text-lg font-bold">Notifications</Text>
        </View>

        <View className="flex-1 bg-card rounded-2xl border-2 border-[#007AFF] border-dashed p-5">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.text}
              />
            }
          >
            {renderNotificationGroup('Today', groupedNotifications.today)}
            {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
            {renderNotificationGroup('Older', groupedNotifications.older)}

            {notifications.length === 0 && (
              <View className="items-center justify-center py-16">
                <Text className="text-text text-lg font-semibold mb-2">No notifications yet</Text>
                <Text className="text-text-secondary text-sm text-center leading-5">
                  You&apos;ll see your notifications here when you have some
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
