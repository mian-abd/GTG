import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Context
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Navigation
import AuthNavigator from './src/navigation/AuthNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import MentorNavigator from './src/navigation/MentorNavigator';
import VisitorNavigator from './src/navigation/VisitorNavigator';
import AppNavigator from './src/navigation/AppNavigator';

// Firebase config - only needed if not using react-native-firebase
const firebaseConfig = {
  // Your Firebase configuration goes here
  apiKey: "AIzaSyAPidd0JyfmTXP4skidXaIjQBk78d2sF1o",
  authDomain: "gatewaytogold-1bf66.firebaseapp.com",
  projectId: "gatewaytogold-1bf66",
  storageBucket: "gatewaytogold-1bf66.firebasestorage.app",
  messagingSenderId: "1098642367077",
  appId: "1:1098642367077:android:6e6c5164d642267672dc8c"
};

// Initialize Firebase
// Note: Initialization is now handled in src/utils/firebaseConfig.js
// But we keep this here for reference

// StatusBar component that uses the theme
const ThemedStatusBar = () => {
  const { theme } = useTheme();
  return <StatusBar style={theme.colors.statusBar} />;
};

export default function App() {
  const [userRole, setUserRole] = useState(null); // 'admin', 'mentor', 'visitor', or null
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerificationMode, setIsEmailVerificationMode] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setIsLoading(false);
      // For testing, set to null to start with auth screens
      setUserRole(null);
      
      // Show the mode selector for development convenience
      setShowModeSelector(true);
    }, 1000);
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  // Development mode selector overlay
  const ModeSelector = () => (
    <View style={styles.modeSelectorContainer}>
      <Text style={styles.modeSelectorTitle}>Development Mode</Text>
      <TouchableOpacity
        style={[styles.modeButton, isEmailVerificationMode ? styles.activeMode : null]}
        onPress={() => setIsEmailVerificationMode(true)}
      >
        <Text style={styles.modeButtonText}>Email Verification Flow</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.modeButton, !isEmailVerificationMode ? styles.activeMode : null]}
        onPress={() => setIsEmailVerificationMode(false)}
      >
        <Text style={styles.modeButtonText}>Regular App Flow</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => setShowModeSelector(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  // For testing the email verification flow
  if (isEmailVerificationMode) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemedStatusBar />
          <AppNavigator />
          {showModeSelector && <ModeSelector />}
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider value={{ userRole, handleLogin, handleLogout }}>
          <NavigationContainer>
            <ThemedStatusBar />
            {userRole === 'admin' ? (
              <AdminNavigator />
            ) : userRole === 'mentor' ? (
              <MentorNavigator />
            ) : userRole === 'visitor' ? (
              <VisitorNavigator />
            ) : (
              <AuthNavigator />
            )}
            {showModeSelector && <ModeSelector />}
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  modeSelectorContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
    width: 200,
    alignItems: 'center',
  },
  modeSelectorTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modeButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  activeMode: {
    backgroundColor: '#34A853',
  },
  modeButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#EA4335',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
