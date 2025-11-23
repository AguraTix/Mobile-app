import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { useAuth } from "@/contexts";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth()
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const profileMenuItems = [
    {
      id: "profile",
      title: "My Account",
      icon: () => <Ionicons name="person" size={24} color="white" />,
      onPress: () => router.push("/profile/setup"),
      color: "#ec4899", // Pink color from screenshot
    },
    {
      id: "settings",
      title: "Settings",
      icon: () => <Ionicons name="settings" size={24} color="white" />,
      onPress: () => router.push("/profile/settings"),
      color: "#ec4899",
    },
    {
      id: "help",
      title: "Help Center",
      icon: () => <Ionicons name="help-circle" size={24} color="white" />,
      onPress: () => router.push("/profile/help-support"),
      color: "#ec4899",
    },
    {
      id: "contact",
      title: "Contact",
      icon: () => <Ionicons name="call" size={24} color="white" />,
      onPress: () => router.push("/profile/contact"),
      color: "#ec4899",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <Header title="Profile" showBack={false} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          className="items-center px-5 py-8 mt-5"
          style={{ opacity: fadeAnim }}
        >
          <View className="relative mb-5">
            <View className="w-24 h-24 rounded-full bg-[#fce7cf] items-center justify-center overflow-hidden border-2 border-[#fce7cf]">
              <Image
                source={require("@/assets/images/profile.jpg")}
                className="w-full h-full"
              />
            </View>
          </View>

          <Text className="text-2xl font-bold text-white mb-1 text-center">{user?.name || "Donye Collins"}</Text>
          <Text className="text-sm text-gray-400 text-center">{user?.email || "iamcollinsdonye@gmail.com"}</Text>
        </Animated.View>

        {/* Menu Items */}
        <View className="px-5 mt-4">
          {profileMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between mb-6"
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-[16px] items-center justify-center mr-4" style={{ backgroundColor: item.color }}>
                  {item.icon()}
                </View>
                <Text className="text-lg font-medium text-white">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}


