import Colors from "@/constants/Colors";
import { radius, spacing } from "@/constants/spacing";
import { typeScale } from "@/constants/typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
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
  date: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      
      {/* Custom Header matching the design */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{event.title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Bell size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <User size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Event Image */}
        <View style={styles.imageContainer}>
          <RNImage
            source={
              event.imageUrl 
                ? { uri: event.imageUrl }
                : require('@/assets/images/m1.png')
            }
            style={styles.eventImage}
            resizeMode="cover"
          />
        </View>

        {/* Event Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Organizer:</Text>
            <Text style={styles.infoValue}>Platini</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconRow}>
              <Calendar size={16} color="#FFFFFF" />
              <Text style={styles.infoLabel}>Date:</Text>
            </View>
            <Text style={styles.infoValue}>
              {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : "TBD"}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconRow}>
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.infoLabel}>Venue:</Text>
            </View>
            <Text style={styles.infoValue}>{event.location || "Serena Hotel Kigali"}</Text>
          </View>
        </View>

        {/* Tickets Section */}
        <View style={styles.ticketsSection}>
          <Text style={styles.sectionTitle}>Tickets</Text>
          {categories.length === 0 ? (
            <View style={styles.noTicketsContainer}>
              <Text style={styles.noTicketsText}>No tickets available for this event</Text>
            </View>
          ) : (
            <View style={styles.ticketsGrid}>
              {categories.map((category, idx) => (
                <View style={styles.ticketCard} key={idx}>
                  <Text style={styles.ticketType}>{category.name}</Text>
                  <View style={styles.ticketBadge}>
                    <Text style={styles.ticketBadgeText}>
                      {category.quantity || 0} left
                    </Text>
                  </View>
                  <Text style={styles.ticketPrice}>
                    {category.price.toLocaleString()} RWF
                  </Text>
                  <TouchableOpacity 
                    style={[
                      styles.buyButton,
                      (!category.quantity || category.quantity <= 0) && styles.buyButtonDisabled
                    ]}
                    onPress={() => handleBuyTicket(category)}
                    disabled={!category.quantity || category.quantity <= 0}
                  >
                    <Text style={styles.buyButtonText}>Buy</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Location Section */}
        {coords.latitude && coords.longitude && (
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            <TouchableOpacity style={styles.mapContainer} onPress={handleViewMap}>
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: typeScale.h3.size,
    fontWeight: typeScale.h3.weight,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
    marginRight: 8,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 200,
    marginHorizontal: 20,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: typeScale.caption.size,
    marginRight: 8,
  },
  infoValue: {
    color: Colors.text,
    fontSize: typeScale.body.size,
    fontWeight: '500',
  },
  infoIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailRow: {
    marginBottom: spacing.md,
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontSize: typeScale.caption.size,
    marginBottom: 4,
  },
  detailValue: {
    color: Colors.text,
    fontSize: typeScale.body.size,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketsSection: {
    paddingHorizontal: 20,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: typeScale.h3.size,
    fontWeight: typeScale.h3.weight,
    marginBottom: spacing.md,
  },
  noTicketsContainer: {
    backgroundColor: Colors.card,
    borderRadius: radius.lg,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  noTicketsText: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  ticketsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ticketCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ticketType: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  ticketBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  ticketBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  ticketPrice: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.5,
  },
  buyButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  buyButtonTextDisabled: {
    color: Colors.background,
  },
  locationSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});