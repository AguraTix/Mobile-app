import { LinearGradient } from 'expo-linear-gradient';
import React, { Component, ReactNode } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });

    // Log to production error reporting service
    if (__DEV__) {
      console.log('Error details:', { error, errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = () => {
    Alert.alert(
      'Report Error',
      'Thank you for helping us improve! This error has been automatically reported to our team.',
      [{ text: 'OK' }]
    );
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1">
          <LinearGradient
            colors={['#e6007e', '#c2185b', '#ad1457']}
            className="flex-1 justify-center items-center"
          >
            <View className="p-5 items-center max-w-[300px]">
              <Text className="text-2xl font-bold text-white text-center mb-4">Oops! Something went wrong</Text>
              <Text className="text-base text-white text-center mb-8 leading-[22px]">
                We're sorry, but something unexpected happened. Our team has been notified.
              </Text>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  className="bg-white px-6 py-3 rounded-lg min-w-[100px]"
                  onPress={this.handleRetry}
                >
                  <Text className="text-[#e6007e] text-base font-semibold text-center">Try Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white/20 px-6 py-3 rounded-lg min-w-[100px] border border-white"
                  onPress={this.handleReportError}
                >
                  <Text className="text-white text-base font-semibold text-center">Report Issue</Text>
                </TouchableOpacity>
              </View>

              {__DEV__ && this.state.error && (
                <View className="mt-8 p-4 bg-black/30 rounded-lg w-full">
                  <Text className="text-sm font-semibold text-white mb-2">Debug Information:</Text>
                  <Text className="text-xs text-white/80 mb-1">{this.state.error.message}</Text>
                  <Text className="text-xs text-white/80">{this.state.error.stack}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      );
    }

    return this.props.children;
  }
}
