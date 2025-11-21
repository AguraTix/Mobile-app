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
            icon: <Ionicons name="home" size={26} color={pathname === '/home' ? Colors.primary : Colors.textSecondary} />,
        },
        {
            name: 'Menu',
            path: '/menu',
            icon: <Ionicons name="restaurant" size={26} color={pathname === '/menu' ? Colors.primary : Colors.textSecondary} />,
        },
        {
            name: 'Tickets',
            path: '/tickets',
            icon: <Ionicons name="ticket" size={26} color={pathname === '/tickets' ? Colors.primary : Colors.textSecondary} />,
        },
        {
            name: 'Events',
            path: '/events-user',
            icon: <Ionicons name="time" size={26} color={pathname === '/events-user' ? Colors.primary : Colors.textSecondary} />,
        },
        {
            name: 'Profile',
            path: '/profile-main',
            icon: <Ionicons name="person" size={26} color={pathname === '/profile-main' ? Colors.primary : Colors.textSecondary} />,
        },
    ];

    return (
        <View className="flex-row justify-between items-center bg-card rounded-[40px] mx-4 mb-10 mt-2 px-0 py-2.5 shadow-lg" style={styles.shadow}>
            {navItems.map((item) => {
                const isFocused = pathname === item.path;
                return (
                    <TouchableOpacity
                        key={item.path}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={() => router.push(item.path as any)}
                        className="items-center justify-center px-3"
                        activeOpacity={0.8}
                    >
                        <View className={`p-2 rounded-3xl justify-center items-center ${isFocused ? 'bg-input-background border-2 border-primary' : 'bg-transparent'}`}>
                            {item.icon}
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
