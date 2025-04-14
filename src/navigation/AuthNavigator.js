import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import FirebaseTestScreen from '../screens/auth/FirebaseTestScreen';
import SendGridTestScreen from '../screens/auth/SendGridTestScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="RoleSelection"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="FirebaseTest" component={FirebaseTestScreen} />
      <Stack.Screen name="SendGridTest" component={SendGridTestScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 