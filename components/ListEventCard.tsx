import Colors from "@/constants/Colors";
import { Event } from "@/types/backend";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  event: Event;
  isBooked?: boolean;
};

const ListEventCardBase = ({ event, isBooked }: Props) => {
  const router = useRouter();

  const getImageSource = () => {
    if (event.image_url) {
      return { uri: event.image_url };
    }
    if (event.event_images && event.event_images.length > 0) {
      return { uri: event.event_images[0].path };
    }
    return require('../../assets/images/m1.png');
  };

  return (
    <View className="flex-row bg-[#1C1C1E] rounded-3xl mx-5 mb-4 p-3 h-[200px]">
      <Image
        source={getImageSource()}
        className="w-[200px] h-full rounded-2xl mr-5"
      />
      <View className="flex-1 justify-between py-1">
        <View>
          <Text className="text-text font-bold text-[17px]" numberOfLines={1}>
            {event.title}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="calendar" size={14} color={Colors.textSecondary} />
            <Text className="text-text-secondary text-[13px] ml-2.5">{event.date}</Text>
          </View>
          {event.Venue && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={14} color={Colors.textSecondary} />
              <Text className="text-text-secondary text-[13px] ml-2.5">{event.Venue.location}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          className="flex-row items-center justify-center bg-[#2C2C2E] rounded-2xl py-2"
          onPress={() =>
            router.push({
              pathname: `/event/${event.event_id}` as any,
              params: { booked: isBooked ? "1" : undefined },
            })
          }
          accessibilityRole="button"
          accessibilityLabel="View event details"
        >
          <Text className="text-text text-[15px] font-medium ml-2">View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

ListEventCardBase.displayName = "ListEventCard";

const ListEventCard = memo(ListEventCardBase);
ListEventCard.displayName = "ListEventCard";

export default ListEventCard;
