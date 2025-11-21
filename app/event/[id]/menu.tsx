import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock menu items
const mockMenuItems = [
  { id: '1', name: 'Burger', category: 'food', price: 5000, available: true },
  { id: '2', name: 'Pizza', category: 'food', price: 8000, available: true },
  { id: '3', name: 'Coke', category: 'drinks', price: 2000, available: true },
];

export default function EventMenuScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedTab, setSelectedTab] = useState<'menu' | 'orders'>('menu');
  const currentMenuItems = mockMenuItems;

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
      <Header showLogo showProfile showSearch />

      <View className="flex-1">
        <View className="flex-row items-center px-5 mb-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
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
          {currentMenuItems.length === 0 ? (
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
const MenuItemComponent: React.FC<{ item: any; onPress: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity
    className={`bg-card rounded-2xl mb-4 overflow-hidden w-[48%] relative ${!item.available ? 'opacity-60' : ''}`}
    onPress={onPress}
    disabled={!item.available}
    activeOpacity={0.8}
  >
    <Image
      source={require('@/assets/images/m1.png')}
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
    {!item.available && <View className="absolute inset-0 bg-black/50 justify-center items-center" />}
  </TouchableOpacity>
);