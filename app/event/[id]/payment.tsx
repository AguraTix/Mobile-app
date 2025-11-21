import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PaymentMethod = 'mobile_money' | 'card';

export default function PaymentScreen() {
  const router = useRouter();
  const { id, count, seats, categoryId, categoryName, price } = useLocalSearchParams<{
    id?: string;
    count?: string;
    seats?: string;
    categoryId?: string;
    categoryName?: string;
    price?: string;
  }>();

  const availableMethods: PaymentMethod[] = ['mobile_money', 'card'];

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const ticketCount = Math.max(1, parseInt(count || "1", 10));
  const ticketPrice = parseFloat(price || "0");
  const totalAmount = ticketCount * ticketPrice;
  const tax = totalAmount * 0.18; // 18% tax
  const finalTotal = totalAmount + tax;

  const handlePayment = async () => {
    try {
      // Mock payment - just navigate to success
      Alert.alert("Success", "Payment processed successfully!");
      router.push(`/event/${id}/payment-success`);
    } catch (error: any) {
      Alert.alert("Payment Error", "Payment failed. Please try again.");
    }
  };

  const renderPaymentMethod = () => {
    switch (selectedMethod) {
      case 'mobile_money':
        return (
          <View className="bg-card rounded-2xl p-5 mb-6">
            <Text className="text-text text-base font-bold mb-2">Mobile Money Payment</Text>
            <Text className="text-text-secondary text-sm mb-5 leading-5">
              Enter your phone number to receive a payment prompt
            </Text>

            <View className="mb-4">
              <Text className="text-text text-sm font-medium mb-2">Phone Number</Text>
              <TextInput
                className="bg-[#1C1C1E] rounded-xl py-4 px-4 text-text text-base border border-[#333]"
                placeholder="e.g., 0781234567"
                placeholderTextColor={Colors.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View className="mt-4">
              <Text className="text-text text-sm font-medium mb-3">Select Provider:</Text>
              <View className="flex-row justify-between">
                {['mtn', 'airtel', 'mpesa'].map((provider) => (
                  <TouchableOpacity
                    key={provider}
                    className="flex-1 bg-primary rounded-lg py-3 px-4 mx-1 items-center"
                  >
                    <Text className="text-white text-xs font-semibold">{provider.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'card':
        return (
          <View className="bg-card rounded-2xl p-5 mb-6">
            <Text className="text-text text-base font-bold mb-2">Card Payment</Text>
            <Text className="text-text-secondary text-sm mb-5 leading-5">
              Enter your card details to complete the payment
            </Text>

            <View className="mb-4">
              <Text className="text-text text-sm font-medium mb-2">Card Number</Text>
              <TextInput
                className="bg-[#1C1C1E] rounded-xl py-4 px-4 text-text text-base border border-[#333]"
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.textSecondary}
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View className="flex-row">
              <View className="flex-1 mr-2 mb-4">
                <Text className="text-text text-sm font-medium mb-2">Expiry Month</Text>
                <TextInput
                  className="bg-[#1C1C1E] rounded-xl py-4 px-4 text-text text-base border border-[#333]"
                  placeholder="MM"
                  placeholderTextColor={Colors.textSecondary}
                  value={expiryMonth}
                  onChangeText={setExpiryMonth}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              <View className="flex-1 ml-2 mb-4">
                <Text className="text-text text-sm font-medium mb-2">Expiry Year</Text>
                <TextInput
                  className="bg-[#1C1C1E] rounded-xl py-4 px-4 text-text text-base border border-[#333]"
                  placeholder="YY"
                  placeholderTextColor={Colors.textSecondary}
                  value={expiryYear}
                  onChangeText={setExpiryYear}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>

            <View className="flex-row">
              <View className="flex-1 mr-2 mb-4">
                <Text className="text-text text-sm font-medium mb-2">CVV</Text>
                <TextInput
                  className="bg-[#1C1C1E] rounded-xl py-4 px-4 text-text text-base border border-[#333]"
                  placeholder="123"
                  placeholderTextColor={Colors.textSecondary}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
              <View className="flex-1 ml-2 mb-4">
                <Text className="text-text text-sm font-medium mb-2">Card Holder Name</Text>
                <TextInput
                  className="bg-[#1C1C1E] rounded-xl py-4 px-4 text-text text-base border border-[#333]"
                  placeholder="John Doe"
                  placeholderTextColor={Colors.textSecondary}
                  value={cardHolderName}
                  onChangeText={setCardHolderName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <TouchableOpacity
              className="flex-row items-center mt-4"
              onPress={() => setSaveCard(!saveCard)}
            >
              <View className={`w-5 h-5 rounded border-2 border-primary mr-3 items-center justify-center ${saveCard ? 'bg-primary' : ''}`}>
                {saveCard && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
              <Text className="text-text text-sm">Save card for future payments</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const renderPaymentSummary = () => (
    <View className="bg-card rounded-2xl p-5 mb-6">
      <Text className="text-text text-lg font-bold mb-4">Payment Summary</Text>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-text-secondary text-sm">Tickets ({ticketCount}x)</Text>
        <Text className="text-text text-sm font-medium">{ticketPrice.toLocaleString()} RWF</Text>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-text-secondary text-sm">Subtotal</Text>
        <Text className="text-text text-sm font-medium">{totalAmount.toLocaleString()} RWF</Text>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-text-secondary text-sm">Tax (18%)</Text>
        <Text className="text-text text-sm font-medium">{tax.toLocaleString()} RWF</Text>
      </View>

      <View className="flex-row justify-between items-center border-t border-border pt-3 mt-2">
        <Text className="text-text text-base font-bold">Total</Text>
        <Text className="text-primary text-lg font-bold">{finalTotal.toLocaleString()} RWF</Text>
      </View>
    </View>
  );


  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar style="light" />

      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-black">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center">Payment</Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="p-2 mr-2">
            <Ionicons name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 mr-2">
            <Ionicons name="notifications" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity className="w-8 h-8 rounded-full bg-primary items-center justify-center">
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Payment Summary */}
          {renderPaymentSummary()}

          {/* Payment Methods */}
          <View className="mb-6">
            <Text className="text-text text-lg font-bold mb-4">Select Payment Method</Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center bg-card rounded-xl p-4 mx-1 border-2 ${selectedMethod === 'mobile_money' ? 'bg-primary border-primary' : 'border-transparent'}`}
                onPress={() => setSelectedMethod('mobile_money')}
              >
                <Ionicons name="phone-portrait" size={24} color={selectedMethod === 'mobile_money' ? '#FFFFFF' : Colors.primary} />
                <Text className={`text-text text-xs font-medium ml-2 text-center ${selectedMethod === 'mobile_money' ? 'text-white' : ''}`}>
                  Mobile Money
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center bg-card rounded-xl p-4 mx-1 border-2 ${selectedMethod === 'card' ? 'bg-primary border-primary' : 'border-transparent'}`}
                onPress={() => setSelectedMethod('card')}
              >
                <Ionicons name="card" size={24} color={selectedMethod === 'card' ? '#FFFFFF' : Colors.primary} />
                <Text className={`text-text text-xs font-medium ml-2 text-center ${selectedMethod === 'card' ? 'text-white' : ''}`}>
                  Credit/Debit Card
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method Form */}
          {renderPaymentMethod()}
        </ScrollView>

        {/* Payment Button */}
        <View className="absolute bottom-0 left-0 right-0 bg-background px-5 py-4 border-t border-border">
          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center"
            onPress={handlePayment}
          >
            <Text className="text-white text-base font-bold">
              Pay {finalTotal.toLocaleString()} RWF
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}