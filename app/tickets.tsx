import BottomNav from "@/components/BottomNav";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Skeleton from "@/components/Skeleton";
import Colors from "@/constants/Colors";
import { useTicket } from "@/contexts";
import { TicketStatus } from "@/types/ticket";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
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

  console.log(userTickets)

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
      className="bg-[#1A1A1A] rounded-2xl mb-4 overflow-hidden relative"
      style={styles.shadow}
      onPress={() => handleTicketPress(ticket.ticket_id)}
      activeOpacity={0.8}
    >
      {/* Active Ribbon */}
      {(ticket.status === TicketStatus.SOLD || ticket.status === TicketStatus.RESERVED) && (
        <View className="absolute top-3 right-3 bg-success px-3 py-1 rounded-full z-10">
          <Text className="text-white text-[10px] font-bold uppercase">Active</Text>
        </View>
      )}

      <View className="flex-row p-4">
        {/* Event Image */}
        <View className="w-20 h-20 rounded-xl overflow-hidden mr-4 bg-card">
          {ticket.Event?.image ? (
            <Image
              source={{ uri: ticket.Event.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-primary/20">
              <Ionicons name="musical-notes" size={32} color={Colors.primary} />
            </View>
          )}
        </View>

        {/* Event Info */}
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-white text-base font-bold mb-1" numberOfLines={1}>
              {ticket.Event?.title || "Event"}
            </Text>
            <Text className="text-text-secondary text-xs mb-2">
              {ticket.sectionName || "Standard"} Tickets
            </Text>
            <Text className="text-primary text-sm font-bold">
              {ticket.price?.toLocaleString() || "0"} Rwf
            </Text>
          </View>
        </View>

        {/* View Ticket Button */}
        <View className="justify-center ml-2">
          <TouchableOpacity
            className="bg-transparent border border-primary px-4 py-2 rounded-lg"
            onPress={() => handleTicketPress(ticket.ticket_id)}
          >
            <Text className="text-primary text-xs font-semibold">View Ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
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
        {/* Header Section */}
        <View
          className="items-center px-5 py-8 bg-primary mx-5 mt-5 rounded-[20px]"
          style={styles.headerShadow}
        >
          <View className="w-16 h-16 rounded-[32px] bg-white/20 items-center justify-center mb-4">
            <Ionicons name="ticket" size={32} color={Colors.primary} />
          </View>
          <Text className="text-2xl font-bold text-white mb-2 text-center">My Tickets</Text>
          <Text className="text-base text-white/90 text-center font-medium">
            {activeTickets.length} active tickets
          </Text>
        </View>

        {/* Loading state */}
        {loading && (
          <View className="px-5 mt-8">
            <Text className="text-xl font-semibold text-text mb-5">Loading Tickets</Text>
            <Skeleton height={120} radius={16} style={{ marginBottom: 12 }} />
            <Skeleton height={120} radius={16} style={{ marginBottom: 12 }} />
            <Skeleton height={120} radius={16} style={{ marginBottom: 12 }} />
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
              title="Browse Events"
              variant="primary"
              size="large"
              fullWidth={true}
              onPress={() => router.push("/events-user")}
              style={{ minWidth: 200 }}
            />
          </View>
        )}

        {/* Call to Action */}
        {!loading && userTickets.length > 0 && (
          <View className="px-5 mt-10">
            <Button
              title="Browse More Events"
              variant="outline"
              size="large"
              fullWidth={true}
              onPress={() => router.push("/events-user")}
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