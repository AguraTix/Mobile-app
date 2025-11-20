import Button from "@/components/Button";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import Colors from "@/constants/Colors";
import { useEvent } from "@/contexts/EventContext";
import { useNotification } from "@/contexts/NotificationContext";
import { useRouter } from "expo-router";
import { AlertCircle, Calendar } from "lucide-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpcomingEventsScreen() {
  const router = useRouter();
  const { events, isLoading, error, fetchRecentEvents, clearError } = useEvent();
  const { addNotification } = useNotification();

  // Fetch events on mount
  useEffect(() => {
    fetchRecentEvents(10, 0);
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      addNotification(error, 'error', 5000);
      clearError();
    }
  }, [error]);

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleRetry = () => {
    fetchRecentEvents(10, 0);
  };

  // Filter upcoming events (events with future dates)
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate > now;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Show loading state
  if (isLoading && events.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Upcoming Events" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && events.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Upcoming Events" showBack />
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <AlertCircle size={48} color={Colors.error} />
          </View>
          <Text style={styles.errorTitle}>Unable to Load Events</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            title="Try Again"
            variant="primary"
            onPress={handleRetry}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Upcoming Events" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <Calendar size={32} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Upcoming Events</Text>
          <Text style={styles.headerSubtitle}>
            {upcomingEvents.length} events coming up
          </Text>
        </View>

        {/* Events List */}
        {upcomingEvents.length > 0 ? (
          <View style={styles.eventsSection}>
            {upcomingEvents.map((event, index) => (
              <View key={event.event_id} style={styles.eventContainer}>
                <EventCard
                  event={event}
                  variant="compact"
                  onPress={() => handleEventPress(event.event_id)}
                />
                {index < upcomingEvents.length - 1 && (
                  <View style={styles.eventSeparator} />
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Calendar size={48} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No Upcoming Events</Text>
            <Text style={styles.emptyMessage}>
              There are no upcoming events scheduled at the moment. Check back later for new events!
            </Text>
            <Button
              title="Browse All Events"
              variant="outline"
              onPress={() => router.push("/(tabs)/events-user")}
              style={styles.browseButton}
            />
          </View>
        )}

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Button
            title="View All Events"
            variant="primary"
            size="large"
            fullWidth={true}
            onPress={() => router.push("/(tabs)/events-user")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  eventsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  eventContainer: {
    marginBottom: 16,
  },
  eventSeparator: {
    height: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
    marginTop: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  browseButton: {
    minWidth: 160,
  },
  ctaSection: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  retryButton: {
    minWidth: 120,
  },
});
