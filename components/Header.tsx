import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showBell?: boolean;
  showSearch?: boolean;
  showLogo?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onBellPress?: () => void;
  onSearchPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  showMenu = false,
  showBell = false,
  showSearch = false,
  showLogo = false,
  showProfile = false,
  onMenuPress,
  onBellPress,
  onSearchPress,
  rightComponent,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/home");
    }
  };

  return (
    <SafeAreaView className="bg-black" edges={["top"]} style={styles.shadow}>
      <View className="flex-row items-center justify-between px-5 py-4 min-h-[60px]">
        <View className="flex-row items-center min-w-[60px]">
          {showBack && (
            <TouchableOpacity
              className="w-11 h-11 rounded-[22px] items-center justify-center mx-1"
              style={styles.iconButton}
              onPress={handleBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}

          {showMenu && (
            <TouchableOpacity
              className="w-11 h-11 rounded-[22px] items-center justify-center mx-1"
              style={styles.iconButton}
              onPress={onMenuPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="menu" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 items-center px-4">
          {showLogo ? (
            <Text className="text-2xl font-extrabold text-white text-center tracking-widest">AGURA</Text>
          ) : title ? (
            <Text className="text-xl font-bold text-white text-center tracking-wide" numberOfLines={1}>
              {title}
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center min-w-[60px] justify-end">
          {showSearch && (
            <TouchableOpacity
              className="w-11 h-11 rounded-[22px] items-center justify-center mx-1"
              style={styles.iconButton}
              onPress={onSearchPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="search" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}

          {showBell && (
            <TouchableOpacity
              className="w-11 h-11 rounded-[22px] items-center justify-center mx-1"
              style={styles.iconButton}
              onPress={onBellPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="notifications" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}

          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Keep only rgba background and shadow styles
const styles = StyleSheet.create({
  shadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
});
