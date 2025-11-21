import BottomNav from '@/components/BottomNav';
import React from 'react';
import { View } from 'react-native';
import EventMenuScreen from './event/[id]/menu';

export default function MenuTabScreen() {
    // You may want to pass props or params here if needed
    return (
        <View className="flex-1">
            <EventMenuScreen />
            <BottomNav />
        </View>
    );
}
