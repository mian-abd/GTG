import React, { useState } from 'react';
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

// Import demo data and helpers
import { STUDENTS } from '../../utils/demoData';
import { getInitials } from '../../utils/helpers';

// Using first student as the current visitor
const currentStudent = STUDENTS[0];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();
  
  // State for settings switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  
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
  
  // Progress sections
  const renderProgressSection = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Program Progress</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${currentStudent.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentStudent.progress}% Complete</Text>
      </View>
      
      {/* Course completion badges could go here */}
      <View style={styles.badgesContainer}>
        <View style={styles.badge}>
          <Ionicons name="school" size={22} color="#4e73df" />
          <Text style={styles.badgeText}>Academic</Text>
        </View>
        
        <View style={styles.badge}>
          <Ionicons name="people" size={22} color="#f9a826" />
          <Text style={styles.badgeText}>Social</Text>
        </View>
        
        <View style={styles.badge}>
          <Ionicons name="construct" size={22} color="#2ecc71" />
          <Text style={styles.badgeText}>Skills</Text>
        </View>
      </View>
    </View>
  );
  
  // Room and schedule section
  const renderRoomScheduleSection = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Room & Schedule</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="home-outline" size={20} color="#666" style={styles.infoIcon} />
        <View>
          <Text style={styles.infoLabel}>Room Assignment</Text>
          <Text style={styles.infoValue}>{currentStudent.roomAssignment.building} - Room {currentStudent.roomAssignment.roomNumber}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => navigation.navigate('ScheduleTab')}
      >
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>View My Schedule</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Settings section
  const renderSettingsSection = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Settings</Text>
      </View>
      
      <View style={styles.settingRow}>
        <Ionicons name="notifications-outline" size={22} color="#666" />
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#e1e1e1', true: '#4e73df' }}
          thumbColor="#fff"
          style={styles.settingSwitch}
        />
      </View>
      
      <View style={styles.settingRow}>
        <Ionicons name="moon-outline" size={22} color="#666" />
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          trackColor={{ false: '#e1e1e1', true: '#4e73df' }}
          thumbColor="#fff"
          style={styles.settingSwitch}
        />
      </View>
      
      <View style={styles.settingRow}>
        <Ionicons name="location-outline" size={22} color="#666" />
        <Text style={styles.settingText}>Location Services</Text>
        <Switch
          value={locationEnabled}
          onValueChange={setLocationEnabled}
          trackColor={{ false: '#e1e1e1', true: '#4e73df' }}
          thumbColor="#fff"
          style={styles.settingSwitch}
        />
      </View>
    </View>
  );
  
  // Actions section
  const renderActionsSection = () => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.actionRow} 
        onPress={handleMedicalInfo}
      >
        <Ionicons name="medical-outline" size={22} color="#e74c3c" style={styles.actionIcon} />
        <Text style={styles.actionText}>Medical Information</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionRow} 
        onPress={handleEmergencyContact}
      >
        <Ionicons name="call-outline" size={22} color="#f9a826" style={styles.actionIcon} />
        <Text style={styles.actionText}>Emergency Contact</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionRow} 
        onPress={handleViewMentor}
      >
        <Ionicons name="person-outline" size={22} color="#4e73df" style={styles.actionIcon} />
        <Text style={styles.actionText}>My Mentor</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionRow, styles.logoutRow]} 
        onPress={handleLogoutPress}
      >
        <Ionicons name="log-out-outline" size={22} color="#e74c3c" style={styles.actionIcon} />
        <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Ionicons name="create-outline" size={22} color="#4e73df" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          {currentStudent.profileImageUrl ? (
            <Image source={{ uri: currentStudent.profileImageUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>{getInitials(currentStudent.name)}</Text>
            </View>
          )}
          
          <Text style={styles.profileName}>{currentStudent.name}</Text>
          <Text style={styles.profileDepartment}>{currentStudent.department}</Text>
          <Text style={styles.profileEmail}>{currentStudent.email}</Text>
        </View>
        
        {renderProgressSection()}
        {renderRoomScheduleSection()}
        {renderSettingsSection()}
        {renderActionsSection()}
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>DePauw Pre-College App v1.0.0</Text>
        </View>
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
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4e73df',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  badge: {
    alignItems: 'center',
    padding: 12,
  },
  badgeText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
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
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfileScreen; 