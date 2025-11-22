import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import Colors from "@/constants/Colors";
import { useEvent } from "@/contexts";
import { Event } from "@/types/events";

type FilterOption = {
  id: string;
  label: string;
  value: string;
};

type SortOption = {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
};

export default function EventsUserScreen() {
  const router = useRouter();
  const { events: allEvents, fetchEvents, isLoading: loading, error } = useEvent();

  // Search & General States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("date_asc");

  // Missing States (ADDED)
  const [showFilters, setShowFilters] = useState(false);
  const recentSearches: string[] = [];
  const popularSearches: string[] = [];

  // Dummy handlers (ADDED to prevent crashes)
  const handleSearch = () => { };
  const handleSortPress = () => setShowSortModal(true);
  const handleFilterPress = () => setShowFilters(!showFilters);

  const loadData = async () => {
    await fetchEvents();
  };

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Debounce search
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    setIsDebouncing(true);



    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);


  const sortOptions: SortOption[] = [
    {
      id: "date_asc",
      label: "Date (Earliest)",
      value: "date_asc",
      icon: <Ionicons name="calendar" size={18} color={Colors.text} />,
    },
    {
      id: "date_desc",
      label: "Date (Latest)",
      value: "date_desc",
      icon: <Ionicons name="calendar" size={18} color={Colors.text} />,
    },
    {
      id: "price_asc",
      label: "Price (Low to High)",
      value: "price_asc",
      icon: <Ionicons name="cash" size={18} color={Colors.text} />,
    },
    {
      id: "price_desc",
      label: "Price (High to Low)",
      value: "price_desc",
      icon: <Ionicons name="cash" size={18} color={Colors.text} />,
    },
    {
      id: "popularity",
      label: "Most Popular",
      value: "popularity",
      icon: <Ionicons name="people" size={18} color={Colors.text} />,
    },
  ];

  // Apply Filters & Sort
  const filteredAndSortedEvents = useMemo(() => {
    if (!allEvents) return [];

    const query = debouncedQuery.toLowerCase();

    let results = allEvents.filter((event) => {
      const match =
        event.title.toLowerCase().includes(query) ||
        event.Venue?.name?.toLowerCase().includes(query);

      return match;
    });

    return results;
  }, [allEvents, debouncedQuery, selectedFilters, selectedSort]);

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      variant={viewMode === "grid" ? "compact" : "default"}
      onPress={() => router.push(`/event/${item.event_id}`)}
    />
  );

  const renderEmptyState = () => (
    <View className="items-center mt-[60px]">
      <Ionicons name="calendar" size={56} color={Colors.textSecondary} />
      <Text className="text-xl font-bold mt-2.5 text-text">No events found</Text>
      <Text className="text-text-secondary mt-1">
        Try adjusting your search or filters
      </Text>
    </View>
  );

  const renderSortModal = () => (
    <Modal visible={showSortModal} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background p-5 rounded-t-[20px]">
          <View className="flex-row justify-between mb-4">
            <Text className="text-lg font-semibold text-text">Sort By</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                className="py-3.5"
                onPress={() => {
                  setSelectedSort(option.id);
                  setShowSortModal(false);
                }}
              >
                <View className="flex-row items-center">
                  {option.icon}
                  <Text className="ml-3 text-base text-text">{option.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-4">
        {/* Search */}
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

        {/* Controls */}
        <View className="my-2.5">
          <View className="flex-row justify-between">
            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`p-2 rounded-md bg-background ${viewMode === "list" ? 'bg-primary/10' : ''}`}
                onPress={() => setViewMode("list")}
              >
                <Ionicons name="list" size={20} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                className={`p-2 rounded-md bg-background ${viewMode === "grid" ? 'bg-primary/10' : ''}`}
                onPress={() => setViewMode("grid")}
              >
                <Ionicons name="grid" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-2.5">
              <TouchableOpacity className="flex-row items-center gap-1.5" onPress={handleSortPress}>
                <Ionicons name="options" size={20} color={Colors.text} />
                <Text className="text-text">Sort</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                className="p-2 rounded-md bg-card"
                onPress={handleFilterPress}
              >
                <Ionicons name="filter" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Events */}
        <FlatList
          data={filteredAndSortedEvents}
          keyExtractor={(item) => item.event_id}
          renderItem={renderEventItem}
          key={viewMode}
          numColumns={viewMode === "grid" ? 2 : 1}
          columnWrapperStyle={viewMode === "grid" ? styles.gridRow : undefined}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>

      {renderSortModal()}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gridRow: { justifyContent: "space-between" },
});
