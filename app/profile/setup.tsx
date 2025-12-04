import Colors from "@/constants/Colors";
import { useAuth } from "@/contexts";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from "react-native";


export default function MyAccountScreen() {
  const router = useRouter();
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profile_photo || null
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Add updateProfile method to authService
      // await authService.updateProfile({
      //   name,
      //   email,
      //   phone_number: phoneNumber,
      //   profile_photo: profileImage || undefined,
      // });
      Alert.alert('Info', 'Profile update feature will be available soon. Changes saved locally.');
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />

      <View className="flex-1 px-5 pt-6">
        {/* Header */}
        <View className="flex-row items-center mb-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-2 -ml-2"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-text text-xl font-bold">My Account</Text>
        </View>

        {/* Profile Image */}
        <View className="items-center mb-12">
          <TouchableOpacity
            className="relative"
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <View className="w-24 h-24 rounded-full items-center justify-center overflow-hidden border-2 border-[#fce7cf]">
              <Image
                source={require('@/assets/images/profile.jpg')}
                className="w-full h-full z-5"
                resizeMode="cover"
              />
            </View>
            <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary items-center justify-center border-2 border-background shadow-lg">
              <Ionicons name="camera" size={16} color={Colors.text} />
            </View>
          </TouchableOpacity>
          <Text className="text-text-secondary text-sm mt-3">Tap to change photo</Text>
        </View>

        {/* Form Fields */}
        <View className="flex-1">
          <View className="mb-5">
            <Text className="text-text text-sm mb-2 font-semibold">Full Name</Text>
            <TextInput
              className="bg-card rounded-2xl px-5 py-4 text-base text-text border border-transparent focus:border-primary"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View className="mb-5">
            <Text className="text-text text-sm mb-2 font-semibold">Email Address</Text>
            <TextInput
              className="bg-card rounded-2xl px-5 py-4 text-base text-text border border-transparent focus:border-primary"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-5">
            <Text className="text-text text-sm mb-2 font-semibold">Phone Number</Text>
            <TextInput
              className="bg-card rounded-2xl px-5 py-4 text-base text-text border border-transparent focus:border-primary"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Save Button */}
        <View className="pb-10">
          <TouchableOpacity
            className="bg-primary rounded-full py-5 items-center shadow-lg active:opacity-90"
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <Text className="text-text text-lg font-bold">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}