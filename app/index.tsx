import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            // Always go to onboarding for UI-only mode
            router.replace('./onboarding');
        }, 2000); // Show splash for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <View className="flex-1 justify-center items-center relative">
            {/* Dark pink gradient background */}
            <LinearGradient
                colors={['#8e0038', '#ad1457', '#c2185b', '#e91e63']}
                className="absolute inset-0"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Soft pink circular gradient in center */}
            <View
                className="absolute overflow-hidden rounded-full"
                style={{ width: width * 0.8, height: width * 0.8 }}
            >
                <LinearGradient
                    colors={['rgba(255, 192, 203, 0.3)', 'rgba(255, 182, 193, 0.1)']}
                    className="flex-1"
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>

            {/* Logo */}
            <View className="z-10 items-center justify-center">
                <Text
                    className="text-[56px] font-extrabold text-white tracking-[3px] lowercase"
                    style={{
                        textShadowColor: 'rgba(0, 0, 0, 0.2)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 4,
                        fontFamily: 'System',
                    }}
                >
                    agura
                </Text>
            </View>
        </View>
    );
}