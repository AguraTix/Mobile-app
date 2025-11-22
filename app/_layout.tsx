import CustomSplashScreen from '@/components/CustomSplashScreen';
import { ProductionErrorBoundary } from '@/components/ProductionErrorBoundary';
import { ToastProvider } from '@/components/ToastProvider';
import Colors from '@/constants/Colors';
import { RootProvider } from '@/contexts/RootProvider';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Keyboard, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = React.useState(true);

  React.useEffect(() => {
    // Configure navigation bar for Android
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('light');
      NavigationBar.setBehaviorAsync('inset-swipe');
      NavigationBar.setVisibilityAsync('hidden');

      // Show navigation bar when keyboard appears
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          NavigationBar.setVisibilityAsync('visible');
        }
      );

      // Hide navigation bar when keyboard disappears
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          NavigationBar.setVisibilityAsync('hidden');
        }
      );

      // Cleanup listeners
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, []);

  React.useEffect(() => {
    // Hide splash screen after a short delay for smooth transition
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const content = (
    <>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <CustomSplashScreen visible={isSplashVisible} />
      <RootProvider>
        <ToastProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: Colors.background,
              },
              animation: 'slide_from_right',
            }}
          >
            {/* Public screens - no authentication required */}
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="onboarding" options={{ animation: 'none' }} />
            <Stack.Screen name="welcome" options={{ animation: 'none' }} />

            {/* Auth screens - require guest access */}
            <Stack.Screen
              name="auth/login"
              options={{
                animation: 'slide_from_bottom',
                gestureEnabled: true
              }}
            />
            <Stack.Screen
              name="auth/register"
              options={{
                animation: 'slide_from_bottom',
                gestureEnabled: true
              }}
            />
            <Stack.Screen
              name="auth/register-email"
              options={{
                animation: 'slide_from_bottom',
                gestureEnabled: true
              }}
            />
            <Stack.Screen
              name="auth/register-phone"
              options={{
                animation: 'slide_from_bottom',
                gestureEnabled: true
              }}
            />

            {/* Protected screens - require authentication */}
            <Stack.Screen name="home" options={{ animation: 'none' }} />
            <Stack.Screen name="menu" options={{ animation: 'none' }} />
            <Stack.Screen name="tickets" options={{ animation: 'none' }} />
            <Stack.Screen name="events-user" options={{ animation: 'none' }} />
            <Stack.Screen name="profile-main" options={{ animation: 'none' }} />
            <Stack.Screen name="events" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="event" />
            <Stack.Screen name="notifications" />
          </Stack>
        </ToastProvider>
      </RootProvider>
    </>
  );

  if (Platform.OS === 'web') {
    return <ProductionErrorBoundary>{content}</ProductionErrorBoundary>;
  }
  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <ProductionErrorBoundary>{content}</ProductionErrorBoundary>
    </GestureHandlerRootView>
  );
}
