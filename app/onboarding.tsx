import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Navigate to welcome screen after loading completes
                    setTimeout(() => {
                        router.replace('/welcome');
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200); // Faster loading for better UX

        return () => clearInterval(interval);
    }, [router]);

    return (
        <View className="flex-1 justify-center items-center relative">
            <StatusBar style="light" />

            {/* Dark pink gradient background matching the screenshot */}
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

            {/* Logo container */}
            <View className="flex-1 items-center justify-center z-10">
                <Text
                    className="text-[42px] font-bold text-white tracking-[2px] text-center"
                    style={{
                        textShadowColor: 'rgba(0,0,0,0.2)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3,
                    }}
                >
                    agura
                </Text>
            </View>

            {/* Loading indicator at bottom */}
            <View className="absolute bottom-20 items-center justify-center z-10">
                <View className="w-2 h-2 rounded-full bg-white mb-2" />
                <Text className="text-white text-base font-medium text-center">{progress}%</Text>
            </View>
        </View>
    );
}