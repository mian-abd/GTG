import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { onSaveProfile, currentUser } = route.params || {};
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    department: currentUser?.department || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // Only include fields that have been changed
      const changedData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== currentUser?.[key]) {
          changedData[key] = formData[key];
        }
      });
      
      // If no changes, just go back
      if (Object.keys(changedData).length === 0) {
        navigation.goBack();
        return;
      }
      
      // Call the save function from the parent component
      if (onSaveProfile) {
        const success = await onSaveProfile(changedData);
        if (success) {
          navigation.goBack();
        }
      } else {
        Alert.alert('Error', 'Unable to save profile. Please try again later.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.secondary }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Edit Profile</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={[styles.saveButtonText, { color: theme.colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContainer}>
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Name</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }]}
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="Your Name"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>
        
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Email</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }]}
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="Your Email"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Department/Major</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }]}
            value={formData.department}
            onChangeText={(text) => handleInputChange('department', text)}
            placeholder="Your Department or Major"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>
        
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Phone</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }]}
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            placeholder="Your Phone Number"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Bio</Text>
          <TextInput
            style={[styles.textArea, { 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }]}
            value={formData.bio}
            onChangeText={(text) => handleInputChange('bio', text)}
            placeholder="Write a short bio about yourself"
            placeholderTextColor={theme.colors.text.tertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  spacer: {
    height: 40,
  },
});

export default EditProfileScreen; 