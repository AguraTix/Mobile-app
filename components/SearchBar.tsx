import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFilter?: () => void;
  onSearch?: (query: string) => void;
  showFilter?: boolean;
  disabled?: boolean;
  showSuggestions?: boolean;
  recentSearches?: string[];
  popularSearches?: string[];
}

export default function SearchBar({
  placeholder = "Search events...",
  value,
  onChangeText,
  onClear,
  onFilter,
  onSearch,
  showFilter = false,
  disabled = false,
  showSuggestions = true,
  recentSearches = [],
  popularSearches = []
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && value.length === 0) {
      setShowSuggestionsList(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for touch events
    setTimeout(() => {
      setShowSuggestionsList(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 150);
  };

  const handleClear = () => {
    onChangeText("");
    onClear?.();
    setShowSuggestionsList(false);
  };

  const handleSearch = (query: string) => {
    onChangeText(query);
    onSearch?.(query);
    setShowSuggestionsList(false);
    Keyboard.dismiss();
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice search - in real app, integrate with speech recognition
    setTimeout(() => {
      setIsListening(false);
      // Mock voice input
      const mockVoiceInput = "music festival";
      onChangeText(mockVoiceInput);
      onSearch?.(mockVoiceInput);
    }, 2000);
  };

  const renderSuggestionItem = ({ item, type }: { item: string; type: 'recent' | 'popular' }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 gap-3"
      onPress={() => handleSearch(item)}
      activeOpacity={0.7}
    >
      {type === 'recent' ? (
        <Ionicons name="time" size={16} color={Colors.textSecondary} />
      ) : (
        <Ionicons name="trending-up" size={16} color={Colors.primary} />
      )}
      <Text className={`text-base flex-1 ${type === 'popular' ? 'text-primary font-medium' : 'text-text'}`}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const suggestionsData = [
    { title: 'Recent Searches', data: recentSearches, type: 'recent' as const },
    { title: 'Popular Searches', data: popularSearches, type: 'popular' as const }
  ];

  return (
    <View className="mb-5 z-50">
      <View
        className={`flex-row items-center bg-card rounded-2xl px-4 py-3 border ${isFocused ? 'border-primary bg-input-background' : 'border-border'
          } ${disabled ? 'opacity-60' : ''}`}
        style={isFocused ? styles.shadowFocused : styles.shadow}
      >
        <View className="mr-3">
          <Ionicons name="search" size={20} color={isFocused ? Colors.primary : Colors.textSecondary} />
        </View>

        <TextInput
          className="flex-1 text-base text-text p-0"
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (text.length > 0) {
              setShowSuggestionsList(false);
            } else if (isFocused) {
              setShowSuggestionsList(true);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => onSearch?.(value)}
        />

        {value.length > 0 && (
          <TouchableOpacity
            className="p-1 ml-2"
            onPress={handleClear}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className={`p-1 ml-2 rounded-[20px] px-2 py-1 ${isListening ? 'bg-primary/20' : ''}`}
          onPress={handleVoiceSearch}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="mic" size={18} color={isListening ? Colors.primary : Colors.textSecondary} />
        </TouchableOpacity>

        {showFilter && (
          <TouchableOpacity
            className="p-1 ml-2 rounded-[20px] px-2 py-1 bg-primary/20"
            onPress={onFilter}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="filter" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Suggestions */}
      {showSuggestionsList && showSuggestions && (
        <Animated.View
          className="absolute top-full left-0 right-0 bg-card rounded-2xl mt-2 max-h-[300px] border border-border overflow-hidden"
          style={[{ opacity: fadeAnim }, styles.suggestionsShadow]}
        >
          <FlatList
            data={suggestionsData}
            keyExtractor={(item, index) => `${item.title}-${index}`}
            renderItem={({ item }) => (
              <View className="py-3">
                <Text className="text-xs font-semibold text-text-secondary uppercase tracking-widest mx-4 mb-2">
                  {item.title}
                </Text>
                {item.data.map((searchTerm, index) =>
                  renderSuggestionItem({ item: searchTerm, type: item.type })
                )}
              </View>
            )}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  shadowFocused: {
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  suggestionsShadow: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
});
