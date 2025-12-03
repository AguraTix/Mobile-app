import Colors from "@/constants/Colors";
import { useTicket } from "@/contexts";
import { TicketStatus } from "@/types/ticket";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TicketPreviewScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { myTickets } = useTicket();

    const ticket = myTickets.find((t) => t.ticket_id === id);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleDownload = () => {
        Alert.alert("Download", "Downloading ticket...");
        // TODO: Implement download functionality
    };

    const handlePlaceOrder = () => {
        Alert.alert("Place Order", "Redirecting to food and drinks...");
        router.push("/menu");
    };

    if (!ticket) {
        return (
            <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
                <StatusBar style="light" />
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-text text-lg mb-4">Ticket not found</Text>
                    <TouchableOpacity
                        className="bg-primary px-6 py-3 rounded-full"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <StatusBar style="light" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <Ionicons name="chevron-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text className="text-text text-lg font-semibold">Ticket Preview</Text>
                </View>
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity>
                        <Ionicons name="search" size={22} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={22} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require("@/assets/images/profile.jpg")}
                            className="w-8 h-8 rounded-full"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* QR Code Card */}
                <View className="mx-5 mt-4 bg-gradient-to-b from-primary to-primary/80 rounded-3xl p-6 items-center">
                    {/* QR Code */}
                    {ticket.qrCode ? (
                        <View className="bg-white p-6 rounded-2xl mb-6">
                            <Image
                                source={{ uri: ticket.qrCode }}
                                className="w-56 h-56"
                                resizeMode="contain"
                            />
                        </View>
                    ) : (
                        <View className="bg-white/20 w-56 h-56 rounded-2xl mb-6 items-center justify-center">
                            <Ionicons name="qr-code" size={80} color="white" />
                        </View>
                    )}

                    {/* Event Title */}
                    <Text className="text-white text-2xl font-bold mb-2 text-center">
                        {ticket.Event?.title || "Event"}
                    </Text>

                    {/* Ticket Info */}
                    <View className="w-full mt-4 space-y-2">
                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-white/80 text-sm">
                                {ticket.sectionName || "Standard"} Tickets ({ticket.seatNumber ? "1" : "N/A"})
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-white/80 text-sm">{ticket.Venue?.name || "Venue"}</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-white/80 text-sm">Amount: {ticket.price?.toLocaleString()} Rwf</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-white/80 text-sm">
                                Bought at: {ticket.purchaseDate ? formatTime(ticket.purchaseDate) : "N/A"}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-white/80 text-sm">
                                Date: {ticket.Event?.date ? formatDate(ticket.Event.date) : "TBD"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Quick Action Section */}
                <View className="mx-5 mt-8">
                    <Text className="text-text text-lg font-bold mb-4">Quick Action</Text>

                    <View className="flex-row justify-around">
                        {/* Place Order Button */}
                        <TouchableOpacity
                            className="items-center"
                            onPress={handlePlaceOrder}
                            activeOpacity={0.7}
                        >
                            <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-2">
                                <Ionicons name="fast-food" size={28} color="white" />
                            </View>
                            <Text className="text-text text-xs text-center">
                                Place foods and{"\n"}drinks order
                            </Text>
                        </TouchableOpacity>

                        {/* Download Ticket Button */}
                        <TouchableOpacity
                            className="items-center"
                            onPress={handleDownload}
                            activeOpacity={0.7}
                        >
                            <View className="w-16 h-16 bg-success rounded-2xl items-center justify-center mb-2">
                                <Ionicons name="download" size={28} color="white" />
                            </View>
                            <Text className="text-text text-xs text-center">Download Ticket</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Ticket Details */}
                <View className="mx-5 mt-8 bg-card rounded-2xl p-5">
                    <Text className="text-text text-base font-bold mb-4">Ticket Details</Text>

                    <View className="space-y-3">
                        <View className="flex-row justify-between items-center py-2 border-b border-border">
                            <Text className="text-text-secondary text-sm">Ticket ID</Text>
                            <Text className="text-text text-sm font-mono">{ticket.ticket_id.slice(0, 8)}...</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-2 border-b border-border">
                            <Text className="text-text-secondary text-sm">Section</Text>
                            <Text className="text-text text-sm font-semibold capitalize">
                                {ticket.sectionName || "Standard"}
                            </Text>
                        </View>

                        {ticket.seatNumber && (
                            <View className="flex-row justify-between items-center py-2 border-b border-border">
                                <Text className="text-text-secondary text-sm">Seat Number</Text>
                                <Text className="text-text text-sm font-semibold">{ticket.seatNumber}</Text>
                            </View>
                        )}

                        <View className="flex-row justify-between items-center py-2 border-b border-border">
                            <Text className="text-text-secondary text-sm">Status</Text>
                            <View className="flex-row items-center gap-2">
                                <View
                                    className={`w-2 h-2 rounded-full ${ticket.status === TicketStatus.SOLD || ticket.status === TicketStatus.RESERVED
                                            ? "bg-success"
                                            : "bg-gray-500"
                                        }`}
                                />
                                <Text
                                    className={`text-sm font-semibold uppercase ${ticket.status === TicketStatus.SOLD || ticket.status === TicketStatus.RESERVED
                                            ? "text-success"
                                            : "text-gray-500"
                                        }`}
                                >
                                    {ticket.status === TicketStatus.SOLD
                                        ? "Active"
                                        : ticket.status === TicketStatus.RESERVED
                                            ? "Reserved"
                                            : ticket.status === TicketStatus.USED
                                                ? "Used"
                                                : "Expired"}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center py-2">
                            <Text className="text-text-secondary text-sm">Purchase Date</Text>
                            <Text className="text-text text-sm">
                                {ticket.purchaseDate ? formatDate(ticket.purchaseDate) : "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
