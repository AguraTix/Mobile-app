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
        <View style={styles.tabBarContainer}>
            {navItems.map((item) => {
                const isFocused = pathname === item.path;
                return (
                    <TouchableOpacity
                        key={item.path}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={() => router.push(item.path as any)}
                        style={styles.tabButton}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                            {item.icon}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 40,
        marginHorizontal: 16,
        marginBottom: Platform.OS === 'ios' ? 24 : 40,
        marginTop: 8,
        paddingHorizontal: 0,
        paddingVertical: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    iconWrap: {
        padding: 8,
        borderRadius: 24,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapActive: {
        backgroundColor: Colors.inputBackground,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 40,
    },
});
