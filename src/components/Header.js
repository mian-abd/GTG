import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ 
  title, 
  showBackButton = false, 
  showMenuButton = false, 
  showLogoutButton = false,
  rightIcon = null,
  onRightIconPress,
  onMenuPress,
  backgroundColor = '#1A1A1A',
  iconColor = '#FFF'
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          </TouchableOpacity>
        )}
        
        {showMenuButton && (
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={iconColor} />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightButton}>
            <Ionicons name={rightIcon} size={24} color={iconColor} />
          </TouchableOpacity>
        )}
        
        {showLogoutButton && (
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  menuButton: {
    marginRight: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightButton: {
    marginLeft: 16,
  },
  logoutButton: {
    marginLeft: 16,
  },
});

export default Header; 