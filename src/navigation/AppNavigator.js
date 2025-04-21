import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import SendGridTestScreen from '../screens/auth/SendGridTestScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';
import VisitorLoginScreen from '../screens/auth/VisitorLoginScreen';

// Main Navigation
import VisitorNavigator from './VisitorNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="VisitorLogin">
      {/* Auth Screens */}
      <Stack.Screen 
        name="VisitorLogin" 
        component={VisitorLoginScreen} 
        options={{ 
          title: 'Visitor Login',
          headerStyle: {
            backgroundColor: '#1A1A1A',
          },
          headerTintColor: '#fff',
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="SendGridTest" 
        component={SendGridTestScreen} 
        options={{ 
          title: 'Email Verification',
          headerStyle: {
            backgroundColor: '#4285F4',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="Verification" 
        component={VerificationScreen} 
        options={{ 
          title: 'Verify Your Email',
          headerStyle: {
            backgroundColor: '#4285F4',
          },
          headerTintColor: '#fff',
        }}
      />
      
      {/* Main App */}
      <Stack.Screen 
        name="Main" 
        component={VisitorNavigator} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 