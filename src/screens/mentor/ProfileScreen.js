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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import demo data
import { MENTORS } from '../../utils/demoData';
import { getInitials } from '../../utils/helpers';

// Using first mentor as the current mentor
const currentMentor = MENTORS[0];

const ProfileScreen = () => {
  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
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
          onPress: () => console.log('Logout pressed')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#4e73df" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {currentMentor.profileImageUrl ? (
              <Image 
                source={{ uri: currentMentor.profileImageUrl }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImageFallback}>
                <Text style={styles.profileImageText}>
                  {getInitials(currentMentor.name)}
                </Text>
              </View>
            )}
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{currentMentor.name}</Text>
              <Text style={styles.profileRole}>{currentMentor.department}</Text>
              <Text style={styles.profileEmail}>{currentMentor.email}</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentMentor.students.length}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
          </View>
        </View>
        
        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#ccc", true: "#4e73df" }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={24} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>Email Alerts</Text>
            </View>
            <Switch
              value={emailAlertsEnabled}
              onValueChange={setEmailAlertsEnabled}
              trackColor={{ false: "#ccc", true: "#4e73df" }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color="#666" style={styles.settingIcon} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#ccc", true: "#4e73df" }}
              thumbColor="#fff"
            />
          </View>
        </View>
        
        {/* Account Section */}
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="person-outline" size={24} color="#666" style={styles.accountIcon} />
              <Text style={styles.accountText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.accountIcon} />
              <Text style={styles.accountText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#666" style={styles.accountIcon} />
              <Text style={styles.accountText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.accountItem, styles.logoutItem]} 
            onPress={handleLogout}
          >
            <View style={styles.accountItemLeft}>
              <Ionicons name="log-out-outline" size={24} color="#ff3b30" style={styles.accountIcon} />
              <Text style={[styles.accountText, styles.logoutText]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
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
    backgroundColor: '#4e73df',
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
    color: '#333',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
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
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  settingsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  accountSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#333',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#333',
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    color: '#ff3b30',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    color: '#888',
    fontSize: 14,
  },
});

export default ProfileScreen; 