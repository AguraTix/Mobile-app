import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

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
      style={[
        styles.container,
        selected && styles.selectedContainer,
        style, 
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          selected && styles.selectedText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40, 
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  selectedContainer: {
    backgroundColor: Colors.primary,
  },
  text: {
    color: Colors.text,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedText: {
    color: Colors.text,
    fontWeight: '600',
  },
});

export default CategoryButton;
