import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import Header from "@/components/Header";
import SocialLoginButton from "@/components/SocialLoginButton";
import { useAuth } from "@/contexts/AuthContext";
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { loginWithToken } = useAuth();
  const goEmail = () => router.push("/auth/register-email");
  const goPhone = () => router.push("/auth/register-phone");
  const goLogin = () => router.push("/auth/login");

  const handleRegisterWithGoogle = async () => {
    const authUrl = "https://agurabackend.onrender.com/api/auth/google";
    const redirectUri = Linking.createURL("auth-callback");

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${authUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`,
        redirectUri
      );

      if (result.type === 'success' && result.url) {
        const { queryParams } = Linking.parse(result.url);
        const { token, user } = queryParams as { token?: string, user?: string };

        if (token && user) {
          await loginWithToken(token, JSON.parse(user));
        }
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-background pb-5">
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
        >
          <Header title="Don't Have Account ?" showBack />
          <View className="flex-1 px-9 pt-8 pb-5 items-center">
            <View className="w-full h-96 overflow-hidden mb-8 self-center shadow-lg">
              <Image
                source={require("@/assets/images/signup.png")}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-2xl font-bold text-text text-center mb-4 leading-8">
              Buy your Event ticket with{"\n"}Agura Platform
            </Text>
            <Text className="text-[15px] text-text-secondary text-center mb-8">
              Sign up to our app and start buying your ticket easily and faster
            </Text>
            <View className="w-full mb-6 items-center">
              <SocialLoginButton
                provider="google"
                onPress={handleRegisterWithGoogle}
                className="bg-white mb-3.5 py-[7px] px-[18px] rounded-[28px] min-w-[317px] max-w-[461px] self-center shadow-sm"
              />
              <SocialLoginButton
                provider="gmail"
                onPress={goEmail}
                className="bg-white mb-3.5 py-[7px] px-[18px] rounded-[28px] min-w-[317px] max-w-[461px] self-center shadow-sm"
              />
              <SocialLoginButton
                provider="phone"
                onPress={goPhone}
                className="bg-white mb-3.5 py-[7px] px-[18px] rounded-[28px] min-w-[317px] max-w-[461px] self-center shadow-sm"
              />
            </View>
            <View className="flex-row justify-center mt-3">
              <Text className="text-text-secondary text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={goLogin}>
                <Text className="text-primary text-sm font-semibold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
