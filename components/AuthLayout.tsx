import Colors from '@/constants/Colors';
import React, { ReactNode } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent={false}
      />
      <View className="flex-1 px-6 pt-8 pb-10">{children}</View>
    </SafeAreaView>
  );
}
