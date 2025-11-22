import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import SocialLoginButton from '@/components/SocialLoginButton';
import { commonValidations, useFormValidation } from '@/hooks/useFormValidation';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface PhoneRegisterFormValues {
  phone: string;
  password: string;
}

const phoneRegisterValidationSchema = {
  phone: commonValidations.phone,
  password: commonValidations.password,
};

export default function RegisterPhoneScreen() {
  const router = useRouter();

  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<PhoneRegisterFormValues>(
    {
      phone: '',
      password: '',
    },
    phoneRegisterValidationSchema,
    async (values) => {
      try {
        // Mock registration - just navigate to home
        router.replace('/home');
      } catch {
        // Error handled
      }
    }
  );

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <>
      <Header title="Register with Phone" showBack />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-between mt-4">
            <View className="w-full">
              <Input
                label="Phone Number"
                placeholder="Phone Number"
                value={getFieldValue('phone')}
                onChangeText={(text) => setFieldValue('phone', text)}
                onBlur={() => setFieldTouched('phone')}
                error={getFieldError('phone')}
                keyboardType="phone-pad"
              />
              <Input
                label="Password"
                placeholder="Password"
                value={getFieldValue('password')}
                onChangeText={(text) => setFieldValue('password', text)}
                onBlur={() => setFieldTouched('password')}
                error={getFieldError('password')}
                secureTextEntry
              />
            </View>
            <Button
              title="Sign Up"
              onPress={handleSubmit}
              loading={isSubmitting}
              className="mt-8"
              fullWidth
              size="large"
              disabled={!formik.isValid || !formik.dirty}
            />
            <View className="mt-8">
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-[1px] bg-border" />
                <Text className="text-text-secondary px-4 text-sm">or</Text>
                <View className="flex-1 h-[1px] bg-border" />
              </View>
              <View className="flex-row justify-center">
                <SocialLoginButton provider="apple" onPress={() => router.push('/profile/setup')} showText={false} className="mx-2" />
                <SocialLoginButton provider="google" onPress={() => router.push('/profile/setup')} showText={false} className="mx-2" />
                <SocialLoginButton provider="gmail" onPress={() => router.push('/profile/setup')} showText={false} className="mx-2" />
              </View>
            </View>
            <View className="flex-row justify-center mt-8">
              <Text className="text-text-secondary text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-primary text-sm font-medium">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
