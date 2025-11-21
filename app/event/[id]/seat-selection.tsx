import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Seat {
  id: string;
  row: number;
  number: number;
  isSelected: boolean;
  isBooked: boolean;
  isVip: boolean;
}

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { id, categoryId, categoryName, price } = useLocalSearchParams<{
    id?: string;
    categoryId?: string;
    categoryName?: string;
    price?: string;
  }>();

  // Generate seat map (8 rows, 6 seats per row) matching the design
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    for (let row = 1; row <= 8; row++) {
      for (let seatNum = 1; seatNum <= 6; seatNum++) {
        seats.push({
          id: `${row}-${seatNum}`,
          row,
          number: seatNum,
          isSelected: false,
          isBooked: Math.random() < 0.1, // 10% chance of being booked
          isVip: Math.random() < 0.2, // 20% chance of being VIP
        });
      }
    }
    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const selectedSeats = seats.filter(seat => seat.isSelected);

  const toggleSeat = (seatId: string) => {
    setSeats(prevSeats =>
      prevSeats.map(seat =>
        seat.id === seatId && !seat.isBooked
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );
  };

  const handleNext = () => {
    if (selectedSeats.length === 0) return;

    const params = new URLSearchParams();
    params.set('count', selectedSeats.length.toString());
    params.set('seats', selectedSeats.map(s => s.id).join(','));
    if (categoryId) params.set('categoryId', categoryId);
    if (categoryName) params.set('categoryName', categoryName);
    if (price) params.set('price', price);

    router.push(`/event/${id}/ticket-names?${params.toString()}`);
  };

  const renderSeat = (seat: Seat) => {
    let seatColorClass = "bg-[#4CAF50]"; // Available

    if (seat.isBooked) {
      seatColorClass = "bg-[#666]";
    } else if (seat.isSelected) {
      seatColorClass = "bg-primary";
    }

    return (
      <TouchableOpacity
        key={seat.id}
        className={`w-6 h-6 rounded mx-0.5 ${seatColorClass}`}
        onPress={() => toggleSeat(seat.id)}
        disabled={seat.isBooked}
      />
    );
  };

  const renderRow = (rowNumber: number) => {
    const rowSeats = seats.filter(seat => seat.row === rowNumber);

    return (
      <View key={rowNumber} className="flex-row mb-2 justify-center">
        {rowSeats.map(seat => renderSeat(seat))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />

      {/* Custom Header matching the design */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-black">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center">Choose Seat</Text>
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

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Seat map */}
        <View className="items-center mb-8 mt-4">
          {Array.from({ length: 8 }, (_, i) => renderRow(i + 1))}
        </View>

        {/* Legend */}
        <View className="bg-[#1C1C1E] rounded-2xl p-5 mb-5">
          <View className="flex-row items-center mb-3">
            <View className="w-4 h-4 rounded mr-3 bg-primary" />
            <Text className="text-text text-sm">Your Selection ({selectedSeats.length})</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <View className="w-4 h-4 rounded mr-3 bg-[#4CAF50]" />
            <Text className="text-text text-sm">Selected Seats</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded mr-3 bg-[#666]" />
            <Text className="text-text text-sm">UnSelected Seats</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom button */}
      <View className="px-5 pb-8 pt-4">
        <TouchableOpacity
          className={`bg-primary rounded-full py-4 items-center ${selectedSeats.length === 0 ? 'opacity-50' : ''}`}
          onPress={handleNext}
          disabled={selectedSeats.length === 0}
        >
          <Text className="text-text text-base font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
