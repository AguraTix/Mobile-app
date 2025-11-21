import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    ticketIds?: string;
    count?: string;
    amount?: string;
    categoryName?: string;
  }>();

  const ticketCount = parseInt(params.count || '1', 10);
  const amount = params.amount || '0';
  const categoryName = params.categoryName ? decodeURIComponent(params.categoryName) : 'Standard';


  // Animation values
  const checkScale = useMemo(() => new Animated.Value(0), []);
  const checkOpacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    // Animate check mark appearance
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [checkScale, checkOpacity]);

  const handleGoBack = () => {
    router.push('/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center px-8">
        {/* Success Message */}
        <Text className="text-2xl font-bold text-text text-center mb-5 leading-8">
          You have successfully{'\n'}bought tickets
        </Text>

        <Text className="text-base text-text text-center leading-6 mb-16 opacity-80">
          You have now bought {ticketCount} {categoryName} ticket{ticketCount > 1 ? 's' : ''}{'\n'}
          for {parseInt(amount).toLocaleString()} RWF.{'\n'}
          Your tickets are ready to use!
        </Text>

        {/* Animated Check Mark */}
        <Animated.View
          className="mb-16"
          style={{
            transform: [{ scale: checkScale }],
            opacity: checkOpacity,
          }}
        >
          <View className="w-[120px] h-[120px] rounded-full border-[3px] border-[#4CAF50] items-center justify-center bg-[#4CAF50]/10">
            <View className="w-20 h-20 rounded-full bg-[#4CAF50] items-center justify-center">
              <Text className="text-white text-[40px] font-bold">✓</Text>
            </View>
          </View>
        </Animated.View>

        {/* Go Back Button */}
        <TouchableOpacity
          className="bg-primary rounded-full py-4 px-8 w-full items-center"
          onPress={handleGoBack}
        >
          <Text className="text-text text-base font-bold">Go back to Events</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}