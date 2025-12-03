import Skeleton from '@/components/Skeleton';
import Colors from '@/constants/Colors';
import { useFood } from '@/contexts/FoodContext';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedTab, setSelectedTab] = useState<'menu' | 'orders'>('menu');
  const { fetchFoodsByEvent, isLoading, foods } = useFood();

  useEffect(() => {
    if (id) {
      fetchFoodsByEvent(id.toString());
    }
  }, [id, fetchFoodsByEvent]);

  // Map foods to menu items format
  const currentMenuItems = foods.map(food => ({
    id: food.food_id,
    name: food.foodname,
    category: 'food', // You can add category to Food model later if needed
    price: food.foodprice,
    available: food.quantity > 0,
    description: food.fooddescription || `Delicious ${food.foodname}`,
    image: food.foodimage,
  }));

  const handleOrderItem = (item: any) => {
    if (!item.available) return;
    router.push(`/event/${id}/food-detail?itemId=${item.id}`);
  };

  const handleSwitchToOrders = () => {
    setSelectedTab('orders');
    router.push(`/event/${id}/orders`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍔';
      case 'drinks': return '🥤';
      case 'snacks': return '🍿';
      default: return '🍽️';
    }
  };

  const groupedItems = currentMenuItems.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />

      <View className="flex-1">
        <View className="flex-row items-center px-5 py-4 mb-5">
          <TouchableOpacity onPress={() => router.replace('/home')} className="mr-3 p-1">
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-text text-lg font-bold">Event Menu</Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row mx-5 bg-card rounded-3xl p-1 mb-5">
          <TouchableOpacity
            className={`flex-1 py-3 px-5 rounded-3xl items-center ${selectedTab === 'menu' ? 'bg-primary' : ''}`}
            onPress={() => setSelectedTab('menu')}
          >
            <Text className={`text-base font-medium ${selectedTab === 'menu' ? 'text-text font-semibold' : 'text-text-secondary'}`}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 px-5 rounded-3xl items-center ${selectedTab === 'orders' ? 'bg-primary' : ''}`}
            onPress={handleSwitchToOrders}
          >
            <Text className={`text-base font-medium ${selectedTab === 'orders' ? 'text-text font-semibold' : 'text-text-secondary'}`}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View className="gap-4">
              <Skeleton height={180} radius={16} />
              <Skeleton height={180} radius={16} />
              <Skeleton height={180} radius={16} />
            </View>
          ) : currentMenuItems.length === 0 ? (
            <View className="py-16 items-center justify-center">
              <Text className="text-text text-lg font-semibold mb-2">No menu items available</Text>
              <Text className="text-text-secondary text-sm">Check back later!</Text>
            </View>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <View key={category} className="mb-8">
                <View className="flex-row items-center mb-4">
                  <Text className="text-2xl mr-3">{getCategoryIcon(category)}</Text>
                  <Text className="text-text text-xl font-bold">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </View>

                <View className="flex-row flex-wrap justify-between">
                  {(items as any[]).map((item: any) => (
                    <MenuItemComponent key={item.id} item={item} onPress={() => handleOrderItem(item)} />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Menu Item Component
const MenuItemComponent: React.FC<{ item: any; onPress: () => void }> = ({ item, onPress }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <TouchableOpacity
      className="bg-card rounded-2xl mb-4 overflow-hidden w-[48%] relative"
      onPress={onPress}
      disabled={!item.available}
      activeOpacity={0.8}
    >
      {/* Food Image - Centered */}
      <View className="items-center justify-center pt-4 pb-2 bg-card">
        <Image
          source={require('@/assets/images/m1.png')}
          className="w-[120px] h-[120px]"
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View className="px-4 pb-4">
        {/* Title */}
        <Text className="text-text text-base font-bold mb-1" numberOfLines={1}>
          {item.name}
        </Text>

        {/* Description */}
        <Text className="text-text-secondary text-xs mb-3" numberOfLines={2}>
          {item.description || `This is a ${item.name.toLowerCase()} for people`}
        </Text>

        {/* Rating and Favorite */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-base mr-1">⭐</Text>
            <Text className="text-text text-sm font-medium">4+</Text>
          </View>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="p-1"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#ff4444" : Colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Out of stock overlay */}
      {!item.available && (
        <View className="absolute inset-0 bg-black/60 justify-center items-center rounded-2xl">
          <Text className="text-white text-sm font-bold">Out of Stock</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};