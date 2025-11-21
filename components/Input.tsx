import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ComponentType<any>;
  rightIcon?: React.ComponentType<any>;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  containerStyle?: any;
}

export default function Input({
  label,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  secureTextEntry,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);
    props.onFocus?.(undefined as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.(undefined as any);
  };

  return (
    <View className="mb-5" style={containerStyle}>
      {label && <Text className="text-base font-semibold text-text mb-2 ml-1">{label}</Text>}

      <View
        className={`flex-row items-center bg-white rounded-xl border-2 ${error ? 'border-error bg-red-50' : isFocused ? 'border-primary bg-white' : 'border-transparent'
          }`}
        style={styles.shadow}
      >
        {LeftIcon && (
          <View className="pl-5 pr-3 items-center justify-center">
            <LeftIcon size={20} color={isFocused ? Colors.primary : Colors.textSecondary} />
          </View>
        )}

        <TextInput
          className={`flex-1 py-4 px-5 text-base text-black font-medium ${LeftIcon ? 'pl-4' : ''} ${RightIcon || secureTextEntry ? 'pr-4' : ''}`}
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={style}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            className="pr-5 pl-3 items-center justify-center"
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {isPasswordVisible ? (
              <Ionicons name="eye-off" size={20} color={Colors.textSecondary} />
            ) : (
              <Ionicons name="eye" size={20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}

        {RightIcon && !secureTextEntry && (
          <TouchableOpacity
            className="pr-5 pl-3 items-center justify-center"
            onPress={onRightIconPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <RightIcon size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-sm text-error mt-1.5 ml-1 font-medium">{error}</Text>}
    </View>
  );
}

// Keep shadow styles that are specific
const styles = StyleSheet.create({
  shadow: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
});
