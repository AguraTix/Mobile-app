import Button from '@/components/Button'
import Header from '@/components/Header'
import Input from '@/components/Input'
import SocialLoginButton from '@/components/SocialLoginButton'
import Colors from '@/constants/Colors'
import { commonValidations, useFormValidation } from '@/hooks/useFormValidation'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface RegisterFormValues {
  email: string
  phone: string
  password: string
}

const registerValidationSchema = {
  email: commonValidations.email,
  phone: commonValidations.phone,
  password: commonValidations.password,
}

export default function RegisterEmailScreen() {
  const router = useRouter()

  const {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormValidation<RegisterFormValues>(
    {
      email: '',
      phone: '',
      password: '',
    },
    registerValidationSchema,
    async (values) => {
      try {
        router.replace('/(tabs)')
      } catch {
        // Error handled
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
      <View style={styles.content}>
        <View style={styles.inputContainer}>
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
          style={styles.signUpButton}
          fullWidth
          size="large"
          disabled={!formik.isValid || !formik.dirty}
        />

        <View style={styles.socialContainer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsRow}>
            <SocialLoginButton
              provider="google"
              onPress={() => handleSocialLogin('google')}
              showText={false}
              style={styles.socialButton}
            />
            <SocialLoginButton
              provider="phone"
              onPress={() => handleSocialLogin('phone')}
              showText={false}
              style={styles.socialButton}
            />
          </View>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  inputContainer: {
    width: '100%',
  },
  errorText: {
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: 32,
  },
  socialContainer: {
    marginTop: 32,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    marginHorizontal: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
})
