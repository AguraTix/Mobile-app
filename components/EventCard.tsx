import Colors from "@/constants/Colors";
import { Event } from "@/types/events";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface EventCardProps {
  event: Event
  onPress?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  variant?: "default" | "featured" | "compact" | "detailed" | "grid" | "list" | "poster";
  loading?: boolean;
  isFavorite?: boolean;
  isBookmarked?: boolean;
}

export default function EventCard({
  event,
  onPress,
  onFavorite,
  onShare,
  onBookmark,
  variant = "default",
  loading = false,
  isFavorite = false,
  isBookmarked = false
}: EventCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!loading) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, opacityAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getImageSource = () => {
    if (event.image_url) {
      return { uri: event.image_url };
    }
    if (event.event_images && event.event_images.length > 0) {
      return { uri: event.event_images[0].path };
    }
    return require('../assets/images/m1.png');
  };

  const getMinPrice = () => {
    if (!event.tickets || event.tickets.length === 0) return null;
    const prices = event.tickets.map(t => t.price);
    return Math.min(...prices);
  };

  if (loading) {
    return <EventCardSkeleton variant={variant} />;
  }
  if (variant === "grid") {
    const minPrice = getMinPrice();
    return (
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        <TouchableOpacity
          className="bg-card rounded-xl overflow-hidden"
          style={styles.gridShadow}
          onPress={onPress}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {/* Image */}
            <View className="relative h-[140px]">
              <Image
                source={getImageSource()}
                className="w-full h-full"
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && !imageError && (
                <View className="absolute inset-0 bg-card justify-center items-center">
                  <ActivityIndicator color={Colors.primary} />
                </View>
              )}
              {imageError && (
                <View className="absolute inset-0 bg-card justify-center items-center">
                  <Text className="text-text-secondary text-xs">Image unavailable</Text>
                </View>
              )}

              {/* Price Badge */}
              {minPrice !== null && (
                <View className="absolute bottom-2 left-2 bg-primary px-2.5 py-1 rounded-lg">
                  <Text className="text-white text-xs font-bold">
                    {minPrice === 0 ? 'Free' : `$${minPrice}`}
                  </Text>
                </View>
              )}


            </View>

            {/* Content */}
            <View className="p-3">
              <Text className="text-sm font-bold text-text mb-2 leading-5" numberOfLines={2}>
                {event.title}
              </Text>

              <View className="gap-1.5">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="calendar" size={12} color={Colors.textSecondary} />
                  <Text className="text-[11px] text-text-secondary font-medium flex-1" numberOfLines={1}>
                    {formatDate(event.date || "")}
                  </Text>
                </View>
                {event.Venue && (
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="location" size={12} color={Colors.textSecondary} />
                    <Text className="text-[11px] text-text-secondary font-medium flex-1" numberOfLines={1}>
                      {event.Venue.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === "list") {
    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <TouchableOpacity
          className="bg-card rounded-2xl mb-4 flex-row overflow-hidden"
          style={styles.compactShadow}
          onPress={onPress}
          activeOpacity={0.8}
        >
          {/* Image on the left */}
          <View className="w-[120px] h-[140px]">
            <Image
              source={getImageSource()}
              className="w-full h-full"
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && !imageError && (
              <View className="absolute inset-0 bg-card justify-center items-center">
                <ActivityIndicator color={Colors.primary} />
              </View>
            )}
          </View>

          {/* Content on the right */}
          <View className="flex-1 p-4 justify-between">
            <View>
              <Text className="text-text text-base font-bold mb-2" numberOfLines={1}>
                {event.title}
              </Text>

              <View className="gap-1.5 mb-3">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="musical-notes" size={14} color={Colors.textSecondary} />
                  <Text className="text-xs text-text-secondary font-medium">
                    Playlist
                  </Text>
                </View>

                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                  <Text className="text-xs text-text-secondary font-medium">
                    {formatDate(event.date || "")}
                  </Text>
                </View>

                {event.Venue && (
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                    <Text className="text-xs text-text-secondary font-medium" numberOfLines={1}>
                      {event.Venue.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* View Details Button */}
            <TouchableOpacity
              className="bg-card border border-text-secondary rounded-lg py-2 px-3 flex-row items-center justify-center self-start"
              onPress={onPress}
            >
              <Ionicons name="arrow-forward" size={14} color={Colors.text} />
              <Text className="text-text text-xs font-semibold ml-1.5">View Details</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === "compact") {
    return (
      <Animated.View style={{ opacity: opacityAnim }}>
        <TouchableOpacity
          className="bg-card rounded-xl mb-4 flex-row p-4 shadow-sm"
          style={styles.compactShadow}
          onPress={onPress}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }], flexDirection: 'row', flex: 1 }}>
            <Image source={getImageSource()} className="w-20 h-20 rounded-lg mr-4 bg-border" />
            <View className="flex-1 justify-center">
              <Text className="text-base font-semibold text-text mb-2" numberOfLines={1}>
                {event.title}
              </Text>
              <View className="gap-2">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="calendar" size={14} color={Colors.textSecondary} />
                  <Text className="text-[13px] text-text-secondary font-medium flex-1">
                    {formatDate(event.date || "")}
                  </Text>
                </View>
                {event.Venue && (
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="location" size={14} color={Colors.textSecondary} />
                    <Text className="text-[13px] text-text-secondary font-medium flex-1" numberOfLines={1}>
                      {event.Venue.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === "detailed") {
    return (
      <Animated.View style={[{ opacity: opacityAnim }, styles.detailedShadow]} className="bg-card rounded-[20px] mb-5 overflow-hidden">
        <TouchableOpacity
          className="bg-card rounded-[20px] overflow-hidden relative"
          onPress={onPress}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View className="relative h-[250px]">
              <Image
                source={getImageSource()}
                className="w-full h-full object-cover"
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {/* Dark Overlay to reduce brightness */}
              <View className="absolute inset-0 bg-black/30" />
              {!imageLoaded && !imageError && (
                <View className="absolute inset-0 bg-card justify-center items-center">
                  <ActivityIndicator color={Colors.primary} />
                </View>
              )}
              {imageError && (
                <View className="absolute inset-0 bg-card justify-center items-center">
                  <Text className="text-text-secondary text-sm">Image unavailable</Text>
                </View>
              )}


            </View>

            <View className="p-5 absolute bottom-0">
              <View className="mb-3">
                <Text className="text-[22px] font-bold text-text leading-7" numberOfLines={2}>
                  {event.title}
                </Text>
              </View>

              <View className="gap-3">
                <View className="flex-row justify-between">
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="calendar" size={16} color={Colors.textSecondary} />
                    <Text className="text-sm text-white font-medium">
                      {formatDate(event.date)}
                    </Text>
                  </View>

                </View>

                {event.Venue && (
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="location" size={16} color={Colors.textSecondary} />
                    <Text className="text-sm text-text-secondary font-medium flex-1" numberOfLines={1}>
                      {event.Venue.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === "poster") {
    return (
      <Animated.View style={{ opacity: opacityAnim, flex: 1 }}>
        <TouchableOpacity
          className="bg-card rounded-[32px] overflow-hidden h-full w-full"
          onPress={onPress}
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
            <View className="relative flex-1">
              <Image
                source={getImageSource()}
                className="w-full h-full"
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && !imageError && (
                <View className="absolute inset-0 bg-card justify-center items-center">
                  <ActivityIndicator color={Colors.primary} />
                </View>
              )}

              {/* Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%' }}
              />

              {/* Content */}
              <View className="absolute bottom-0 left-0 right-0 p-6">
                <Text className="text-2xl font-bold text-white mb-3" numberOfLines={2}>
                  {event.title}
                </Text>

                <View className="gap-2">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="calendar-outline" size={16} color="#cccccc" />
                    <Text className="text-sm text-gray-300 font-medium">
                      {formatDate(event.date || "")}
                    </Text>
                  </View>

                  {event.Venue && (
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="location-outline" size={16} color="#cccccc" />
                      <Text className="text-sm text-gray-300 font-medium" numberOfLines={1}>
                        {event.Venue.location}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const minPrice = getMinPrice();
  return (
    <Animated.View style={[{ opacity: opacityAnim }, styles.cardShadow]} className="bg-card rounded-2xl mb-5 overflow-hidden">
      <TouchableOpacity
        className={`bg-card rounded-2xl overflow-hidden ${variant === 'featured' ? 'border-2 border-primary' : ''}`}
        style={variant === 'featured' ? styles.featuredShadow : {}}
        onPress={onPress}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View className="relative h-[200px]">
            <Image
              source={getImageSource()}
              className="w-full h-full"
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && !imageError && (
              <View className="absolute inset-0 bg-card justify-center items-center">
                <ActivityIndicator color={Colors.primary} />
              </View>
            )}
            {imageError && (
              <View className="absolute inset-0 bg-card justify-center items-center">
                <Text className="text-text-secondary text-sm">Image unavailable</Text>
              </View>
            )}

            {variant === "featured" && (
              <View className="absolute top-4 left-4 bg-primary flex-row items-center px-3 py-1.5 rounded-[20px] gap-1">
                <Ionicons name="star" size={16} color="#ffffff" />
                <Text className="text-white text-xs font-semibold">Featured</Text>
              </View>
            )}


          </View>

          <View className="p-5">
            <Text className="text-lg font-bold text-text mb-4 leading-6" numberOfLines={2}>
              {event.title}
            </Text>

            <View className="gap-3 mb-5">
              <View className="flex-row items-center gap-3">
                <Ionicons name="calendar" size={18} color={Colors.textSecondary} />
                <Text className="text-sm text-text-secondary font-medium flex-1">
                  {formatDate(event.date || "")}
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <Ionicons name="time" size={18} color={Colors.textSecondary} />
                <Text className="text-sm text-text-secondary font-medium flex-1">
                  {formatTime(event.date || "")}
                </Text>
              </View>

              {event.Venue && (
                <View className="flex-row items-center gap-3">
                  <Ionicons name="location" size={18} color={Colors.textSecondary} />
                  <Text className="text-sm text-text-secondary font-medium flex-1" numberOfLines={1}>
                    {event.Venue.location}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row justify-between items-center pt-4 border-t border-black/10">
              {minPrice !== null && (
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-text-secondary font-medium">From:</Text>
                  <Text className="text-base font-bold text-primary">
                    {minPrice === 0 ? "Free" : `$${minPrice} `}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Skeleton Loading Component
function EventCardSkeleton({ variant }: { variant: string }) {
  const renderSkeleton = () => (
    <View className="bg-card rounded-2xl mb-4 overflow-hidden">
      <View className="h-[200px] bg-border" />
      <View className="p-4">
        <View className="h-5 bg-border rounded mb-3 w-4/5" />
        <View className="gap-2 mb-3">
          <View className="h-4 bg-border rounded w-3/5" />
          <View className="h-4 bg-border rounded w-3/5" />
        </View>
        <View className="flex-row justify-between">
          <View className="h-4 bg-border rounded w-[30%]" />
          <View className="h-4 bg-border rounded w-[30%]" />
        </View>
      </View>
    </View>
  );

  if (variant === "compact") {
    return (
      <View className="bg-card rounded-xl mb-4 flex-row p-4 shadow-sm" style={styles.compactShadow}>
        <View className="w-20 h-20 rounded-lg mr-4 bg-border" />
        <View className="flex-1 justify-center">
          <View className="h-5 bg-border rounded mb-2 w-4/5" />
          <View className="gap-2">
            <View className="h-4 bg-border rounded w-3/5" />
            <View className="h-4 bg-border rounded w-3/5" />
          </View>
        </View>
      </View>
    );
  }

  return renderSkeleton();
}

const styles = StyleSheet.create({
  cardShadow: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  featuredShadow: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
  },
  compactShadow: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  gridShadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  detailedShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
});