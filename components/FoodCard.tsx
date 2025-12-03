import Colors from "@/constants/Colors";
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
    const [isFavorite, setIsFavorite] = React.useState(false);

    return (
        <TouchableOpacity
            className="bg-card rounded-2xl overflow-hidden w-[160px] mr-4"
            style={styles.shadow}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Image */}
            <View className="items-center justify-center pt-4 pb-2 bg-card">
                <Image
                    source={item.image}
                    className="w-[100px] h-[100px]"
                    resizeMode="contain"
                />
            </View>

            {/* Content */}
            <View className="px-3 pb-3">
                <Text className="text-text font-bold text-sm mb-1" numberOfLines={1}>
                    {item.name}
                </Text>
                <Text className="text-text-secondary text-[10px] mb-2" numberOfLines={2}>
                    This is a {item.name.toLowerCase()} for people
                </Text>

                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Text className="text-xs mr-1">⭐</Text>
                        <Text className="text-text text-xs font-medium">4+</Text>
                    </View>

                    <View className="flex-row items-center">
                        <Text className="text-xs mr-1 text-white">RWF</Text>
                        <Text className="text-text text-xs font-medium">{item.price}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            setIsFavorite(!isFavorite);
                        }}
                        className="p-1"
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={18}
                            color={isFavorite ? "#ff4444" : Colors.text}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Add Button Overlay */}
            {onAdd && (
                <TouchableOpacity
                    className="absolute top-2 right-2 bg-primary/90 p-1.5 rounded-full"
                    onPress={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                >
                    <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
            )}
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
