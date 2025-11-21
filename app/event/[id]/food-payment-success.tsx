import Header from '@/components/Header';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FoodPaymentSuccessScreen() {
  const router = useRouter();
  const { id, ticketId } = useLocalSearchParams<{ id?: string; ticketId?: string }>();
  const scaleValue = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    // Animate the checkmark icon
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  const handleBackToMenu = () => {
    router.push(`/event/${id}/menu`);
  };

  const handleViewOrders = () => {
    router.push(`/event/${id}/orders`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => { }}
      />

      <View className="flex-1 px-5 justify-center">
        <View className="items-center py-10">
          <Animated.View className="mb-8" style={{ transform: [{ scale: scaleValue }] }}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </Animated.View>

          <Text className="text-text text-3xl font-bold text-center mb-4">Order Successful!</Text>
          <Text className="text-text-secondary text-base text-center leading-6 mb-8 px-5">
            Your food order has been placed successfully and linked to your ticket.
          </Text>

          {ticketId && (
            <View className="bg-card rounded-2xl p-5 mb-8 w-full items-center">
              <Text className="text-text-secondary text-sm mb-2">Linked to Ticket:</Text>
              <Text className="text-text text-lg font-bold">{ticketId}</Text>
            </View>
          )}

          <View className="bg-[#4CAF50]/10 rounded-2xl p-5 w-full border border-[#4CAF50]/20">
            <Text className="text-text text-base font-bold mb-3 text-center">What&apos;s Next?</Text>
            <Text className="text-text-secondary text-sm leading-5">
              • Your order will be prepared for pickup at the event
              {'\n'}• Check your order status in the Orders section
              {'\n'}• Show your ticket ID when collecting your food
            </Text>
          </View>
        </View>

        <View className="pb-8 gap-4">
          <TouchableOpacity
            className="bg-transparent border-2 border-primary rounded-full py-4 items-center"
            onPress={handleViewOrders}
          >
            <Text className="text-primary text-base font-semibold">View My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center"
            onPress={handleBackToMenu}
          >
            <Text className="text-text text-base font-semibold">Order More Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
