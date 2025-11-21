import Colors from '@/constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ProductionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (__DEV__) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReportIssue = () => {
    Alert.alert(
      'Report Issue',
      'Thank you for reporting this issue. Our team has been notified and will investigate.',
      [{ text: 'OK' }]
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-background justify-center items-center px-6">
          <View className="items-center max-w-[400px]">
            <View className="mb-6 p-4 rounded-full bg-primary/10">
              <Ionicons name="warning" size={64} color={Colors.primary} />
            </View>

            <Text className="text-2xl font-bold text-text mb-4 text-center">
              Oops! Something went wrong
            </Text>

            <Text className="text-base text-text-secondary mb-8 text-center leading-6">
              We're sorry, but something unexpected happened. Our team has been notified.
            </Text>

            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity
                className="flex-row items-center bg-primary/10 px-5 py-3 rounded-[25px] border border-primary"
                onPress={this.handleRetry}
              >
                <Ionicons name="refresh" size={20} color={Colors.primary} />
                <Text className="text-primary text-base font-semibold ml-2">Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-primary px-5 py-3 rounded-[25px]"
                onPress={this.handleReportIssue}
              >
                <Text className="text-white text-base font-semibold">Report Issue</Text>
              </TouchableOpacity>
            </View>

            {__DEV__ && this.state.error && (
              <View className="bg-white/5 p-4 rounded-xl border border-white/10 mt-6 w-full">
                <Text className="text-sm font-semibold text-text mb-2">Debug Info (Development Only):</Text>
                <Text className="text-xs text-text-secondary font-mono leading-4">{this.state.error.toString()}</Text>
                {this.state.errorInfo && (
                  <Text className="text-xs text-text-secondary font-mono leading-4">{this.state.errorInfo.componentStack}</Text>
                )}
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
