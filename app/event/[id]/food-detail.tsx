import Header from '@/components/Header';
import Skeleton from '@/components/Skeleton';
import Colors from '@/constants/Colors';
import { useAuth, useCart } from '@/contexts';
import { useFood } from '@/contexts/FoodContext';
import { FoodOrderStatus } from '@/types/order';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id, itemId } = useLocalSearchParams<{ id?: string; itemId?: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { currentFood, fetchFoodById, isLoading } = useFood();

  useEffect(() => {
    if (itemId) {
      fetchFoodById(itemId.toString());
    }
  }, [itemId, fetchFoodById]);

  const foodItem = currentFood;

  const handleAddToCart = () => {
    if (!foodItem || foodItem.quantity <= 0) return;

    // Add item to cart
    addItem({
      order_id: Math.random().toString(36).substr(2, 9),
      user_id: user?.user_id || 'guest',
      food_id: foodItem.food_id,
      event_id: id || foodItem.event_id,
      order_status: FoodOrderStatus.PENDING,
      quantity: quantity,
      Food: foodItem
    });

    Alert.alert(
      "Added to Cart",
      `${quantity} x ${foodItem.foodname} added to cart!`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => router.push(`/event/${id}/cart`) }
      ]
    );
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <StatusBar style="light" />

        {/* Header */}
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-text text-lg font-semibold">Event Menu</Text>
        </View>

        <View className="flex-1 px-5">
          <Skeleton height={200} radius={24} />
          <View className="h-6" />
          <Skeleton height={60} radius={16} />
          <View className="h-6" />
          <Skeleton height={100} radius={16} />
        </View>
      </SafeAreaView>
    );
  }

  if (!foodItem) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <StatusBar style="light" />
        <Header showLogo showProfile showSearch />

        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-text text-base text-center mb-5">Item not found</Text>
          <TouchableOpacity className="bg-primary px-6 py-3 rounded-lg" onPress={() => router.back()}>
            <Text className="text-text text-base font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />

      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-5 py-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-text text-lg font-semibold">Event Menu</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Food Image - Centered */}
          <View className="items-center justify-center py-8 bg-card mx-5 rounded-3xl mb-6">
            <Image
              source={
                foodItem.foodimage
                  ? { uri: foodItem.foodimage }
                  : require('@/assets/images/m1.png')
              }
              className="w-[200px] h-[200px]"
              resizeMode="contain"
            />
          </View>

          {/* Quantity Selector */}
          {foodItem.quantity > 0 && (
            <View className="items-center mb-6">
              <View className="flex-row items-center bg-primary rounded-full px-2 py-2">
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                  onPress={decrementQuantity}
                  disabled={quantity === 1}
                >
                  <Ionicons name="remove" size={20} color={Colors.text} />
                </TouchableOpacity>

                <Text className="text-text text-lg font-bold mx-6 min-w-[30px] text-center">
                  {quantity}
                </Text>

                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                  onPress={incrementQuantity}
                >
                  <Ionicons name="add" size={20} color={Colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Food Details */}
          <View className="px-5">
            {/* Title */}
            <Text className="text-text text-2xl font-bold mb-4 text-center">
              {foodItem.foodname}
            </Text>

            {/* Info Badges */}
            <View className="flex-row justify-center items-center mb-6 flex-wrap">
              <View className="flex-row items-center mr-4 mb-2">
                <Text className="text-base mr-1">⭐</Text>
                <Text className="text-text text-sm">4+</Text>
              </View>

              <View className="flex-row items-center mr-4 mb-2">
                <Text className="text-base mr-1">🔥</Text>
                <Text className="text-text text-sm">300cal</Text>
              </View>

              <View className="flex-row items-center mb-2">
                <Text className="text-base mr-1">⏱️</Text>
                <Text className="text-text text-sm">5-10min</Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-text-secondary text-sm leading-6 text-center mb-6">
              {foodItem.fooddescription || "Delicious food item prepared with care and quality ingredients."}
            </Text>

            {/* Availability Status */}
            {foodItem.quantity <= 0 && (
              <View className="flex-row items-center justify-center mb-6">
                <View className="w-2 h-2 rounded-full mr-2 bg-[#ff4444]" />
                <Text className="text-[#ff4444] text-sm font-semibold">
                  Out of Stock
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Add to Cart Button */}
        {foodItem.quantity > 0 && (
          <View className="absolute bottom-0 left-0 right-0 p-5 bg-background">
            <TouchableOpacity
              className="bg-primary rounded-full py-4 items-center"
              onPress={handleAddToCart}
            >
              <Text className="text-white text-base font-bold">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}