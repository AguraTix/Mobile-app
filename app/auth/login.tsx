import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import NetworkError from "@/components/NetworkError";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { commonValidations, useFormValidation } from "@/hooks/useFormValidation";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginFormValues {
  identifier: string;
  password: string;
}

const loginValidationSchema = {
  identifier: commonValidations.required('Email or phone number'),
  password: commonValidations.required('Password'),
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const { addNotification } = useNotification();
  const [networkError, setNetworkError] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      setLocalError(authError);
      addNotification(authError, 'error', 5000);
    }
  }, [authError]);

  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<LoginFormValues>(
    {
      identifier: "",
      password: "",
    },
    loginValidationSchema,
    async (values) => {
      try {
        setLocalError(null);
        setNetworkError(false);
        await login({
          identifier: values.identifier,
          password: values.password,
        });

      } catch (error: any) {
        console.error('Login error:', error);
      }
    }
  );

  const handleGoogleLogin = async () => {
    try {
      setNetworkError(false);
      setLocalError(null);

      const redirectUrl = Linking.createURL("/auth/login");
      const authUrl = `http://10.12.74.188:3000/api/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const query = parsed.queryParams || {};
        addNotification("Google login successful!", 'success', 3000);
        router.replace("/home");
        return;
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      addNotification('Google login failed', 'error', 5000);
    }
  };

  const handleRetry = () => {
    setNetworkError(false);
    setLocalError(null);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  // Show network error if there's a network issue
  if (networkError) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="light" />
        <Header title="Login" showBack />
        <NetworkError
          message="Unable to connect to our servers. Please check your internet connection."
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="light" />
        <Header title="Login" showBack />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerClassName="flex-grow"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-6 py-8 justify-between">
              <View className="w-full gap-3">
                <Input
                  label="Email or Phone"
                  placeholder="Email or Phone Number"
                  value={getFieldValue('identifier')}
                  onChangeText={(text) => setFieldValue('identifier', text)}
                  onBlur={() => setFieldTouched('identifier')}
                  error={getFieldError('identifier')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  placeholder="Password"
                  value={getFieldValue('password')}
                  onChangeText={(text) => setFieldValue('password', text)}
                  onBlur={() => setFieldTouched('password')}
                  error={getFieldError('password')}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>

              <View className="w-full pb-8">
                {localError && <Text className="text-error mb-4 text-center text-sm font-medium">{localError}</Text>}

                <Button
                  title="Login"
                  onPress={handleSubmit}
                  loading={isSubmitting || authLoading}
                  className="bg-primary rounded-[25px] mb-6"
                  fullWidth
                  size="large"
                  disabled={!formik.isValid || !formik.dirty || authLoading}
                />

                <Button
                  title="Continue with Google"
                  onPress={handleGoogleLogin}
                  className="bg-transparent border border-border rounded-[25px] mb-8"
                  fullWidth
                  size="large"
                  disabled={authLoading || isSubmitting}
                />

                <View className="flex-row justify-center">
                  <Text className="text-text-secondary text-sm">Don&rsquo;t have an account? </Text>
                  <TouchableOpacity onPress={() => router.push("/auth/register")}>
                    <Text className="text-primary text-sm font-semibold">Sign up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}