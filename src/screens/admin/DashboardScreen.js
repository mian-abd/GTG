import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

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

  const handleManageVisitors = () => {
    navigation.navigate('VisitorsTab');
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
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Mentors</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="school" size={24} color="#F9A826" />
              </View>
              <Text style={styles.statValue}>{mentorsCount}</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Activities</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar" size={24} color="#F9A826" />
              </View>
              <Text style={styles.statValue}>{activitiesCount}</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Activities</Text>
              <TouchableOpacity style={styles.viewButton}>
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
              <Text style={styles.sectionTitle}>Visitor Status</Text>
              <TouchableOpacity 
                style={styles.manageButton}
                onPress={handleManageVisitors}
              >
                <Text style={styles.manageButtonText}>Manage Visitors</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.noVisitorsContainer}>
              <Text style={styles.noVisitorsText}>
                No visitors found. Add visitors through the Manage Visitors page.
              </Text>
            </View>
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
  footer: {
    alignItems: 'center',
    padding: 16,
    marginTop: 16,
  },
  footerText: {
    color: '#888',
    fontSize: 12,
  },
});

export default DashboardScreen; 