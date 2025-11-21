import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  variant?: "default" | "large" | "compact";
}

export default function SectionHeader({
  title,
  subtitle,
  showSeeAll = false,
  onSeeAllPress,
  variant = "default",
}: SectionHeaderProps) {
  const titleSizeClass = variant === "large" ? "text-2xl" : variant === "compact" ? "text-lg" : "text-xl";
  const subtitleSizeClass = variant === "large" ? "text-base" : variant === "compact" ? "text-[13px]" : "text-sm";

  return (
    <View className="flex-row items-center justify-between mb-5 px-1">
      <View className="flex-1">
        <Text className={`font-bold text-text mb-1 ${titleSizeClass}`}>{title}</Text>
        {subtitle && <Text className={`text-text-secondary font-medium ${subtitleSizeClass}`}>{subtitle}</Text>}
      </View>

      {showSeeAll && (
        <TouchableOpacity
          className="flex-row items-center px-4 py-2 rounded-[20px] gap-1"
          style={styles.seeAllButton}
          onPress={onSeeAllPress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text className="text-sm font-semibold text-primary">See All</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Keep only the background color with opacity that Tailwind can't handle as elegantly
const styles = StyleSheet.create({
  seeAllButton: {
    backgroundColor: "rgba(230, 0, 126, 0.1)",
  },
});
