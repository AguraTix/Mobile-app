import Colors from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function NetworkError({
  message = "Network connection issue",
  onRetry,
  showRetry = true
}: NetworkErrorProps) {
  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      <View className="mb-6 p-4 rounded-full bg-primary/10">
        <Ionicons name="wifi" size={48} color={Colors.primary} />
      </View>

      <Text className="text-2xl font-bold text-text mb-3 text-center">Connection Error</Text>
      <Text className="text-base text-text-secondary mb-8 text-center leading-6">{message}</Text>

      {showRetry && onRetry && (
        <TouchableOpacity
          className="flex-row items-center bg-primary px-6 py-3 rounded-[25px] mb-8"
          onPress={onRetry}
        >
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
          <Text className="text-white text-base font-semibold ml-2">Try Again</Text>
        </TouchableOpacity>
      )}

      <View className="bg-white/5 p-5 rounded-2xl border border-white/10 w-full">
        <Text className="text-base font-semibold text-text mb-3">Quick Tips:</Text>
        <Text className="text-sm text-text-secondary mb-2 leading-5">• Check your internet connection</Text>
        <Text className="text-sm text-text-secondary mb-2 leading-5">• Try switching between WiFi and mobile data</Text>
        <Text className="text-sm text-text-secondary leading-5">• Restart the app if the problem persists</Text>
      </View>
    </View>
  );
}
