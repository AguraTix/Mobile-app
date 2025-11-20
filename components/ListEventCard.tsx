import Colors from "@/constants/Colors";
import { Event } from "@/types/backend";
import { useRouter } from "expo-router";
import { Calendar, MapPin } from "lucide-react-native";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <View style={styles.listEventCard}>
      <Image
        source={getImageSource()}
        style={styles.listEventImage}
      />
      <View style={styles.listEventInfo}>
        <View>
          <Text style={styles.listEventTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={styles.listEventMeta}>
            <Calendar size={14} color={Colors.textSecondary} />
            <Text style={styles.listEventMetaText}>{event.date}</Text>
          </View>
          {event.Venue && (
            <View style={styles.listEventMeta}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.listEventMetaText}>{event.Venue.location}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.listDetailsButton}
          onPress={() =>
            router.push({
              pathname: `/event/${event.event_id}` as any,
              params: { booked: isBooked ? "1" : undefined },
            })
          }
          accessibilityRole="button"
          accessibilityLabel="View event details"
        >
          <Text style={styles.listDetailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

ListEventCardBase.displayName = "ListEventCard";

const ListEventCard = memo(ListEventCardBase);
ListEventCard.displayName = "ListEventCard";

export default ListEventCard;

const styles = StyleSheet.create({
  listEventCard: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    height: 200,
  },
  listEventImage: {
    width: 200,
    height: "100%",
    borderRadius: 16,
    marginRight: 19,
  },
  listEventInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  listEventTitle: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 17,
  },
  listEventMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  listEventMetaText: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginLeft: 9,
  },
  listDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    paddingVertical: 7,
  },
  listDetailsButtonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 8,
  },
});
