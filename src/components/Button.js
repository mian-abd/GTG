import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  iconName,
  iconPosition = 'left',
  iconSize = 20,
  iconColor,
  variant = 'filled', // filled, outlined, text
  color = '#F9A826',
  isLoading = false,
  disabled = false,
  size = 'medium', // small, medium, large
}) => {
  // Determine background and text colors based on variant
  let backgroundColor, textColor, borderWidth, borderColor;
  
  switch (variant) {
    case 'outlined':
      backgroundColor = 'transparent';
      textColor = color;
      borderWidth = 1;
      borderColor = color;
      break;
    case 'text':
      backgroundColor = 'transparent';
      textColor = color;
      borderWidth = 0;
      borderColor = 'transparent';
      break;
    case 'filled':
    default:
      backgroundColor = color;
      textColor = color === '#F9A826' ? '#000' : '#FFF';
      borderWidth = 0;
      borderColor = 'transparent';
  }

  // Determine padding based on size
  let padding;
  switch (size) {
    case 'small':
      padding = 8;
      break;
    case 'large':
      padding = 16;
      break;
    case 'medium':
    default:
      padding = 12;
  }

  // If disabled, apply opacity
  if (disabled) {
    backgroundColor = variant === 'filled' ? '#CCC' : backgroundColor;
    textColor = variant === 'filled' ? '#666' : '#CCC';
    borderColor = variant === 'outlined' ? '#CCC' : borderColor;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      style={[
        styles.button,
        {
          backgroundColor,
          borderWidth,
          borderColor,
          padding,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {iconName && iconPosition === 'left' && (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={iconColor || textColor}
              style={styles.iconLeft}
            />
          )}
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {title}
          </Text>
          {iconName && iconPosition === 'right' && (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={iconColor || textColor}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button; 