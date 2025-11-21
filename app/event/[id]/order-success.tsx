import Header from '@/components/Header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Animation refs
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkRotate = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const dotsScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Start animations sequence
    const animateSuccess = () => {
      // Animate dots first
      Animated.parallel([
        Animated.timing(dotsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(dotsScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Then animate checkmark
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(checkmarkScale, {
            toValue: 1,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkRotate, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);

      // Animate dots continuously
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dotsScale, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(dotsScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => animateDots());
      };

      setTimeout(animateDots, 1000);
    };

    animateSuccess();
  }, [checkmarkRotate, checkmarkScale, dotsOpacity, dotsScale]);

  const handleGoBackToOrders = () => {
    router.push(`/event/${id}/orders`);
  };

  const rotation = checkmarkRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Create animated dots around the checkmark
  const renderAnimatedDots = () => {
    const dots = [];
    const dotCount = 8;
    const radius = 80;

    for (let i = 0; i < dotCount; i++) {
      const angle = (i * 360) / dotCount;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;

      dots.push(
        <Animated.View
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#4CAF50]"
          style={{
            transform: [
              { translateX: x },
              { translateY: y },
              { scale: dotsScale },
            ],
            opacity: dotsOpacity,
          }}
        />
      );
    }

    return dots;
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="light" />
      <Header
        showLogo
        showProfile
        showSearch
        onSearchPress={() => { }}
      />

      <View className="flex-1 justify-center px-5">
        <View className="items-center py-[60px]">
          <View className="relative w-[200px] h-[200px] items-center justify-center mb-12">
            {renderAnimatedDots()}
            <Animated.View
              className="absolute"
              style={{
                transform: [
                  { scale: checkmarkScale },
                  { rotate: rotation },
                ],
              }}
            >
              <View className="w-[100px] h-[100px] rounded-full bg-[#4CAF50] items-center justify-center border-[3px] border-[#2E7D32]">
                <Text className="text-white text-[40px] font-bold">✓</Text>
              </View>
            </Animated.View>
          </View>

          <Text className="text-text text-2xl font-bold text-center mb-4 leading-8">Your order has been successfully placed</Text>
          <Text className="text-text-secondary text-base text-center leading-6 px-5">
            Sit and relax while your orders is being worked on. It&apos;ll take 5min before you get it
          </Text>
        </View>

        <View className="pb-8">
          <TouchableOpacity
            className="bg-primary rounded-full py-4 items-center"
            onPress={handleGoBackToOrders}
          >
            <Text className="text-text text-base font-semibold">Go back to orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
