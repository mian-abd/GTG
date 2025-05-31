import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';
import { 
  getScheduleByDay, 
  formatScheduleTime 
} from '../../utils/scheduleService';

// Demo student data (keep this for now)
const STUDENT_DATA = [
  { 
    id: '1', 
    initials: 'JD', 
    name: 'John Doe', 
    department: 'Computer Science', 
    progress: 77, 
    lastMeeting: 'Jul 5, 2023',
    meetingNotes: 'Discussed project progress and research interests.'
  },
  { 
    id: '2', 
    initials: 'JS', 
    name: 'Jane Smith', 
    department: 'Biology', 
    progress: 42, 
    lastMeeting: 'Jul 3, 2023',
    meetingNotes: 'Helped with lab experiment design.'
  },
  { 
    id: '3', 
    initials: 'MJ', 
    name: 'Mike Johnson', 
    department: 'Physics', 
    progress: 89, 
    lastMeeting: 'Jul 6, 2023',
    meetingNotes: 'Final review of research paper.'
  },
];

const MentorDashboardScreen = () => {
  const navigation = useNavigation();
  const { user, handleLogout } = useAuth();
  const { theme } = useTheme();
  
  // State for schedule data
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [tomorrowSchedule, setTomorrowSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch schedule data on component mount
  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      
      // Fetch schedule for Day 1 (today) and Day 2 (tomorrow)
      const [day1Schedule, day2Schedule] = await Promise.all([
        getScheduleByDay(1),
        getScheduleByDay(2)
      ]);
      
      // Filter to show only relevant items for dashboard (limit to 3-4 items each)
      const relevantToday = day1Schedule
        .filter(item => item.type !== 'meal') // Skip meals for dashboard
        .slice(0, 3); // Show first 3 non-meal items
      
      const relevantTomorrow = day2Schedule
        .filter(item => item.type !== 'meal') // Skip meals for dashboard
        .slice(0, 3); // Show first 3 non-meal items
      
      setTodaySchedule(relevantToday);
      setTomorrowSchedule(relevantTomorrow);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get appropriate icon for schedule item type
  const getScheduleIcon = (type) => {
    switch (type) {
      case 'session':
        return 'school';
      case 'activity':
        return 'people';
      case 'free':
        return 'time';
      case 'meal':
        return 'restaurant';
      default:
        return 'calendar';
    }
  };
  
  const handleMenuToggle = () => {
    // Toggle the sidebar menu
  };

  const handleStudentDetails = (student) => {
    navigation.navigate('StudentDetail', { student });
  };

  // Render loading state
  const renderLoadingSchedule = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Loading schedule...</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background.primary} />
      <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <View style={[styles.header, { 
          backgroundColor: theme.colors.background.primary,
          borderBottomColor: theme.colors.border
        }]}>
          <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={24} color={theme.colors.primary} />
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Mentor Portal</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="notifications" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={[styles.dashboardHeader, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={styles.mentorProfileSection}>
              {user?.profileImageUrl ? (
                <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImageContainer, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.profileInitials}>{getInitials(user?.name || "User")}</Text>
                </View>
              )}
              <View style={styles.mentorInfo}>
                <Text style={[styles.mentorName, { color: theme.colors.text.primary }]}>{user?.name || "Mentor"}</Text>
                <Text style={[styles.mentorDepartment, { color: theme.colors.text.secondary }]}>{user?.department || "Department"}</Text>
              </View>
            </View>
            <View style={styles.dashboardTitleContainer}>
              <Text style={[styles.dashboardTitle, { color: theme.colors.text.primary }]}>Mentor Dashboard</Text>
              <Text style={[styles.sessionInfo, { color: theme.colors.text.secondary }]}>July 2025 • Summer Program</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Today's Schedule</Text>
          </View>

          {loading ? renderLoadingSchedule() : (
            <View style={styles.scheduleContainer}>
              {todaySchedule.length > 0 ? (
                todaySchedule.map((item, index) => (
                  <View key={item.id || index} style={[styles.scheduleItem, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border
                  }]}>
                    <View style={styles.scheduleIconContainer}>
                      <Ionicons name={getScheduleIcon(item.type)} size={24} color={theme.colors.primary} />
                    </View>
                    <View style={styles.scheduleContent}>
                      <Text style={[styles.scheduleItemName, { color: theme.colors.text.primary }]}>{item.title}</Text>
                      <Text style={[styles.scheduleItemTime, { color: theme.colors.text.secondary }]}>
                        {formatScheduleTime(item.startTime)} - {formatScheduleTime(item.endTime)}
                      </Text>
                      {item.location && (
                        <Text style={[styles.scheduleItemLocation, { color: theme.colors.text.tertiary }]}>{item.location}</Text>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptySchedule}>
                  <Text style={[styles.emptyScheduleText, { color: theme.colors.text.secondary }]}>
                    No events scheduled for today
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Tomorrow</Text>
          </View>

          {loading ? renderLoadingSchedule() : (
            <View style={styles.scheduleContainer}>
              {tomorrowSchedule.length > 0 ? (
                tomorrowSchedule.map((item, index) => (
                  <View key={item.id || index} style={[styles.scheduleItem, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border
                  }]}>
                    <View style={styles.scheduleIconContainer}>
                      <Ionicons name={getScheduleIcon(item.type)} size={24} color={theme.colors.primary} />
                    </View>
                    <View style={styles.scheduleInfo}>
                      <Text style={[styles.scheduleTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
                      <Text style={[styles.scheduleTime, { color: theme.colors.text.secondary }]}>
                        {formatScheduleTime(item.startTime)} - {formatScheduleTime(item.endTime)}
                        {item.location && ` • ${item.location}`}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptySchedule}>
                  <Text style={[styles.emptyScheduleText, { color: theme.colors.text.secondary }]}>
                    No events scheduled for tomorrow
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.text.tertiary }]}>DePauw University Pre-College Program</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuButton: {
    width: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  profileButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  dashboardHeader: {
    padding: 16,
  },
  mentorProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mentorInfo: {
    justifyContent: 'center',
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mentorDepartment: {
    fontSize: 14,
  },
  dashboardTitleContainer: {
    marginTop: 16,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sessionInfo: {
    fontSize: 14,
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scheduleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scheduleItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  scheduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheduleItemTime: {
    fontSize: 14,
  },
  scheduleItemLocation: {
    fontSize: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  emptySchedule: {
    padding: 20,
    alignItems: 'center',
  },
  emptyScheduleText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
});

export default MentorDashboardScreen; 