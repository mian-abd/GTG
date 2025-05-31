import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Switch,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { updateDocument } from '../../utils/firebaseConfig';

// Import helpers
import { getInitials } from '../../utils/helpers';

const ProfileScreen = ({ onLogout, navigation }) => {
  // Get theme context
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, handleLogout, handleLogin } = useAuth();
  
  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  
  // State for profile editing
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    biography: user?.biography || '',
    yearsExperience: user?.yearsExperience || '',
    phone: user?.phone || '',
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

    if (!formData.department.trim()) {
      Alert.alert('Error', 'Please enter your department');
      return false;
    }
    
    return true;
  };

  const handleEditProfile = () => {
    // Reset form data to current user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      biography: user?.biography || '',
      yearsExperience: user?.yearsExperience || '',
      phone: user?.phone || '',
    });
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      // Only include fields that have been changed
      const changedData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== user?.[key]) {
          changedData[key] = formData[key];
        }
      });
      
      // If no changes, just close modal
      if (Object.keys(changedData).length === 0) {
        setEditModalVisible(false);
        return;
      }

      // Add updated timestamp
      changedData.updatedAt = new Date().toISOString();
      
      // Update in Firebase (assuming mentors collection)
      const success = await updateDocument('mentors', user.id, changedData);
      
      if (success) {
        // Update local auth context with updated data
        const updatedUser = {
          ...user,
          ...changedData
        };
        
        // Update auth context
        handleLogin(user.role, updatedUser);
        
        Alert.alert('Success', 'Profile updated successfully');
        setEditModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => {
            // Use the provided onLogout prop if available, otherwise use the auth context
            if (onLogout) {
              onLogout();
            } else if (handleLogout) {
              handleLogout();
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleThemeToggle = (value) => {
    toggleTheme(value);
  };

  // Edit Profile Modal Component
  const EditProfileModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>Edit Profile</Text>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)}
                hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.tertiary,
                  borderColor: theme.colors.border
                }]}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.text.tertiary}
                returnKeyType="next"
              />
              
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Email</Text>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.tertiary,
                  borderColor: theme.colors.border
                }]}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email address"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
              
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Department</Text>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.tertiary,
                  borderColor: theme.colors.border
                }]}
                value={formData.department}
                onChangeText={(text) => handleInputChange('department', text)}
                placeholder="Enter your department"
                placeholderTextColor={theme.colors.text.tertiary}
                returnKeyType="next"
              />

              <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.tertiary,
                  borderColor: theme.colors.border
                }]}
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="phone-pad"
                returnKeyType="next"
              />

              <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Years of Experience</Text>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.tertiary,
                  borderColor: theme.colors.border
                }]}
                value={formData.yearsExperience.toString()}
                onChangeText={(text) => handleInputChange('yearsExperience', text)}
                placeholder="Enter years of experience"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="numeric"
                returnKeyType="next"
              />
              
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary }]}>Biography</Text>
              <TextInput
                style={[styles.input, styles.textArea, { 
                  color: theme.colors.text.primary,
                  backgroundColor: theme.colors.background.tertiary,
                  borderColor: theme.colors.border
                }]}
                value={formData.biography}
                onChangeText={(text) => handleInputChange('biography', text)}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.colors.text.tertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSaveProfile}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.secondary,
        borderBottomColor: theme.colors.border
      }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Profile</Text>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: theme.colors.background.tertiary }]}
          onPress={handleEditProfile}
        >
          <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { 
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border
        }]}>
          <View style={styles.profileHeader}>
            {user?.profileImageUrl ? (
              <Image 
                source={{ uri: user.profileImageUrl }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={[styles.profileImageFallback, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.profileImageText}>
                  {getInitials(user?.name || user?.email || 'Mentor')}
                </Text>
              </View>
            )}
            
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text.primary }]}>{user?.name || 'Mentor'}</Text>
              <Text style={[styles.profileRole, { color: theme.colors.text.secondary }]}>{user?.department || 'Department'}</Text>
              <Text style={[styles.profileEmail, { color: theme.colors.text.secondary }]}>{user?.email || ''}</Text>
              {user?.phone && (
                <Text style={[styles.profilePhone, { color: theme.colors.text.secondary }]}>{user.phone}</Text>
              )}
            </View>
          </View>

          {/* Biography Section */}
          {user?.biography && (
            <View style={styles.biographySection}>
              <Text style={[styles.biographyTitle, { color: theme.colors.text.primary }]}>About</Text>
              <Text style={[styles.biographyText, { color: theme.colors.text.secondary }]}>{user.biography}</Text>
            </View>
          )}
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{user?.students?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Students</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{user?.classes?.length || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Classes</Text>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{user?.yearsExperience || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>Years</Text>
            </View>
          </View>
        </View>
        
        {/* Settings Section */}
        <View style={[styles.settingsSection, { 
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Settings</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.text.secondary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.text.primary }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={24} color={theme.colors.text.secondary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.text.primary }]}>Email Alerts</Text>
            </View>
            <Switch
              value={emailAlertsEnabled}
              onValueChange={setEmailAlertsEnabled}
              trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={theme.colors.text.secondary} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.colors.text.primary }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>
        
        {/* Account Section */}
        <View style={[styles.accountSection, { 
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Account</Text>
          
          <TouchableOpacity 
            style={[styles.accountItem, { borderBottomColor: theme.colors.border }]}
            onPress={handleEditProfile}
          >
            <View style={styles.accountItemLeft}>
              <Ionicons name="person-outline" size={24} color={theme.colors.text.secondary} style={styles.accountIcon} />
              <Text style={[styles.accountText, { color: theme.colors.text.primary }]}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.accountItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="lock-closed-outline" size={24} color={theme.colors.text.secondary} style={styles.accountIcon} />
              <Text style={[styles.accountText, { color: theme.colors.text.primary }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.accountItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.text.secondary} style={styles.accountIcon} />
              <Text style={[styles.accountText, { color: theme.colors.text.primary }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.accountItem, { borderBottomColor: 'transparent' }]}
            onPress={handleLogoutPress}
          >
            <View style={styles.accountItemLeft}>
              <Ionicons name="log-out-outline" size={24} color="#E74C3C" style={styles.accountIcon} />
              <Text style={[styles.accountText, { color: "#E74C3C" }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* My Students Section */}
        <View style={[styles.studentsSection, { 
          backgroundColor: theme.colors.card,
          marginBottom: 20,
        }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>My Students</Text>
            <TouchableOpacity 
              style={[styles.viewAllButton, { borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('StudentsTab')}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {user?.students && user.students.length > 0 ? (
            user.students.slice(0, 3).map((student, index) => (
              <View 
                key={index}
                style={[
                  styles.studentItem, 
                  { borderBottomColor: theme.colors.border },
                  index === (user.students.length - 1 || 2) && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.studentInfo}>
                  {student.profileImageUrl ? (
                    <Image source={{ uri: student.profileImageUrl }} style={styles.studentImage} />
                  ) : (
                    <View style={[styles.studentImageFallback, { backgroundColor: theme.colors.tertiary }]}>
                      <Text style={styles.studentImageText}>{getInitials(student.name)}</Text>
                    </View>
                  )}
                  <View>
                    <Text style={[styles.studentName, { color: theme.colors.text.primary }]}>{student.name}</Text>
                    <Text style={[styles.studentDetail, { color: theme.colors.text.secondary }]}>{student.department}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.noStudentsText, { color: theme.colors.text.secondary }]}>
              No students assigned yet
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal />
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
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileImageFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
  },
  biographySection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  biographyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  biographyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  settingsSection: {
    padding: 20,
    marginBottom: 16,
  },
  accountSection: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    marginRight: 12,
  },
  accountText: {
    fontSize: 16,
  },
  studentsSection: {
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  studentImageFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  studentImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDetail: {
    fontSize: 14,
  },
  noStudentsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 