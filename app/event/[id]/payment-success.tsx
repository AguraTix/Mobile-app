import Colors from "@/constants/Colors";
import { useOrder } from "@/contexts/OrderContext";
import { usePayment } from "@/contexts/PaymentContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { getOrder, currentOrder, isLoading: orderLoading } = useOrder();
  const { currentPayment, isLoading: paymentLoading } = usePayment();
  const [isLoading, setIsLoading] = useState(true);

  const orderProcessing = orderLoading || paymentLoading;

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      if (orderId) {
        await getOrder(orderId);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDownloadTickets = () => {
    // TODO: Implement ticket download functionality
    console.log('Downloading tickets...');
  };

  const handleShareOrder = () => {
    // TODO: Implement share functionality
    console.log('Sharing order...');
  };

  const handleViewTickets = () => {
    router.push('/tickets');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (isLoading || orderProcessing || paymentLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text className="text-text text-base mt-4">Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const order = currentOrder;
  const payment = currentPayment;

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-text text-xl font-bold mb-3 text-center">Order Not Found</Text>
          <Text className="text-text-secondary text-base text-center leading-6 mb-8 px-5">
            We couldn't find the order details. Please check your tickets or contact support.
          </Text>
          <TouchableOpacity className="flex-row items-center justify-center bg-primary rounded-xl py-4 px-4 mx-1" onPress={handleGoHome}>
            <Text className="text-white text-base font-semibold mx-2">Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View className="items-center py-8 mb-6">
          <View className="mb-4">
            <Ionicons name="checkmark-circle" size={64} color="#34C759" />
          </View>
          <Text className="text-text text-2xl font-bold mb-3 text-center">Payment Successful!</Text>
          <Text className="text-text-secondary text-base text-center leading-6 max-w-[300px]">
            Your tickets have been purchased successfully. You will receive a confirmation email shortly.
          </Text>
        </View>

        {/* Order Details */}
        <View className="bg-card rounded-2xl p-5 mb-5">
          <Text className="text-text text-lg font-bold mb-4">Order Details</Text>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text-secondary text-sm">Order ID:</Text>
            <Text className="text-text text-sm font-medium">{order.order_id}</Text>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text-secondary text-sm">Date:</Text>
            <Text className="text-text text-sm font-medium">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text-secondary text-sm">Status:</Text>
            <Text className="text-[#34C759] font-semibold">
              {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        {payment && (
          <View className="bg-card rounded-2xl p-5 mb-5">
            <Text className="text-text text-lg font-bold mb-4">Payment Details</Text>

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-text-secondary text-sm">Payment ID:</Text>
              <Text className="text-text text-sm font-medium">{payment.payment_id}</Text>
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-text-secondary text-sm">Method:</Text>
              <Text className="text-text text-sm font-medium">
                {payment.payment_method.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-text-secondary text-sm">Status:</Text>
              <Text className="text-[#34C759] font-semibold">
                {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
              </Text>
            </View>
          </View>
        )}

        {/* Ticket Summary */}
        <View className="bg-card rounded-2xl p-5 mb-5">
          <Text className="text-text text-lg font-bold mb-4">Tickets</Text>

          {order.quantity && (
            <View className="mb-4 pb-4 border-b border-border">
              <View className="flex-row items-center mb-3">
                <Ionicons name="ticket" size={20} color={Colors.primary} />
                <Text className="text-text text-base font-semibold ml-3">Food Order</Text>
              </View>

              <View className="ml-8">
                <Text className="text-text-secondary text-sm mb-1">
                  Quantity: {order.quantity}
                </Text>
                {order.special_instructions && (
                  <Text className="text-text-secondary text-sm mb-1">
                    Instructions: {order.special_instructions}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Next Steps */}
        <View className="bg-card rounded-2xl p-5 mb-5">
          <Text className="text-text text-lg font-bold mb-4">What's Next?</Text>

          <View className="flex-row items-start mb-5">
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-4">
              <Text className="text-white text-base font-bold">1</Text>
            </View>
            <View className="flex-1">
              <Text className="text-text text-base font-semibold mb-1">Check Your Email</Text>
              <Text className="text-text-secondary text-sm leading-5">
                You'll receive a confirmation email with your tickets attached
              </Text>
            </View>
          </View>

          <View className="flex-row items-start mb-5">
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-4">
              <Text className="text-white text-base font-bold">2</Text>
            </View>
            <View className="flex-1">
              <Text className="text-text text-base font-semibold mb-1">Download Tickets</Text>
              <Text className="text-text-secondary text-sm leading-5">
                Download your tickets and save them to your phone
              </Text>
            </View>
          </View>

          <View className="flex-row items-start mb-5">
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-4">
              <Text className="text-white text-base font-bold">3</Text>
            </View>
            <View className="flex-1">
              <Text className="text-text text-base font-semibold mb-1">Attend the Event</Text>
              <Text className="text-text-secondary text-sm leading-5">
                Present your tickets at the event entrance
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-background px-5 py-4 border-t border-border">
        <View className="flex-row mb-3">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-card rounded-xl py-4 px-4 mx-1 border border-primary" onPress={handleDownloadTickets}>
            <Ionicons name="download" size={20} color={Colors.primary} />
            <Text className="text-primary text-sm font-semibold ml-2">Download</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-card rounded-xl py-4 px-4 mx-1 border border-primary" onPress={handleShareOrder}>
            <Ionicons name="share-social" size={20} color={Colors.primary} />
            <Text className="text-primary text-sm font-semibold ml-2">Share</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mb-3">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-primary rounded-xl py-4 px-4 mx-1" onPress={handleViewTickets}>
            <Ionicons name="ticket" size={20} color="#FFFFFF" />
            <Text className="text-white text-base font-semibold mx-2">View My Tickets</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex-row items-center justify-center py-4" onPress={handleGoHome}>
          <Ionicons name="home" size={20} color={Colors.textSecondary} />
          <Text className="text-text-secondary text-sm ml-2">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
