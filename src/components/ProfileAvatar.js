import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const ProfileAvatar = ({
  size = 60,
  source = null,
  initials = '',
  backgroundColor = '#009688',
  textColor = '#FFFFFF',
  style = {},
}) => {
  const fontSize = size * 0.4;

  return (
    <View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor,
        },
        style
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text style={[styles.initials, { fontSize, color: textColor }]}>
          {initials.substring(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: 'bold',
  },
});

export default ProfileAvatar; 