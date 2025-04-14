import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Auth Screens
import SendGridTestScreen from '../screens/auth/SendGridTestScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';

// Main Navigation
import VisitorNavigator from './VisitorNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SendGridTest">
        {/* Auth Screens */}
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
    </NavigationContainer>
  );
};

export default AppNavigator; 