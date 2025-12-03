import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useTicket } from "@/contexts";
import { TicketStatus } from "@/types/ticket";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TicketsScreen() {
  const router = useRouter();
  const { myTickets: userTickets, isLoading: loading, fetchMyTickets } = useTicket()

  // Fetch tickets when component mounts
  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);


  // Active tickets are those that are sold but not yet used or cancelled
  const activeTickets = userTickets.filter(ticket =>
    ticket.status === TicketStatus.SOLD || ticket.status === TicketStatus.RESERVED
  );

  // Expired tickets are those that are used or cancelled
  const expiredTickets = userTickets.filter(ticket =>
    ticket.status === TicketStatus.USED || ticket.status === TicketStatus.CANCELLED
  );

  const handleTicketPress = (ticketId: string) => {
    router.push(`/ticket/${ticketId}`);
  };

 const renderTicketCard = (ticket: any) => (
  <TouchableOpacity
    key={ticket.ticket_id}
    className="bg-[#1A1A1A] rounded-[24px] p-4 flex-row items-center overflow-hidden relative mb-4"
    style={styles.shadow}
    onPress={() => handleTicketPress(ticket.ticket_id)}
    activeOpacity={0.8}
  >
    {/* Active Ribbon - Diagonal style */}
    {(ticket.status === TicketStatus.SOLD || ticket.status === TicketStatus.RESERVED) && (
      <View className="absolute top-0 right-0 bg-success px-6 py-1 transform rotate-45 translate-x-4 translate-y-2 z-10">
        <Text className="text-white text-[10px] font-bold uppercase">Active</Text>
      </View>
    )}

    {/* Event Image */}
    <View className="w-14 h-14 rounded-2xl bg-white overflow-hidden mr-4">
      {ticket.Event?.image ? (
        <Image
          source={{ uri: ticket.Event.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-full items-center justify-center bg-primary/20">
          <Ionicons name="musical-notes" size={24} color={Colors.primary} />
        </View>
      )}
    </View>

    {/* Event Info */}
    <View className="flex-1 mr-4">
      <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>
        {ticket.Event?.title || "Event"}
      </Text>
      <Text className="text-gray-400 text-xs" numberOfLines={1}>
        {ticket.sectionName || "Standard"} Tickets
      </Text>
      <Text className="text-primary text-xs font-bold mt-1">
        {ticket.price?.toLocaleString() || "0"} Rwf
      </Text>
    </View>

    {/* View Ticket Button - Kept as original but adjusted styling */}
    <TouchableOpacity
      className="bg-transparent border border-primary px-3 py-2 rounded-lg min-w-[80px]"
      onPress={(e) => {
        e.stopPropagation(); // Prevent parent onPress from firing
        handleTicketPress(ticket.ticket_id);
      }}
    >
      <Text className="text-primary text-xs font-semibold text-center">View Ticket</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

  return (
    <SafeAreaView className="flex-1  bg-background" edges={["top"]}>
      <Header title="My Tickets" showBack />

      <ScrollView
        className="flex-1 pb-40"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >


        {/* Loading state */}
        {loading && (
          <View className="px-5 mt-8 py-24 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text className="text-text-secondary text-sm mt-4">Loading tickets...</Text>
          </View>
        )}

        {/* Active Tickets */}
        {!loading && activeTickets.length > 0 && (
          <View className="px-5 mt-8">
            <Text className="text-xl font-semibold text-text mb-5">Active Tickets</Text>
            {activeTickets.map(renderTicketCard)}
          </View>
        )}

        {/* Expired Tickets */}
        {!loading && expiredTickets.length > 0 && (
          <View className="px-5 mt-8">
            <Text className="text-xl font-semibold text-text mb-5">Past Events</Text>
            {expiredTickets.map(renderTicketCard)}
          </View>
        )}

        {/* Empty State */}
        {!loading && userTickets.length === 0 && (
          <View className="items-center px-10 py-[60px] mt-10">
            <View className="mb-6 opacity-50">
              <Ionicons name="ticket" size={48} color={Colors.textSecondary} />
            </View>
            <Text className="text-xl font-semibold text-text mb-3 text-center">No Tickets Yet</Text>
            <Text className="text-base text-text-secondary text-center leading-6 mb-8">
              You haven&apos;t purchased any tickets yet. Start exploring events to get your first ticket!
            </Text>
            <Button
              title="Book a ticket"
              variant="primary"
              size="large"
              fullWidth={true}
              onPress={() => router.push("/events-user")}
              style={{ minWidth: 200 }}
            />
          </View>
        )}

        
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerShadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});