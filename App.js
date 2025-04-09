import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

// Context
import { AuthProvider } from './src/context/AuthContext';

// Navigation
import AuthNavigator from './src/navigation/AuthNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import MentorNavigator from './src/navigation/MentorNavigator';
import VisitorNavigator from './src/navigation/VisitorNavigator';

export default function App() {
  const [userRole, setUserRole] = useState(null); // 'admin', 'mentor', 'visitor', or null
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setIsLoading(false);
      // For testing, set to null to start with auth screens
      setUserRole(null);
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

  return (
    <SafeAreaProvider>
      <AuthProvider value={{ userRole, handleLogin, handleLogout }}>
        <NavigationContainer>
          <StatusBar style="auto" />
          {userRole === 'admin' ? (
            <AdminNavigator />
          ) : userRole === 'mentor' ? (
            <MentorNavigator />
          ) : userRole === 'visitor' ? (
            <VisitorNavigator />
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
