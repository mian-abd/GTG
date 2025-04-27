import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

// Import demo data and helpers
import { STUDENTS } from '../../utils/demoData';
import { getInitials } from '../../utils/helpers';

// Using first student as the current visitor
const currentStudent = STUDENTS[0];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();
  const { theme, isDarkMode, toggleTheme, useSystemTheme, enableSystemTheme } = useTheme();
  
  // State for settings switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [useDeviceTheme, setUseDeviceTheme] = useState(useSystemTheme);
  const [locationEnabled, setLocationEnabled] = useState(true);
  
  // Sync darkMode state with the theme context
  useEffect(() => {
    // This ensures the switch reflects the current theme state
    setUseDeviceTheme(useSystemTheme);
  }, [useSystemTheme]);
  
  const handleEditProfile = () => {
    // Will navigate to edit profile screen in future
    Alert.alert('Edit Profile', 'This feature will be available soon.');
  };
  
  const handleMedicalInfo = () => {
    // Will navigate to medical info screen in future
    Alert.alert('Medical Information', 'This feature will be available soon.');
  };
  
  const handleEmergencyContact = () => {
    // Will navigate to emergency contact screen in future
    Alert.alert('Emergency Contact', 'This feature will be available soon.');
  };
  
  const handleViewMentor = () => {
    // Will navigate to mentor details screen in future
    Alert.alert('Mentor Details', 'This feature will be available soon.');
  };
  
  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: handleLogout,
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleThemeToggle = (value) => {
    toggleTheme(value);
  };
  
  const handleDeviceThemeToggle = (value) => {
    setUseDeviceTheme(value);
    if (value) {
      enableSystemTheme();
    }
  };
  
  // Room and schedule section
  const renderRoomScheduleSection = () => (
    <View style={[styles.sectionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Room & Schedule</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="home-outline" size={20} color={theme.colors.text.secondary} style={styles.infoIcon} />
        <View>
          <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>Room Assignment</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{currentStudent.roomAssignment.building} - Room {currentStudent.roomAssignment.roomNumber}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]} 
        onPress={() => navigation.navigate('ScheduleTab')}
      >
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>View My Schedule</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Settings section
  const renderSettingsSection = () => (
    <View style={[styles.sectionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Settings</Text>
      </View>
      
      <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
        <Ionicons name="notifications-outline" size={22} color={theme.colors.text.secondary} />
        <Text style={[styles.settingText, { color: theme.colors.text.primary }]}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary }}
          thumbColor="#fff"
          style={styles.settingSwitch}
        />
      </View>
      
      <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
        <Ionicons name="moon-outline" size={22} color={theme.colors.text.secondary} />
        <Text style={[styles.settingText, { color: theme.colors.text.primary }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleThemeToggle}
          trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary }}
          thumbColor="#fff"
          style={styles.settingSwitch}
        />
      </View>
      
      <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
        <Ionicons name="location-outline" size={22} color={theme.colors.text.secondary} />
        <Text style={[styles.settingText, { color: theme.colors.text.primary }]}>Location Services</Text>
        <Switch
          value={locationEnabled}
          onValueChange={setLocationEnabled}
          trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary }}
          thumbColor="#fff"
          style={styles.settingSwitch}
        />
      </View>
    </View>
  );
  
  // Actions section
  const renderActionsSection = () => (
    <View style={[styles.sectionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Quick Actions</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.actionRow, { borderBottomColor: theme.colors.border }]} 
        onPress={handleMedicalInfo}
      >
        <Ionicons name="medical-outline" size={22} color={theme.colors.accent} style={styles.actionIcon} />
        <Text style={[styles.actionText, { color: theme.colors.text.primary }]}>Medical Information</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionRow, { borderBottomColor: theme.colors.border }]} 
        onPress={handleEmergencyContact}
      >
        <Ionicons name="call-outline" size={22} color={theme.colors.primary} style={styles.actionIcon} />
        <Text style={[styles.actionText, { color: theme.colors.text.primary }]}>Emergency Contact</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionRow, { borderBottomColor: theme.colors.border }]} 
        onPress={handleViewMentor}
      >
        <Ionicons name="person-outline" size={22} color={theme.colors.tertiary} style={styles.actionIcon} />
        <Text style={[styles.actionText, { color: theme.colors.text.primary }]}>My Mentor</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionRow, styles.logoutRow]} 
        onPress={handleLogoutPress}
      >
        <Ionicons name="log-out-outline" size={22} color={theme.colors.accent} style={styles.actionIcon} />
        <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.secondary }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          {currentStudent.profileImageUrl ? (
            <Image source={{ uri: currentStudent.profileImageUrl }} style={styles.profileImage} />
          ) : (
            <View style={[styles.initialsContainer, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.initials}>{getInitials(currentStudent.name)}</Text>
            </View>
          )}
          
          <Text style={[styles.profileName, { color: theme.colors.text.primary }]}>{currentStudent.name}</Text>
          <Text style={[styles.profileDepartment, { color: theme.colors.text.secondary }]}>{currentStudent.department}</Text>
          <Text style={[styles.profileEmail, { color: theme.colors.text.secondary }]}>{currentStudent.email}</Text>
        </View>
        
        {renderRoomScheduleSection()}
        {renderSettingsSection()}
        {renderActionsSection()}
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  initialsContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4e73df',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  initials: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileDepartment: {
    fontSize: 16,
    color: '#666',
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: '#999',
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#4e73df',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingSwitch: {
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutRow: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#e74c3c',
  },
  spacer: {
    height: 24,
  },
});

export default ProfileScreen; 