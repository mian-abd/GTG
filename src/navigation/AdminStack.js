import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import ProgramScheduleScreen from '../screens/admin/ProgramScheduleScreen';
import AnnouncementsScreen from '../screens/admin/AnnouncementsScreen';
import RoomAssignmentScreen from '../screens/admin/RoomAssignmentScreen';
import MentorScheduleScreen from '../screens/admin/MentorScheduleScreen';
import StudentScheduleScreen from '../screens/admin/StudentScheduleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ScheduleStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgramSchedule" component={ProgramScheduleScreen} />
      <Stack.Screen name="RoomAssignment" component={RoomAssignmentScreen} />
      <Stack.Screen name="MentorSchedule" component={MentorScheduleScreen} />
      <Stack.Screen name="StudentSchedule" component={StudentScheduleScreen} />
    </Stack.Navigator>
  );
};

const AdminBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'goldenrod',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Schedule" component={ScheduleStack} />
      <Tab.Screen name="Announcements" component={AnnouncementsScreen} />
      <Tab.Screen name="Profile" component={AdminProfileScreen} />
    </Tab.Navigator>
  );
};

export default AdminBottomTabs; 