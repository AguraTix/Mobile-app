import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Skeleton from "@/components/Skeleton";
import Colors from "@/constants/Colors";
import { radius, spacing } from "@/constants/spacing";
import { typeScale } from "@/constants/typography";
import { useAuth, useEvent } from "@/contexts";
import { useRouter } from "expo-router";
import {
  Bell
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");


const mockFeaturedEvents: any[] = [
  { id: '1', event_id: '1', title: 'Summer Music Festival', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), venue_id: 'v1', admin_id: 'a1', description: 'Amazing summer music festival', artist_lineup: ['Artist 1', 'Artist 2'], image_url: 'https://via.placeholder.com/300x200?text=Music+Festival' },
  { id: '2', event_id: '2', title: 'Tech Conference 2024', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), venue_id: 'v2', admin_id: 'a1', description: 'Tech conference', artist_lineup: [], image_url: 'https://via.placeholder.com/300x200?text=Tech+Conference' },
];
const mockAllEvents: any[] = [
  ...mockFeaturedEvents,
  { id: '3', event_id: '3', title: 'Sports Championship', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), venue_id: 'v3', admin_id: 'a1', description: 'Sports event', artist_lineup: [], image_url: 'https://via.placeholder.com/300x200?text=Sports' },
  { id: '4', event_id: '4', title: 'Food Expo', date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), venue_id: 'v4', admin_id: 'a1', description: 'Food expo', artist_lineup: [], image_url: 'https://via.placeholder.com/300x200?text=Food+Expo' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth()
  const { events, fetchEvents, isLoading } = useEvent(); // Modified line
  const [searchQuery, setSearchQuery] = useState(""); // Added line
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Added line
  const [selectedCategory, setSelectedCategory] = useState("All"); // Added line
  const [refreshing, setRefreshing] = useState(false); // Added line
  const [recentSearches, setRecentSearches] = useState<string[]>([ // Added line
    "music festival",
    "tech conference",
    "food expo",
    "art exhibition"
  ]);
  const [popularSearches, setPopularSearches] = useState<string[]>([ // Added line
    "summer events",
    "live music",
    "sports games",
    "business networking"
  ]);

  useEffect(() => { // Added useEffect
    fetchEvents().catch(console.error);
  }, []);

  // Use real events from context, fallback to mock if empty
  const featuredEvents = events.length > 0 ? events.slice(0, 2) : mockFeaturedEvents; // Modified line
  const allEvents = events.length > 0 ? events : mockAllEvents; // Modified line
  const loading = isLoading; // Modified line

  // Compute upcoming events from all events
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter((event: any) => new Date(event.date) > now) // Modified line
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Modified line
      .slice(0, 6);
  }, [allEvents]);

  // Helper function to check if a date is today (kept for potential future use, though not used in the diff)
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const quickActions = [
    {
      id: "1",
      title: "My Tickets",
      icon: "🎫",
      color: Colors.primary,
      onPress: () => router.push("/(tabs)/tickets")
    },
    {
      id: "2",
      title: "Book Event",
      icon: "📅",
      color: "#3b82f6",
      onPress: () => router.push("/(tabs)/events-user")
    },
    {
      id: "3",
      title: "Food & Drinks",
      icon: "🍔",
      color: "#f59e0b",
      onPress: () => router.push("/(tabs)/events-user")
    },
    {
      id: "4",
      title: "Get Help",
      icon: "❓",
      color: "#10b981",
      onPress: () => router.push("/profile/help-support")
    }
  ];

  const categories = [
    { name: "Music", icon: "🎵", color: Colors.primary },
    { name: "Sports", icon: "⚽", color: Colors.success },
    { name: "Technology", icon: "💻", color: Colors.info },
    { name: "Food", icon: "🍕", color: Colors.warning },
    { name: "Art", icon: "🎨", color: Colors.error },
    { name: "Business", icon: "💼", color: Colors.primaryLight }
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecentSearches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(newRecentSearches);

      // For now, just update local state since we don't have a dedicated search screen
      console.log('Searching for:', query.trim());
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleViewAllEvents = () => {
    router.push("/(tabs)/events-user");
  };

  const handleViewAllUpcoming = () => {
    router.push("/(tabs)/events/upcoming");
  };

  const handleQuickAction = (action: any) => {
    action.onPress();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleNotificationPress = () => {
    Alert.alert("Notifications", "You have 3 new notifications");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hello, {user?.name || 'Guest'}! 👋</Text>
            <Text style={styles.subtitle}>Discover amazing events today</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}
            activeOpacity={0.8}
          >
            <Bell size={24} color={Colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search events, venues, or categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          showFilter={true}
          showSuggestions={true}
          recentSearches={recentSearches}
          popularSearches={popularSearches}
        />

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionButton, { backgroundColor: action.color + '20' }]}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Events */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured Events"
            subtitle="Handpicked events just for you"
            showSeeAll={true}
            onSeeAllPress={handleViewAllEvents}
          />
          {loading ? (
            <View style={[styles.horizontalScroll, { flexDirection: 'row' }]}>
              <View style={styles.featuredEventContainer}><Skeleton height={200} radius={16} /></View>
              <View style={styles.featuredEventContainer}><Skeleton height={200} radius={16} /></View>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {featuredEvents.map((event) => (
                <View key={event.id} style={styles.featuredEventContainer}>
                  <EventCard
                    event={event}
                    variant="detailed"
                    onPress={() => handleEventPress(event.id)}
                    onFavorite={() => Alert.alert("Favorite", "Added to favorites")}
                    onShare={() => Alert.alert("Share", "Sharing event...")}
                    onBookmark={() => Alert.alert("Bookmark", "Bookmarked event")}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <SectionHeader
            title="Upcoming Events"
            subtitle="Events happening soon"
            showSeeAll={true}
            onSeeAllPress={handleViewAllUpcoming}
          />
          {loading ? (
            <View style={{ gap: 12, paddingHorizontal: 20 }}>
              <Skeleton height={92} radius={12} />
              <Skeleton height={92} radius={12} />
              <Skeleton height={92} radius={12} />
            </View>
          ) : (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                variant="default"
                onPress={() => handleEventPress(event.id)}
                onFavorite={() => Alert.alert("Favorite", "Added to favorites")}
              />
            ))
          )}
        </View>

        {/* Event Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryButton, { backgroundColor: category.color + '20' }]}
                onPress={() => {
                  // For now, just log the category selection since we don't have dedicated category screens
                  console.log('Selected category:', category.name);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: typeScale.h1.size,
    fontWeight: typeScale.h1.weight,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typeScale.subtitle.size,
    color: Colors.textSecondary,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: Colors.card,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typeScale.h3.size,
    fontWeight: typeScale.h3.weight,
    color: Colors.text,
    marginBottom: spacing.md,
  },
  quickActionsScroll: {
    paddingHorizontal: 20,
    gap: spacing.md,
  },
  quickActionButton: {
    width: 140,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    backgroundColor: Colors.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginRight: spacing.md,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  featuredEventContainer: {
    width: width - 40,
    marginRight: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: 20,
  },
  categoryButton: {
    width: '48%',
    padding: 20,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    backgroundColor: Colors.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: typeScale.subtitle.size,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});