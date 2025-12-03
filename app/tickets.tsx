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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [expandedTicketId, setExpandedTicketId] = React.useState<string | null>(null);

  const handleTicketPress = (ticketId: string) => {
    console.log("Viewing ticket:", ticketId);
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  const handleDownloadTicket = (ticket: any) => {
    console.log("Downloading ticket:", ticket.ticket_id);
    // TODO: Implement QR code download functionality
  };

  const handleShareTicket = (ticket: any) => {
    console.log("Sharing ticket:", ticket.ticket_id);
    // TODO: Implement ticket sharing functionality
  };

  const renderTicketCard = (ticket: any) => {
    const isExpanded = expandedTicketId === ticket.ticket_id;

    return (
      <TouchableOpacity
        key={ticket.ticket_id}
        className={`bg-card rounded-2xl p-5 mb-4 ${ticket.status === TicketStatus.CANCELLED ? 'opacity-60 bg-gray-100' : ''}`}
        style={styles.shadow}
        onPress={() => handleTicketPress(ticket.ticket_id)}
        activeOpacity={0.8}
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="ticket" size={20} color={Colors.primary} />
            <Text className="text-sm font-semibold text-primary uppercase">{ticket.sectionName || "Standard"}</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className={`w-2 h-2 rounded-full ${ticket.status === TicketStatus.SOLD || ticket.status === TicketStatus.RESERVED
              ? 'bg-success'
              : 'bg-gray-500'
              }`} />
            <Text className={`text-xs font-medium uppercase ${ticket.status === TicketStatus.SOLD || ticket.status === TicketStatus.RESERVED
              ? 'text-success'
              : 'text-gray-500'
              }`}>
              {ticket.status === TicketStatus.SOLD ? "Active" :
                ticket.status === TicketStatus.RESERVED ? "Reserved" :
                  ticket.status === TicketStatus.USED ? "Used" : "Expired"}
            </Text>
          </View>
        </View>

        <Text className="text-lg font-semibold text-text mb-4 leading-6">{ticket.Event?.title || "Event"}</Text>

        <View className="mb-5">
          <View className="flex-row items-center gap-3 mb-2">
            <Ionicons name="calendar" size={16} color={Colors.textSecondary} />
            <Text className="text-sm text-text-secondary flex-1">
              {ticket.Event?.date ? formatDate(ticket.Event.date) : 'TBD'} at {ticket.Event?.date ? formatTime(ticket.Event.date) : 'TBD'}
            </Text>
          </View>

          <View className="flex-row items-center gap-3 mb-2">
            <Ionicons name="location" size={16} color={Colors.textSecondary} />
            <Text className="text-sm text-text-secondary flex-1">{ticket.Event?.Venue?.name || ""}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <Ionicons name="time" size={16} color={Colors.textSecondary} />
            <Text className="text-sm text-text-secondary flex-1">
              {ticket.status === TicketStatus.AVAILABLE ? "Event hasn't started" : "Event has ended"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center pt-4 border-t border-black/10">
          <View className="flex-1">
            <Text className="text-xs text-text-secondary mb-1">Ticket #</Text>
            <Text className="text-sm font-semibold text-text font-mono">{ticket.ticket_id}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            {(ticket.status === TicketStatus.SOLD || ticket.status === TicketStatus.RESERVED) && (
              <>
                <TouchableOpacity
                  className="w-9 h-9 rounded-[18px] bg-primary/10 items-center justify-center"
                  onPress={() => handleDownloadTicket(ticket)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="download" size={18} color={Colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-9 h-9 rounded-[18px] bg-primary/10 items-center justify-center"
                  onPress={() => handleShareTicket(ticket)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="share-social" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              className="w-9 h-9 rounded-[18px] bg-primary/10 items-center justify-center"
              onPress={() => handleTicketPress(ticket.ticket_id)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* QR Code Section - Shows when expanded */}
        {isExpanded && ticket.qrCode && (
          <View className="mt-4 pt-4 border-t border-black/10 items-center">
            <Text className="text-xs text-text-secondary mb-3 uppercase tracking-wide">Entry QR Code</Text>
            <View className="bg-white p-4 rounded-2xl">
              <Image
                source={{ uri: ticket.qrCode }}
                className="w-48 h-48"
                resizeMode="contain"
              />
            </View>
            <Text className="text-xs text-text-secondary mt-3 text-center">
              Show this QR code at the venue entrance
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1  bg-background" edges={["top"]}>
      <Header title="My Tickets" showBack />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
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