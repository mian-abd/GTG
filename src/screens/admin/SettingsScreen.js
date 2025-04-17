import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import Card from '../../components/Card';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const handleUserManagement = () => {
    navigation.navigate('UserManagement');
  };

  const handleMenuToggle = () => {
    // Toggle the sidebar menu
  };

  const confirmLogout = () => {
    handleLogout();
  };

  const handleThemeToggle = (value) => {
    toggleTheme(value);
  };

  const renderSettingItem = (icon, title, description, action, isSwitch = false, value = false, onValueChange = null) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>{title}</Text>
        {description && <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>{description}</Text>}
      </View>
      <View style={styles.settingAction}>
        {isSwitch ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: theme.colors.background.tertiary, true: theme.colors.primary }}
            thumbColor={value ? '#FFFFFF' : '#CCCCCC'}
          />
        ) : (
          <TouchableOpacity onPress={action}>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background.primary} />
      <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <Header 
          title="Settings" 
          showMenuButton={true}
          onMenuPress={handleMenuToggle}
        />

        <ScrollView style={styles.scrollView}>
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Account Settings</Text>

            {renderSettingItem(
              'person-circle',
              'Profile Information',
              'Edit your name, email, and profile picture',
              () => {}
            )}

            {renderSettingItem(
              'lock-closed',
              'Security',
              'Change password and security settings',
              () => {}
            )}

            {renderSettingItem(
              'people',
              'User Management',
              'Add, edit, or remove users',
              handleUserManagement
            )}
          </Card>

          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Notifications</Text>

            {renderSettingItem(
              'notifications',
              'Push Notifications',
              'Receive alerts directly to your device',
              null,
              true,
              enableNotifications,
              setEnableNotifications
            )}

            {renderSettingItem(
              'mail',
              'Email Updates',
              'Receive program updates via email',
              null,
              true,
              emailUpdates,
              setEmailUpdates
            )}
          </Card>

          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>App Settings</Text>

            {renderSettingItem(
              'moon',
              'Dark Mode',
              'Use dark theme throughout the app',
              null,
              true,
              isDarkMode,
              handleThemeToggle
            )}

            {renderSettingItem(
              'language',
              'Language',
              'Change app language',
              () => {}
            )}
          </Card>

          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Support</Text>

            {renderSettingItem(
              'help-circle',
              'Help Center',
              'Get help with using the app',
              () => {}
            )}

            {renderSettingItem(
              'bug',
              'Report a Problem',
              'Let us know about any issues',
              () => {}
            )}

            {renderSettingItem(
              'information-circle',
              'About',
              'Version information and legal details',
              () => {}
            )}
          </Card>

          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: theme.colors.background.tertiary }]} 
            onPress={confirmLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.text.tertiary }]}>
              DePauw University Pre-College Program v1.0.0
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 8,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
  },
  settingAction: {
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  logoutText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
  },
});

export default SettingsScreen; 