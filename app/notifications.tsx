import Skeleton from '@/components/Skeleton';
import Colors from '@/constants/Colors';
import { useNotification } from '@/contexts/NotificationContext';
import { Notification } from '@/types/notification';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationItem = ({ notification, onPress }: { notification: Notification; onPress: () => void }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getNotificationIcon = () => {
    let iconName: any = 'notifications';
    let color = Colors.primary;
    let bgColor = 'rgba(230, 0, 126, 0.1)'; // Primary with opacity

    switch (notification.type) {
      case 'payment':
        iconName = 'card-outline';
        color = '#4CAF50';
        bgColor = 'rgba(76, 175, 80, 0.1)';
        break;
      case 'ticket':
        iconName = 'ticket-outline';
        color = '#FF9800';
        bgColor = 'rgba(255, 152, 0, 0.1)';
        break;
      case 'event':
        iconName = 'calendar-outline';
        color = '#2196F3';
        bgColor = 'rgba(33, 150, 243, 0.1)';
        break;
      default:
        iconName = 'notifications-outline';
    }

    return (
      <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: bgColor }}>
        <Ionicons name={iconName} size={24} color={color} />
      </View>
    );
  };

  return (
    <TouchableOpacity
      className={`flex-row items-start py-4 border-b border-[#333] ${!notification.is_read ? 'bg-[#1C1C1E]/50 -mx-5 px-5' : ''}`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {getNotificationIcon()}

      <View className="flex-1 ml-3">
        <View className="flex-row items-start justify-between mb-1">
          <Text className={`text-text text-base flex-1 ${!notification.is_read ? 'font-bold' : 'font-semibold'}`}>
            {notification.title}
          </Text>
          <Text className="text-text-secondary text-xs ml-2">{formatTime(notification.created_at)}</Text>
        </View>

        <Text className="text-text-secondary text-sm leading-5 mb-2" numberOfLines={2}>
          {notification.message}
        </Text>
      </View>

      {!notification.is_read && (
        <View className="w-2 h-2 rounded-full bg-primary ml-2 mt-2" />
      )}
    </TouchableOpacity>
  );
};

const NotificationSkeleton = () => (
  <View className="flex-row items-start py-4 border-b border-[#333]">
    <Skeleton width={48} height={48} radius={16} style={{ marginRight: 12 }} />
    <View className="flex-1">
      <View className="flex-row justify-between mb-2">
        <Skeleton width="60%" height={20} radius={4} />
        <Skeleton width={60} height={16} radius={4} />
      </View>
      <Skeleton width="90%" height={16} radius={4} style={{ marginBottom: 6 }} />
      <Skeleton width="40%" height={16} radius={4} />
    </View>
  </View>
);

export default function NotificationsScreen() {
  const router = useRouter();
  const { persistentNotifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotification();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.notification_id);
    }

    // Navigate based on metadata if available
    if (notification.metadata?.event_id) {
      router.push(`/event/${notification.metadata.event_id}`);
    } else if (notification.metadata?.ticket_id) {
      router.push(`/ticket/${notification.metadata.ticket_id}`);
    } else if (notification.metadata?.payment_id) {
      // router.push(`/payment/${notification.metadata.payment_id}`);
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const isToday = (dateString: string) => {
      const date = new Date(dateString);
      return date.toDateString() === today.toDateString();
    };

    const isYesterday = (dateString: string) => {
      const date = new Date(dateString);
      return date.toDateString() === yesterday.toDateString();
    };

    const todayNotifications = notifications.filter(n => isToday(n.created_at));
    const yesterdayNotifications = notifications.filter(n => isYesterday(n.created_at));
    const olderNotifications = notifications.filter(n => !isToday(n.created_at) && !isYesterday(n.created_at));

    return {
      today: todayNotifications,
      yesterday: yesterdayNotifications,
      older: olderNotifications
    };
  };

  const groupedNotifications = groupNotificationsByDate(persistentNotifications);
  const hasNotifications = persistentNotifications.length > 0;

  const renderNotificationGroup = (title: string, notifications: Notification[]) => {
    if (notifications.length === 0) return null;

    return (
      <View className="mb-6" key={title}>
        <Text className="text-text-secondary text-sm font-semibold mb-3 uppercase tracking-wide">{title}</Text>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.notification_id}
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

      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 mb-2">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text className="text-text text-lg font-semibold">Notifications</Text>
          </View>

          {hasNotifications && (
            <TouchableOpacity onPress={() => markAllAsRead()}>
              <Text className="text-primary text-sm font-semibold">Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <ScrollView
          className="flex-1 px-5"
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
          {isLoading && !refreshing && persistentNotifications.length === 0 ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : !hasNotifications ? (
            <View className="items-center justify-center py-20">
              <View className="w-20 h-20 rounded-full bg-[#2C2C2E] items-center justify-center mb-4">
                <Ionicons name="notifications-off-outline" size={40} color={Colors.textSecondary} />
              </View>
              <Text className="text-text text-lg font-semibold mb-2">No notifications yet</Text>
              <Text className="text-text-secondary text-sm text-center leading-5 px-10">
                You&apos;ll see your notifications here when you have some activity
              </Text>
            </View>
          ) : (
            <>
              {renderNotificationGroup('Today', groupedNotifications.today)}
              {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
              {renderNotificationGroup('Older', groupedNotifications.older)}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
