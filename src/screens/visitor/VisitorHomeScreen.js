import React from 'react';
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

const VisitorHomeScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();

  const handleExplore = () => {
    navigation.navigate('ExploreTab');
  };

  const handleMentors = () => {
    navigation.navigate('MentorsTab');
  };

  const handleSchedule = () => {
    navigation.navigate('ScheduleTab');
  };

  const handleAbout = () => {
    // Navigate to About section
  };

  const handleBrowsePaths = () => {
    navigation.navigate('ExploreTab');
  };

  const handleMeetMentors = () => {
    navigation.navigate('MentorsTab');
  };

  const handleViewSchedule = () => {
    navigation.navigate('ScheduleTab');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={24} color="#F9A826" />
            <Text style={styles.headerTitle}>Visitor Portal</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeTitle}>Welcome to DePauw Pre-College Program</Text>
            <Text style={styles.welcomeSubtitle}>Explore opportunities, connect with mentors, and discover your potential</Text>
          </View>

          <View style={styles.navigationButtonsContainer}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleExplore}
            >
              <View style={[styles.navButtonIcon, {backgroundColor: '#5D5FEF'}]}>
                <Ionicons name="search" size={24} color="#FFF" />
              </View>
              <Text style={styles.navButtonText}>Explore</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleMentors}
            >
              <View style={[styles.navButtonIcon, {backgroundColor: '#009688'}]}>
                <Ionicons name="people" size={24} color="#FFF" />
              </View>
              <Text style={styles.navButtonText}>Mentors</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleSchedule}
            >
              <View style={[styles.navButtonIcon, {backgroundColor: '#E74C3C'}]}>
                <Ionicons name="calendar" size={24} color="#FFF" />
              </View>
              <Text style={styles.navButtonText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={handleAbout}
            >
              <View style={[styles.navButtonIcon, {backgroundColor: '#8E44AD'}]}>
                <Ionicons name="information-circle" size={24} color="#FFF" />
              </View>
              <Text style={styles.navButtonText}>About</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Program Highlights</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsContainer}
          >
            <View style={styles.highlightCard}>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="home" size={24} color="#F9A826" />
              </View>
              <Text style={styles.highlightTitle}>Campus Life</Text>
              <Text style={styles.highlightDescription}>
                Experience life at DePauw University's beautiful campus
              </Text>
            </View>

            <View style={styles.highlightCard}>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="school" size={24} color="#F9A826" />
              </View>
              <Text style={styles.highlightTitle}>Academic Excellence</Text>
              <Text style={styles.highlightDescription}>
                Learn from outstanding faculty in small-group settings
              </Text>
            </View>

            <View style={styles.highlightCard}>
              <View style={styles.highlightIconContainer}>
                <Ionicons name="people" size={24} color="#F9A826" />
              </View>
              <Text style={styles.highlightTitle}>Mentorship</Text>
              <Text style={styles.highlightDescription}>
                Connect with dedicated mentors who guide your journey
              </Text>
            </View>
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Resources</Text>
          </View>

          <View style={styles.resourcesContainer}>
            <View style={styles.resourceCard}>
              <View style={styles.resourceIconContainer}>
                <Ionicons name="book" size={24} color="#F9A826" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Learning Paths</Text>
                <Text style={styles.resourceDescription}>
                  Discover curated learning paths designed to help you explore academic interests
                </Text>
                <TouchableOpacity 
                  style={styles.resourceButton}
                  onPress={handleBrowsePaths}
                >
                  <Text style={styles.resourceButtonText}>Browse Paths</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.resourceCard}>
              <View style={styles.resourceIconContainer}>
                <Ionicons name="people" size={24} color="#F9A826" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Mentorship Program</Text>
                <Text style={styles.resourceDescription}>
                  Connect with DePauw faculty and students for guidance and support
                </Text>
                <TouchableOpacity 
                  style={styles.resourceButton}
                  onPress={handleMeetMentors}
                >
                  <Text style={styles.resourceButtonText}>Meet Mentors</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.resourceCard}>
              <View style={styles.resourceIconContainer}>
                <Ionicons name="calendar" size={24} color="#F9A826" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Workshops & Events</Text>
                <Text style={styles.resourceDescription}>
                  Join interactive workshops and special events throughout the program
                </Text>
                <TouchableOpacity 
                  style={styles.resourceButton}
                  onPress={handleViewSchedule}
                >
                  <Text style={styles.resourceButtonText}>View Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>DePauw University Pre-College Program</Text>
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
  profileButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  welcomeBanner: {
    backgroundColor: '#F9A826',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  welcomeTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: '#000',
    fontSize: 14,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#2A2A2A',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  navButtonText: {
    color: 'white',
    fontSize: 12,
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
  highlightsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  highlightCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(249, 168, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlightDescription: {
    color: '#AAA',
    fontSize: 12,
    textAlign: 'center',
  },
  resourcesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resourceCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  resourceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(249, 168, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resourceDescription: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 12,
  },
  resourceButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(249, 168, 38, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  resourceButtonText: {
    color: '#F9A826',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 12,
  },
});

export default VisitorHomeScreen; 