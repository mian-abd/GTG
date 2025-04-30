import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Import screens
import MentorDashboardScreen from '../screens/mentor/MentorDashboardScreen';
import StudentsScreen from '../screens/mentor/StudentsScreen';
import ScheduleScreen from '../screens/mentor/ScheduleScreen';
import ResourcesScreen from '../screens/mentor/ResourcesScreen';
import ProfileScreen from '../screens/mentor/ProfileScreen';
import StudentDetailScreen from '../screens/mentor/StudentDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MentorDashboard" component={MentorDashboardScreen} />
  </Stack.Navigator>
);

// Students Stack
const StudentsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MentorStudents" component={StudentsScreen} />
    <Stack.Screen name="StudentDetails" component={StudentDetailScreen} />
  </Stack.Navigator>
);

// Schedule Stack
const ScheduleStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MentorSchedule" component={ScheduleScreen} />
  </Stack.Navigator>
);

// Resources Stack
const ResourcesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MentorResources" component={ResourcesScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => {
  const { handleLogout } = useAuth();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Profile" 
        component={(props) => <ProfileScreen {...props} onLogout={handleLogout} />} 
      />
    </Stack.Navigator>
  );
};

const MentorNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'StudentsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ScheduleTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'ResourcesTab') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
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
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="StudentsTab" 
        component={StudentsStack} 
        options={{ title: 'Students' }}
      />
      <Tab.Screen 
        name="ScheduleTab" 
        component={ScheduleStack} 
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen 
        name="ResourcesTab" 
        component={ResourcesStack} 
        options={{ title: 'Resources' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MentorNavigator; 