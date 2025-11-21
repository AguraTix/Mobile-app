import Colors from "@/constants/Colors";
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
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export const options = {
  headerShown: false,
};

function formatPrice(price: number, currency: string = 'RWF'): string {
  return `${price.toLocaleString()} ${currency}`;
}

// Mock event data
const mockEventData = {
  id: '1',
  title: 'Summer Music Festival',
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  location: 'Central Park, Kigali',
  imageUrl: 'https://via.placeholder.com/400x300?text=Music+Festival',
  description: 'Join us for an amazing summer music festival featuring top artists and live performances.',
  price: 50,
  category: 'music',
};

const mockCategories = [
  { id: '1', name: 'VIP', price: 100, quantity: 50 },
  { id: '2', name: 'Regular', price: 50, quantity: 200 },
  { id: '3', name: 'Student', price: 30, quantity: 100 },
];

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const router = useRouter();

  const [event, setEvent] = useState(mockEventData);
  const [categories, setCategories] = useState(mockCategories);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({
    latitude: -1.9441,
    longitude: 30.0619,
  });

  useEffect(() => {
    // Mock data already loaded
  }, [id]);

  const handleBuyTicket = (category: any) => {
    if (!category.quantity || category.quantity <= 0) {
      Alert.alert("Sold Out", "This ticket category is no longer available.");
      return;
    }

    // Navigate to seat selection with category info
    router.push(`/event/${id}/seat-selection?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}&price=${category.price}`);
  };

  const handleViewMap = () => {
    router.push(`/event/${id}/map`);
  };

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
        <Text className="text-white text-xl font-bold flex-1 text-center">{event.title}</Text>
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
              event.imageUrl
                ? { uri: event.imageUrl }
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
            <Text className="text-text text-base font-medium">Platini</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={16} color="#FFFFFF" />
              <Text className="text-text-secondary text-xs ml-2">Date:</Text>
            </View>
            <Text className="text-text text-base font-medium">
              {event.date ? new Date(event.date).toLocaleDateString('en-US', {
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
            <Text className="text-text text-base font-medium">{event.location || "Serena Hotel Kigali"}</Text>
          </View>
        </View>

        {/* Tickets Section */}
        <View className="px-5 mb-6">
          <Text className="text-text text-xl font-bold mb-4">Tickets</Text>
          {categories.length === 0 ? (
            <View className="bg-card rounded-2xl p-8 items-center" style={styles.shadow}>
              <Text className="text-text-secondary text-base text-center">No tickets available for this event</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {categories.map((category, idx) => (
                <View key={idx} className="bg-card rounded-xl p-4 w-[48%] mb-3 border border-border">
                  <Text className="text-text text-sm font-semibold mb-2">{category.name}</Text>
                  <View className="bg-[#4CAF50] px-2 py-1 rounded-xl self-start mb-2">
                    <Text className="text-white text-[10px] font-semibold">
                      {category.quantity || 0} left
                    </Text>
                  </View>
                  <Text className="text-primary text-base font-bold mb-3">
                    {category.price.toLocaleString()} RWF
                  </Text>
                  <TouchableOpacity
                    className={`bg-primary rounded-lg py-2 items-center ${(!category.quantity || category.quantity <= 0) ? 'bg-text-secondary opacity-50' : ''}`}
                    onPress={() => handleBuyTicket(category)}
                    disabled={!category.quantity || category.quantity <= 0}
                  >
                    <Text className="text-text text-sm font-semibold">Buy</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Location Section */}
        {coords.latitude && coords.longitude && (
          <View className="px-5 mb-5">
            <Text className="text-text text-xl font-bold mb-4">Location</Text>
            <TouchableOpacity className="h-[200px] rounded-2xl overflow-hidden" onPress={handleViewMap}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  }}
                  title={event.title}
                  description={event.location}
                  pinColor={Colors.primary}
                />
              </MapView>
            </TouchableOpacity>
          </View>
        )}
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