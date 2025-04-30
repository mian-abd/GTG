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
import { AuthProvider, useAuth } from './src/context/AuthContext';
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

// Main navigator that selects the appropriate navigator based on auth state
const MainNavigator = () => {
  const { userRole, isLoading, isAuthenticated } = useAuth();
  
  // Log current auth state for debugging
  console.log("MainNavigator - Auth state:", { userRole, isLoading, isAuthenticated });
  
  if (isLoading) {
    return null; // Or a loading screen
  }
  
  // Determine which navigator to render based on userRole
  let navigatorToRender;
  
  if (userRole === 'admin') {
    console.log("Rendering AdminNavigator");
    navigatorToRender = <AdminNavigator />;
  } else if (userRole === 'mentor') {
    console.log("Rendering MentorNavigator");
    navigatorToRender = <MentorNavigator />;
  } else if (userRole === 'visitor') {
    console.log("Rendering VisitorNavigator");
    navigatorToRender = <VisitorNavigator />;
  } else {
    console.log("Rendering AuthNavigator");
    navigatorToRender = <AuthNavigator />;
  }
  
  return (
    <>
      <ThemedStatusBar />
      {navigatorToRender}
    </>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Initialize the app and schedule
    const initialize = async () => {
      try {
        // Initialize the default schedule
        await initializeSchedule();
        console.log('Schedule initialization completed');
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        // Complete initialization
        setAppIsReady(true);
      }
    };
    
    initialize();
  }, []);

  if (!appIsReady) {
    return null; // Or a loading screen
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
