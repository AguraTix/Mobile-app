import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Skeleton from "@/components/Skeleton";
import Colors from "@/constants/Colors";
import { useAuth, useEvent, useOrder } from "@/contexts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");



export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth()
  const { events, featuredEvents, upcomingEvents, fetchEvents, fetchFeaturedEvents, isLoading: loading } = useEvent();
  const { myOrders, fetchMyOrders } = useOrder();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "music festival",
    "tech conference",
    "food expo",
    "art exhibition"
  ]);
  const [popularSearches, setPopularSearches] = useState<string[]>([
    "summer events",
    "live music",
    "sports games",
    "business networking"
  ]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const quickActions = [
    {
      id: "1",
      title: "My Tickets",
      icon: "🎫",
      color: Colors.primary,
      onPress: () => router.push("/tickets")
    },
    {
      id: "2",
      title: "Book Event",
      icon: "📅",
      color: "#3b82f6",
      onPress: () => router.push("/events-user")
    },
    {
      id: "3",
      title: "Food & Drinks",
      icon: "🍔",
      color: "#f59e0b",
      onPress: () => router.push("/events-user")
    },
    {
      id: "4",
      title: "Get Help",
      icon: "❓",
      color: "#10b981",
      onPress: () => router.push("/profile/help-support")
    }
  ];

  // Filter for Food & Drinks events
  const foodEvents = useMemo(() => {
    if (!events) return [];
    const keywords = ["food", "drink", "dining", "lunch", "dinner", "brunch", "wine", "beer", "cocktail"];
    return events.filter(event => {
      const text = `${event.title} ${event.description || ""}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    });
  }, [events]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecentSearches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(newRecentSearches);
    }
  };

  const handleEventPress = (eventId: string) => {
    if (!eventId) return
    router.push(`/event/${eventId}`);
  };

  const handleViewAllEvents = () => {
    router.push("/events-user");
  };

  const handleViewAllUpcoming = () => {
    router.push("/events/upcoming");
  };

  const handleQuickAction = (action: any) => {
    action.onPress();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents()
    await fetchFeaturedEvents();
    await fetchMyOrders();
    setRefreshing(false);
  };

  const handleNotificationPress = () => {
    Alert.alert("Notifications", "You have 3 new notifications");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-text mb-1">Hello, {user?.name || 'Guest'}! 👋</Text>
            <Text className="text-base text-text-secondary">Discover amazing events today</Text>
          </View>
          <TouchableOpacity
            className="relative p-2 rounded-lg bg-card"
            onPress={handleNotificationPress}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications" size={24} color={Colors.text} />
            <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-5">
          <SearchBar
            placeholder="Search events, venues, or categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={handleSearch}
            showFilter={true}
            showSuggestions={true}
            recentSearches={recentSearches}
            popularSearches={popularSearches}
          />
        </View>

        {/* Quick Actions */}
        <View className="mb-8 px-5">
          <Text className="text-xl font-bold text-text mb-4">Quick Actions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="w-[140px] p-4 rounded-lg items-center justify-center min-h-[100px] bg-card mr-4"
                style={[{ backgroundColor: action.color + '20' }, styles.shadow]}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.8}
              >
                <Text className="text-2xl mb-2">{action.icon}</Text>
                <Text className="text-sm font-semibold text-text text-center">{action.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Active Orders */}
        {myOrders.length > 0 && (
          <View className="mb-8 px-5">
            <SectionHeader
              title="Active Orders"
              subtitle="Track your food & drinks"
              showSeeAll={false}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {myOrders.map((order) => (
                <TouchableOpacity
                  key={order.order_id}
                  className="w-[280px] bg-card p-4 rounded-2xl flex-row items-center mr-4"
                  style={styles.shadow}
                  onPress={() => router.push(`/event/${order.event_id}/orders`)}
                >
                  <View className="w-16 h-16 rounded-xl bg-background items-center justify-center mr-4">
                    <Text className="text-2xl">🍔</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-text font-bold text-base mb-1" numberOfLines={1}>
                      Order #{order.order_id.slice(-4)}
                    </Text>
                    <Text className="text-text-secondary text-sm mb-2" numberOfLines={1}>
                      {order.quantity || 1} items • {order.order_status}
                    </Text>
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-primary mr-2" />
                      <Text className="text-primary text-xs font-medium">In Progress</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured Events */}
        <View className="mb-10">
          <View className="px-5">
            <SectionHeader
              title="Featured Events"
              subtitle="Handpicked events just for you"
              showSeeAll={true}
              onSeeAllPress={handleViewAllEvents}
            />
          </View>
          {loading ? (
            <View className="flex-row px-5 gap-5">
              <View className="w-[calc(100vw-40px)] mr-5"><Skeleton height={200} radius={16} /></View>
              <View className="w-[calc(100vw-40px)] mr-5"><Skeleton height={200} radius={16} /></View>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {featuredEvents.map((event) => (
                <View key={event.event_id} style={{ width: width - 40, marginRight: 20 }}>
                  <EventCard
                    event={event}
                    variant="detailed"
                    onPress={() => handleEventPress(event.event_id)}
                    onFavorite={() => Alert.alert("Favorite", "Added to favorites")}
                    onShare={() => Alert.alert("Share", "Sharing event...")}
                    onBookmark={() => Alert.alert("Bookmark", "Bookmarked event")}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Upcoming Events */}
        <View className="mb-10 px-5">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Events happening soon"
            showSeeAll={true}
            onSeeAllPress={handleViewAllUpcoming}
          />
          {loading ? (
            <View className="gap-3">
              <Skeleton height={92} radius={12} />
              <Skeleton height={92} radius={12} />
              <Skeleton height={92} radius={12} />
            </View>
          ) : (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                variant="default"
                onPress={() => handleEventPress(event.event_id)}
                onFavorite={() => Alert.alert("Favorite", "Added to favorites")}
              />
            ))
          )}
        </View>

        {/* Food & Drinks Section */}
        {foodEvents.length > 0 && (
          <View className="mb-10 px-5">
            <SectionHeader
              title="Food & Drinks"
              subtitle="Events with great dining options"
              showSeeAll={true}
              onSeeAllPress={() => router.push("/events-user")}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {foodEvents.map((event) => (
                <View key={event.event_id} style={{ width: 280, marginRight: 16 }}>
                  <EventCard
                    event={event}
                    variant="detailed"
                    onPress={() => handleEventPress(event.event_id)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-[100px]" />
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
});