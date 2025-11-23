import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useOrder } from '@/contexts';
import { FoodOrder } from '@/types/order';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventOrdersScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedTab, setSelectedTab] = useState<'menu' | 'orders'>('orders');
  const { myOrders, fetchOrdersByEvent, isLoading } = useOrder();
  const [orders, setOrders] = useState<FoodOrder[]>([]);

  useEffect(() => {
    if (id) {
      fetchOrdersByEvent(id)
        .then(setOrders)
        .catch((error) => {
          // Fallback to myOrders if event-specific fetch fails
          setOrders(myOrders);
        });
    } else {
      setOrders(myOrders);
    }
  }, [id, myOrders]);

  const handleOrderAgain = (order: FoodOrder) => {
    // Navigate back to menu or reorder
    router.push(`/event/${id}/menu`);
  };

  // Order Item Component
  const OrderItem = ({ order }: { order: FoodOrder }) => (
    <View className="flex-row items-center bg-[#1C1C1E] rounded-2xl p-4 mb-3 relative">
      <View className="w-12 h-12 rounded-xl overflow-hidden mr-4">
        <Image
          source={require('@/assets/images/m1.png')}
          className="w-full h-full"
        />
      </View>
      <View className="flex-1">
        <Text className="text-text text-base font-semibold mb-1">Food Order</Text>
        <Text className="text-text-secondary text-sm mb-1">
          {order.special_instructions || 'No special instructions'}
        </Text>
        <Text className="text-text text-sm font-medium">
          Qty: {order.quantity}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-text text-base font-bold mb-2">{order.quantity}</Text>
        <TouchableOpacity
          className="bg-primary px-3 py-1.5 rounded-xl"
          onPress={() => handleOrderAgain(order)}
        >
          <Text className="text-text text-xs font-semibold">Order again</Text>
        </TouchableOpacity>
      </View>
      <View className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#4CAF50] items-center justify-center">
        <Text className="text-white text-xs font-bold">✓</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => { }}
      />

      <View className="flex-1">
        <View className="flex-row justify-between items-center px-5 mb-5">
          <Text className="text-text text-lg font-bold">Event Orders</Text>
          <TouchableOpacity>
            <Text className="text-text-secondary text-sm">Recent</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row mx-5 mb-5 bg-[#1C1C1E] rounded-3xl p-1">
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-3xl ${selectedTab === 'menu' ? 'bg-primary' : ''}`}
            onPress={() => {
              setSelectedTab('menu');
              router.push(`/event/${id}/menu`);
            }}
          >
            <Text className={`text-sm font-medium ${selectedTab === 'menu' ? 'text-text font-semibold' : 'text-text-secondary'}`}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-3xl ${selectedTab === 'orders' ? 'bg-primary' : ''}`}
            onPress={() => setSelectedTab('orders')}
          >
            <Text className={`text-sm font-medium ${selectedTab === 'orders' ? 'text-text font-semibold' : 'text-text-secondary'}`}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orders List */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text className="text-text-secondary text-base mt-4">Loading orders...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View className="py-16 items-center justify-center">
              <Text className="text-text-secondary text-base text-center leading-6">No orders yet</Text>
            </View>
          ) : (
            orders.map((order) => (
              <OrderItem key={order.order_id} order={order} />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
