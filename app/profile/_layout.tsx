import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
  return (
    <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="setup" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="payment-methods" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="help-support" />
        <Stack.Screen name="contact" />
      </Stack>
    
  );
}
