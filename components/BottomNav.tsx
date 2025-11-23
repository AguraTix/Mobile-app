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
            name: 'Events',
            path: '/events-user',
            icon: <></>,
        },
        {
            name: 'Tickets',
            path: '/tickets',
            icon: <></>,
        },
        {
            name: 'Profile',
            path: '/profile-main',
            icon: <></>,
        },
    ];

    return (
        <View className="absolute bottom-5 left-4 right-4 flex-row justify-between items-center bg-[#1A1A1A] rounded-[40px] px-2 py-2 shadow-lg" style={styles.shadow}>
            {navItems.map((item, index) => {
                const isFocused = pathname === item.path;
                const isCenter = index === 2; // The middle item (Events/Star)

                if (isCenter) {
                    return (
                        <TouchableOpacity
                            key={item.path}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={() => router.push(item.path as any)}
                            className="items-center justify-center -mt-8"
                            activeOpacity={0.9}
                        >
                            <View className={`w-16 h-16 rounded-full justify-center items-center border-4 border-[#121212] ${isFocused ? 'bg-card' : 'bg-card'}`}>
                                <View className="w-14 h-14 rounded-full bg-[#2A2A2A] justify-center items-center border border-white/10">
                                    <Ionicons name="star" size={24} color={isFocused ? Colors.primary : "#A0A0A0"} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={item.path}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={() => router.push(item.path as any)}
                        className="items-center justify-center flex-1"
                        activeOpacity={0.7}
                    >
                        <View className="p-2 justify-center items-center">
                            <Ionicons
                                name={
                                    item.name === 'Home' ? (isFocused ? 'home' : 'home-outline') :
                                        item.name === 'Menu' ? (isFocused ? 'clipboard' : 'clipboard-outline') :
                                            item.name === 'Tickets' ? (isFocused ? 'ticket' : 'ticket-outline') :
                                                (isFocused ? 'person' : 'person-outline')
                                }
                                size={24}
                                color={isFocused ? Colors.primary : "#A0A0A0"}
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
