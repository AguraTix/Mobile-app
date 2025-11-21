import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BackendIntegrationTest() {
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);

    try {
      Alert.alert(
        '✅ UI-Only Mode',
        'Backend integration tests are disabled in UI-only mode.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', 'Failed to run tests');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-5 py-4 border-b border-border">
        <Text className="text-text text-xl font-bold">Backend Integration Test</Text>
        <TouchableOpacity
          className={`bg-primary px-4 py-2 rounded-lg min-w-[80px] items-center ${isRunning ? 'opacity-60' : ''}`}
          onPress={runTests}
          disabled={isRunning}
        >
          <Text className="text-white text-sm font-semibold">Run Tests</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <View className="gap-5">
          <View className="bg-card rounded-xl p-5 items-center">
            <Text className="text-text text-lg font-bold mb-2">UI-Only Mode</Text>
            <Text className="text-base font-bold mb-2 text-[#34C759]">
              ✅ BACKEND TESTS DISABLED
            </Text>
            <Text className="text-text-secondary text-sm text-center">This is a UI-only prototype with no backend integration.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
