import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getDocuments } from '../../utils/firebaseConfig';

// Demo data
const ACTIVITIES = [
  { id: '1', name: 'Campus Tour', date: 'Jun 15, 2023', location: 'Main Campus', participants: 25 },
  { id: '2', name: 'Welcome Dinner', date: 'Jun 16, 2023', location: 'Dining Hall', participants: 42 },
  { id: '3', name: 'Team Building', date: 'Jun 17, 2023', location: 'Sports Center', participants: 36 },
];

const DashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { handleLogout } = useAuth();
  const [activeVisitorsCount, setActiveVisitorsCount] = useState('...');
  const [mentorsCount, setMentorsCount] = useState('...');
  const [activitiesCount, setActivitiesCount] = useState(42);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      // Fetch mentors from Firestore
      const mentorsData = await getDocuments('mentors');
      setMentorsCount(mentorsData.length.toString());
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Fetch students from Firestore
      const studentsData = await getDocuments('students');
      setStudents(studentsData);
      
      // Update counts
      setActiveVisitorsCount(studentsData.length);
      // Removed hardcoded mentor count as we're now fetching it in fetchMentors
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleMenuToggle = () => {
    // Toggle the sidebar menu
  };

  const renderActivity = ({ item }) => (
    <View style={[styles.activityRow, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.activityCol}>
        <Text style={[styles.activityText, { color: theme.colors.text.primary }]}>{item.name}</Text>
      </View>
      <View style={styles.activityCol}>
        <Text style={[styles.activityText, { color: theme.colors.text.primary }]}>{item.date}</Text>
      </View>
      <View style={styles.activityCol}>
        <Text style={[styles.activityText, { color: theme.colors.text.primary }]}>{item.location}</Text>
      </View>
      <View style={styles.activityCol}>
        <Text style={[styles.activityText, { color: theme.colors.text.primary }]}>{item.participants}</Text>
      </View>
      <View style={styles.activityCol}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStudent = ({ item }) => (
    <TouchableOpacity 
      style={[styles.studentCard, { borderBottomColor: theme.colors.border }]}
      onPress={() => {
        // Navigate to student details or some action
        navigation.navigate('UsersTab');
      }}
    >
      <View style={styles.studentAvatarContainer}>
        <View style={[styles.studentAvatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.studentInitials, { color: theme.colors.surface }]}>
            {item.name ? item.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
      </View>
      <View style={styles.studentInfo}>
        <Text style={[styles.studentName, { color: theme.colors.text.primary }]}>{item.name || 'Unknown'}</Text>
        <Text style={[styles.studentEmail, { color: theme.colors.text.secondary }]}>{item.email || 'No email'}</Text>
        {item.roomNumber && <Text style={[styles.studentEmail, { color: theme.colors.text.secondary }]}>Room: {item.roomNumber}</Text>}
      </View>
      <View style={styles.studentStatus}>
        <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
        <Text style={[styles.statusText, { color: theme.colors.text.secondary }]}>Active</Text>
      </View>
    </TouchableOpacity>
  );

  const handleManageVisitors = () => {
    navigation.navigate('UsersTab');
  };

  const handleViewAllUsers = () => {
    navigation.navigate('UsersTab');
  };

  const handleViewAllMentors = () => {
    navigation.navigate('MentorsTab');
  };

  const handleViewAllActivities = () => {
    navigation.navigate('ProgramTab');
  };
  
  const handleRoomAssignments = () => {
    navigation.navigate('ProgramTab', { screen: 'RoomAssignment' });
  };
  
  const handleMentorSchedule = () => {
    navigation.navigate('ProgramTab', { screen: 'MentorSchedule' });
  };
  
  const handleStudentSchedule = () => {
    navigation.navigate('ProgramTab', { screen: 'StudentSchedule' });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background.primary }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background.primary} />
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <View style={[styles.header, { 
          backgroundColor: theme.colors.background.secondary,
          borderBottomColor: theme.colors.border
        }]}>
          <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={24} color={theme.colors.primary} />
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Admin Dashboard</Text>
          </View>
        </View>

        <View style={[styles.programOverview, { backgroundColor: theme.colors.background.secondary }]}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Program Overview</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>Summer 2025</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.statsContainer, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.statTitle, { color: theme.colors.text.primary }]}>Active Visitors</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="people" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{activeVisitorsCount}</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={handleViewAllUsers}
              >
                <Text style={[styles.viewAllText, { color: theme.colors.text.tertiary }]}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.statTitle, { color: theme.colors.text.primary }]}>Mentors</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="school" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{mentorsCount}</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={handleViewAllMentors}
              >
                <Text style={[styles.viewAllText, { color: theme.colors.text.tertiary }]}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.statTitle, { color: theme.colors.text.primary }]}>Activities</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{activitiesCount}</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={handleViewAllActivities}
              >
                <Text style={[styles.viewAllText, { color: theme.colors.text.tertiary }]}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Quick Access Buttons */}
          <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Quick Access</Text>
            </View>
            <View style={styles.quickAccessContainer}>
              <TouchableOpacity 
                style={[styles.quickAccessButton, { backgroundColor: theme.colors.card }]}
                onPress={handleRoomAssignments}
              >
                <Ionicons name="bed" size={24} color={theme.colors.primary} />
                <Text style={[styles.quickAccessText, { color: theme.colors.text.primary }]}>Room Assignments</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickAccessButton, { backgroundColor: theme.colors.card }]}
                onPress={handleMentorSchedule}
              >
                <Ionicons name="time" size={24} color={theme.colors.primary} />
                <Text style={[styles.quickAccessText, { color: theme.colors.text.primary }]}>Mentor Schedules</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickAccessButton, { backgroundColor: theme.colors.card }]}
                onPress={handleStudentSchedule}
              >
                <Ionicons name="book" size={24} color={theme.colors.primary} />
                <Text style={[styles.quickAccessText, { color: theme.colors.text.primary }]}>Student Classes</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Student Status</Text>
              <TouchableOpacity 
                style={[styles.manageButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleManageVisitors}
              >
                <Text style={[styles.manageButtonText, { color: theme.colors.surface }]}>Manage Students</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={[styles.loadingContainer, { backgroundColor: theme.colors.card }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Loading students...</Text>
              </View>
            ) : students.length > 0 ? (
              <View style={[styles.studentsContainer, { backgroundColor: theme.colors.card }]}>
                <FlatList
                  data={students.slice(0, 5)} // Only show first 5 students
                  renderItem={renderStudent}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  ListFooterComponent={students.length > 5 && (
                    <TouchableOpacity 
                      style={[styles.viewMoreButton, { borderTopColor: theme.colors.border }]}
                      onPress={handleViewAllUsers}
                    >
                      <Text style={[styles.viewMoreText, { color: theme.colors.primary }]}>
                        View {students.length - 5} more students
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : (
              <View style={[styles.noVisitorsContainer, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.noVisitorsText, { color: theme.colors.text.secondary }]}>
                  No students found. Add students through the Manage Students page.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.text.tertiary }]}>
              DePauw University Pre-College Program Dashboard
            </Text>
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
    padding: 16,
    borderBottomWidth: 1,
  },
  menuButton: {
    marginRight: 16,
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
  programOverview: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 16,
  },
  statCard: {
    borderRadius: 8,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    minWidth: 100,
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  statIconContainer: {
    marginVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  viewAllButton: {
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 12,
  },
  // Quick Access styles
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  quickAccessButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '30%',
  },
  quickAccessText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  activitiesContainer: {
    marginHorizontal: 16,
    borderRadius: 8,
  },
  activitiesHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  activityCol: {
    flex: 1,
    justifyContent: 'center',
  },
  activityText: {
    fontSize: 14,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  manageButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  noVisitorsContainer: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  noVisitorsText: {
    textAlign: 'center',
  },
  loadingContainer: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  studentsContainer: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  studentAvatarContainer: {
    marginRight: 12,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentInitials: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentEmail: {
    fontSize: 12,
  },
  studentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  viewMoreText: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default DashboardScreen; 