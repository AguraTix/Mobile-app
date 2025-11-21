import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useAuth } from "@/contexts";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth()
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    // Mock logout - just navigate to login
    router.replace("/auth/login");
  };

  const handleEditAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        // Mock update - just log
        console.log('Profile image updated:', result.assets[0].uri);
      }
    } catch (e) {
      // no-op
    }
  };

  // Mock user statistics
  const userStats = {
    eventsAttended: 24,
    ticketsPurchased: 31,
    totalSpent: 1247,
    averageRating: 4.8,
    favoriteCategories: ["Music", "Tech", "Food"],
    memberSince: "2023",
  };

  // Mock achievements
  const achievements = [
    { id: "1", title: "First Event", description: "Attended your first event", icon: "🎉", unlocked: true },
    { id: "2", title: "Regular Attendee", description: "Attended 10+ events", icon: "🎯", unlocked: true },
    { id: "3", title: "Music Lover", description: "Attended 5 music events", icon: "🎵", unlocked: true },
    { id: "4", title: "Tech Enthusiast", description: "Attended 3 tech events", icon: "💻", unlocked: false },
    { id: "5", title: "Social Butterfly", description: "Shared 10 events", icon: "🦋", unlocked: false },
    { id: "6", title: "Early Bird", description: "Booked 5+ events in advance", icon: "🌅", unlocked: true },
    { id: "7", title: "Foodie", description: "Attended 3 food & wine events", icon: "🍷", unlocked: false },
    { id: "8", title: "VIP Member", description: "Spent over $1000 on events", icon: "👑", unlocked: true },
  ];

  // Mock recent activity
  const recentActivity = [
    { id: "1", type: "ticket", title: "Purchased ticket for Summer Music Festival", time: "2 hours ago", icon: () => <Ionicons name="document-text" size={20} /> },
    { id: "2", type: "event", title: "Attended Tech Startup Meetup", time: "1 day ago", icon: () => <Ionicons name="calendar" size={20} /> },
    { id: "3", type: "favorite", title: "Added Food & Wine Expo to favorites", time: "2 days ago", icon: () => <Ionicons name="heart" size={20} /> },
    { id: "4", type: "share", title: "Shared Agura Launch Event", time: "3 days ago", icon: () => <Ionicons name="share-social" size={20} /> },
    { id: "5", type: "review", title: "Rated Jazz Night 5 stars", time: "4 days ago", icon: () => <Ionicons name="star" size={20} /> },
    { id: "6", type: "payment", title: "Updated payment method", time: "1 week ago", icon: () => <Ionicons name="card" size={20} /> },
  ];

  const profileMenuItems = [
    {
      id: "profile",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      icon: () => <Ionicons name="create" size={20} />,
      onPress: () => router.push("/profile/setup"),
      color: Colors.primary,
      badge: null,
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Manage your notification preferences",
      icon: () => <Ionicons name="notifications" size={20} />,
      onPress: () => router.push("/profile/notifications"),
      color: "#10b981",
      badge: 3,
    },
    {
      id: "payment",
      title: "Payment Methods",
      subtitle: "Manage your payment options",
      icon: () => <Ionicons name="card" size={20} />,
      onPress: () => router.push("/profile/payment-methods"),
      color: "#f59e0b",
      badge: null,
    },
    {
      id: "tickets",
      title: "My Tickets",
      subtitle: "View and manage your tickets",
      icon: () => <Ionicons name="document-text" size={20} />,
      onPress: () => router.push("/tickets"),
      color: "#8b5cf6",
      badge: 2,
    },
    {
      id: "favorites",
      title: "Favorites",
      subtitle: "Events you've saved",
      icon: () => <Ionicons name="heart" size={20} />,
      onPress: () => {
        console.log('Navigate to favorites');
      },
      color: "#ef4444",
      badge: 8,
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "App preferences and configuration",
      icon: () => <Ionicons name="settings" size={20} />,
      onPress: () => router.push("/profile/settings"),
      color: "#6b7280",
      badge: null,
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: () => <Ionicons name="help-circle" size={20} />,
      onPress: () => router.push("/profile/help-support"),
      color: "#3b82f6",
      badge: null,
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      subtitle: "Manage your privacy settings",
      icon: () => <Ionicons name="shield-checkmark" size={20} />,
      onPress: () => {
        console.log('Navigate to privacy settings');
      },
      color: "#059669",
      badge: null,
    },
    {
      id: "categories",
      title: "Favorite Categories",
      subtitle: "Manage your event preferences",
      icon: () => <Ionicons name="grid" size={20} />,
      onPress: () => router.push("/profile/categories"),
      color: "#ec4899",
      badge: 3,
    },
    {
      id: "contact",
      title: "Contact Us",
      subtitle: "Get in touch with our team",
      icon: () => <Ionicons name="chatbubble" size={20} />,
      onPress: () => router.push("/profile/contact"),
      color: "#06b6d4",
      badge: null,
    },
  ];

  const renderStatsCard = () => (
    <View className="bg-card mx-5 mt-6 rounded-2xl p-5" style={styles.shadow}>
      <Text className="text-lg font-semibold text-text mb-5 text-center">Your Activity</Text>
      <View className="flex-row justify-between">
        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-[20px] items-center justify-center mb-2 bg-primary/10">
            <Ionicons name="calendar" size={20} color={Colors.primary} />
          </View>
          <Text className="text-lg font-bold text-text mb-1">{userStats.eventsAttended}</Text>
          <Text className="text-xs text-text-secondary font-medium">Events</Text>
        </View>
        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-[20px] items-center justify-center mb-2 bg-[#10b981]/10">
            <Ionicons name="document-text" size={20} color="#10b981" />
          </View>
          <Text className="text-lg font-bold text-text mb-1">{userStats.ticketsPurchased}</Text>
          <Text className="text-xs text-text-secondary font-medium">Tickets</Text>
        </View>
        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-[20px] items-center justify-center mb-2 bg-[#f59e0b]/10">
            <Ionicons name="cash" size={20} color="#f59e0b" />
          </View>
          <Text className="text-lg font-bold text-text mb-1">${userStats.totalSpent}</Text>
          <Text className="text-xs text-text-secondary font-medium">Spent</Text>
        </View>
        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-[20px] items-center justify-center mb-2 bg-[#8b5cf6]/10">
            <Ionicons name="star" size={20} color="#8b5cf6" />
          </View>
          <Text className="text-lg font-bold text-text mb-1">{userStats.averageRating}</Text>
          <Text className="text-xs text-text-secondary font-medium">Rating</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View className="mt-6 px-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-text">Achievements</Text>
        <TouchableOpacity onPress={() => {
          console.log('Navigate to achievements');
        }}>
          <Text className="text-sm text-primary font-medium">See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
        {achievements.map((achievement) => (
          <TouchableOpacity
            key={achievement.id}
            className="w-[120px] items-center bg-card rounded-xl p-4"
            style={styles.smallShadow}
            onPress={() => {
              console.log('View achievement:', achievement.id);
            }}
            activeOpacity={0.7}
          >
            <View className={`w-12 h-12 rounded-[24px] bg-primary items-center justify-center mb-3 ${!achievement.unlocked ? 'bg-text-secondary opacity-30' : ''}`}>
              <Text className="text-2xl">{achievement.icon}</Text>
            </View>
            <Text className={`text-sm font-semibold text-text text-center mb-1 ${!achievement.unlocked ? 'text-text-secondary' : ''}`}>
              {achievement.title}
            </Text>
            <Text className={`text-xs text-text-secondary text-center leading-4 ${!achievement.unlocked ? 'opacity-60' : ''}`}>
              {achievement.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRecentActivity = () => (
    <View className="mt-6 px-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-text">Recent Activity</Text>
        <TouchableOpacity onPress={() => {
          console.log('Navigate to activity');
        }}>
          <Text className="text-sm text-primary font-medium">See All</Text>
        </TouchableOpacity>
      </View>
      <View className="gap-3">
        {recentActivity.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            className="flex-row items-center bg-card rounded-xl p-4"
            style={styles.smallShadow}
            onPress={() => {
              console.log('View activity:', activity.id);
            }}
            activeOpacity={0.7}
          >
            <View className="w-8 h-8 rounded-[16px] items-center justify-center mr-3 bg-primary/10">
              <Ionicons name="document-text" size={16} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-text mb-0.5">{activity.title}</Text>
              <Text className="text-xs text-text-secondary">{activity.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Header title="Profile" showBack />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          className="items-center px-5 py-8 bg-primary mx-5 mt-5 rounded-[20px]"
          style={[{ opacity: fadeAnim }, styles.headerShadow]}
        >
          <View className="relative mb-5">
            <Image
              source={require("@/assets/images/profile.jpg")}
              className="w-20 h-20 rounded-[40px] border-[3px] border-white"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 w-7 h-7 rounded-[14px] bg-primary items-center justify-center border-2 border-white"
              onPress={handleEditAvatar}
            >
              <Ionicons name="create" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-2">
            <Text className="text-2xl font-bold text-white mb-2 text-center">{user?.name || "User Name"}</Text>
            <TouchableOpacity
              className="ml-3 p-2 bg-white/20 rounded-[20px]"
              onPress={() => router.push("/profile/setup")}
              activeOpacity={0.7}
            >
              <Ionicons name="create" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text className="text-base text-white/90 mb-6 text-center font-medium">{user?.email || "user@example.com"}</Text>

          <View className="mb-6 items-center">
            <View className="flex-row items-center mb-1">
              <Ionicons name="location" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text className="text-sm text-white/80 ml-1.5 font-medium">Member since {userStats.memberSince}</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="star" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text className="text-sm text-white/80 ml-1.5 font-medium">{userStats.averageRating} average rating</Text>
            </View>
          </View>

          <Button
            title="Edit Profile"
            variant="outline"
            size="small"
            icon={() => <Ionicons name="create" size={20} />}
            onPress={() => router.push("/profile/setup")}
            style={{ marginLeft: 12, padding: 8, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 20 }}
          />
        </Animated.View>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Achievements */}
        {renderAchievements()}

        {/* Recent Activity */}
        {renderRecentActivity()}

        {/* Menu Items */}
        <View className="px-5 mt-8">
          <Text className="text-lg font-semibold text-text mb-4">Account Settings</Text>
          {profileMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between bg-card rounded-2xl p-5 mb-3"
              style={styles.shadow}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-11 h-11 rounded-[22px] items-center justify-center mr-4" style={{ backgroundColor: `${item.color}15` }}>
                  <Ionicons name="settings" size={20} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-text mb-1">{item.title}</Text>
                  <Text className="text-sm text-text-secondary leading-[18px]">{item.subtitle}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                {item.badge && (
                  <View className="bg-primary rounded-xl px-2 py-1 min-w-[20px] items-center justify-center">
                    <Text className="text-xs font-semibold text-white">{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Section */}
        <View className="px-5 mt-8">
          <Button
            title="Logout"
            variant="ghost"
            size="large"
            icon={() => <Ionicons name="log-out" size={20} />}
            onPress={handleLogout}
            style={{ borderColor: "#ef4444" }}
          />
        </View>

        {/* App Version */}
        <View className="items-center pt-5">
          <Text className="text-sm text-text-secondary font-medium">Agura v1.0.0</Text>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  smallShadow: {
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerShadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
