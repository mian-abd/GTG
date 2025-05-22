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
import { getDocuments } from '../../utils/firebaseConfig';

// Demo data
const ACTIVITIES = [
  { id: '1', name: 'Campus Tour', date: 'Jun 15, 2023', location: 'Main Campus', participants: 25 },
  { id: '2', name: 'Welcome Dinner', date: 'Jun 16, 2023', location: 'Dining Hall', participants: 42 },
  { id: '3', name: 'Team Building', date: 'Jun 17, 2023', location: 'Sports Center', participants: 36 },
];

const DashboardScreen = () => {
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
    <View style={styles.activityRow}>
      <View style={styles.activityCol}>
        <Text style={styles.activityText}>{item.name}</Text>
      </View>
      <View style={styles.activityCol}>
        <Text style={styles.activityText}>{item.date}</Text>
      </View>
      <View style={styles.activityCol}>
        <Text style={styles.activityText}>{item.location}</Text>
      </View>
      <View style={styles.activityCol}>
        <Text style={styles.activityText}>{item.participants}</Text>
      </View>
      <View style={styles.activityCol}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStudent = ({ item }) => (
    <TouchableOpacity 
      style={styles.studentCard}
      onPress={() => {
        // Navigate to student details or some action
        navigation.navigate('UsersTab');
      }}
    >
      <View style={styles.studentAvatarContainer}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentInitials}>
            {item.name ? item.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name || 'Unknown'}</Text>
        <Text style={styles.studentEmail}>{item.email || 'No email'}</Text>
        {item.roomNumber && <Text style={styles.studentEmail}>Room: {item.roomNumber}</Text>}
      </View>
      <View style={styles.studentStatus}>
        <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
        <Text style={styles.statusText}>Active</Text>
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleMenuToggle} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={24} color="#F9A826" />
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
          </View>
        </View>

        <View style={styles.programOverview}>
          <View>
            <Text style={styles.sectionTitle}>Program Overview</Text>
            <Text style={styles.sectionSubtitle}>Summer 2025</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Active Visitors</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="people" size={24} color="#F9A826" />
              </View>
              <Text style={styles.statValue}>{activeVisitorsCount}</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={handleViewAllUsers}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Mentors</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="school" size={24} color="#F9A826" />
              </View>
              <Text style={styles.statValue}>{mentorsCount}</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={handleViewAllMentors}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Activities</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={24} color="#F9A826" />
              </View>
              <Text style={styles.statValue}>{activitiesCount}</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={handleViewAllActivities}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Quick Access Buttons */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
            </View>
            <View style={styles.quickAccessContainer}>
              <TouchableOpacity 
                style={styles.quickAccessButton}
                onPress={handleRoomAssignments}
              >
                <Ionicons name="bed" size={24} color="#F9A826" />
                <Text style={styles.quickAccessText}>Room Assignments</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAccessButton}
                onPress={handleMentorSchedule}
              >
                <Ionicons name="time" size={24} color="#F9A826" />
                <Text style={styles.quickAccessText}>Mentor Schedules</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAccessButton}
                onPress={handleStudentSchedule}
              >
                <Ionicons name="book" size={24} color="#F9A826" />
                <Text style={styles.quickAccessText}>Student Classes</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Activities</Text>
              <TouchableOpacity 
                style={styles.viewButton}
                onPress={handleViewAllActivities}
              >
                <Text style={styles.viewButtonText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activitiesContainer}>
              <View style={styles.activitiesHeader}>
                <View style={styles.activityCol}>
                  <Text style={styles.columnTitle}>Activity</Text>
                </View>
                <View style={styles.activityCol}>
                  <Text style={styles.columnTitle}>Date</Text>
                </View>
                <View style={styles.activityCol}>
                  <Text style={styles.columnTitle}>Location</Text>
                </View>
                <View style={styles.activityCol}>
                  <Text style={styles.columnTitle}>Participants</Text>
                </View>
                <View style={styles.activityCol}>
                  <Text style={styles.columnTitle}>Actions</Text>
                </View>
              </View>
              
              <FlatList
                data={ACTIVITIES}
                renderItem={renderActivity}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Student Status</Text>
              <TouchableOpacity 
                style={styles.manageButton}
                onPress={handleManageVisitors}
              >
                <Text style={styles.manageButtonText}>Manage Students</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F9A826" />
                <Text style={styles.loadingText}>Loading students...</Text>
              </View>
            ) : students.length > 0 ? (
              <View style={styles.studentsContainer}>
                <FlatList
                  data={students.slice(0, 5)} // Only show first 5 students
                  renderItem={renderStudent}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  ListFooterComponent={students.length > 5 && (
                    <TouchableOpacity 
                      style={styles.viewMoreButton}
                      onPress={handleViewAllUsers}
                    >
                      <Text style={styles.viewMoreText}>
                        View {students.length - 5} more students
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : (
              <View style={styles.noVisitorsContainer}>
                <Text style={styles.noVisitorsText}>
                  No students found. Add students through the Manage Students page.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
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
    backgroundColor: '#1A1A1A',
  },
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuButton: {
    marginRight: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  programOverview: {
    backgroundColor: '#2A2A2A',
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: '#CCC',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#2A2A2A',
  },
  statCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    minWidth: 100,
  },
  statTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  statIconContainer: {
    marginVertical: 8,
  },
  statValue: {
    color: '#F9A826',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  viewAllButton: {
    marginTop: 8,
  },
  viewAllText: {
    color: '#AAA',
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
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '30%',
  },
  quickAccessText: {
    color: 'white',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#2A2A2A',
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
    backgroundColor: '#F9A826',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  activitiesContainer: {
    marginHorizontal: 16,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  activitiesHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  columnTitle: {
    color: '#CCC',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  activityCol: {
    flex: 1,
    justifyContent: 'center',
  },
  activityText: {
    color: 'white',
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
    backgroundColor: '#F9A826',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  manageButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  noVisitorsContainer: {
    backgroundColor: '#333',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  noVisitorsText: {
    color: '#CCC',
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: '#333',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    color: '#CCC',
    marginTop: 8,
  },
  studentsContainer: {
    marginHorizontal: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  studentAvatarContainer: {
    marginRight: 12,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9A826',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentInitials: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentEmail: {
    color: '#CCC',
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
    color: '#CCC',
    fontSize: 12,
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  viewMoreText: {
    color: '#F9A826',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});

export default DashboardScreen; 