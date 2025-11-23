import Colors from "@/constants/Colors";
import { useEvent } from "@/contexts";
import { TicketTypeConfig } from "@/types/ticket";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const options = {
  headerShown: false,
};

function formatPrice(price: number, currency: string = 'RWF'): string {
  return `${price.toLocaleString()} ${currency}`;
}


export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string; }>();
  const router = useRouter();
  const { fetchEventById, currentEvent } = useEvent()
  // TODO: Venue model doesn't include coordinates yet, using default Kigali location
  // Update this when venue coordinates are added to the backend
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: -1.9441,
    longitude: 30.0619,
  });

  useEffect(() => {
    fetchEventById(id.toString())
  }, [id]);

  const handleBuyTicket = (ticket: TicketTypeConfig) => {
    if (!ticket.quantity || ticket.quantity <= 0) {
      Alert.alert("Sold Out", "This ticket category is no longer available.");
      return;
    }

    // Navigate to seat selection with ticket info
    router.push(`/event/${id}/seat-selection?ticketType=${encodeURIComponent(ticket.type)}&price=${ticket.price}`);
  };

  const handleViewMap = () => {
    router.push(`/event/${id}/map`);
  };

  // Show loading or empty state while event is being fetched
  if (!currentEvent) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary">Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <StatusBar style="light" />

      {/* Custom Header matching the design */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-black">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1 text-center">{currentEvent.title}</Text>
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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Event Image */}
        <View className="h-[200px] mx-5 rounded-2xl overflow-hidden mb-6">
          <RNImage
            source={
              currentEvent?.image_url
                ? { uri: currentEvent.image_url }
                : require('@/assets/images/m1.png')
            }
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Event Information */}
        <View className="bg-card mx-5 rounded-2xl p-5 mb-6" style={styles.shadow}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-secondary text-xs mr-2">Organizer:</Text>
            <Text className="text-text text-base font-medium">{currentEvent?.User?.name || "N/A"}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={16} color="#FFFFFF" />
              <Text className="text-text-secondary text-xs ml-2">Date:</Text>
            </View>
            <Text className="text-text text-base font-medium">
              {currentEvent?.date ? new Date(currentEvent.date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : "TBD"}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#FFFFFF" />
              <Text className="text-text-secondary text-xs ml-2">Venue:</Text>
            </View>
            <Text className="text-text text-base font-medium">{currentEvent?.Venue?.location || currentEvent?.Venue?.name || "TBD"}</Text>
          </View>
        </View>

        {/* Tickets Section */}
        <View className="px-5 mb-6">
          <Text className="text-text text-xl font-bold mb-4">Tickets</Text>
          {!currentEvent?.tickets || currentEvent.tickets.length === 0 ? (
            <View className="bg-card rounded-2xl p-8 items-center" style={styles.shadow}>
              <Text className="text-text-secondary text-base text-center">No tickets available for this event</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {currentEvent.tickets.map((ticket, idx) => (
                <View key={idx} className="bg-card rounded-xl p-4 w-[48%] mb-3 border border-border">
                  <Text className="text-text text-sm font-semibold mb-2">{ticket.type}</Text>
                  <View className="bg-[#4CAF50] px-2 py-1 rounded-xl self-start mb-2">
                    <Text className="text-white text-[10px] font-semibold">
                      {ticket.quantity || 0} left
                    </Text>
                  </View>
                  <Text className="text-primary text-base font-bold mb-3">
                    {ticket.price.toLocaleString()} RWF
                  </Text>
                  <TouchableOpacity
                    className={`bg-primary rounded-lg py-2 items-center ${(!ticket.quantity || ticket.quantity <= 0) ? 'bg-text-secondary opacity-50' : ''}`}
                    onPress={() => handleBuyTicket(ticket)}
                    disabled={!ticket.quantity || ticket.quantity <= 0}
                  >
                    <Text className="text-text text-sm font-semibold">Buy</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  map: {
    flex: 1,
  },
});