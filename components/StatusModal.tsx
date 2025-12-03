import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { 
  ActivityIndicator, 
  Modal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View 
} from "react-native";

interface StatusModalProps {
    visible: boolean;
    status: 'loading' | 'success' | 'error' | 'idle';
    message?: string;
    onClose?: () => void;
    onSuccess?: () => void; // Optional callback for when success modal is closed or action button pressed
    successButtonText?: string;
}

export default function StatusModal({
    visible,
    status,
    message,
    onClose,
    onSuccess,
    successButtonText = "Done"
}: StatusModalProps) {
    if (!visible || status === 'idle') return null;

    const isSuccess = status === 'success';
    const isError = status === 'error';
    const isLoading = status === 'loading';

    // Handle outside click - only close if not loading
    const handleOverlayPress = () => {
        if (!isLoading && onClose) {
            onClose();
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback 
                onPress={handleOverlayPress}
                disabled={isLoading} // Disable outside press during loading
            >
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.container}>
                            {isLoading && (
                                <View className="items-center py-4">
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                    <Text className="text-text text-base font-medium mt-4 text-center">
                                        {message || "Processing..."}
                                    </Text>
                                </View>
                            )}

                            {isSuccess && (
                                <View className="items-center py-2">
                                    <View className="w-16 h-16 bg-success/10 rounded-full items-center justify-center mb-4">
                                        <Ionicons name="checkmark-circle" size={40} color={Colors.success} />
                                    </View>
                                    <Text className="text-text text-lg font-bold mb-2 text-center">Success!</Text>
                                    <Text className="text-text-secondary text-base text-center mb-6">
                                        {message || "Operation completed successfully."}
                                    </Text>
                                    <TouchableOpacity
                                        className="bg-primary w-full py-3 rounded-xl items-center"
                                        onPress={onSuccess || onClose}
                                    >
                                        <Text className="text-white font-bold text-base">{successButtonText}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {isError && (
                                <View className="items-center py-2">
                                    <View className="w-16 h-16 bg-error/10 rounded-full items-center justify-center mb-4">
                                        <Ionicons name="alert-circle" size={40} color={Colors.error} />
                                    </View>
                                    <Text className="text-text text-lg font-bold mb-2 text-center">Error</Text>
                                    <Text className="text-text-secondary text-base text-center mb-6">
                                        {message || "Something went wrong. Please try again."}
                                    </Text>
                                    <TouchableOpacity
                                        className="bg-gray-200 w-full py-3 rounded-xl items-center"
                                        onPress={onClose}
                                    >
                                        <Text className="text-text font-bold text-base">Close</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: 'black',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});