import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';

// Demo data
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

const SCHEDULE_TODAY = [
  {
    id: '1',
    name: 'Meeting with John',
    time: '2:00 PM - 3:00 PM',
    location: 'Julian Science Center 159',
    icon: 'person'
  },
  {
    id: '2',
    name: 'Group Workshop',
    time: '4:00 PM - 5:00 PM',
    location: 'Hoover Hall 112',
    icon: 'people'
  }
];

const SCHEDULE_TOMORROW = [
  {
    id: '1',
    name: 'Faculty Planning',
    time: '10:30 AM - 11:30 AM',
    location: 'Administration Building',
    icon: 'calendar'
  },
  {
    id: '2',
    name: 'Student Review: Jane',
    time: '1:15 PM - 2:15 PM',
    location: 'Julian Science Center 159',
    icon: 'person'
  }
];

const MentorDashboardScreen = () => {
  const navigation = useNavigation();
  const { user, handleLogout } = useAuth();
  const { theme } = useTheme();
  
  const handleMenuToggle = () => {
    // Toggle the sidebar menu
  };

  const handleStudentDetails = (student) => {
    navigation.navigate('StudentDetail', { student });
  };

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
          <View style={styles.dashboardHeader}>
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

          <View style={[styles.welcomeCard, { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border
          }]}>
            <Text style={[styles.welcomeText, { color: theme.colors.text.primary }]}>Welcome back, {user?.name?.split(' ')[0] || "Mentor"}!</Text>
            <Text style={[styles.updateText, { color: theme.colors.text.secondary }]}>You have 3 student updates and 2 upcoming activities today</Text>
            <TouchableOpacity 
              style={[styles.viewScheduleButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('ScheduleTab')}
            >
              <Text style={styles.viewScheduleText}>View Schedule</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>My Students</Text>
          </View>

          <View style={styles.studentsContainer}>
            {STUDENT_DATA.map((student) => (
              <View key={student.id} style={[styles.studentCard, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border
              }]}>
                <View style={styles.studentHeader}>
                  <View style={[styles.initialsContainer, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.initials}>{student.initials}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={[styles.studentName, { color: theme.colors.text.primary }]}>{student.name}</Text>
                    <Text style={[styles.studentDepartment, { color: theme.colors.text.secondary }]}>{student.department}</Text>
                  </View>
                </View>

                <View style={styles.meetingNotesContainer}>
                  <Text style={[styles.lastMeetingLabel, { color: theme.colors.text.secondary }]}>Last meeting: {student.lastMeeting}</Text>
                  <Text style={[styles.meetingNotes, { color: theme.colors.text.primary }]}>{student.meetingNotes}</Text>
                </View>

                <TouchableOpacity 
                  style={[styles.viewDetailsButton, { backgroundColor: theme.colors.background.tertiary }]}
                  onPress={() => handleStudentDetails(student)}
                >
                  <Text style={[styles.viewDetailsText, { color: theme.colors.text.primary }]}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Today's Schedule</Text>
          </View>

          <View style={styles.scheduleContainer}>
            {SCHEDULE_TODAY.map((item) => (
              <View key={item.id} style={[styles.scheduleItem, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border
              }]}>
                <View style={styles.scheduleIconContainer}>
                  <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.scheduleContent}>
                  <Text style={[styles.scheduleItemName, { color: theme.colors.text.primary }]}>{item.name}</Text>
                  <Text style={[styles.scheduleItemTime, { color: theme.colors.text.secondary }]}>{item.time}</Text>
                  <Text style={[styles.scheduleItemLocation, { color: theme.colors.text.tertiary }]}>{item.location}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Tomorrow</Text>
          </View>

          <View style={styles.scheduleContainer}>
            {SCHEDULE_TOMORROW.map((item) => (
              <View key={item.id} style={[styles.scheduleItem, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border
              }]}>
                <View style={styles.scheduleIconContainer}>
                  <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={[styles.scheduleTitle, { color: theme.colors.text.primary }]}>{item.name}</Text>
                  <Text style={[styles.scheduleTime, { color: theme.colors.text.secondary }]}>{item.time} • {item.location}</Text>
                </View>
              </View>
            ))}
          </View>

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
    backgroundColor: '#2A2A2A',
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mentorDepartment: {
    color: '#CCC',
    fontSize: 14,
  },
  dashboardTitleContainer: {
    marginTop: 16,
  },
  dashboardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sessionInfo: {
    color: '#CCC',
    fontSize: 14,
  },
  welcomeCard: {
    backgroundColor: '#2A2A2A',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  updateText: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 16,
  },
  viewScheduleButton: {
    alignSelf: 'flex-end',
  },
  viewScheduleText: {
    color: '#009688',
    fontWeight: 'bold',
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  studentCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  studentHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  initialsContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentInfo: {
    justifyContent: 'center',
  },
  studentName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDepartment: {
    color: '#CCC',
    fontSize: 14,
  },
  meetingNotesContainer: {
    marginBottom: 16,
  },
  lastMeetingLabel: {
    color: '#CCC',
    fontSize: 12,
    marginBottom: 4,
  },
  meetingNotes: {
    color: 'white',
    fontSize: 14,
  },
  viewDetailsButton: {
    alignSelf: 'flex-end',
  },
  viewDetailsText: {
    color: '#009688',
    fontWeight: 'bold',
  },
  scheduleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scheduleItem: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheduleTime: {
    color: '#CCC',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleItemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheduleItemTime: {
    color: '#CCC',
    fontSize: 14,
  },
  scheduleItemLocation: {
    color: '#888',
    fontSize: 12,
  },
});

export default MentorDashboardScreen; 