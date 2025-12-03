import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import FoodCard from "@/components/FoodCard";
import SectionHeader from "@/components/SectionHeader";
import Colors from "@/constants/Colors";
import { useAuth, useEvent, useOrder } from "@/contexts";
import { useFood } from "@/contexts/FoodContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
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
  const { foods, fetchAllFoods, isLoading: foodsLoading } = useFood()
  const { myOrders, fetchMyOrders, isLoading: ordersLoading } = useOrder();
  const [refreshing, setRefreshing] = useState(false);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const handleEventPress = (eventId: string) => {
    if (!eventId) return
    router.push(`/event/${eventId}`);
  };

  const handleViewAllEvents = () => {
    router.push("/events-user");
  };



  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchEvents(),
        fetchFeaturedEvents(),
        fetchAllFoods(),
        fetchMyOrders(),
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchFeaturedEvents();
    fetchAllFoods();
    fetchMyOrders();
  }, [fetchEvents, fetchFeaturedEvents, fetchAllFoods, fetchMyOrders]);

  useEffect(() => {
    fetchAllFoods();
  }, [fetchAllFoods]);

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
        {/* Top Header with Logo */}
        <View className="flex-row justify-between items-center px-5 py-4">
          <Text className="text-2xl font-bold text-text">Agura</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="p-2"
              onPress={() => router.push("/events-user")}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              className="relative p-2"
              onPress={handleNotificationPress}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              className="relative"
              onPress={handleNotificationPress}
              activeOpacity={0.8}
            >
              <Image
                source={require('@/assets/images/profile.jpg')}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Events Title with See All */}
        <View className="flex-row justify-between items-center px-5 mb-4">
          <Text className="text-xl font-bold text-text">Upcoming Events</Text>
          <TouchableOpacity onPress={handleViewAllEvents}>
            <Text className="text-primary text-base font-semibold">See All</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Events Carousel */}
        <View className="mb-6">
          {loading ? (
            <View className="px-5 py-32 items-center justify-center">
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : upcomingEvents.length === 0 ? (
            <View className="px-5 py-16 items-center justify-center bg-card rounded-2xl mx-5">
              <Text className="text-6xl mb-4">📅</Text>
              <Text className="text-text text-lg font-semibold mb-2">No Upcoming Events</Text>
              <Text className="text-text-secondary text-sm text-center">Check back later for exciting events!</Text>
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const slideIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                  setActiveSlide(slideIndex);
                }}
                scrollEventThrottle={16}
              >
                {upcomingEvents.slice(0, 3).map((event) => (
                  <View key={event.event_id} style={{ width: width }} className="px-5">
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

              {/* Dots Indicator */}
              <View className="flex-row justify-center items-center mt-2 gap-2">
                {upcomingEvents.slice(0, 3).map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 rounded-full ${index === activeSlide ? 'w-6 bg-primary' : 'w-2 bg-text-secondary'}`}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {/* Available Events */}
        <View className="mb-6 px-5">
          <SectionHeader
            title="Available Events"
            subtitle=""
            showSeeAll={true}
            onSeeAllPress={handleViewAllEvents}
          />
          {loading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : featuredEvents.length === 0 ? (
            <View className="py-12 items-center justify-center bg-card rounded-2xl">
              <Text className="text-5xl mb-3">🎉</Text>
              <Text className="text-text text-base font-semibold mb-1">No Events Available</Text>
              <Text className="text-text-secondary text-sm">New events coming soon!</Text>
            </View>
          ) : (
            featuredEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                variant="list"
                onPress={() => handleEventPress(event.event_id)}
              />
            ))
          )}
        </View>

        {/* Booked Events */}
        <View className="mb-6 px-5">
          <SectionHeader
            title="Booked Events"
            subtitle=""
            showSeeAll={true}
            onSeeAllPress={() => router.push("/tickets")}
          />
          {loading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : upcomingEvents.length === 0 ? (
            <View className="py-12 items-center justify-center bg-card rounded-2xl">
              <Text className="text-5xl mb-3">🎫</Text>
              <Text className="text-text text-base font-semibold mb-1">No Booked Events</Text>
              <Text className="text-text-secondary text-sm">Book your first event today!</Text>
            </View>
          ) : (
            upcomingEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                variant="list"
                onPress={() => handleEventPress(event.event_id)}
              />
            ))
          )}
        </View>

        {/* Orders Section */}
        {myOrders.length > 0 && (
          <View className="mb-6">
            <View className="px-5">
              <SectionHeader
                title="Orders"
                subtitle=""
                showSeeAll={true}
                onSeeAllPress={() => router.push("/tickets")}
              />
            </View>
            {ordersLoading ? (
              <View className="px-5 py-12 items-center justify-center">
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <View className="px-5 gap-4">
                {myOrders.slice(0, 3).map((order) => (
                  <TouchableOpacity
                    key={order.order_id}
                    className="bg-[#1A1A1A] rounded-[24px] p-4 flex-row items-center overflow-hidden relative"
                    activeOpacity={0.8}
                    onPress={() => router.push(`/event/${order.event_id}/orders`)}
                  >
                    {/* Ribbon */}
                    <View className="absolute top-0 right-0 bg-[#2E7D32] px-6 py-1 transform rotate-45 translate-x-4 translate-y-2 z-10">
                      <Text className="text-white text-[10px] font-bold uppercase">Complete</Text>
                    </View>

                    {/* Image */}
                    <View className="w-14 h-14 rounded-2xl bg-white overflow-hidden mr-4">
                      <Image
                        source={require('@/assets/images/m1.png')}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1 mr-8">
                      <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>
                        Soft Drinks
                      </Text>
                      <Text className="text-gray-400 text-xs" numberOfLines={1}>
                        Juice and Fries
                      </Text>
                      <Text className="text-primary text-xs font-bold mt-1">
                        20,000 RWF
                      </Text>
                    </View>

                    {/* Quantity */}
                    <Text className="text-white text-lg font-medium mr-2">
                      {order.quantity || 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Food & Drinks Section */}
        <View className="mb-6">
          <View className="px-5">
            <SectionHeader
              title="Food & Drinks"
              subtitle=""
              showSeeAll={true}
              onSeeAllPress={() => router.push("/menu")}
            />
          </View>
          {foodsLoading ? (
            <View className="px-5 py-16 items-center justify-center">
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : foods.length === 0 ? (
            <View className="mx-5 py-12 items-center justify-center bg-card rounded-2xl">
              <Text className="text-5xl mb-3">🍔</Text>
              <Text className="text-text text-base font-semibold mb-1">No Food Available</Text>
              <Text className="text-text-secondary text-sm">Menu items coming soon!</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {foods.slice(0, 6).map((food) => (
                <FoodCard
                  key={food.food_id}
                  item={{
                    id: food.food_id,
                    name: food.foodname,
                    category: 'food',
                    price: food.foodprice,
                    image: food.foodimage ? { uri: food.foodimage } : require('@/assets/images/m1.png'),
                  }}
                  onPress={() => router.push(`/event/${food.event_id}/food-detail?itemId=${food.food_id}`)}
                  onAdd={() => router.push(`/event/${food.event_id}/food-detail?itemId=${food.food_id}`)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-[100px]" />
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}
