import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock food items
const mockFoodItems: any = {
  '1': { id: '1', name: 'Burger', price: 5000, available: true, description: 'Delicious burger' },
  '2': { id: '2', name: 'Pizza', price: 8000, available: true, description: 'Fresh pizza' },
  '3': { id: '3', name: 'Coke', price: 2000, available: true, description: 'Cold drink' },
};

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id, itemId } = useLocalSearchParams<{ id?: string; itemId?: string }>();
  const [quantity, setQuantity] = useState(1);

  const foodItem = itemId ? mockFoodItems[itemId] : null;

  const handleAddToCart = () => {
    if (!foodItem || !foodItem.available) return;
    router.push(`/event/${id}/cart`);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }

    if (hasHalfStar) {
      stars.push('⭐');
    }

    return stars.join('');
  };

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
      <Header showLogo showProfile showSearch />

      <View className="flex-1">
        <View className="flex-row items-center px-5 mb-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-text text-lg font-bold">Food Detail</Text>
        </View>

        <View className="flex-1 mx-5 border-2 border-primary border-dashed rounded-2xl overflow-hidden">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Food Image */}
            <View className="h-[250px] bg-card">
              <Image
                source={
                  foodItem.image_url
                    ? { uri: foodItem.image_url }
                    : require('@/assets/images/m1.png')
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Food Details */}
            <View className="p-6 bg-background">
              <Text className="text-text text-2xl font-bold mb-3">{foodItem.name}</Text>

              {/* Rating */}
              <View className="flex-row items-center mb-4">
                <Text className="text-base mr-2">
                  {renderStars(foodItem.rating || 4.5)}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {(foodItem.rating || 4.5).toFixed(1)} ({foodItem.review_count || 180} reviews)
                </Text>
              </View>

              {/* Price */}
              <Text className="text-primary text-xl font-bold mb-4">
                {foodItem.price.toLocaleString()} {foodItem.currency}
              </Text>

              {/* Description */}
              <Text className="text-text text-base leading-6 mb-5">
                {foodItem.description}
              </Text>

              {/* Availability Status */}
              <View className="flex-row items-center mb-6">
                <View
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: foodItem.available ? '#4CAF50' : '#ff4444' }}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{ color: foodItem.available ? '#4CAF50' : '#ff4444' }}
                >
                  {foodItem.available ? 'Available' : 'Out of Stock'}
                </Text>
              </View>

              {/* Quantity Controls */}
              {foodItem.available && (
                <View className="flex-row items-center justify-between mb-5">
                  <Text className="text-text text-base font-semibold">Quantity:</Text>
                  <View className="flex-row items-center bg-card rounded-full px-1 py-1">
                    <TouchableOpacity
                      className={`w-9 h-9 rounded-full items-center justify-center ${quantity === 1 ? 'bg-text-secondary opacity-50' : 'bg-primary'}`}
                      onPress={decrementQuantity}
                      disabled={quantity === 1}
                    >
                      <Ionicons name="remove" size={20} color={quantity === 1 ? Colors.textSecondary : Colors.text} />
                    </TouchableOpacity>

                    <Text className="text-text text-lg font-bold mx-5 min-w-[24px] text-center">{quantity}</Text>

                    <TouchableOpacity className="w-9 h-9 rounded-full bg-primary items-center justify-center" onPress={incrementQuantity}>
                      <Ionicons name="add" size={20} color={Colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Total Price */}
              {foodItem.available && (
                <View className="flex-row justify-between items-center pt-5 border-t border-border">
                  <Text className="text-text text-lg font-semibold">Total:</Text>
                  <Text className="text-primary text-xl font-bold">
                    {(foodItem.price * quantity).toLocaleString()} {foodItem.currency}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Add to Cart Button */}
        {foodItem.available && (
          <View className="absolute bottom-0 left-0 right-0 p-5 bg-background border-t border-border">
            <TouchableOpacity className="bg-primary rounded-full py-4 items-center" onPress={handleAddToCart}>
              <Text className="text-text text-base font-bold">
                Add to Cart - {(foodItem.price * quantity).toLocaleString()} {foodItem.currency}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}