import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FoodCardProps {
    item: {
        id: string;
        name: string;
        category: string;
        price: number;
        image: any;
        rating?: number;
    };
    onPress?: () => void;
    onAdd?: () => void;
}

export default function FoodCard({ item, onPress, onAdd }: FoodCardProps) {
    return (
        <TouchableOpacity
            className="bg-card rounded-2xl overflow-hidden w-[160px] mr-4"
            style={styles.shadow}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Image */}
            <View className="h-[120px] bg-white items-center justify-center p-2">
                <Image
                    source={item.image}
                    className="w-full h-full"
                    resizeMode="contain"
                />
                {onAdd && (
                    <TouchableOpacity
                        className="absolute bottom-2 right-2 bg-primary w-8 h-8 rounded-full items-center justify-center"
                        onPress={(e) => {
                            e.stopPropagation();
                            onAdd();
                        }}
                    >
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Content */}
            <View className="p-3">
                <Text className="text-text font-bold text-sm mb-1" numberOfLines={1}>
                    {item.name}
                </Text>
                <Text className="text-text-secondary text-xs mb-2 capitalize">
                    {item.category}
                </Text>

                <View className="flex-row items-center justify-between">
                    <Text className="text-primary font-bold text-sm">
                        {item.price.toLocaleString()} RWF
                    </Text>
                    <View className="flex-row items-center">
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text className="text-text-secondary text-xs ml-1">
                            {item.rating || "4.5"}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    shadow: {
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});
