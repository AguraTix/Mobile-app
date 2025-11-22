import Button from '@/components/Button'
import Header from '@/components/Header'
import Input from '@/components/Input'
import SocialLoginButton from '@/components/SocialLoginButton'
import { useAuth } from '@/contexts'
import { commonValidations, useFormValidation } from '@/hooks/useFormValidation'
import { useRouter } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface RegisterFormValues {
  name: string
  email: string
  phone: string
  password: string
}

const registerValidationSchema = {
  name: commonValidations.name,
  email: commonValidations.email,
  phone: commonValidations.phone,
  password: commonValidations.password,
}

export default function RegisterEmailScreen() {
  const router = useRouter()
  const { register } = useAuth()
  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<RegisterFormValues>(
    {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
    registerValidationSchema,
    async (values) => {
      try {
        await register({
          name: values.name,
          email: values.email.trim(),
          phone_number: values.phone.trim(),
          password: values.password,
        });
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  )

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleSocialLogin = (provider: string) => {
    router.push('/profile/setup')
  }

  const handleSubmit = () => {
    formik.handleSubmit()
  }

  return (
    <>
      <Header title="Register with Gmail" showBack />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 pb-[50px]"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-between mt-4">
            <View className="w-full">

              <Input
                label="Full Name"
                placeholder="Full Name"
                value={getFieldValue('name')}
                onChangeText={(text) => setFieldValue('name', text)}
                onBlur={() => setFieldTouched('name')}
                error={getFieldError('name')}
              />

              <Input
                label="Email"
                placeholder="Email"
                value={getFieldValue('email')}
                onChangeText={(text) => setFieldValue('email', text)}
                onBlur={() => setFieldTouched('email')}
                error={getFieldError('email')}
                autoCapitalize="none"
                keyboardType="email-address"
              />

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
                <SocialLoginButton
                  provider="google"
                  onPress={() => handleSocialLogin('google')}
                  showText={false}
                  className="mx-2"
                />
                <SocialLoginButton
                  provider="phone"
                  onPress={() => handleSocialLogin('phone')}
                  showText={false}
                  className="mx-2"
                />
              </View>
            </View>

            <View className="flex-row justify-center mt-8">
              <Text className="text-text-secondary text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text className="text-primary text-sm font-medium">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}
