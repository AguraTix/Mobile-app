import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

interface SettingsOptionProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 pt-20">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center mr-4"
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-white">Settings</Text>
      </View>

      <View className="flex-1 px-5 pt-4">
        {/* General Section */}
        <View className="mb-8">
          <Text className="text-base font-medium text-neutral-400 mb-4">General</Text>

          <SettingsOption
            title="Reset Password"
            onPress={() => router.push('/profile/reset-password')}
          />

          <SettingsOption
            title="Notifications"
            onPress={() => router.push('/profile/notifications')}
          />
        </View>

        {/* Security Section */}
        <View className="mb-8">
          <Text className="text-base font-medium text-neutral-400 mb-4">Security</Text>

          <SettingsOption
            title="Privacy Policy"
            subtitle="Choose what data you share with us"
            onPress={() => {
              // Handle privacy policy
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const SettingsOption: React.FC<SettingsOptionProps> = ({
  title,
  subtitle,
  onPress,
  showChevron = true,
  destructive = false
}) => (
  <TouchableOpacity
    className="flex-row items-center justify-between py-4 mb-2"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="flex-1 mr-4">
      <Text className={`text-lg font-medium ${destructive ? 'text-red-500' : 'text-white'}`}>
        {title}
      </Text>
      {subtitle && <Text className="text-sm text-neutral-400 mt-1">{subtitle}</Text>}
    </View>
    {showChevron && <Ionicons name="chevron-forward" size={20} color="#fff" />}
  </TouchableOpacity>
);