import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Visitor Screens
import VisitorHomeScreen from '../screens/visitor/VisitorHomeScreen';
import ScheduleScreen from '../screens/visitor/ScheduleScreen';
import MentorsScreen from '../screens/visitor/MentorsScreen';
import ExploreScreen from '../screens/visitor/ExploreScreen';
import ProfileScreen from '../screens/visitor/ProfileScreen';
import EditProfileScreen from '../screens/visitor/EditProfileScreen';
import MapDirectionsScreen from '../screens/visitor/MapDirectionsScreen';
import ClassDetailsScreen from '../screens/visitor/ClassDetailsScreen';
import MentorDetailsScreen from '../screens/visitor/MentorDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="VisitorHome" component={VisitorHomeScreen} />
  </Stack.Navigator>
);

// Schedule Stack
const ScheduleStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Schedule" component={ScheduleScreen} />
    <Stack.Screen name="ClassDetails" component={ClassDetailsScreen} />
  </Stack.Navigator>
);

// Mentors Stack
const MentorsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Mentors" component={MentorsScreen} />
    <Stack.Screen name="MentorDetails" component={MentorDetailsScreen} />
  </Stack.Navigator>
);

// Explore Stack
const ExploreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Explore" component={ExploreScreen} />
    <Stack.Screen name="MapDirections" component={MapDirectionsScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
  </Stack.Navigator>
);

const VisitorNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ScheduleTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MentorsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ExploreTab') {
            iconName = focused ? 'compass' : 'compass-outline';
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
        name="HomeTab" 
        component={HomeStack} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="ScheduleTab" 
        component={ScheduleStack} 
        options={{ title: 'Schedule' }}
      />
      <Tab.Screen 
        name="MentorsTab" 
        component={MentorsStack} 
        options={{ title: 'Mentors' }}
      />
      <Tab.Screen 
        name="ExploreTab" 
        component={ExploreStack} 
        options={{ title: 'Explore' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default VisitorNavigator; 