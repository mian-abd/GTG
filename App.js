import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
// Import Firebase config from utils (remove direct firebase imports)

// Import Schedule Service
import { initializeSchedule } from './src/utils/scheduleService';

// Import API key setup utility
import { setupSendGridApiKey } from './src/utils/setupApiKeys';

// Context
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Navigation
import AuthNavigator from './src/navigation/AuthNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';
import MentorNavigator from './src/navigation/MentorNavigator';
import VisitorNavigator from './src/navigation/VisitorNavigator';

// Firebase config is now handled in src/utils/firebaseConfig.js

// StatusBar component that uses the theme
const ThemedStatusBar = () => {
  const { theme } = useTheme();
  return <StatusBar style={theme.colors.statusBar} />;
};

export default function App() {
  const [userRole, setUserRole] = useState(null); // 'admin', 'mentor', 'visitor', or null
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the app and schedule
    const initialize = async () => {
      try {
        // Initialize the default schedule
        await initializeSchedule();
        console.log('Schedule initialization completed');
        
        // Setup API keys (in production, get from environment variables or secure storage)
        // Don't use hardcoded values - this is just a placeholder comment
        // For production: use a proper configuration or environment variables system
        // Example: For testing only - to be replaced with proper implementation
        // await setupSendGridApiKey('your-api-key-from-secure-source');
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        // Complete initialization and simulate auth check
        setTimeout(() => {
          setIsLoading(false);
          // For testing, set to null to start with auth screens
          setUserRole(null);
        }, 1000);
      }
    };
    
    initialize();
  }, []);

  const handleLogin = (role, data = {}) => {
    setUserRole(role);
    setUserData(data);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider value={{ userRole, userData, handleLogin, handleLogout }}>
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
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
