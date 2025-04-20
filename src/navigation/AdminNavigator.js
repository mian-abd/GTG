import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Admin Screens
import DashboardScreen from '../screens/admin/DashboardScreen';
import ManageMentorsScreen from '../screens/admin/ManageMentorsScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import SettingsScreen from '../screens/admin/SettingsScreen';
import ProgramScheduleScreen from '../screens/admin/ProgramScheduleScreen';
import ManageVisitorsScreen from '../screens/admin/ManageVisitorsScreen';
import RoomAssignmentScreen from '../screens/admin/RoomAssignmentScreen';
import MentorScheduleScreen from '../screens/admin/MentorScheduleScreen';
import StudentScheduleScreen from '../screens/admin/StudentScheduleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);

// Program Stack - for scheduling activities and classes
const ProgramStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProgramSchedule" component={ProgramScheduleScreen} />
    <Stack.Screen name="RoomAssignment" component={RoomAssignmentScreen} />
    <Stack.Screen name="MentorSchedule" component={MentorScheduleScreen} />
    <Stack.Screen name="StudentSchedule" component={StudentScheduleScreen} />
  </Stack.Navigator>
);

// Mentors Stack - for managing mentors
const MentorsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ManageMentors" component={ManageMentorsScreen} />
  </Stack.Navigator>
);

// Users Stack - for managing all users including students
const UsersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserManagement" component={UserManagementScreen} />
    <Stack.Screen name="ManageVisitors" component={ManageVisitorsScreen} />
  </Stack.Navigator>
);

// Settings Stack
const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const AdminNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'ProgramTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MentorsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'UsersTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.secondary,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        }
      })}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardStack} 
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="ProgramTab" 
        component={ProgramStack} 
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen 
        name="MentorsTab" 
        component={MentorsStack} 
        options={{ title: 'Mentors' }}
      />
      <Tab.Screen 
        name="UsersTab" 
        component={UsersStack} 
        options={{ title: 'Users' }}
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