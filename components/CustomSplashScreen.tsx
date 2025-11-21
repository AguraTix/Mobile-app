import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';

interface CustomSplashScreenProps {
  visible: boolean;
}

export default function CustomSplashScreen({ visible }: CustomSplashScreenProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-[9999]">
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        className="flex-1 justify-center items-center"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="items-center justify-center">
          <Text
            className="text-5xl font-bold text-white tracking-[2px] lowercase"
            style={{ fontFamily: 'System' }}
          >
            agura
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
