import Colors from "@/constants/Colors";
import { clsx, type ClassValue } from "clsx";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning" | "gradient";
  size?: "small" | "medium" | "large" | "xl";
  icon?: React.ComponentType<any>;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  ripple?: boolean;
  gradientColors?: string[];
}

export default function Button({
  title,
  variant = "primary",
  size = "medium",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  rounded = false,
  disabled = false,
  ripple = true,
  gradientColors,
  className,
  ...props
}: ButtonProps & { className?: string }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (ripple && !disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (ripple && !disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Base styles
  const baseStyles = "flex-row items-center justify-center rounded-xl shadow-sm";

  // Variant styles
  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-card border border-border",
    outline: "bg-transparent border-2 border-primary",
    ghost: "bg-transparent",
    danger: "bg-error",
    success: "bg-success",
    warning: "bg-warning",
    gradient: "bg-primary", // Fallback for now
  };

  // Size styles
  const sizeStyles = {
    small: "px-4 py-2 min-h-[36px]",
    medium: "px-5 py-3 min-h-[48px]",
    large: "px-6 py-4 min-h-[56px]",
    xl: "px-8 py-5 min-h-[64px]",
  };

  // Text styles
  const textBaseStyles = "font-semibold text-center";

  const textSizeStyles = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    xl: "text-xl",
  };

  const textVariantStyles = {
    primary: "text-white",
    secondary: "text-text",
    outline: "text-primary",
    ghost: "text-primary",
    danger: "text-white",
    success: "text-white",
    warning: "text-white",
    gradient: "text-white",
  };

  // Icon sizes
  const iconSizes = {
    small: 16,
    medium: 20,
    large: 22,
    xl: 24,
  };

  // Spinner sizes
  const spinnerSizes = {
    small: 16,
    medium: 18,
    large: 20,
    xl: 24,
  };

  const getIconColor = () => {
    if (disabled) return "#999999";
    switch (variant) {
      case "outline":
      case "ghost":
        return Colors.primary;
      case "secondary":
        return Colors.text;
      default:
        return "#ffffff";
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim, width: fullWidth ? '100%' : 'auto' }}>
      <TouchableOpacity
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          rounded && "rounded-full",
          (disabled || loading) && "opacity-60 bg-border",
          className
        )}
        disabled={disabled || loading}
        activeOpacity={ripple ? 1 : 0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {loading ? (
          <View className="flex-row items-center justify-center gap-2">
            <ActivityIndicator
              size={spinnerSizes[size]}
              color={getIconColor()}
            />
            <Text className={cn(textBaseStyles, textSizeStyles[size], textVariantStyles[variant], disabled && "text-[#999999]", "ml-2")}>
              Loading...
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center justify-center gap-2">
            {Icon && iconPosition === "left" && (
              <Icon
                size={iconSizes[size]}
                color={getIconColor()}
              />
            )}
            <Text className={cn(textBaseStyles, textSizeStyles[size], textVariantStyles[variant], disabled && "text-[#999999]")}>
              {title}
            </Text>
            {Icon && iconPosition === "right" && (
              <Icon
                size={iconSizes[size]}
                color={getIconColor()}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}