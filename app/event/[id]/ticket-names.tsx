import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TicketNamesScreen() {
  const router = useRouter();
  const { id, count, seats, categoryId, categoryName, price } = useLocalSearchParams<{
    id?: string;
    count?: string;
    seats?: string;
    categoryId?: string;
    categoryName?: string;
    price?: string;
  }>();

  const ticketCount = Math.max(1, parseInt(count || "1", 10));
  const [names, setNames] = useState<string[]>(Array(ticketCount).fill(""));

  const handleNameChange = (idx: number, value: string) => {
    const newNames = [...names];
    newNames[idx] = value;
    setNames(newNames);
  };

  const handleProceed = () => {
    const queryParams = new URLSearchParams();
    queryParams.set("count", String(ticketCount));
    queryParams.set("names", names.join(","));
    if (seats) queryParams.set("seats", seats);
    if (categoryId) queryParams.set("categoryId", categoryId);
    if (categoryName) queryParams.set("categoryName", categoryName);
    if (price) queryParams.set("price", price);

    router.push(`/event/${id}/payment?${queryParams.toString()}`);
  };

  const canProceed = names.every(name => name.trim().length > 0);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar style="light" />

      {/* Custom Header matching the design */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-black">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center">Choose Ticket Names</Text>
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
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Blue border container */}
          <View className="border-2 border-primary rounded-2xl p-6 bg-primary/5">
            <Text className="text-text text-base text-center mb-6 leading-6">
              Please enter the names for your tickets
            </Text>

            {Array.from({ length: ticketCount }).map((_, idx) => (
              <View key={idx} className="mb-5">
                <Text className="text-text text-sm font-medium mb-2">Ticket {idx + 1} names</Text>
                <TextInput
                  className="bg-[#1C1C1E] rounded-xl py-4 px-4 text-text text-base border border-[#333]"
                  placeholder={`Enter name for ticket ${idx + 1}`}
                  placeholderTextColor={Colors.textSecondary}
                  value={names[idx]}
                  onChangeText={(value) => handleNameChange(idx, value)}
                  autoCapitalize="words"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom button */}
        <View className="px-5 pb-8 pt-4">
          <TouchableOpacity
            className={`bg-primary rounded-full py-4 items-center ${!canProceed ? 'opacity-50' : ''}`}
            onPress={handleProceed}
            disabled={!canProceed}
          >
            <Text className="text-text text-base font-bold">Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}