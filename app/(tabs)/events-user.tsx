import { useRouter } from "expo-router";
import {
  Calendar,
  ChevronDown,
  DollarSign,
  Filter,
  Grid3X3,
  List,
  Sliders,
  Users,
  X,
} from "lucide-react-native";
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

import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import Colors from "@/constants/Colors";
import { useEvent } from "@/contexts";
import { Event } from "@/types/backend";

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
      icon: <Calendar size={18} color={Colors.text} />,
    },
    {
      id: "date_desc",
      label: "Date (Latest)",
      value: "date_desc",
      icon: <Calendar size={18} color={Colors.text} />,
    },
    {
      id: "price_asc",
      label: "Price (Low to High)",
      value: "price_asc",
      icon: <DollarSign size={18} color={Colors.text} />,
    },
    {
      id: "price_desc",
      label: "Price (High to Low)",
      value: "price_desc",
      icon: <DollarSign size={18} color={Colors.text} />,
    },
    {
      id: "popularity",
      label: "Most Popular",
      value: "popularity",
      icon: <Users size={18} color={Colors.text} />,
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
    <View style={styles.emptyState}>
      <Calendar size={56} color={Colors.textSecondary} />
      <Text style={styles.emptyStateTitle}>No events found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search or filters
      </Text>
    </View>
  );

  const renderSortModal = () => (
    <Modal visible={showSortModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.sortOption}
                onPress={() => {
                  setSelectedSort(option.id);
                  setShowSortModal(false);
                }}
              >
                <View style={styles.sortOptionContent}>
                  {option.icon}
                  <Text style={styles.sortOptionText}>{option.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <View style={styles.viewModeToggle}>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === "list" && styles.viewModeButtonActive,
                ]}
                onPress={() => setViewMode("list")}
              >
                <List size={20} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === "grid" && styles.viewModeButtonActive,
                ]}
                onPress={() => setViewMode("grid")}
              >
                <Grid3X3 size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.rightControls}>
              <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
                <Sliders size={20} color={Colors.text} />
                <Text style={styles.sortButtonText}>Sort</Text>
                <ChevronDown size={16} color={Colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleFilterPress}
              >
                <Filter size={20} color={Colors.text} />
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
          contentContainerStyle={styles.eventsList}
        />
      </View>

      {renderSortModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 16 },
  controlsSection: { marginVertical: 10 },
  controlsRow: { flexDirection: "row", justifyContent: "space-between" },
  viewModeToggle: { flexDirection: "row", gap: 8 },
  viewModeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.background,
  },
  viewModeButtonActive: {
    backgroundColor: Colors.primaryLight,
  },
  rightControls: { flexDirection: "row", gap: 10 },
  sortButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  sortButtonText: { color: Colors.text },
  filterButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  gridRow: { justifyContent: "space-between" },
  listItem: { marginBottom: 16 },
  gridItem: { width: "48%", marginBottom: 16 },
  eventsList: { paddingBottom: 50 },
  emptyState: { alignItems: "center", marginTop: 60 },
  emptyStateTitle: { fontSize: 20, fontWeight: "700", marginTop: 10 },
  emptyStateText: { color: Colors.textSecondary, marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "600" },
  sortOption: { paddingVertical: 14 },
  sortOptionContent: { flexDirection: "row", alignItems: "center" },
  sortOptionText: { marginLeft: 12, fontSize: 16 },
});
