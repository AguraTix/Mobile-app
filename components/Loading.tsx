import Colors from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';

interface LoadingProps {
    fullScreen?: boolean;
    size?: 'small' | 'large';
    color?: string;
    style?: ViewStyle;
}

export default function Loading({
    fullScreen = false,
    size = 'large',
    color = Colors.primary,
    style
}: LoadingProps) {
    if (fullScreen) {
        return (
            <View className="flex-1 justify-center items-center bg-background" style={style}>
                <ActivityIndicator size={size} color={color} />
            </View>
        );
    }

    return (
        <View className="justify-center items-center p-4" style={style}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}
