import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { useCart } from '@/contexts';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { items, totalPrice, updateItemQuantity, removeItem, clearCart, getTotalItems } = useCart();

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    router.push(`/event/${id}/payment-info`);
  };

  const handleContinueShopping = () => {
    router.push(`/event/${id}/menu`);
  };

  // Cart Item Component
  const CartItemComponent = ({ item }: { item: typeof items[0] }) => (
    <View className="flex-row items-start bg-[#1C1C1E] rounded-2xl p-4 mb-3 relative">
      <View className="w-[60px] h-[60px] rounded-xl overflow-hidden mr-4">
        <Image
          source={
            item.Food?.foodimage
              ? { uri: item.Food.foodimage }
              : require('@/assets/images/m1.png')
          }
          className="w-full h-full"
        />
      </View>

      <View className="flex-1 mr-3">
        <Text className="text-text text-base font-semibold mb-1">{item.Food?.foodname || 'Food Item'}</Text>
        <Text className="text-text-secondary text-sm font-medium">
          {(item.Food?.foodprice || 0).toLocaleString()} RWF each
        </Text>
      </View>

      <View className="items-end min-w-[100px]">
        <View className="flex-row items-center bg-primary rounded-[20px] px-1 py-1 mb-2">
          <TouchableOpacity
            className="w-7 h-7 rounded-[14px] bg-white/20 items-center justify-center"
            onPress={() => updateItemQuantity(item.order_id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color={Colors.text} />
          </TouchableOpacity>

          <Text className="text-text text-sm font-bold mx-3 min-w-[16px] text-center">{item.quantity}</Text>

          <TouchableOpacity
            className="w-7 h-7 rounded-[14px] bg-white/20 items-center justify-center"
            onPress={() => updateItemQuantity(item.order_id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <Text className="text-primary text-sm font-bold mb-1">
          {((item.Food?.foodprice || 0) * item.quantity).toLocaleString()} RWF
        </Text>

        <TouchableOpacity
          className="px-2 py-1"
          onPress={() => removeItem(item.order_id)}
        >
          <Text className="text-[#ff4444] text-xs font-semibold">Remove</Text>
        </TouchableOpacity>
      </View>

      <View className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#4CAF50] items-center justify-center">
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
        <View className="flex-row items-center px-5 mb-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-text text-lg font-bold flex-1">Your Cart</Text>
          {items.length > 0 && (
            <TouchableOpacity onPress={clearCart} className="px-3 py-1.5 bg-text-secondary rounded-lg">
              <Text className="text-text text-sm font-semibold">Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {items.length === 0 ? (
            <View className="py-16 items-center justify-center">
              <Text className="text-text text-xl font-bold mb-2">Your cart is empty</Text>
              <Text className="text-text-secondary text-base text-center mb-6">
                Add some delicious items from the menu!
              </Text>
              <TouchableOpacity
                className="bg-primary px-6 py-3 rounded-full"
                onPress={handleContinueShopping}
              >
                <Text className="text-text text-base font-semibold">Browse Menu</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {items.map((item) => (
                <CartItemComponent key={item.order_id} item={item} />
              ))}

              {/* Order Summary */}
              <View className="bg-card rounded-2xl p-5 mt-5">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-secondary text-sm">Items ({items.length})</Text>
                  <Text className="text-text text-sm font-medium">
                    {getTotalItems()} items
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-secondary text-sm">Subtotal</Text>
                  <Text className="text-text text-sm font-medium">
                    {totalPrice.toLocaleString()} RWF
                  </Text>
                </View>

                <View className="h-[1px] bg-border my-3" />

                <View className="flex-row justify-between items-center">
                  <Text className="text-text text-base font-bold">Total</Text>
                  <Text className="text-primary text-base font-bold">
                    {totalPrice.toLocaleString()} RWF
                  </Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* Cart Footer */}
        {items.length > 0 && (
          <View className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-5 pb-8" style={styles.shadow}>
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-text text-base font-bold">Total</Text>
              <Text className="text-text text-xl font-bold">
                {totalPrice.toLocaleString()} RWF
              </Text>
            </View>

            <TouchableOpacity
              className="bg-primary rounded-full py-4 items-center"
              onPress={handleProceedToCheckout}
            >
              <Text className="text-text text-base font-semibold">Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});