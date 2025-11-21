import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';

type EventCategory = 'music' | 'sports' | 'business' | 'tech' | 'other' | 'Sports' | 'Art' | 'Music' | 'Tech' | 'Culture' | 'Film';

interface CategoryButtonProps {
  category: EventCategory;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  selected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      className={`w-20 h-20 rounded-full items-center justify-center m-2 ${selected ? 'bg-primary' : 'bg-card'
        }`}
      style={style}
      onPress={onPress}
    >
      <Text
        className={`text-sm text-center ${selected ? 'text-text font-semibold' : 'text-text font-medium'
          }`}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryButton;
