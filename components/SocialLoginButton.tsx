import { clsx, type ClassValue } from "clsx";
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SocialProvider = 'apple' | 'google' | 'gmail' | 'phone';

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  style?: ViewStyle;
  showText?: boolean;
  className?: string;
}

const iconMap: Record<SocialProvider, any> = {
  apple: require('../assets/icons/apple.png'),
  google: require('../assets/icons/google.png'),
  gmail: require('../assets/icons/gmail.png'),
  phone: require('../assets/icons/phone.png'),
};

const textMap: Record<SocialProvider, string> = {
  apple: 'Register with Apple',
  google: 'Register with Google',
  gmail: 'Register with Gmail',
  phone: 'Register with Phone',
};

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onPress,
  style,
  showText = true,
  className,
}) => {
  const iconSource = iconMap[provider];
  const buttonText = textMap[provider];

  return (
    <TouchableOpacity
      className={cn("flex-row items-center justify-start bg-card rounded-full py-[14px] px-5 my-2", className)}
      style={style}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
        <Image source={iconSource} className="w-[22px] h-[22px] rounded-[11px]" resizeMode="cover" />
      </View>
      {showText && <Text className="font-medium ml-3 text-base text-black">{buttonText}</Text>}
    </TouchableOpacity>
  );
};

export default SocialLoginButton;
