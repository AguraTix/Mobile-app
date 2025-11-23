import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Skeleton from "@/components/Skeleton";
import Colors from "@/constants/Colors";
import { useAuth, useCart, useEvent, useOrder } from "@/contexts";
import { FoodOrderStatus } from "@/types/order";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
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
  const { featuredEvents, upcomingEvents, fetchEvents, fetchFeaturedEvents, isLoading: loading } = useEvent();
  const { myOrders, fetchMyOrders, isLoading: ordersLoading } = useOrder();
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Music Festival",
    "Art Exhibition",
    "Tech Conference",
    "Food & Drink"
  ]);
  const [popularSearches] = useState<string[]>([
    "Live Concerts",
    "Workshops",
    "Networking",
    "Sports"
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

  // Mock menu items
  const mockMenuItems = [
    { id: '1', name: 'Burger', category: 'food', price: 5000, available: true, image: require('@/assets/images/m1.png') },
    { id: '2', name: 'Pizza', category: 'food', price: 8000, available: true, image: require('@/assets/images/m1.png') },
    { id: '3', name: 'Coke', category: 'drinks', price: 2000, available: true, image: require('@/assets/images/m1.png') },
  ];

  const handleAddToCart = (item: any) => {
    if (!item.available) return;

    addItem({
      order_id: Math.random().toString(36).substr(2, 9),
      user_id: user?.user_id || 'guest',
      food_id: item.id,
      event_id: 'mock-event-id', // Placeholder
      order_status: FoodOrderStatus.PENDING,
      quantity: 1,
      Food: {
        food_id: item.id,
        event_id: 'mock-event-id',
        foodname: item.name,
        fooddescription: 'Delicious ' + item.name,
        foodprice: item.price,
        quantity: 100, // Mock available quantity
        admin_id: 'mock-admin',
        // category: item.category, // Removed as it's not in Food interface
        // available: true, // Removed as it's not in Food interface
        foodimage: '', // Mock image string
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    });

    Alert.alert("Success", `${item.name} added to cart!`);
  };

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
    try {
      await Promise.all([
        fetchEvents(),
        fetchFeaturedEvents(),
        fetchMyOrders()
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
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
        {ordersLoading ? (
          <View className="mb-8 px-5">
            <SectionHeader
              title="Active Orders"
              subtitle="Track your food & drinks"
              showSeeAll={false}
            />
            <View className="h-[100px] justify-center">
              <Loading size="small" />
            </View>
          </View>
        ) : myOrders.length > 0 && (
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
            {mockMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-card rounded-2xl overflow-hidden w-[200px] relative"
                onPress={() => handleAddToCart(item)}
                activeOpacity={0.8}
                style={styles.shadow}
              >
                <Image
                  source={item.image}
                  className="w-full h-[120px]"
                />
                <View className="p-4">
                  <Text className="text-text text-base font-semibold mb-1">{item.name}</Text>
                  <Text className="text-primary text-sm font-bold mb-3">
                    {item.price.toLocaleString()} RWF
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <View className={`px-3 py-1.5 rounded-lg ${!item.available ? 'bg-text-secondary' : 'bg-primary'}`}>
                      <Text className={`text-xs font-semibold ${!item.available ? 'text-background' : 'text-text'}`}>
                        {item.available ? 'Order' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

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