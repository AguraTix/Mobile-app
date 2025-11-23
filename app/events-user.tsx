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
  const { events: allEvents, fetchEvents } = useEvent();

  // Search & General States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Debounce search - update debouncedQuery after user stops typing
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, [fetchEvents]);

  // Filter options for categories and price ranges
  const filterOptions: FilterOption[] = [
    { id: "music", label: "Music", value: "music" },
    { id: "sports", label: "Sports", value: "sports" },
    { id: "technology", label: "Technology", value: "technology" },
    { id: "food", label: "Food & Dining", value: "food" },
    { id: "art", label: "Art & Culture", value: "art" },
    { id: "business", label: "Business", value: "business" },
    { id: "free", label: "Free Events", value: "free" },
    { id: "paid", label: "Paid Events", value: "paid" },
  ];

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

  // Helper function to get minimum ticket price
  const getMinPrice = (event: Event): number => {
    if (!event.tickets || event.tickets.length === 0) return 0;
    const prices = event.tickets.map(t => t.price);
    return Math.min(...prices);
  };

  // Apply Filters & Sort
  const filteredAndSortedEvents = useMemo(() => {
    if (!allEvents) return [];

    const query = debouncedQuery.toLowerCase();

    // Step 1: Filter by search query
    let results = allEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(query) ||
        event.Venue?.name?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query);

      return matchesSearch;
    });

    // Step 2: Apply category and price filters
    if (selectedFilters.length > 0) {
      results = results.filter((event) => {
        const minPrice = getMinPrice(event);

        // Check price filters
        if (selectedFilters.includes("free") && minPrice === 0) return true;
        if (selectedFilters.includes("paid") && minPrice > 0) return true;

        // Check category filters (match against title, description, or artist lineup)
        const categoryFilters = selectedFilters.filter(f => !["free", "paid"].includes(f));
        if (categoryFilters.length > 0) {
          return categoryFilters.some(filter => {
            const searchText = `${event.title} ${event.description || ""} ${event.artist_lineup?.join(" ") || ""}`.toLowerCase();
            return searchText.includes(filter);
          });
        }

        return false;
      });
    }

    // Step 3: Apply sorting
    const sorted = [...results].sort((a, b) => {
      switch (selectedSort) {
        case "date_asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();

        case "date_desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();

        case "price_asc": {
          const priceA = getMinPrice(a);
          const priceB = getMinPrice(b);
          return priceA - priceB;
        }

        case "price_desc": {
          const priceA = getMinPrice(a);
          const priceB = getMinPrice(b);
          return priceB - priceA;
        }

        case "popularity":
          // Sort by number of tickets sold (assuming higher ticketsCreated = more popular)
          return (b.ticketsCreated || 0) - (a.ticketsCreated || 0);

        default:
          return 0;
      }
    });

    return sorted;
  }, [allEvents, debouncedQuery, selectedFilters, selectedSort]);

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      variant={viewMode === "grid" ? "grid" : "default"}
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

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

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
                className="py-3.5 flex-row items-center justify-between"
                onPress={() => {
                  setSelectedSort(option.id);
                  setShowSortModal(false);
                }}
              >
                <View className="flex-row items-center">
                  {option.icon}
                  <Text className="ml-3 text-base text-text">{option.label}</Text>
                </View>
                {selectedSort === option.id && (
                  <Ionicons name="checkmark" size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderFilterModal = () => (
    <Modal visible={showFilters} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background p-5 rounded-t-[20px]" style={{ maxHeight: '80%' }}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-text">Filters</Text>
            <View className="flex-row items-center gap-3">
              {selectedFilters.length > 0 && (
                <TouchableOpacity onPress={clearAllFilters}>
                  <Text className="text-primary text-sm font-medium">Clear All</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Categories Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-text mb-3">Categories</Text>
              <View className="gap-2">
                {filterOptions.filter(f => !["free", "paid"].includes(f.id)).map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    className="flex-row items-center justify-between py-3 px-4 bg-card rounded-lg"
                    onPress={() => toggleFilter(option.id)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-text text-base">{option.label}</Text>
                    <View className={`w-6 h-6 rounded border-2 items-center justify-center ${selectedFilters.includes(option.id)
                      ? 'bg-primary border-primary'
                      : 'border-text-secondary'
                      }`}>
                      {selectedFilters.includes(option.id) && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-text mb-3">Price</Text>
              <View className="gap-2">
                {filterOptions.filter(f => ["free", "paid"].includes(f.id)).map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    className="flex-row items-center justify-between py-3 px-4 bg-card rounded-lg"
                    onPress={() => toggleFilter(option.id)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-text text-base">{option.label}</Text>
                    <View className={`w-6 h-6 rounded border-2 items-center justify-center ${selectedFilters.includes(option.id)
                      ? 'bg-primary border-primary'
                      : 'border-text-secondary'
                      }`}>
                      {selectedFilters.includes(option.id) && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <TouchableOpacity
            className="bg-primary py-4 rounded-lg items-center mt-4"
            onPress={() => setShowFilters(false)}
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">
              Apply Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
                className={`p-2 rounded-md relative ${selectedFilters.length > 0 ? 'bg-primary/20' : 'bg-card'}`}
                onPress={handleFilterPress}
              >
                <Ionicons
                  name="filter"
                  size={20}
                  color={selectedFilters.length > 0 ? Colors.primary : Colors.text}
                />
                {selectedFilters.length > 0 && (
                  <View className="absolute -top-1 -right-1 bg-primary rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">{selectedFilters.length}</Text>
                  </View>
                )}
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
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      {renderSortModal()}
      {renderFilterModal()}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gridRow: {
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
});
