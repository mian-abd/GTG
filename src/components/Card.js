import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Card = ({ 
  children, 
  onPress, 
  style,
  backgroundColor,
  borderRadius = 8,
  elevation = 0,
  padding = 16,
}) => {
  const { theme } = useTheme();
  
  // Use provided backgroundColor or default from the theme
  const bgColor = backgroundColor || theme.colors.card;
  
  const cardContent = (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: bgColor,
          borderRadius,
          padding,
          borderColor: theme.colors.border,
          ...(elevation > 0 ? { elevation } : {})
        },
        style
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
  },
});

export default Card; 