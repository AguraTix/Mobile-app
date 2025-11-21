import Header from '@/components/Header';
import Colors from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function EventMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let eventId = params.id;
  if (Array.isArray(eventId)) eventId = eventId[0];
  // Mock event data for demo
  const event = {
    venue: 'Serena Hotel Kigali',
    latitude: -1.9536,
    longitude: 30.0605,
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <Header showLogo showProfile showSearch />
      <View className="flex-row items-center px-4 pt-3 pb-2 bg-background z-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-text">{event.venue}</Text>
      </View>
      <MapView
        className="flex-1 w-full h-full rounded-t-3xl mt-0"
        initialRegion={{
          latitude: event.latitude,
          longitude: event.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        provider={undefined}
      >
        <Marker
          coordinate={{ latitude: event.latitude, longitude: event.longitude }}
          title={event.venue}
        />
      </MapView>
    </SafeAreaView>
  );
}
