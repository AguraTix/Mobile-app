import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface DatabaseErrorProps {
  error?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
  showRetry?: boolean;
}

export default function DatabaseError({
  error = "Section is associated to TicketCategory using an alias. You must use the 'as' keyword to specify the alias within your include statement.",
  onRetry,
  onContactSupport,
  showRetry = true
}: DatabaseErrorProps) {

  const handleContactSupport = () => {
    if (onContactSupport) {
      onContactSupport();
    } else {
      Alert.alert(
        'Contact Support',
        'This error has been automatically reported to our technical team. They will fix it as soon as possible.',
        [{ text: 'OK' }]
      );
    }
  };

  const getErrorMessage = (error: string) => {
    if (error.includes('alias') || error.includes('include statement')) {
      return 'We\'re experiencing a technical issue with our database. Our team has been notified and is working to fix it.';
    }
    if (error.includes('Section') && error.includes('TicketCategory')) {
      return 'There\'s a temporary issue with our ticket system. Please try again in a few minutes.';
    }
    return 'A database error occurred. Our technical team has been notified.';
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
        className="flex-1 justify-center items-center"
      >
        <View className="p-5 items-center max-w-[350px]">
          <View className="mb-6">
            <Ionicons name="server" size={48} color="#e6007e" />
          </View>

          <Text className="text-2xl font-bold text-white text-center mb-4">Database Error</Text>
          <Text className="text-base text-[#cccccc] text-center mb-8 leading-[22px]">{getErrorMessage(error)}</Text>

          <View className="flex-row gap-4 mb-6">
            {showRetry && onRetry && (
              <TouchableOpacity
                className="bg-[#e6007e] flex-row items-center px-6 py-3 rounded-lg gap-2 min-w-[120px]"
                onPress={onRetry}
              >
                <Ionicons name="refresh" size={20} color="#ffffff" />
                <Text className="text-white text-base font-semibold">Try Again</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="bg-white/20 flex-row items-center px-6 py-3 rounded-lg gap-2 min-w-[120px] border border-white"
              onPress={handleContactSupport}
            >
              <Ionicons name="warning" size={20} color="#ffffff" />
              <Text className="text-white text-base font-semibold">Report Issue</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-[#999999] text-center leading-5 mb-6">
            This error has been automatically logged for our technical team
          </Text>

          {__DEV__ && (
            <View className="p-4 bg-black/30 rounded-lg w-full">
              <Text className="text-sm font-semibold text-white mb-2">Technical Details:</Text>
              <Text className="text-xs text-white/80 leading-4">{error}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
