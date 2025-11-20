import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Backend Integration Test</Text>
        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={runTests}
          disabled={isRunning}
        >
          <Text style={styles.runButtonText}>Run Tests</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsContainer}>
          <View style={styles.overallResult}>
            <Text style={styles.overallTitle}>UI-Only Mode</Text>
            <Text style={[styles.overallStatus, styles.success]}>
              ✅ BACKEND TESTS DISABLED
            </Text>
            <Text style={styles.overallMessage}>This is a UI-only prototype with no backend integration.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  runButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  runButtonDisabled: {
    opacity: 0.6,
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 16,
  },
  resultsContainer: {
    gap: 20,
  },
  overallResult: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  overallTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overallStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overallMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  testResults: {
    gap: 12,
  },
  testItem: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  testStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  testMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  testDetails: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#1C1C1E',
    padding: 8,
    borderRadius: 4,
  },
  success: {
    color: '#34C759',
  },
  failure: {
    color: '#FF3B30',
  },
  successBanner: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  successText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  successSubtext: {
    color: '#34C759',
    fontSize: 14,
    textAlign: 'center',
  },
});
