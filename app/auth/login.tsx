import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import NetworkError from "@/components/NetworkError";
import Colors from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import { commonValidations, useFormValidation } from "@/hooks/useFormValidation";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const { login, isLoading: authLoading, error: authError, user } = useAuth();
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
      console.log(redirectUrl)
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
      <SafeAreaView style={styles.container}>
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
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <Header title="Login" showBack />

        <View style={styles.content}>
          <View style={styles.inputContainer}>
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

          <View style={styles.bottomSection}>
            {localError && <Text style={styles.errorText}>{localError}</Text>}

            <Button
              title="Login"
              onPress={handleSubmit}
              loading={isSubmitting || authLoading}
              style={styles.loginButton}
              fullWidth
              size="large"
              disabled={!formik.isValid || !formik.dirty || authLoading}
            />

            <Button
              title="Continue with Google"
              onPress={handleGoogleLogin}
              style={styles.googleButton}
              fullWidth
              size="large"
              disabled={authLoading || isSubmitting}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don&rsquo;t have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/events-user")}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    padding: 32,
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "100%",
    gap: 12,
  },
  bottomSection: {
    width: "100%",
    paddingBottom: 32,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 24,
  },
  googleButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 32,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});