import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentInfoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [address, setAddress] = useState('137 Teaticket Hwy, East Falmouth MA 2536');
  const [phone, setPhone] = useState('+234 9011039271');
  const [selectedPayment, setSelectedPayment] = useState('mastercard');
  const [isLoading, setIsLoading] = useState(false);

  // Mock cart total (would come from cart store) - Rwanda pricing
  const subtotal = 5500;
  const total = 6000; // Including processing fee

  // Payment methods
  const paymentMethods = [
    {
      id: 'add',
      name: 'Add Payment Method',
      icon: require('@/assets/images/payment/stripe.png'),
      isAdd: true,
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      icon: require('@/assets/images/payment/mastercard.png'),
      isAdd: false,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: require('@/assets/images/payment/paypal.png'),
      isAdd: false,
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: require('@/assets/images/payment/stripe.png'),
      isAdd: false,
    },
  ];

  const handleProceedToPayment = async () => {
    if (!selectedPayment || selectedPayment === 'add') {
      // Show error for no payment method selected
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to order success screen
      router.push(`/event/${id}/order-success`);
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setIsLoading(false);
    }
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

      <View className="flex-1">
        <View className="flex-row items-center px-5 mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-text text-lg font-bold">Payment Information</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Address Section */}
          <View className="mb-8">
            <View className="flex-row items-start mb-4">
              <TextInput
                className="flex-1 text-text text-base mr-4"
                value={address}
                onChangeText={setAddress}
                multiline
                textAlignVertical="top"
                style={{ lineHeight: 22 }}
              />
              <TouchableOpacity className="py-1">
                <Text className="text-primary text-sm font-semibold">Change</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center">
              <TextInput
                className="flex-1 text-text text-base mr-4"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity className="py-1">
                <Text className="text-primary text-sm font-semibold">Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Methods Section */}
          <View className="mb-8">
            <Text className="text-text text-lg font-bold mb-5">Payment</Text>
            <View className="flex-row justify-between px-2.5">
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  className={`w-[60px] h-[60px] rounded-[30px] bg-[#2C2C2E] items-center justify-center border-2 ${selectedPayment === method.id ? 'border-primary' : 'border-transparent'}`}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <Image source={method.icon} className="w-8 h-8" resizeMode="contain" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Order Summary */}
          <View className="bg-card rounded-2xl p-5 mt-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-text-secondary text-base">Subtotal</Text>
              <Text className="text-text text-base">{subtotal.toLocaleString()} RWF</Text>
            </View>
            <View className="h-[1px] bg-[#3C3C3E] my-2" />
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-text text-lg font-bold">Total</Text>
              <Text className="text-text text-lg font-bold">{total.toLocaleString()} RWF</Text>
            </View>
          </View>
        </ScrollView>

        {/* Payment Footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-5 pb-8" style={styles.shadow}>
          <TouchableOpacity
            className={`bg-primary rounded-full py-4 items-center ${(!selectedPayment || selectedPayment === 'add' || isLoading) ? 'bg-[#666] opacity-60' : ''}`}
            onPress={handleProceedToPayment}
            disabled={!selectedPayment || selectedPayment === 'add' || isLoading}
          >
            <Text className="text-text text-base font-semibold">
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </Text>
          </TouchableOpacity>
        </View>
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
