import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// Import Firebase functionality
import { getDocuments } from '../../utils/firebaseConfig';

const AdminDashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    mentors: 0,
    classes: 0,
    activities: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch counts from Firebase
      const students = await getDocuments('students');
      const mentors = await getDocuments('mentors');
      const classes = await getDocuments('classes');
      const activities = await getDocuments('activities');
      
      setStats({
        students: students?.length || 0,
        mentors: mentors?.length || 0,
        classes: classes?.length || 0,
        activities: activities?.length || 0
      });
      
      // Get recent activities
      const combined = [
        ...(activities || []).map(a => ({ 
          ...a, 
          type: 'activity',
          timestamp: a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date()
        })),
        ...(classes || []).map(c => ({ 
          ...c, 
          type: 'class',
          timestamp: c.createdAt ? new Date(c.createdAt.seconds * 1000) : new Date()
        }))
      ];
      
      // Sort by timestamp (newest first) and take the first 5
      const sorted = combined.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
      setRecentActivities(sorted);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSchedule = () => {
    navigation.navigate('Schedule', { screen: 'ProgramSchedule' });
  };
  
  const navigateToRoomAssignment = () => {
    navigation.navigate('Schedule', { screen: 'RoomAssignment' });
  };
  
  const navigateToMentorSchedule = () => {
    navigation.navigate('Schedule', { screen: 'MentorSchedule' });
  };
  
  const navigateToStudentSchedule = () => {
    navigation.navigate('Schedule', { screen: 'StudentSchedule' });
  };

  const navigateToAnnouncements = () => {
    navigation.navigate('Announcements');
  };

  const renderMenuItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.menuItem, { backgroundColor: theme.colors.background.secondary }]}
        onPress={item.onPress}
      >
        <View style={styles.menuIcon}>
          <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
        </View>
        <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
          {item.title}
        </Text>
        <Ionicons name="chevron-forward" size={22} color={theme.colors.text.secondary} />
      </TouchableOpacity>
    );
  };

  const menuItems = [
    { 
      id: '1', 
      title: 'Program Schedule', 
      icon: 'calendar', 
      onPress: navigateToSchedule 
    },
    { 
      id: '2', 
      title: 'Room Assignments', 
      icon: 'bed', 
      onPress: navigateToRoomAssignment 
    },
    { 
      id: '3', 
      title: 'Mentor Shifts', 
      icon: 'people', 
      onPress: navigateToMentorSchedule 
    },
    { 
      id: '4', 
      title: 'Student Classes', 
      icon: 'school', 
      onPress: navigateToStudentSchedule 
    },
    { 
      id: '5', 
      title: 'Announcements', 
      icon: 'megaphone', 
      onPress: navigateToAnnouncements 
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
            Welcome, Admin
          </Text>
          <Text style={[styles.dateText, { color: theme.colors.text.secondary }]}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={40} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: theme.colors.background.secondary }]}>
            <View style={styles.statsItem}>
              <Text style={[styles.statsNumber, { color: theme.colors.primary }]}>
                {stats.students}
              </Text>
              <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                Students
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={[styles.statsNumber, { color: theme.colors.primary }]}>
                {stats.mentors}
              </Text>
              <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                Mentors
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={[styles.statsNumber, { color: theme.colors.primary }]}>
                {stats.classes}
              </Text>
              <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                Classes
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={[styles.statsNumber, { color: theme.colors.primary }]}>
                {stats.activities}
              </Text>
              <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
                Activities
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Quick Actions
          </Text>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.recentContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Recent Activities
          </Text>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <View 
                key={index} 
                style={[styles.activityItem, { backgroundColor: theme.colors.background.secondary }]}
              >
                <View style={[
                  styles.activityIcon, 
                  { 
                    backgroundColor: activity.type === 'activity' 
                      ? 'rgba(218, 165, 32, 0.2)' 
                      : 'rgba(92, 184, 92, 0.2)' 
                  }
                ]}>
                  <Ionicons 
                    name={activity.type === 'activity' ? 'calendar' : 'school'} 
                    size={20} 
                    color={activity.type === 'activity' ? 'goldenrod' : '#5cb85c'} 
                  />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityName, { color: theme.colors.text.primary }]}>
                    {activity.name}
                  </Text>
                  <Text style={[styles.activityMeta, { color: theme.colors.text.secondary }]}>
                    {activity.type === 'activity' 
                      ? `${activity.date} at ${activity.time}` 
                      : `Instructor: ${activity.instructor}`}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.background.secondary }]}>
              <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
                No recent activities found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  recentContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityMeta: {
    fontSize: 12,
  },
  emptyState: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default AdminDashboardScreen; 