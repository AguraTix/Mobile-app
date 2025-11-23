import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface SecureRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function SecureRoute({
  children,
  fallback,
  redirectTo = '/auth/login'
}: SecureRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      const token = 8976; // Mock token for now

      if (token) {
        // Token exists, consider user authenticated
        setIsAuthenticated(true);
      } else {
        // No token, redirect to login
        setIsAuthenticated(false);
        router.replace(redirectTo as any);
      }
    } catch (error) {
      setIsAuthenticated(false);
      router.replace(redirectTo as any);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="mt-4 text-base text-text font-medium">Loading...</Text>
      </View>
    );
  }

  // Show fallback or redirect if not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null; // Will redirect via useEffect
  }

  // User is authenticated, show protected content
  return <>{children}</>;
}
