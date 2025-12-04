import Colors from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
    transparent?: boolean;
}

/**
 * A reusable full-screen loading overlay component.
 * Shows a centered spinner with an optional message.
 */
export default function LoadingOverlay({
    visible,
    message = 'Loading...',
    transparent = true,
}: LoadingOverlayProps) {
    if (!visible) return null;

    return (
        <Modal
            transparent={transparent}
            animationType="fade"
            visible={visible}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    {message && (
                        <Text style={styles.message}>{message}</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        minWidth: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    message: {
        color: Colors.text,
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
});
