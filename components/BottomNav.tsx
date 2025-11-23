import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface NavItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            name: 'Home',
            path: '/home',
            icon: <></>,
        },
        {
            name: 'Menu',
            path: '/menu',
            icon: <></>,
        },
        {
            name: 'Tickets',
            path: '/tickets',
            icon: <></>,
        },
        {
            name: 'Events',
            path: '/events-user',
            icon: <></>,
        },
        {
            name: 'Profile',
            path: '/profile-main',
            icon: <></>,
        },
    ];

    return (
        <View className="flex-row justify-around items-center bg-card rounded-[40px] mx-4 mb-10 mt-2 px-4 py-3 shadow-lg" style={styles.shadow}>
            {navItems.map((item) => {
                const isFocused = pathname === item.path;
                return (
                    <TouchableOpacity
                        key={item.path}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={() => router.push(item.path as any)}
                        className="items-center justify-center"
                        activeOpacity={0.7}
                    >
                        <View className={`w-14 h-14 rounded-full justify-center items-center ${isFocused ? 'bg-primary' : 'bg-transparent'}`}>
                            <Ionicons
                                name={
                                    item.name === 'Home' ? (isFocused ? 'home' : 'home-outline') :
                                        item.name === 'Menu' ? (isFocused ? 'restaurant' : 'restaurant-outline') :
                                            item.name === 'Tickets' ? (isFocused ? 'ticket' : 'ticket-outline') :
                                                item.name === 'Events' ? (isFocused ? 'time' : 'time-outline') :
                                                    (isFocused ? 'person' : 'person-outline')
                                }
                                size={24}
                                color={isFocused ? Colors.text : Colors.textSecondary}
                            />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// Keep only platform-specific shadow styles that Tailwind can't handle well
const styles = StyleSheet.create({
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },
});
