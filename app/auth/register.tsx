import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "@/components/Header";
import SocialLoginButton from "@/components/SocialLoginButton";

export default function RegisterScreen() {
  const router = useRouter();
  const goEmail = () => router.push("/auth/register-email");
  const goPhone = () => router.push("/auth/register-phone");
  const goLogin = () => router.push("/auth/login");

  const handleRegisterWithGoogle = () => goEmail();

  return (
    <>
      <SafeAreaView className="flex-1 bg-background pb-10">
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
        >
          <Header title="Don't Have Account ?" showBack />
          <View className="flex-1 px-9 pt-8 pb-10 items-center">
            <View className="w-[260px] h-[260px] rounded-[36px] overflow-hidden mb-8 self-center bg-card shadow-lg">
              <Image
                source={require("@/assets/images/icon.png")}
                className="w-full h-full rounded-[36px]"
                contentFit="contain"
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
