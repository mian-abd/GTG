import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Admin Screens
import DashboardScreen from '../screens/admin/DashboardScreen';
import ManageVisitorsScreen from '../screens/admin/ManageVisitorsScreen';
import ManageMentorsScreen from '../screens/admin/ManageMentorsScreen';
import ProgramScheduleScreen from '../screens/admin/ProgramScheduleScreen';
import SettingsScreen from '../screens/admin/SettingsScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);

// Visitors Stack
const VisitorsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ManageVisitors" component={ManageVisitorsScreen} />
  </Stack.Navigator>
);

// Mentors Stack
const MentorsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ManageMentors" component={ManageMentorsScreen} />
  </Stack.Navigator>
);

// Schedule Stack
const ScheduleStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProgramSchedule" component={ProgramScheduleScreen} />
  </Stack.Navigator>
);

// Settings Stack
const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="UserManagement" component={UserManagementScreen} />
  </Stack.Navigator>
);

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'VisitorsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'MentorsTab') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'ScheduleTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'goldenrod',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardStack} 
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="VisitorsTab" 
        component={VisitorsStack} 
        options={{ title: 'Visitors' }}
      />
      <Tab.Screen 
        name="MentorsTab" 
        component={MentorsStack} 
        options={{ title: 'Mentors' }}
      />
      <Tab.Screen 
        name="ScheduleTab" 
        component={ScheduleStack} 
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStack} 
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator; 