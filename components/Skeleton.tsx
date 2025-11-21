import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, ViewStyle, type DimensionValue } from "react-native";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: ViewStyle | ViewStyle[];
}

export default function Skeleton({ width = "100%", height = 16, radius = 8, style }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 250],
  });

  return (
    <View
      className="bg-gray-200 overflow-hidden"
      style={[{ width, height, borderRadius: radius }, style]}
    >
      <Animated.View
        pointerEvents="none"
        className="absolute left-0 top-0 w-[200px] bg-gray-100 opacity-70"
        style={[
          {
            transform: [{ translateX }],
            height: typeof height === "number" ? height : undefined,
          },
        ]}
      />
    </View>
  );
}
