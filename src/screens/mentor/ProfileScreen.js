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
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// Import helpers
import { getInitials } from '../../utils/helpers';

const ProfileScreen = ({ onLogout, navigation }) => {
  // Get theme context
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, handleLogout } = useAuth();
  
  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.background.secondary,
        borderBottomColor: theme.colors.border
      }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text.primary }]}>Profile</Text>
        <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.colors.background.tertiary }]}>
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
            </View>
          </View>
          
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
          
          <TouchableOpacity style={[styles.accountItem, { borderBottomColor: theme.colors.border }]}>
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
        
        {/* My Students Section - Remove progress bars and message icons */}
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
  studentsSection: {
    backgroundColor: '#fff',
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
    borderColor: '#e1e1e1',
    padding: 8,
    borderRadius: 4,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    backgroundColor: '#4e73df',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  studentImageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
  },
  noStudentsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default ProfileScreen; 